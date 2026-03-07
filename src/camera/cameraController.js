// ==================================================
// 📍 src/camera/cameraController.js
// ==================================================
// 🎥 CAMERA CONTROLLER
//
// Domain: camera
// Question It Answers:
//   • How does user input modify camera?
//   • How do we apply Engine A (mouse zoom)?
//   • How do we apply Engine B (anchored zoom)?
//   • How do we pan?
//
// Rules:
//   • Mutates appState.camera
//   • Calls clampCameraToBounds()
//   • Calls updateCameraBoundsInState()
//   • Triggers renderWorld()
//   • Does NOT do projection math
// ==================================================

import { appState } from "../core/appState.js";
import { clampCameraToBounds, deriveCameraYFromAnchor, updateCameraBoundsInState } from "./cameraBounds.js";

import { renderWorld } from "../render/worldRenderer.js";

/* ============================================================
   🔎 INTERNAL HELPER
============================================================ */

function finalizeCameraUpdate() {
	clampCameraToBounds();
	updateCameraBoundsInState();
	renderWorld();
}

/* ============================================================
   🔍 ENGINE A — MOUSE CENTERED ZOOM
============================================================ */

export function zoomMouseCentered(factor, mouseX, mouseY) {
	const camera = appState.camera;

	if (!camera) return;

	const oldZoom = camera.zoom;
	const newZoom = oldZoom * factor;

	if (newZoom <= 0.0001) return;

	// --------------------------------------------------
	// 1️⃣ World point under mouse BEFORE zoom
	// --------------------------------------------------
	const worldXBefore = mouseX / oldZoom + camera.x;
	const worldYBefore = mouseY / oldZoom + camera.y;

	// --------------------------------------------------
	// 2️⃣ Apply new zoom
	// --------------------------------------------------
	camera.zoom = newZoom;

	// --------------------------------------------------
	// 3️⃣ Solve camera so same world point stays under mouse
	// --------------------------------------------------
	camera.x = worldXBefore - mouseX / newZoom;
	camera.y = worldYBefore - mouseY / newZoom;

	// --------------------------------------------------
	// 4️⃣ Clamp to strict bounds
	// --------------------------------------------------
	finalizeCameraUpdate();
}

/* ============================================================
   📌 ENGINE B — ANCHORED ZOOM
============================================================ */

export function zoomAnchored(factor) {
	const camera = appState.camera;

	if (!camera) return;

	const newZoom = camera.zoom * factor;

	if (newZoom <= 0.0001) return;

	camera.zoom = newZoom;

	// Re-derive camera.y from state anchor
	deriveCameraYFromAnchor();

	finalizeCameraUpdate();
}

/* ============================================================
   🖱 PAN (WORLD UNITS)
============================================================ */

export function panBy(deltaWorldX, deltaWorldY) {
	const camera = appState.camera;

	if (!camera) return;

	camera.x += deltaWorldX;
	camera.y += deltaWorldY;

	finalizeCameraUpdate();
}

/* ============================================================
   🧭 SET CAMERA STATE
============================================================ */

export function setCameraState(state) {
	const camera = appState.camera;

	if (!camera) return;

	camera.state = state;

	// When changing state, snap to anchor
	deriveCameraYFromAnchor();

	finalizeCameraUpdate();
}
