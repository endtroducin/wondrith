import { appState } from "../core/appState.js";

export function clampCameraPosition(x, y, zoom = 1) {
	const viewportH = appState.canvas.height;

	// -----------------------------
	// X RULE: never show x < 0 world
	// -----------------------------
	// If stageX > 0, the world is pushed right and negative world X becomes visible.
	// So we clamp stageX to be <= 0.
	const clampedX = Math.min(x, 0);

	// -----------------------------
	// Y RULES: enforce top/bottom pins
	// -----------------------------
	const ideaBottom = appState.zones.ideaZone.y + appState.zones.ideaZone.height;
	const taskTop = appState.zones.taskZone.y;

	// Lowest you can go (ideaBottom pinned to bottom of screen)
	const minY = viewportH - ideaBottom * zoom;

	// Highest you can go (taskTop pinned to top of screen)
	const maxY = 0 - taskTop * zoom;

	// Clamp stageY within allowed range
	const clampedY = Math.min(Math.max(y, minY), maxY);

	return { x: clampedX, y: clampedY };
}

// Get center of canvas
function getViewportCenter() {
	return {
		x: appState.canvas.width / 2,
		y: appState.canvas.height / 2,
	};
}

// 🔁 Pan camera to a target zone: "idea", "plan", "task"
export function moveCameraTo(mode) {
	const zoom = 1;
	const viewportH = appState.canvas.height;

	let worldAnchorY = 0; // always zero
	let screenTargetY;

	if (mode === "idea") {
		screenTargetY = viewportH;
	}

	if (mode === "plan") {
		screenTargetY = viewportH / 2;
	}

	if (mode === "task") {
		screenTargetY = 0;
	}

	const stageY = screenTargetY - worldAnchorY * zoom;

	appState.stage.position({ x: 0, y: stageY });
	appState.stage.batchDraw();

	updateCameraBounds();
}

export function updateCameraBounds() {
	const stage = appState.stage;

	if (!stage) return;

	const stagePos = stage.position();
	const zoom = stage.scaleX();

	const viewportWidth = appState.canvas.width;
	const viewportHeight = appState.canvas.height;

	// Convert stage transform into world-space bounds
	const left = -stagePos.x / zoom;
	const top = -stagePos.y / zoom;
	const right = left + viewportWidth / zoom;
	const bottom = top + viewportHeight / zoom;

	// Store for debugging
	appState.camera.bounds = {
		left,
		top,
		right,
		bottom,
	};

	// Optional debug log
	console.log("Camera bounds:", appState.camera.bounds);
}
