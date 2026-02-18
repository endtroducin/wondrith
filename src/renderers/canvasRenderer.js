// 📍 src/renderers/canvasRenderer.js
// 🎨 Responsible ONLY for initializing Konva stage + layers.
//
// This file:
//   - Creates the Stage
//   - Creates fixed layers
//   - Stores references in appState
//
// It does NOT:
//   - Draw zones
//   - Draw grid
//   - Setup listeners
//   - Handle resize
//   - Contain logic
//

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
	// 🧱 CREATE LAYERS (3 TOTAL)
	// --------------------------------------------------
	const backgroundLayer = new Konva.Layer({ id: "backgroundLayer" });
	const worldLayer = new Konva.Layer({ id: "worldLayer" });
	const uiLayer = new Konva.Layer({ id: "uiLayer" });

	stage.add(backgroundLayer);
	stage.add(worldLayer);
	stage.add(uiLayer);

	// --------------------------------------------------
	// 🌍 CREATE WORLD GROUP (CAMERA CONTAINER)
	// --------------------------------------------------
	const worldGroup = new Konva.Group({ id: "worldGroup" });

	worldLayer.add(worldGroup);

	// --------------------------------------------------
	// 💾 SAVE TO SSOT
	// --------------------------------------------------
	appState.stage = stage;

	appState.layers = {
		background: backgroundLayer,
		world: worldLayer,
		ui: uiLayer,
	};

	appState.world = {
		group: worldGroup,
	};

	console.log("✅ Canvas initialized with worldGroup");
}
