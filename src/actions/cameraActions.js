// 📍 src/actions/cameraActions.js
// ======================================================
// 🎥 CAMERA ACTIONS
// ======================================================
// Reads appState.camera → applies transform to worldGroup.
// Updates camera bounds for debug.
// ======================================================

import { appState } from "../core/appState.js";
import gsap from "gsap";

/* ============================================================
   🎬 APPLY CAMERA TRANSFORM
============================================================ */

export function applyCameraTransform() {
	// --------------------------------------------------
	// 🔎 SSOT REFERENCES
	// --------------------------------------------------
	const camera = appState.camera;
	const worldGroup = appState.world.group;
	const worldLayer = appState.layers.world;

	// --------------------------------------------------
	// 🚪 GUARDS
	// --------------------------------------------------
	if (!worldGroup || !worldLayer) return;

	// --------------------------------------------------
	// 📐 APPLY PAN (GROUND PLANE)
	// --------------------------------------------------
	// When camera.x increases, the world shifts left.
	worldGroup.position({
		x: -camera.x * camera.zoom,
		y: -camera.y * camera.zoom,
	});

	// --------------------------------------------------
	// 🔍 APPLY ZOOM
	// --------------------------------------------------
	worldGroup.scale({
		x: camera.zoom,
		y: camera.zoom,
	});

	// --------------------------------------------------
	// 🖌️ REDRAW + DEBUG
	// --------------------------------------------------
	worldLayer.batchDraw();
	updateCameraBounds();
}

/* ============================================================
   🎬 ANIMATE CAMERA TO TARGET
============================================================ */

export function animateCameraTo(target) {
	// --------------------------------------------------
	// 🔎 SSOT REFERENCES
	// --------------------------------------------------
	const camera = appState.camera;

	// --------------------------------------------------
	// 🎬 GSAP ANIMATION
	// --------------------------------------------------
	gsap.to(camera, {
		duration: 0.8,
		x: target.x ?? camera.x,
		y: target.y ?? camera.y,
		zoom: target.zoom ?? camera.zoom,
		height: target.height ?? camera.height,
		ease: "expo.inOut",
		onUpdate: applyCameraTransform,
	});
}

/* ============================================================
   🎯 SET CAMERA ZONE
============================================================ */

export function setCameraZone(zoneName) {
	// --------------------------------------------------
	// 💾 STATE WRITE
	// --------------------------------------------------
	appState.camera.activeZone = zoneName;

	// --------------------------------------------------
	// 📐 ZONE TARGETS (MVP)
	// --------------------------------------------------
	// You can refine these once zones are final.
	let targetY = 0;

	if (zoneName === "idea") targetY = -appState.canvas.height / 2;
	if (zoneName === "plan") targetY = 0;
	if (zoneName === "task") targetY = appState.canvas.height / 2;

	animateCameraTo({ y: targetY });
}

/* ============================================================
   📊 UPDATE CAMERA BOUNDS (DEBUG)
============================================================ */

export function updateCameraBounds() {
	// --------------------------------------------------
	// 🔎 SSOT REFERENCES
	// --------------------------------------------------
	const camera = appState.camera;
	const viewportW = appState.canvas.width;
	const viewportH = appState.canvas.height;

	// --------------------------------------------------
	// 🧮 WORLD BOUNDS
	// --------------------------------------------------
	const left = camera.x;
	const top = camera.y;
	const right = camera.x + viewportW / camera.zoom;
	const bottom = camera.y + viewportH / camera.zoom;

	appState.camera.bounds = { left, top, right, bottom };
}
