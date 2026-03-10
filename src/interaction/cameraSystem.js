// ==================================================
// 📍 src/render/cameraSystem.js
// ==================================================
// 🎥 CAMERA SYSTEM
//
// Owns fixed-camera framing, zoom behavior, section
// presets, and animated camera transitions.
//
// Responsibilities:
//   • compute camera layout
//   • pin x = 0 to the left side of the view
//   • pin y = 0 to top / center / bottom by section
//   • animate zoom transitions
//   • animate section transitions
//   • apply resolved state to the Three.js camera
//   • request renders only when needed
//
// Does NOT:
//   • create the renderer
//   • create world objects
//   • store state outside appState
// ==================================================

// 1️⃣ External libraries
import * as THREE from "three";

// 2️⃣ Core state
import { appState } from "../core/appState.js";

/* ============================================================
   MODULE STATE
============================================================ */

let cameraRef;
let viewportProvider;
let requestRenderRef;

/* ============================================================
   INIT
============================================================ */

export function initCameraSystem(camera, getViewportSize, requestRender) {
	cameraRef = camera;
	viewportProvider = getViewportSize;
	requestRenderRef = requestRender;

	updateCameraLayout();
}

/* ============================================================
   SECTION HELPERS
============================================================ */

function getSectionAnchor(section) {
	switch (section) {
		case "ideas":
			return 0.0;

		case "plan":
			return 0.5;

		case "tasks":
			return 1.0;

		default:
			return 0.5;
	}
}

function getCenterYForAnchor(sectionAnchor, viewHeight) {
	return (0.5 - sectionAnchor) * viewHeight;
}

function easeInOutCubic(t) {
	if (t < 0.5) {
		return 4 * t * t * t;
	}

	return 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/* ============================================================
   CAMERA TRANSITIONS
============================================================ */

function startCameraTransition({
	targetViewHeight = appState.camera.viewHeight,
	targetSectionAnchor = appState.camera.sectionAnchor,
	durationMs = appState.camera.transition.durationMs,
}) {
	const transition = appState.camera.transition;

	transition.isActive = true;
	transition.startTime = performance.now();
	transition.durationMs = durationMs;

	transition.startViewHeight = appState.camera.viewHeight;
	transition.targetViewHeight = THREE.MathUtils.clamp(
		targetViewHeight,
		appState.camera.minViewHeight,
		appState.camera.maxViewHeight,
	);

	transition.startSectionAnchor = appState.camera.sectionAnchor;
	transition.targetSectionAnchor = targetSectionAnchor;

	requestRenderRef?.();
}

export function updateCameraTransition() {
	const transition = appState.camera.transition;

	if (!transition.isActive) {
		return false;
	}

	const elapsedMs = performance.now() - transition.startTime;
	const rawT = elapsedMs / transition.durationMs;
	const clampedT = THREE.MathUtils.clamp(rawT, 0, 1);
	const easedT = easeInOutCubic(clampedT);

	appState.camera.viewHeight = THREE.MathUtils.lerp(transition.startViewHeight, transition.targetViewHeight, easedT);

	appState.camera.sectionAnchor = THREE.MathUtils.lerp(
		transition.startSectionAnchor,
		transition.targetSectionAnchor,
		easedT,
	);

	updateCameraLayout();

	if (clampedT >= 1) {
		transition.isActive = false;
		appState.camera.viewHeight = transition.targetViewHeight;
		appState.camera.sectionAnchor = transition.targetSectionAnchor;
		return false;
	}

	requestRenderRef?.();
	return true;
}

/* ============================================================
   CAMERA LAYOUT
============================================================ */

export function updateCameraLayout() {
	if (!cameraRef || !viewportProvider) {
		return;
	}

	const { width, height } = viewportProvider();

	if (width <= 0 || height <= 0) {
		return;
	}

	const aspect = width / height;
	cameraRef.aspect = aspect;

	const viewHeight = appState.camera.viewHeight;
	const viewWidth = viewHeight * aspect;

	const leftWorldX = appState.camera.leftWorldX;
	const centerX = leftWorldX + viewWidth / 2;
	const centerY = getCenterYForAnchor(appState.camera.sectionAnchor, viewHeight);

	const fovRadians = THREE.MathUtils.degToRad(appState.camera.fov);
	const cameraHeight = viewHeight / (2 * Math.tan(fovRadians / 2));

	cameraRef.position.set(centerX, centerY, cameraHeight);
	cameraRef.up.set(0, 1, 0);
	cameraRef.lookAt(centerX, centerY, 0);
	cameraRef.updateProjectionMatrix();

	appState.camera.position.x = cameraRef.position.x;
	appState.camera.position.y = cameraRef.position.y;
	appState.camera.position.z = cameraRef.position.z;

	appState.camera.target.x = centerX;
	appState.camera.target.y = centerY;
	appState.camera.target.z = 0;
}

/* ============================================================
   CAMERA SECTION PRESETS
============================================================ */

export function setIdeaCameraView(durationMs = 700) {
	appState.camera.section = "ideas";

	startCameraTransition({
		targetViewHeight: appState.camera.viewHeight,
		targetSectionAnchor: getSectionAnchor("ideas"),
		durationMs,
	});
}

export function setPlanCameraView(durationMs = 700) {
	appState.camera.section = "plan";

	startCameraTransition({
		targetViewHeight: appState.camera.viewHeight,
		targetSectionAnchor: getSectionAnchor("plan"),
		durationMs,
	});
}

export function setTaskCameraView(durationMs = 700) {
	appState.camera.section = "tasks";

	startCameraTransition({
		targetViewHeight: appState.camera.viewHeight,
		targetSectionAnchor: getSectionAnchor("tasks"),
		durationMs,
	});
}

/* ============================================================
   ZOOM
============================================================ */

export function setViewHeight(nextViewHeight, durationMs = 450) {
	startCameraTransition({
		targetViewHeight: nextViewHeight,
		targetSectionAnchor: appState.camera.sectionAnchor,
		durationMs,
	});
}

export function zoomIn(durationMs = 450) {
	setViewHeight(appState.camera.viewHeight - appState.camera.zoomStep, durationMs);
}

export function zoomOut(durationMs = 450) {
	setViewHeight(appState.camera.viewHeight + appState.camera.zoomStep, durationMs);
}
