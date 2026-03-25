// ==================================================
// 📍 src/render/gridRenderer.js
// ==================================================
// 🕸 GRID RENDERER
//
// Responsible for drawing the background grid
// to establish the X and Y axes on Z=0.
// ==================================================

import * as PIXI from "pixi.js";
import { appState } from "../core/appState.js";
import { projectWorldToScreen } from "../viewport/camera.js";

/* ============================================================
   🕸 DRAW GRID
============================================================ */

export async function drawGrid() {
	const { gridLayer } = appState; // Get the grid container handle
	const { world } = appState; // Get world boundaries

	// We draw a large rectangle to act as the "ground".
	const ground = new PIXI.Graphics();

	// Draw a subtle grid pattern.
	const gridSize = 100;
	const lines = 10;
	const color = 0xcccccc;
	const lineWidth = 1;

	// Draw vertical lines (X axis)
	for (let i = -lines; i <= lines; i++) {
		const x = i * gridSize;
		ground.moveTo(x, 0);
		ground.lineTo(x, world.boundaries.conversionBandTop * 2); // Arbitrary height for demo
	}

	// Draw horizontal lines (Y axis)
	for (let i = -lines; i <= lines; i++) {
		const y = i * gridSize;
		ground.moveTo(0, y);
		ground.lineTo(world.boundaries.conversionBandTop * 2, y);
	}

	ground.lineStyle(lineWidth, color, 1).beginFill(0x000000, 0); // Transparent fill
	ground.drawRect(
		-world.boundaries.conversionBandTop * 2,
		-world.boundaries.conversionBandTop * 2,
		world.boundaries.conversionBandTop * 4,
		world.boundaries.conversionBandTop * 4,
	);
	ground.endFill();

	// Add the ground graphic to the grid layer
	gridLayer.addChild(ground);

	// Optional: Draw axes labels (X and Y)
	const axisText = new PIXI.Text("X", { fontFamily: "Arial", fontSize: 24 });
	axisText.anchor.set(0.5, 0); // Center text horizontally
	axisText.position.set(0, world.boundaries.conversionBandTop * 2);
	gridLayer.addChild(axisText);

	const axisTextY = new PIXI.Text("Y", { fontFamily: "Arial", fontSize: 24 });
	axisTextY.anchor.set(1, 0.5); // Center text vertically
	axisTextY.position.set(-world.boundaries.conversionBandTop * 2, 0);
	gridLayer.addChild(axisTextY);

	// Align the origin to the center of the screen
	gridLayer.pivot.set(gridLayer.width / 2, gridLayer.height / 2);
}
