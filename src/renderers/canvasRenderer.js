// ==================================================
// 📍 src/renderers/canvasRenderer.js
// ==================================================
// 🎨 Initializes Konva stage + core layers.
// This file ONLY creates rendering containers.
// No logic. No drawing. No listeners.
// ==================================================

import Konva from "konva";
import { appState } from "../core/appState.js";

export function initCanvas(containerId = "canvas-container") {
	// --------------------------------------------------
	// 📐 INITIAL DIMENSIONS
	// --------------------------------------------------
	const width = window.innerWidth;
	const height = window.innerHeight;

	// --------------------------------------------------
	// 🏗 CREATE STAGE
	// --------------------------------------------------
	const stage = new Konva.Stage({
		container: containerId,
		width,
		height,
	});

	// --------------------------------------------------
	// 🧱 CREATE LAYERS (ONLY 2)
	// --------------------------------------------------
	const worldLayer = new Konva.Layer({ id: "worldLayer" });
	const uiLayer = new Konva.Layer({ id: "uiLayer" });

	stage.add(worldLayer);
	stage.add(uiLayer);

	// --------------------------------------------------
	// 🌍 CREATE WORLD GROUP (CAMERA CONTAINER)
	// --------------------------------------------------
	const worldGroup = new Konva.Group({
		id: "worldGroup",
		x: 0,
		y: 0,
		scaleX: 1,
		scaleY: 1,
	});

	worldLayer.add(worldGroup);

	// --------------------------------------------------
	// 💾 WRITE TO SSOT
	// --------------------------------------------------
	appState.stage = stage;

	appState.layers = {
		world: worldLayer,
		ui: uiLayer,
	};

	appState.world = {
		group: worldGroup,
		focalLength: 1000,
	};

	console.log("✅ Canvas initialized (2-layer system)");
}
