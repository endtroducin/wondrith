// 📍 src/renderers/gridRenderer.js
// 🧭 Responsible ONLY for drawing the debug grid
// - Reads from appState
// - Reads from GRID_STYLE
// - Draws to background layer
// - Does NOT mutate card data
// - Does NOT control camera

import Konva from "konva";
import { appState } from "../core/appState.js";
import { GRID_STYLE } from "../core/styles.js";

let gridGroup = null;

export function drawGrid() {
	// ==================================================
	// 🔍 STATE REFERENCES (Single Source of Truth)
	// ==================================================
	const stage = appState.stage;
	const backgroundLayer = appState.layers.background;
	const canvasWidth = appState.canvas.width;
	const canvasHeight = appState.canvas.height;
	const debugVisible = appState.debug.panelVisible;

	// ==================================================
	// 🎨 STYLE REFERENCES
	// ==================================================
	const gridSize = GRID_STYLE.gridSize;
	const majorLineSpacing = GRID_STYLE.majorLine;
	const darkColor = GRID_STYLE.darkColor;
	const lightColor = GRID_STYLE.lightColor;
	const strokeWidthMajor = GRID_STYLE.strokeWidthMajor;
	const strokeWidthMinor = GRID_STYLE.strokeWidthMinor;
	const labelFontSize = GRID_STYLE.labelFontSize;
	const labelColor = GRID_STYLE.labelColor;

	// ==================================================
	// 🚪 EARLY EXIT
	// ==================================================
	if (!debugVisible) {
		if (gridGroup) {
			gridGroup.destroy();
			gridGroup = null;
			backgroundLayer.batchDraw();
		}
		return;
	}

	// ==================================================
	// 🧹 CLEAN PREVIOUS GRID
	// ==================================================
	if (gridGroup) {
		gridGroup.destroy();
		gridGroup = null;
	}

	// ==================================================
	// 📦 CREATE GRID GROUP
	// (One group so we don't create extra layers)
	// ==================================================
	gridGroup = new Konva.Group({
		id: "debugGridGroup",
		listening: false, // grid should not capture mouse events
	});

	const range = 10000; // world draw range

	// ==================================================
	// 🔳 VERTICAL LINES
	// ==================================================
	for (let x = -range; x <= range; x += gridSize) {
		const isMajor = x % majorLineSpacing === 0;

		gridGroup.add(
			new Konva.Line({
				points: [x, -range, x, range],
				stroke: isMajor ? darkColor : lightColor,
				strokeWidth: isMajor ? strokeWidthMajor : strokeWidthMinor,
			}),
		);

		// Major X Labels (Pinned visually to bottom of screen)
		if (isMajor) {
			gridGroup.add(
				new Konva.Text({
					text: `${x}`,
					x: x + 4,
					y: -appState.camera.bounds.top + canvasHeight - 16,
					fontSize: labelFontSize,
					fill: labelColor,
				}),
			);
		}
	}

	// ==================================================
	// 🔳 HORIZONTAL LINES
	// ==================================================
	for (let y = -range; y <= range; y += gridSize) {
		const isMajor = y % majorLineSpacing === 0;

		gridGroup.add(
			new Konva.Line({
				points: [-range, y, range, y],
				stroke: isMajor ? darkColor : lightColor,
				strokeWidth: isMajor ? strokeWidthMajor : strokeWidthMinor,
			}),
		);

		// Major Y Labels (Pinned visually to left of screen)
		if (isMajor) {
			gridGroup.add(
				new Konva.Text({
					text: `${y}`,
					x: -appState.camera.bounds.left + 4,
					y: y + 4,
					fontSize: labelFontSize,
					fill: labelColor,
				}),
			);
		}
	}

	// ==================================================
	// 🧱 ADD TO BACKGROUND LAYER
	// ==================================================
	backgroundLayer.add(gridGroup);
	backgroundLayer.batchDraw();
}
