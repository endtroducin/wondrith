// 📍 src/renderers/canvasRenderer.js
// 🎨 Initializes the canvas and stores the Konva stage/layer into appState

import Konva from "konva";
import { appState } from "../core/appState.js";

export function initCanvas(containerId = "canvas-container") {
	const width = window.innerWidth;
	const height = window.innerHeight;

	const stage = new Konva.Stage({
		container: containerId, // HTML element ID
		width,
		height,
	});

	const layer = new Konva.Layer();
	stage.add(layer);

	// Save refs to appState for later drawing
	appState.stage = stage;
	appState.layer = layer;
}

// // src/canvas/canvas.js
// import Konva from "konva";
// import { appState } from "../core/appState.js";
// import { updateStageSize } from "../interactions/listeners.js";
// import { drawZones } from "./zoneRenderer.js";

// updateStageSize();

// // 🖼️ Initialize the canvas
// export function initCanvas(containerId = "canvas-container") {
// 	// 1️⃣ Create the Konva Stage (top-level container)
// 	appState.stage = new Konva.Stage({
// 		container: containerId,
// 		width: appState.canvas.width,
// 		height: appState.canvas.height,
// 	});

// 	// 2️⃣ Create and add a layer (holds drawable elements)
// 	appState.layer = new Konva.Layer();
// 	appState.stage.add(appState.layer);

// 	// 3️⃣ Draw all background zones (defined in appState.zones)
// 	drawZones();

// 	// 4️⃣ Global mousedown logic
// 	// 👉 Used later to collapse expanded cards, etc.
// 	appState.stage.on("mousedown", (e) => {
// 		const clickedOnCard = e.target.findAncestor(".card", true); // assuming 'card' class
// 		const expandedId = appState.debug.expandedCardId;

// 		if (!clickedOnCard && expandedId) {
// 			const expandedGroup = appState.stage.findOne(`#${expandedId}`);
// 			if (expandedGroup) {
// 				expandedGroup.to({
// 					scaleX: 1,
// 					scaleY: 1,
// 					duration: 0.2,
// 					easing: Konva.Easings.EaseInOut,
// 				});
// 				appState.debug.expandedCardId = null;
// 				appState.stage.draw();
// 			}
// 		}
// 	});

// 	console.log("✅ Canvas initialized");
// }
