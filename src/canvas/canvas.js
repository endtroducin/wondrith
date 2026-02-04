// src/canvas/canvas.js
import Konva from "konva";
import { appState } from "../core/appState.js";
import { updateStageSize } from "../core/listeners.js";
import { drawZones } from "../zone/zoneRenderer.js";

updateStageSize();

// 🖼️ Initialize the canvas
export function initCanvas(containerId = "canvas-container") {
	// 1️⃣ Create the Konva Stage (top-level container)
	appState.stage = new Konva.Stage({
		container: containerId,
		width: appState.canvas.width,
		height: appState.canvas.height,
	});

	// 2️⃣ Create and add a layer (holds drawable elements)
	appState.layer = new Konva.Layer();
	appState.stage.add(appState.layer);

	// 3️⃣ Draw all background zones (defined in appState.zones)
	drawZones();

	// 4️⃣ Global mousedown logic
	// 👉 Used later to collapse expanded cards, etc.
	appState.stage.on("mousedown", (e) => {
		const clickedOnCard = e.target.findAncestor(".card", true); // assuming 'card' class
		const expandedId = appState.debug.expandedCardId;

		if (!clickedOnCard && expandedId) {
			const expandedGroup = appState.stage.findOne(`#${expandedId}`);
			if (expandedGroup) {
				expandedGroup.to({
					scaleX: 1,
					scaleY: 1,
					duration: 0.2,
					easing: Konva.Easings.EaseInOut,
				});
				appState.debug.expandedCardId = null;
				appState.stage.draw();
			}
		}
	});

	console.log("✅ Canvas initialized");
}

// // canvas.js
// import Konva from "konva"; // 🎨 Import Konva for canvas rendering
// import { appState } from "../appState.js"; // 🧠 Import the shared app state
// import { loadAllCards, saveCard } from "../db/pouch.js";

// // 🚀 Initialize the Konva canvas and store stage/layer in appState
// export async function initCanvas() {
// 	// -----------------------------
// 	// 1. Create Stage
// 	// -----------------------------

// 	// 📐 Get current window size to match canvas dimensions
// 	const width = window.innerWidth;
// 	const height = window.innerHeight;

// 	// 🖼️ Create a new Konva stage (canvas root)
// 	const stage = new Konva.Stage({
// 		container: "canvas-container", // HTML element ID to attach canvas to
// 		width, // Set canvas width
// 		height, // Set canvas height
// 	});

// 	// 🧱 Create a new layer (Konva works in layers, like Photoshop)
// 	const layer = new Konva.Layer();
// 	stage.add(layer); // Add this layer to the stage

// 	// Store references in appState
// 	appState.stage = stage;
// 	appState.layer = layer;
// }

//---------------------------------------
// -----------------------------
// 3. Create draggable rectangle
// -----------------------------

// 🎨 Draws a card rectangle based on cardData
// export function drawCard(cardData) {
// 	const s = appState.cardStyle;

// 	const rect = new Konva.Rect({
// 		x: cardData.x,
// 		y: cardData.y,
// 		width: s.width,
// 		height: s.height,
// 		fill: s.fill,
// 		cornerRadius: s.cornerRadius,
// 		shadowBlur: s.shadowBlur,
// 		shadowOpacity: s.shadowOpacity,
// 		stroke: s.stroke,
// 		strokeWidth: s.strokeWidth,
// 		draggable: true,
// 		name: "card",
// 	});

// 	// -----------------------------
// 	// 4. When user drags rectangle
// 	// -----------------------------

// 	// 💾 Update DB + appState on drag
// 	rect.on("dragmove", () => {
// 		cardData.x = rect.x();
// 		cardData.y = rect.y();

// 		appState.cards[cardData._id] = cardData;
// 		saveCard(cardData);
// 	});

// 	// -----------------------------
// 	// 5. Add rectangle to layer
// 	// -----------------------------

// 	// ➕ Add the rectangle to the layer
// 	appState.layer.add(rect);

// 	// 🖌️ Draw everything on the canvas
// 	appState.layer.draw();

// 	// ✅ Log for sanity check
// 	console.log("Canvas initialized and rectangle drawn.");
// }

// import Konva from "konva";
// import { appState } from "../core/appState.js";
// import { drawGrid } from "./grid.js";

// export function initCanvas(containerId = "canvas-container") {
// 	const width = window.innerWidth;
// 	const height = window.innerHeight;

// 	const stage = new Konva.Stage({
// 		container: containerId,
// 		width,
// 		height,
// 		draggable: true,
// 	});

// 	const gridLayer = new Konva.Layer();
// 	const mainLayer = new Konva.Layer();

// 	stage.add(gridLayer);
// 	stage.add(mainLayer);

// 	appState.canvas.stage = stage;
// 	appState.canvas.gridLayer = gridLayer;
// 	appState.canvas.mainLayer = mainLayer;

// 	// Grid
// 	drawGrid();

// 	// Update mouse/world position
// 	stage.on("mousemove dragmove", () => {
// 		const pos = stage.getPointerPosition();
// 		if (!pos) return;

// 		const { x, y } = pos;
// 		appState.mouse.x = x;
// 		appState.mouse.y = y;

// 		const cam = appState.camera;
// 		appState.mouse.worldX = (x - cam.x) / cam.scale;
// 		appState.mouse.worldY = (y - cam.y) / cam.scale;
// 	});

// 	// Redraw grid when moving or zooming
// 	stage.on("scaleX scaleY dragmove", drawGrid);
// }
