// 📍 src/actions/cameraActions.js
// 🎥 Responsible ONLY for positioning + scaling the stage.
// This file:
//   - Reads from appState.camera
//   - Calculates stage transform
//   - Applies transform to Konva
//   - Updates debug bounds
//
// It does NOT:
//   - Handle UI buttons
//   - Handle mouse input
//   - Handle zone detection
//
// Camera is driven entirely by appState.camera.

import { appState } from "../core/appState.js";

/**
 * CAMERA_PRESETS
 *
 * For each logical zone we define:
 *
 * worldAnchorY:
 *   Which WORLD coordinate should be pinned?
 *
 * screenAnchorY:
 *   Where on the SCREEN should it appear?
 *
 * We use functions instead of static values
 * because canvas height may change.
 */
const CAMERA_PRESETS = {
	idea: {
		// Bottom of idea zone
		worldAnchorY: () => appState.zones.ideaZone.y + appState.zones.ideaZone.height,

		// Bottom of screen
		screenAnchorY: () => appState.canvas.height,
	},

	plan: {
		// World Y = 0 (your divider line)
		worldAnchorY: () => 0,

		// Middle of screen
		screenAnchorY: () => appState.canvas.height / 2,
	},

	task: {
		// Top of task zone
		worldAnchorY: () => appState.zones.taskZone.y,

		// Top of screen
		screenAnchorY: () => 0,
	},
};

/**
 * updateCameraFromState()
 *
 * This function reads:
 *   - appState.camera.activeZone
 *   - appState.camera.zoom
 *
 * And calculates:
 *   - stage position
 *   - stage scale
 *
 * Then applies it to Konva.
 */

export function moveCameraTo(zone) {
	const stage = appState.stage;
	const viewportH = appState.canvas.height;
	const zoom = stage.scaleX();

	let targetStageY = 0;

	switch (zone) {
		case "idea":
			// we want worldY = 0 to appear at bottom
			targetStageY = viewportH - 0 * zoom;
			break;

		case "plan":
			// worldY = 0 centered
			targetStageY = viewportH / 2 - 0 * zoom;
			break;

		case "task":
			// worldY = 0 at top
			targetStageY = 0 - 0 * zoom;
			break;
	}

	stage.position({ x: 0, y: targetStageY });
	stage.batchDraw();

	updateCameraBounds();
}

// export function updateCameraFromState() {
// 	const { activeZone, zoom } = appState.camera;

// 	const preset = CAMERA_PRESETS[activeZone];

// 	if (!preset) {
// 		console.warn("Unknown camera zone:", activeZone);
// 		return;
// 	}

// 	// 1️⃣ Determine world anchor
// 	const worldY = preset.worldAnchorY();

// 	// 2️⃣ Determine where it should appear on screen
// 	const screenY = preset.screenAnchorY();

// 	// 3️⃣ Solve transform equation
// 	const stageY = screenY - worldY * zoom;

// 	// 4️⃣ We currently lock X to 0 (per your rule)
// 	const stageX = 0;

// 	// 5️⃣ Store camera position in appState
// 	appState.camera.position = {
// 		x: stageX,
// 		y: stageY,
// 	};

// 	// 6️⃣ Apply scale + position to Konva stage
// 	appState.stage.scale({ x: zoom, y: zoom });
// 	appState.stage.position(appState.camera.position);

// 	// 7️⃣ Redraw
// 	appState.stage.batchDraw();

// 	// 8️⃣ Update debug bounds
// 	updateCameraBounds();
// }

/**
 * updateCameraBounds()
 *
 * Calculates which WORLD coordinates are visible
 * inside the current viewport.
 *
 * This is purely for debugging + verification.
 */

export function updateCameraBounds() {
	const stage = appState.stage;
	const zoom = stage.scaleX();
	const viewportW = appState.canvas.width;
	const viewportH = appState.canvas.height;

	const stageX = stage.x();
	const stageY = stage.y();

	const left = -stageX / zoom;
	const top = -stageY / zoom;
	const right = left + viewportW / zoom;
	const bottom = top + viewportH / zoom;

	appState.camera.bounds = { left, top, right, bottom };
}

// export function updateCameraBounds() {
// 	const stagePos = appState.stage.position();
// 	const zoom = appState.stage.scaleX();

// 	const viewportWidth = appState.canvas.width;
// 	const viewportHeight = appState.canvas.height;

// 	// Left world bound
// 	const left = -stagePos.x / zoom;

// 	// Top world bound
// 	const top = -stagePos.y / zoom;

// 	// Right world bound
// 	const right = left + viewportWidth / zoom;

// 	// Bottom world bound
// 	const bottom = top + viewportHeight / zoom;

// 	appState.camera.bounds = {
// 		left,
// 		top,
// 		right,
// 		bottom,
// 	};
// }

/**
 * setCameraZone(zoneName)
 *
 * Updates camera state
 * Then recomputes transform.
 */
export function setCameraZone(zoneName) {
	appState.camera.activeZone = zoneName;
	updateCameraFromState();
}

// import { appState } from "../core/appState.js";

// export function clampCameraPosition(x, y, zoom = 1) {
// 	const viewportH = appState.canvas.height;

// 	// -----------------------------
// 	// X RULE: never show x < 0 world
// 	// -----------------------------
// 	// If stageX > 0, the world is pushed right and negative world X becomes visible.
// 	// So we clamp stageX to be <= 0.
// 	const clampedX = Math.min(x, 0);

// 	// -----------------------------
// 	// Y RULES: enforce top/bottom pins
// 	// -----------------------------
// 	const ideaBottom = appState.zones.ideaZone.y + appState.zones.ideaZone.height;
// 	const taskTop = appState.zones.taskZone.y;

// 	// Lowest you can go (ideaBottom pinned to bottom of screen)
// 	const minY = viewportH - ideaBottom * zoom;

// 	// Highest you can go (taskTop pinned to top of screen)
// 	const maxY = 0 - taskTop * zoom;

// 	// Clamp stageY within allowed range
// 	const clampedY = Math.min(Math.max(y, minY), maxY);

// 	return { x: clampedX, y: clampedY };
// }

// // Get center of canvas
// function getViewportCenter() {
// 	return {
// 		x: appState.canvas.width / 2,
// 		y: appState.canvas.height / 2,
// 	};
// }

// // 🔁 Pan camera to a target zone: "idea", "plan", "task"
// export function moveCameraTo(mode) {
// 	const zoom = 1;
// 	const viewportH = appState.canvas.height;

// 	let worldAnchorY = 0; // always zero
// 	let screenTargetY;

// 	if (mode === "idea") {
// 		screenTargetY = viewportH;
// 	}

// 	if (mode === "plan") {
// 		screenTargetY = viewportH / 2;
// 	}

// 	if (mode === "task") {
// 		screenTargetY = 0;
// 	}

// 	const stageY = screenTargetY - worldAnchorY * zoom;

// 	appState.stage.position({ x: 0, y: stageY });
// 	appState.stage.batchDraw();

// 	updateCameraBounds();
// }

// export function updateCameraBounds() {
// 	const stage = appState.stage;

// 	if (!stage) return;

// 	const stagePos = stage.position();
// 	const zoom = stage.scaleX();

// 	const viewportWidth = appState.canvas.width;
// 	const viewportHeight = appState.canvas.height;

// 	// Convert stage transform into world-space bounds
// 	const left = -stagePos.x / zoom;
// 	const top = -stagePos.y / zoom;
// 	const right = left + viewportWidth / zoom;
// 	const bottom = top + viewportHeight / zoom;

// 	// Store for debugging
// 	appState.camera.bounds = {
// 		left,
// 		top,
// 		right,
// 		bottom,
// 	};

// 	// Optional debug log
// 	console.log("Camera bounds:", appState.camera.bounds);
// }

// export function updateCameraFromState() {
// 	const { activeZone, zoom } = appState.camera;

// 	const preset = CAMERA_PRESETS[activeZone];
// 	if (!preset) return;

// 	const worldY = preset.worldAnchorY();
// 	const screenY = preset.screenAnchorY();

// 	const stageY = screenY - worldY * zoom;

// 	appState.camera.position = { x: 0, y: stageY };

// 	appState.stage.scale({ x: zoom, y: zoom });
// 	appState.stage.position(appState.camera.position);

// 	appState.stage.batchDraw();

// 	updateCameraBounds();
// }
