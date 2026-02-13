import Konva from "konva";
import { appState } from "../core/appState.js";
import { GRID_STYLE } from "../core/styles.js";

let gridLayer, labelLayer;

export function drawGrid() {
	// Clear existing grid if it exists
	if (gridLayer) {
		gridLayer.destroy();
		gridLayer = null;
	}

	if (labelLayer) {
		labelLayer.destroy();
		labelLayer = null;
	}

	// Don’t draw grid unless debug is visible
	if (!appState.debug.panelVisible) return;

	const { width, height } = appState.canvas;

	gridLayer = new Konva.Layer();
	labelLayer = new Konva.Layer();

	for (let x = 0; x < width; x += GRID_STYLE.spacingSmall) {
		const isMajor = x % GRID_STYLE.spacingLarge === 0;

		// Draw vertical grid line
		gridLayer.add(
			new Konva.Line({
				points: [x, 0, x, height],
				stroke: isMajor ? GRID_STYLE.darkColor : GRID_STYLE.lightColor,
				strokeWidth: isMajor ? GRID_STYLE.strokeWidthMajor : GRID_STYLE.strokeWidthMinor,
			}),
		);

		// 🔢 Add X label
		if (isMajor) {
			labelLayer.add(
				new Konva.Text({
					text: `${x}`,
					x: x + 2,
					y: height - 16, // Pinned to bottom
					fontSize: GRID_STYLE.labelFontSize,
					fill: GRID_STYLE.labelColor,
				}),
			);
		}
	}

	for (let y = 0; y < height; y += GRID_STYLE.spacingSmall) {
		const isMajor = y % GRID_STYLE.spacingLarge === 0;

		// Draw horizontal grid line
		gridLayer.add(
			new Konva.Line({
				points: [0, y, width, y],
				stroke: isMajor ? GRID_STYLE.darkColor : GRID_STYLE.lightColor,
				strokeWidth: isMajor ? GRID_STYLE.strokeWidthMajor : GRID_STYLE.strokeWidthMinor,
			}),
		);

		// 🔢 Add Y label
		if (isMajor) {
			labelLayer.add(
				new Konva.Text({
					text: `${y}`,
					x: 2, // Pinned to left
					y: y + 2,
					fontSize: GRID_STYLE.labelFontSize,
					fill: GRID_STYLE.labelColor,
				}),
			);
		}
	}

	appState.stage.add(gridLayer);
	appState.stage.add(labelLayer);
	gridLayer.moveToBottom(); // Ensure it stays beneath everything
}
