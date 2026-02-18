// 📍 src/interactions/listeners.js
// 🧲 Connects UI + Konva events to interaction logic.
//
// Responsibilities:
// - Wire DOM events
// - Wire Konva stage events
// - Handle window resize
//
// Does NOT:
// - Contain card logic
// - Contain rendering
// - Contain persistence
//

import { appState } from "../core/appState.js";
import { createCard } from "../actions/cardActions.js";
import { dragstartHandler } from "./dragstart.js";
import { dragmoveHandler } from "./dragmove.js";
import { dragendHandler } from "./dragend.js";

// ======================================================
// 🖱️ DOM + Basic UI Listeners
// ======================================================

export function setupListeners() {
	// 🔎 Explicit SSOT references
	const stage = appState.stage;
	const mouse = appState.mouse;

	// --------------------------------------------------
	// Add Card Button
	// --------------------------------------------------

	const addBtn = document.getElementById("add-card-btn");

	if (addBtn) {
		addBtn.addEventListener("click", () => {
			createCard();
		});
	}

	// --------------------------------------------------
	// Mouse Tracking (Canvas Only)
	// --------------------------------------------------

	stage.on("mousemove", () => {
		const pos = stage.getPointerPosition();

		mouse.x = pos?.x ?? 0;
		mouse.y = pos?.y ?? 0;
	});
}

// ======================================================
// 🎯 Card Drag Interaction Wiring
// ======================================================

export function setupInteractionListeners() {
	// 🔎 Explicit SSOT reference
	const stage = appState.stage;

	// --------------------------------------------------
	// Drag Start
	// --------------------------------------------------

	stage.on("dragstart", (evt) => {
		// Ensure we only handle draggable groups (cards)
		if (!evt.target || !evt.target.id()) return;

		dragstartHandler(evt);
	});

	// --------------------------------------------------
	// Drag Move
	// --------------------------------------------------

	stage.on("dragmove", (evt) => {
		if (!evt.target || !evt.target.id()) return;

		dragmoveHandler(evt);
	});

	// --------------------------------------------------
	// Drag End
	// --------------------------------------------------

	stage.on("dragend", (evt) => {
		if (!evt.target || !evt.target.id()) return;

		dragendHandler(evt);
	});
}

// ======================================================
// 📏 Resize Handling
// ======================================================

export function handleResize() {
	// 🔎 Explicit SSOT references
	const stage = appState.stage;
	const canvas = appState.canvas;

	const container = document.getElementById("canvas-container");

	if (!container) return;

	// Update stage dimensions
	stage.width(container.offsetWidth);
	stage.height(container.offsetHeight);

	// Update SSOT
	canvas.width = container.offsetWidth;
	canvas.height = container.offsetHeight;

	stage.batchDraw();
}
