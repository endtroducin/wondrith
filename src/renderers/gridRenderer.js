// ==================================================
// 📍 src/renderers/gridRenderer.js
// ==================================================
// 🎨 Draws debug grid in WORLD space.
// Grid attaches to worldGroup so it moves with camera.
// ==================================================

import Konva from "konva";
import { appState } from "../core/appState.js";
import { GRID_STYLE } from "../core/styles.js";

export function drawGrid() {
	// --------------------------------------------------
	// 🔎 SSOT REFERENCES
	// --------------------------------------------------
	const worldGroup = appState.world.group;
	const debugVisible = appState.debug.panelVisible;

	// --------------------------------------------------
	// 🚪 GUARD (ONLY DRAW IF DEBUG ON)
	// --------------------------------------------------
	worldGroup.find(".grid").forEach((node) => node.destroy());
	if (!debugVisible) return;

	// --------------------------------------------------
	// 📐 GRID RANGE
	// --------------------------------------------------
	const range = 5000;

	// --------------------------------------------------
	// 🔁 VERTICAL LINES
	// --------------------------------------------------
	for (let x = -range; x <= range; x += GRID_STYLE.gridSize) {
		const isMajor = x % GRID_STYLE.majorLine === 0;

		const line = new Konva.Line({
			points: [x, -range, x, range],
			stroke: isMajor ? GRID_STYLE.darkColor : GRID_STYLE.lightColor,
			strokeWidth: isMajor ? GRID_STYLE.strokeWidthMajor : GRID_STYLE.strokeWidthMinor,
			name: "grid",
		});

		worldGroup.add(line);
	}

	// --------------------------------------------------
	// 🔁 HORIZONTAL LINES
	// --------------------------------------------------
	for (let y = -range; y <= range; y += GRID_STYLE.gridSize) {
		const isMajor = y % GRID_STYLE.majorLine === 0;

		const line = new Konva.Line({
			points: [-range, y, range, y],
			stroke: isMajor ? GRID_STYLE.darkColor : GRID_STYLE.lightColor,
			strokeWidth: isMajor ? GRID_STYLE.strokeWidthMajor : GRID_STYLE.strokeWidthMinor,
			name: "grid",
		});

		worldGroup.add(line);
	}

	// --------------------------------------------------
	// 🖌 REDRAW
	// --------------------------------------------------
	appState.layers.world.batchDraw();
}
