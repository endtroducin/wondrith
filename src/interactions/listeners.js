// 📍 src/interactions/listeners.js
// 🧲 Hook up global UI events and connect them to logic

import { appState } from "../core/appState.js";
import { createCard } from "../actions/cardActions.js";
import { dragstartHandler } from "./dragstart.js";
import { dragmoveHandler } from "./dragmove.js";
import { dragendHandler } from "./dragend.js";

// import { clampCameraPosition } from "../actions/cameraActions.js";

export function setupListeners() {
	// Create card when user clicks a button
	document.getElementById("add-card-btn")?.addEventListener("click", () => {
		createCard();
	});

	// Track mouse position on Konva canvas
	appState.stage.on("mousemove", () => {
		const pos = appState.stage.getPointerPosition();
		appState.mouse.x = pos?.x;
		appState.mouse.y = pos?.y;
	});
}

// 🔁 Call this once in your main.js after rendering cards
export function setupInteractionListeners() {
	const stage = appState.stage;

	// Listen for card dragstart
	stage.on("dragstart", (evt) => {
		if (evt.target.getParent()) {
			dragstartHandler(evt);
		}
	});

	// Listen for dragmove
	stage.on("dragmove", (evt) => {
		if (evt.target.getParent()) {
			dragmoveHandler(evt);
		}
	});

	// Listen for dragend
	stage.on("dragend", (evt) => {
		if (evt.target.getParent()) {
			dragendHandler(evt);
		}
	});

	// You can do similar for click / mouseenter etc.
}

export function handleResize() {
	const container = document.getElementById("canvas-container");

	appState.stage.width(container.offsetWidth);
	appState.stage.height(container.offsetHeight);

	appState.canvas.width = container.offsetWidth;
	appState.canvas.height = container.offsetHeight;
}

// Example: Pan camera
// export function panStage(deltaX, deltaY) {
// 	const stage = appState.stage;
// 	const currentPos = stage.position();
// 	const zoom = stage.scaleX(); // assuming uniform scale

// 	const targetX = currentPos.x + deltaX;
// 	const targetY = currentPos.y + deltaY;

// 	const clamped = clampCameraPosition(targetX, targetY, zoom);
// 	stage.position(clamped);
// 	stage.batchDraw();
// }

// import { appState } from "../core/appState.js";

// //#region 🧊 Window Resize Listener
// /**
//  * 🧠 Sync stage dimensions with window size.
//  */
// export function updateStageSize() {
// 	if (!appState.canvas) return;

// 	appState.canvas.width = window.innerWidth;
// 	appState.canvas.height = window.innerHeight;

// 	// Optional: redraw canvas
// 	if (appState.layer) {
// 		appState.layer.draw();
// 	}
// }

// /**
//  * 🚀 Initialize resize listener (call this once in main.js)
//  */
// export function setupResizeListener() {
// 	updateStageSize(); // initial load

// 	window.addEventListener("resize", updateStageSize);
// }
// //#endregion

// //#region 🧊 Mouse Position
// export function setupMousePositionListener() {
// 	window.addEventListener("mousemove", (e) => {
// 		appState.mouse = {
// 			x: e.clientX,
// 			y: e.clientY,
// 		};
// 	});
// }
// //#endregion

// //
