// ==================================================
// 📍 src/camera/cameraController.js
// ==================================================
// 🎥 CAMERA CONTROLLER
// ==================================================

import { appState } from "../core/appState.js";

/* ============================================================
   🎥 INIT CAMERA
============================================================ */

export function initCamera() {
	// Center the camera on world origin at startup.
	//
	// This means:
	// - world x = 0 appears at screen center horizontally
	// - world y = 0 appears at screen center vertically
	appState.camera.x = 0;
	appState.camera.y = 0;
	appState.camera.z = 1200;
	appState.camera.focalLength = 1400;
}
