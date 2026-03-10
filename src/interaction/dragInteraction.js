// ==================================================
// 📍 src/interaction/dragInteraction.js
// ==================================================
// 🖱️ DRAG INTERACTION
//
// Enables dragging entries along the XY plane while
// applying spatial rules for floating vs grounded
// behavior.
//
// Responsibilities:
//   • detect pointer hits on draggable meshes
//   • project pointer movement onto the XY plane
//   • update canonical entry positions
//   • apply grounded snapping and collision avoidance
//   • request renders only when needed
//
// Does NOT:
//   • store business logic on meshes
//   • create world objects
//   • render frames
// ==================================================

// 1️⃣ External libraries
import * as THREE from "three";

// 2️⃣ Core state
import { appState } from "../core/appState.js";

// 4️⃣ Internal modules
import { rebuildDerivedRenderState } from "../data/hydrateAppState.js";
import { isGroundedEntry, resolveGroundedPlacement } from "../world/spatialRules.js";

/* ============================================================
   MODULE STATE
============================================================ */

let cameraRef;
let domElementRef;
let getDraggableMeshesRef;
let getEntityIdForMeshRef;
let getEntityTypeForMeshRef;
let requestRenderRef;

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const dragPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
const dragIntersection = new THREE.Vector3();

let activeDrag = null;

/* ============================================================
   INIT
============================================================ */

export function initDragInteraction({
	camera,
	domElement,
	getDraggableMeshList,
	getEntityIdForMesh,
	getEntityTypeForMesh,
	requestRender,
}) {
	cameraRef = camera;
	domElementRef = domElement;
	getDraggableMeshesRef = getDraggableMeshList;
	getEntityIdForMeshRef = getEntityIdForMesh;
	getEntityTypeForMeshRef = getEntityTypeForMesh;
	requestRenderRef = requestRender;

	domElementRef.addEventListener("pointerdown", handlePointerDown);
	domElementRef.addEventListener("pointermove", handlePointerMove);
	domElementRef.addEventListener("pointerup", handlePointerUp);
	domElementRef.addEventListener("pointerleave", handlePointerUp);
}

/* ============================================================
   POINTER HELPERS
============================================================ */

function updatePointerFromEvent(event) {
	const bounds = domElementRef.getBoundingClientRect();

	pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
	pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
}

function getPointerPlaneIntersection(event) {
	updatePointerFromEvent(event);
	raycaster.setFromCamera(pointer, cameraRef);

	const didIntersect = raycaster.ray.intersectPlane(dragPlane, dragIntersection);

	if (!didIntersect) {
		return null;
	}

	return dragIntersection.clone();
}

function getTopLevelDraggableMesh(object) {
	let current = object;

	while (current) {
		const entityId = getEntityIdForMeshRef?.(current);
		const entityType = getEntityTypeForMeshRef?.(current);

		if (entityId && entityType) {
			return current;
		}

		current = current.parent;
	}

	return null;
}

function findPickedMesh(event) {
	updatePointerFromEvent(event);
	raycaster.setFromCamera(pointer, cameraRef);

	const draggableMeshes = getDraggableMeshesRef?.() ?? [];
	const intersections = raycaster.intersectObjects(draggableMeshes, true);

	if (intersections.length === 0) {
		return null;
	}

	return getTopLevelDraggableMesh(intersections[0].object);
}

/* ============================================================
   DRAG LIFECYCLE
============================================================ */

function handlePointerDown(event) {
	if (event.button !== 0) {
		return;
	}

	const pickedMesh = findPickedMesh(event);

	if (!pickedMesh) {
		return;
	}

	const entityId = getEntityIdForMeshRef?.(pickedMesh);
	const entityType = getEntityTypeForMeshRef?.(pickedMesh);

	if (!entityId || !entityType) {
		return;
	}

	const hitPoint = getPointerPlaneIntersection(event);

	if (!hitPoint) {
		return;
	}

	const entry = getEntryById(entityId);

	if (!entry) {
		return;
	}

	activeDrag = {
		entityId,
		offsetX: entry.position.x - hitPoint.x,
		offsetY: entry.position.y - hitPoint.y,
	};

	domElementRef.style.cursor = "grabbing";
	requestRenderRef?.();
}

function handlePointerMove(event) {
	if (!activeDrag) {
		return;
	}

	const hitPoint = getPointerPlaneIntersection(event);

	if (!hitPoint) {
		return;
	}

	const entry = getEntryById(activeDrag.entityId);

	if (!entry) {
		return;
	}

	const desiredPosition = {
		x: hitPoint.x + activeDrag.offsetX,
		y: hitPoint.y + activeDrag.offsetY,
		z: entry.position.z,
	};

	const nextPosition = computeDragPosition(entry, desiredPosition);

	entry.position.x = nextPosition.x;
	entry.position.y = nextPosition.y;
	entry.position.z = nextPosition.z;

	rebuildDerivedRenderState();
	requestRenderRef?.();
}

function handlePointerUp() {
	if (!activeDrag) {
		return;
	}

	activeDrag = null;
	domElementRef.style.cursor = "default";

	requestRenderRef?.();
}

/* ============================================================
   DRAG RULES
============================================================ */

function computeDragPosition(entry, desiredPosition) {
	const previewEntry = {
		...entry,
		position: desiredPosition,
	};

	if (!isGroundedEntry(previewEntry)) {
		return {
			x: desiredPosition.x,
			y: desiredPosition.y,
			z: entry.position.z,
		};
	}

	const allEntries = appState.entryOrder.map((entryId) => appState.entriesById[entryId]).filter(Boolean);

	return resolveGroundedPlacement(entry, desiredPosition, allEntries);
}

/* ============================================================
   STATE HELPERS
============================================================ */

function getEntryById(entryId) {
	return appState.entriesById?.[entryId] ?? null;
}

/* ============================================================
   STATUS HELPERS
============================================================ */

export function isDraggingActive() {
	return activeDrag !== null;
}

/* ============================================================
   DISPOSE
============================================================ */

export function disposeDragInteraction() {
	if (domElementRef) {
		domElementRef.removeEventListener("pointerdown", handlePointerDown);
		domElementRef.removeEventListener("pointermove", handlePointerMove);
		domElementRef.removeEventListener("pointerup", handlePointerUp);
		domElementRef.removeEventListener("pointerleave", handlePointerUp);
	}

	cameraRef = undefined;
	domElementRef = undefined;
	getDraggableMeshesRef = undefined;
	getEntityIdForMeshRef = undefined;
	getEntityTypeForMeshRef = undefined;
	requestRenderRef = undefined;
	activeDrag = null;
}
