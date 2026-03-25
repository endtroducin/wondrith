// ==================================================
// 📍 src/world/worldBuilder.js
// ==================================================
// 🌍 WORLD BUILDER
//
// Creates the Pixi layer structure (World, Grid, Cards, UI).
// ==================================================

import * as PIXI from "pixi.js";

/* ============================================================
   🌍 BUILD WORLD LAYERS
============================================================ */

export function buildWorld(app) {
	// World layer holds the main projected scene geometry.
	const world = new PIXI.Container();

	// Grid layer is rendered in world screen space.
	const gridLayer = new PIXI.Container();

	// Card layer holds all card displays.
	const cardLayer = new PIXI.Container();
	cardLayer.sortableChildren = true; // Enables drag-and-drop sorting later

	// UI layer stays pinned to the screen for rulers/labels.
	const uiLayer = new PIXI.Container();

	// Attach layers to the main world container.
	world.addChild(gridLayer);
	world.addChild(cardLayer);

	// Attach world and UI to the Pixi app stage.
	app.stage.addChild(world);
	app.stage.addChild(uiLayer);

	// Return handles to these layers for other modules (renderer, etc.)
	return {
		world,
		gridLayer,
		cardLayer,
		uiLayer,
	};
}
