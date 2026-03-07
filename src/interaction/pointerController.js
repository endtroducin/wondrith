// ==================================================
// 📍 src/interaction/pointerController.js
// ==================================================
// 🖱 POINTER CONTROLLER (SIMPLE + STABLE)
//
// Left-click drag on empty stage = pan
// Wheel = anchored zoom
// Shift + wheel = mouse-centered zoom
// ==================================================

import { appState } from "../core/appState.js";
import { renderWorld } from "../render/worldRenderer.js";
import { updateCameraBoundsInState } from "../camera/cameraBounds.js";
import { unprojectScreenToWorld } from "../math/projection.js";

const ZOOM_MIN = 0.2;
const ZOOM_MAX = 6;
const ZOOM_SPEED = 0.0015;

/* ============================================================
   INIT
============================================================ */

export function initPointerControls() {
	const stage = appState.stage;
	if (!stage) return;

	/* --------------------------------------------------------
	   🖱 LEFT-CLICK DRAG = PAN (BACKGROUND ONLY)
	-------------------------------------------------------- */

	let isDragging = false;
	let startPointer = null;
	let startCamera = null;

	stage.on("mousedown", (evt) => {
		// Only start pan if clicking empty stage
		if (evt.target !== stage) return;

		isDragging = true;

		const p = stage.getPointerPosition();
		startPointer = { ...p };
		startCamera = {
			x: appState.camera.x,
			y: appState.camera.y,
		};
	});

	stage.on("mouseup", () => {
		isDragging = false;
	});

	stage.on("mousemove", () => {
		if (!isDragging) return;

		const p = stage.getPointerPosition();
		if (!p) return;

		const dxScreen = p.x - startPointer.x;
		const dyScreen = p.y - startPointer.y;

		// Convert screen movement → world movement
		const zoom = appState.camera.zoom;

		appState.camera.x = startCamera.x - dxScreen / zoom;
		appState.camera.y = startCamera.y - dyScreen / zoom;

		enforceBounds();
		updateCameraBoundsInState();
		renderWorld();
	});

	/* --------------------------------------------------------
	   🎡 WHEEL ZOOM
	-------------------------------------------------------- */

	stage.on("wheel", (evt) => {
		evt.evt.preventDefault();

		const delta = evt.evt.deltaY;
		const factor = Math.exp(-delta * ZOOM_SPEED);

		if (evt.evt.shiftKey) {
			mouseCenteredZoom(factor);
		} else {
			anchoredZoom(factor);
		}

		updateCameraBoundsInState();
		renderWorld();
	});
}

/* ============================================================
   ZOOM MODES
============================================================ */

function anchoredZoom(factor) {
	const cam = appState.camera;

	cam.zoom = clamp(cam.zoom * factor, ZOOM_MIN, ZOOM_MAX);

	// Strict x rule
	if (cam.x < 0) cam.x = 0;

	enforceBounds();
}

function mouseCenteredZoom(factor) {
	const cam = appState.camera;
	const stage = appState.stage;

	const pointer = stage.getPointerPosition();
	if (!pointer) return;

	// World point before zoom
	const before = unprojectScreenToWorld({ x: pointer.x, y: pointer.y }, cam, 0);

	cam.zoom = clamp(cam.zoom * factor, ZOOM_MIN, ZOOM_MAX);

	// World point after zoom
	const after = unprojectScreenToWorld({ x: pointer.x, y: pointer.y }, cam, 0);

	cam.x += before.x - after.x;
	cam.y += before.y - after.y;

	enforceBounds();
}

/* ============================================================
   STRICT BOUNDS
============================================================ */

function enforceBounds() {
	const cam = appState.camera;
	const canvas = appState.canvas;

	if (!canvas?.width || !canvas?.height) return;

	// X cannot go below 0
	if (cam.x < 0) cam.x = 0;

	// Y rules based on activeZone
	const viewH = canvas.height / cam.zoom;

	const zone = cam.activeZone;

	if (zone === "task") {
		if (cam.y > 0) cam.y = 0;
	}

	if (zone === "idea") {
		if (cam.y < -viewH) cam.y = -viewH;
	}

	if (zone === "plan") {
		if (cam.y > 0) cam.y = 0;
		if (cam.y < -viewH) cam.y = -viewH;
	}
}

function clamp(v, min, max) {
	return Math.max(min, Math.min(max, v));
}
