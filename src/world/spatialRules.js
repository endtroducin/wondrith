// ==================================================
// 📍 src/world/spatialRules.js
// ==================================================
// 🧭 SPATIAL RULES
//
// Provides lightweight spatial behavior for entries,
// including grounded-vs-floating mode, grid snapping,
// and simple collision avoidance.
//
// Responsibilities:
//   • detect grounded vs floating mode
//   • snap grounded entries to the grid
//   • compute 2D overlap for grounded cards
//   • find nearest open grounded placement
//
// Does NOT:
//   • mutate Three.js objects
//   • render anything
//   • store application state
// ==================================================

/* ============================================================
   CONSTANTS
============================================================ */

const TASK_GRID_STEP_X = 25;
const TASK_GRID_STEP_Y = 25;
const HORIZON_Y = 0;

/* ============================================================
   MODE HELPERS
============================================================ */

export function isGroundedEntry(entry) {
	return entry.position.y <= HORIZON_Y;
}

export function isFloatingEntry(entry) {
	return entry.position.y > HORIZON_Y;
}

/* ============================================================
   GRID HELPERS
============================================================ */

export function snapGroundedPosition(position) {
	return {
		x: snapToStep(position.x, TASK_GRID_STEP_X),
		y: snapToStep(position.y, TASK_GRID_STEP_Y),
		z: 0,
	};
}

function snapToStep(value, step) {
	return Math.round(value / step) * step;
}

/* ============================================================
   FOOTPRINT HELPERS
============================================================ */

export function getEntryFootprint(entry) {
	const width = Math.max(50, entry.visual?.width ?? entry.size?.x ?? 50);
	const depth = Math.max(25, entry.visual?.depth ?? entry.size?.y ?? 25);

	return {
		width,
		depth,
		halfWidth: width / 2,
		halfDepth: depth / 2,
	};
}

export function getFootprintBounds(entry, positionOverride = null) {
	const position = positionOverride ?? entry.position;
	const footprint = getEntryFootprint(entry);

	return {
		minX: position.x - footprint.halfWidth,
		maxX: position.x + footprint.halfWidth,
		minY: position.y - footprint.halfDepth,
		maxY: position.y + footprint.halfDepth,
	};
}

/* ============================================================
   COLLISION HELPERS
============================================================ */

export function entriesOverlap2D(entryA, entryB, positionA = null, positionB = null) {
	const a = getFootprintBounds(entryA, positionA);
	const b = getFootprintBounds(entryB, positionB);

	return !(a.maxX <= b.minX || a.minX >= b.maxX || a.maxY <= b.minY || a.minY >= b.maxY);
}

export function hasGroundedCollision(candidateEntry, candidatePosition, allEntries) {
	for (const otherEntry of allEntries) {
		if (otherEntry.id === candidateEntry.id) {
			continue;
		}

		if (!isGroundedEntry(otherEntry)) {
			continue;
		}

		if (entriesOverlap2D(candidateEntry, otherEntry, candidatePosition, otherEntry.position)) {
			return true;
		}
	}

	return false;
}

/* ============================================================
   PLACEMENT SEARCH
============================================================ */

export function resolveGroundedPlacement(entry, desiredPosition, allEntries) {
	const snappedPosition = snapGroundedPosition(desiredPosition);

	if (!hasGroundedCollision(entry, snappedPosition, allEntries)) {
		return snappedPosition;
	}

	const searchOffsets = generateSearchOffsets(12);

	for (const offset of searchOffsets) {
		const candidatePosition = {
			x: snappedPosition.x + offset.gridX * TASK_GRID_STEP_X,
			y: snappedPosition.y + offset.gridY * TASK_GRID_STEP_Y,
			z: 0,
		};

		if (!hasGroundedCollision(entry, candidatePosition, allEntries)) {
			return candidatePosition;
		}
	}

	return snappedPosition;
}

function generateSearchOffsets(radius) {
	const offsets = [];

	for (let ring = 1; ring <= radius; ring += 1) {
		for (let gridX = -ring; gridX <= ring; gridX += 1) {
			for (let gridY = -ring; gridY <= ring; gridY += 1) {
				const onRingEdge = Math.abs(gridX) === ring || Math.abs(gridY) === ring;

				if (!onRingEdge) {
					continue;
				}

				offsets.push({ gridX, gridY });
			}
		}
	}

	offsets.sort((a, b) => {
		const distA = Math.abs(a.gridX) + Math.abs(a.gridY);
		const distB = Math.abs(b.gridX) + Math.abs(b.gridY);

		return distA - distB;
	});

	return offsets;
}
