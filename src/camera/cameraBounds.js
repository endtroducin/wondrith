// ==================================================
// 📍 src/camera/cameraBounds.js
// ==================================================
// 📊 CAMERA BOUNDS & CONSTRAINTS
//
// Domain: camera
// Question It Answers:
//   • What world rectangle is currently visible?
//   • How do we enforce strict bounds?
//   • How do camera states constrain Y?
//
// Rules:
//   • WORLD space is fixed
//   • Camera is mutable state
//   • This file may mutate appState.camera
//   • This file does NOT render
//   • This file does NOT talk to Konva
// ==================================================

import { appState } from "../core/appState.js";

/* ============================================================
   🧭 CAMERA STATE CONFIG
============================================================ */

function getStateConfig(state, canvasHeight) {
	switch (state) {
		case "idea":
			return {
				// y=0 must remain in bottom half
				minY0Screen: canvasHeight / 2,
				maxY0Screen: canvasHeight,
				anchorY: canvasHeight, // pinned for Engine B
			};

		case "task":
			return {
				// y=0 must remain in top half
				minY0Screen: 0,
				maxY0Screen: canvasHeight / 2,
				anchorY: 0,
			};

		case "plan":
		default:
			return {
				// y=0 can be anywhere on screen
				minY0Screen: 0,
				maxY0Screen: canvasHeight,
				anchorY: canvasHeight / 2,
			};
	}
}

/* ============================================================
   🧮 DERIVE CAMERA.Y FROM ANCHOR (ENGINE B)
============================================================ */

export function deriveCameraYFromAnchor() {
	const camera = appState.camera;
	const canvas = appState.canvas;

	if (!camera || !canvas) return;

	const { anchorY } = getStateConfig(camera.state, canvas.height);

	// screenY = (0 - cam.y) * zoom
	// anchorY = -cam.y * zoom
	camera.y = -(anchorY / camera.zoom);
}

/* ============================================================
   🧯 CLAMP CAMERA (STRICT BOUNDS)
============================================================ */

export function clampCameraToBounds() {
	const camera = appState.camera;
	const canvas = appState.canvas;

	if (!camera || !canvas) return;

	const zoom = camera.zoom;
	const H = canvas.height;

	// --------------------------------------------------
	// 🔒 STRICT X BOUND (x >= 0)
	// --------------------------------------------------
	if (camera.x < 0) {
		camera.x = 0;
	}

	// --------------------------------------------------
	// 🔒 Y=0 VISIBILITY BOUNDS (ENGINE A)
	// --------------------------------------------------
	const { minY0Screen, maxY0Screen } = getStateConfig(camera.state, H);

	// y0Screen = -camera.y * zoom
	const y0Screen = -camera.y * zoom;

	let clampedY0Screen = y0Screen;

	if (y0Screen < minY0Screen) {
		clampedY0Screen = minY0Screen;
	}

	if (y0Screen > maxY0Screen) {
		clampedY0Screen = maxY0Screen;
	}

	// Solve back to camera.y
	// clampedY0Screen = -camera.y * zoom
	camera.y = -(clampedY0Screen / zoom);
}

/* ============================================================
   📐 COMPUTE WORLD BOUNDS (VISIBLE RECTANGLE)
============================================================ */

export function computeCameraWorldBounds() {
	const camera = appState.camera;
	const canvas = appState.canvas;

	if (!camera || !canvas) {
		return { left: 0, right: 0, top: 0, bottom: 0 };
	}

	const zoom = camera.zoom;

	const left = camera.x;
	const right = camera.x + canvas.width / zoom;

	const top = camera.y;
	const bottom = camera.y + canvas.height / zoom;

	return { left, right, top, bottom };
}

/* ============================================================
   💾 UPDATE BOUNDS INTO STATE
============================================================ */

export function updateCameraBoundsInState() {
	const bounds = computeCameraWorldBounds();
	appState.camera.bounds = bounds;
	return bounds;
}
