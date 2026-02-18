// 📍 src/actions/cameraActions.js
// 🎥 Camera system
//
// This file:
//   • Reads from appState.camera
//   • Calculates stage transform
//   • Applies transform (animated)
//   • Updates debug bounds
//
// It does NOT:
//   • Handle UI events
//   • Detect zones
//   • Modify other state

import { appState } from "../core/appState.js";
import gsap from "gsap";

// ==================================================
// 🎯 CAMERA PRESETS (logical anchors)
// ==================================================

const CAMERA_PRESETS = {
	idea: {
		worldAnchorY: () => appState.zones.ideaZone.y + appState.zones.ideaZone.height,

		screenAnchorY: () => appState.canvas.height,
	},

	plan: {
		worldAnchorY: () => 0,

		screenAnchorY: () => appState.canvas.height / 2,
	},

	task: {
		worldAnchorY: () => appState.zones.taskZone.y,

		screenAnchorY: () => 0,
	},
};

export function updateCameraFromState() {
	// --------------------------------------------------
	// 🔍 STATE REFERENCES
	// --------------------------------------------------
	const stage = appState.stage;
	const activeZone = appState.camera.activeZone;

	// --------------------------------------------------
	// 🧮 DERIVED VALUES
	// --------------------------------------------------
	const zoom = stage.scaleX();
	const preset = CAMERA_PRESETS[activeZone];

	// --------------------------------------------------
	// 🚪 GUARDS
	// --------------------------------------------------
	if (!preset) {
		console.warn("Invalid camera zone:", activeZone);
		return;
	}

	// --------------------------------------------------
	// 📐 CALCULATE TARGET POSITION
	// --------------------------------------------------
	const worldY = preset.worldAnchorY();
	const screenY = preset.screenAnchorY();

	// Solve:
	// screenY = worldY * zoom + stageY
	// stageY = screenY - worldY * zoom
	const targetStageY = screenY - worldY * zoom;

	// --------------------------------------------------
	// 🎬 APPLY ANIMATED TRANSFORM
	// --------------------------------------------------
	gsap.to(stage, {
		duration: 0.8,
		x: 0,
		y: targetStageY,
		ease: "expo.inOut",

		onUpdate: () => {
			stage.batchDraw();
			updateCameraBounds();
		},
	});
}

// ==================================================
// 🎯 PUBLIC ZONE SETTER
// ==================================================

export function setCameraZone(zoneName) {
	// --------------------------------------------------
	// 🔍 STATE WRITE
	// --------------------------------------------------
	appState.camera.activeZone = zoneName;

	// --------------------------------------------------
	// 🔁 TRIGGER CAMERA UPDATE
	// --------------------------------------------------
	updateCameraFromState();
}

// ==================================================
// 📊 UPDATE CAMERA BOUNDS (debug)
// ==================================================

export function updateCameraBounds() {
	// --------------------------------------------------
	// 🔍 STATE REFERENCES
	// --------------------------------------------------
	const world = appState.world.group;
	const zoom = world.scaleX();
	const viewportW = appState.canvas.width;
	const viewportH = appState.canvas.height;

	const worldX = world.x();
	const worldY = world.y();

	// --------------------------------------------------
	// 🧮 CALCULATE WORLD BOUNDS
	// --------------------------------------------------
	const left = -worldX / zoom;
	const top = -worldY / zoom;
	const right = left + viewportW / zoom;
	const bottom = top + viewportH / zoom;

	// --------------------------------------------------
	// 💾 WRITE TO STATE
	// --------------------------------------------------
	appState.camera.bounds = { left, top, right, bottom };
}
