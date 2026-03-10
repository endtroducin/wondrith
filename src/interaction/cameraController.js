// ==================================================
// 📍 src/interaction/cameraController.js
// ==================================================
// 🎥 CAMERA CONTROLLER
//
// Connects OrbitControls to the application camera
// and synchronizes camera state back into appState.
//
// Responsibilities:
//   • enable orbit controls
//   • enable pan
//   • enable zoom
//   • sync camera position to appState
//   • sync camera target to appState
//
// Does NOT:
//   • build scene objects
//   • contain business logic
//   • store world data outside appState
// ==================================================

// 1️⃣ External libraries
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// 2️⃣ Core state
import { appState } from "../core/appState.js";

/* ============================================================
   MODULE STATE
============================================================ */

let controls;
let cameraRef;

/* ============================================================
   INIT CONTROLS
============================================================ */

export function initCameraController(camera, domElement) {
	cameraRef = camera;

	controls = new OrbitControls(camera, domElement);

	// --------------------------------------------------
	// Control behavior
	// --------------------------------------------------

	controls.enableDamping = true;
	controls.dampingFactor = 0.08;

	controls.enablePan = true;
	controls.enableZoom = true;
	controls.screenSpacePanning = true;

	controls.minDistance = appState.camera.minDistance;
	controls.maxDistance = appState.camera.maxDistance;

	// --------------------------------------------------
	// Initial target
	// --------------------------------------------------

	controls.target.set(appState.camera.target.x, appState.camera.target.y, appState.camera.target.z);

	controls.update();
}

/* ============================================================
   UPDATE
============================================================ */

export function updateCameraController() {
	if (!controls || !cameraRef) {
		return;
	}

	controls.update();

	appState.camera.position.x = cameraRef.position.x;
	appState.camera.position.y = cameraRef.position.y;
	appState.camera.position.z = cameraRef.position.z;

	appState.camera.target.x = controls.target.x;
	appState.camera.target.y = controls.target.y;
	appState.camera.target.z = controls.target.z;
}

/* ============================================================
   DISPOSE
============================================================ */

export function disposeCameraController() {
	if (controls) {
		controls.dispose();
	}

	controls = undefined;
	cameraRef = undefined;
}
