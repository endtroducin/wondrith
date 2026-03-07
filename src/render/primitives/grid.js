// ==================================================
// 📍 src/render/primitives/grid.js
// ==================================================
// 🧾 GRID RENDERER (PRIMITIVE)
//
// This file:
//   • Draws a grid behind everything
//   • Uses camera pan/zoom to keep grid stable in world space
//   • Draws darker axis line for y = 0
//   • Draws axis labels every 100 pinned to left + bottom
//
// It does NOT:
//   • Affect card logic
//   • Handle interactions
//   • Do 2.5D perspective (projection step)
// ==================================================

import Konva from "konva";
import { appState } from "../../core/appState.js";

/* ============================================================
   🎨 STYLE
============================================================ */

const GRID = {
	minor: 25,
	major: 100,

	colorMinor: "rgba(0,0,0,0.08)",
	colorMajor: "rgba(0,0,0,0.20)",
	colorAxis: "rgba(0,0,0,0.35)",

	widthMinor: 1,
	widthMajor: 1.5,
	widthAxis: 2,

	labelColor: "rgba(0,0,0,0.45)",
	labelFontSize: 11,

	// Overscan so grid reaches screen edge while panning
	paddingPx: 500,
};

/* ============================================================
   🧱 PRIVATE MODULE STATE
============================================================ */

let gridGroup = null;

/* ============================================================
   🧱 ENSURE GRID GROUP
============================================================ */

function ensureGridGroup() {
	// --------------------------------------------------
	// 🔎 SSOT REFERENCES
	// --------------------------------------------------
	const worldLayer = appState.layers.world;

	// --------------------------------------------------
	// 🚪 GUARDS
	// --------------------------------------------------
	if (!worldLayer) return null;

	// --------------------------------------------------
	// 🧱 CREATE ONCE
	// --------------------------------------------------
	if (!gridGroup) {
		gridGroup = new Konva.Group({
			id: "grid-group",
			listening: false,
		});

		// Grid should be behind everything: add first.
		worldLayer.add(gridGroup);
	}

	return gridGroup;
}

/* ============================================================
   🧾 RENDER GRID
============================================================ */

export function renderGrid() {
	// --------------------------------------------------
	// 🔎 SSOT REFERENCES
	// --------------------------------------------------
	const group = ensureGridGroup();
	const worldLayer = appState.layers.world;
	const camera = appState.camera;
	const canvas = appState.canvas;

	// --------------------------------------------------
	// 🚪 GUARDS
	// --------------------------------------------------
	if (!group || !worldLayer) return;

	const w = canvas.width;
	const h = canvas.height;

	if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) return;

	// --------------------------------------------------
	// 🧹 CLEAR (LINES + LABELS)
	// --------------------------------------------------
	group.destroyChildren();

	// --------------------------------------------------
	// 🧮 DERIVED SCREEN WINDOW
	// --------------------------------------------------
	const pad = GRID.paddingPx;

	const left = -pad;
	const top = -pad;
	const right = w + pad;
	const bottom = h + pad;

	// --------------------------------------------------
	// 🧮 CAMERA OFFSET IN SCREEN UNITS
	// --------------------------------------------------
	// screenX = worldX * zoom + offsetX
	// offsetX = -(camera.x * zoom)
	const offsetX = -(camera.x * camera.zoom);
	const offsetY = -(camera.y * camera.zoom);

	// --------------------------------------------------
	// 🧮 GRID STEP IN SCREEN UNITS
	// --------------------------------------------------
	const minorStep = GRID.minor * camera.zoom;
	const majorStep = GRID.major * camera.zoom;

	// Prevent divide-by-zero / NaN cascades
	if (!Number.isFinite(minorStep) || minorStep <= 0) return;

	// --------------------------------------------------
	// 🧮 FIND FIRST ALIGNED LINE IN VIEW
	// --------------------------------------------------
	const startX = Math.floor((left - offsetX) / minorStep) * minorStep + offsetX;
	const startY = Math.floor((top - offsetY) / minorStep) * minorStep + offsetY;

	/* ==================================================
	   🔁 VERTICAL LINES + X LABELS (BOTTOM-PINNED)
	================================================== */

	for (let sx = startX; sx <= right; sx += minorStep) {
		const isMajor = Math.abs((sx - offsetX) % majorStep) < 0.0001;

		group.add(
			new Konva.Line({
				points: [sx, top, sx, bottom],
				stroke: isMajor ? GRID.colorMajor : GRID.colorMinor,
				strokeWidth: isMajor ? GRID.widthMajor : GRID.widthMinor,
			}),
		);

		// ------------------------------
		// 🔢 Labels every 100 (pinned bottom)
		// ------------------------------
		if (isMajor) {
			const worldX = (sx - offsetX) / camera.zoom;

			group.add(
				new Konva.Text({
					x: sx + 4,
					y: h - 18,
					text: `${Math.round(worldX)}`,
					fontSize: GRID.labelFontSize,
					fill: GRID.labelColor,
				}),
			);
		}
	}

	/* ==================================================
	   🔁 HORIZONTAL LINES + Y LABELS (LEFT-PINNED)
	================================================== */

	for (let sy = startY; sy <= bottom; sy += minorStep) {
		// Convert screen → world
		const worldY = (sy - offsetY) / camera.zoom;

		// Determine major lines in WORLD space
		const isMajor = Math.round(worldY) % GRID.major === 0;

		group.add(
			new Konva.Line({
				points: [left, sy, right, sy],
				stroke: isMajor ? GRID.colorMajor : GRID.colorMinor,
				strokeWidth: isMajor ? GRID.widthMajor : GRID.widthMinor,
			}),
		);

		// ------------------------------
		// 🔢 Labels every 100 (pinned left)
		// ------------------------------
		if (isMajor) {
			group.add(
				new Konva.Text({
					x: 6,
					y: sy - 6,
					text: `${Math.round(worldY)}`,
					fontSize: GRID.labelFontSize,
					fill: GRID.labelColor,
				}),
			);
		}
	}

	/* ==================================================
	   ➖ DARKER Y = 0 AXIS LINE
	================================================== */

	// screenY(worldY=0) = 0*zoom + offsetY
	const y0 = offsetY;

	group.add(
		new Konva.Line({
			points: [left, y0, right, y0],
			stroke: GRID.colorAxis,
			strokeWidth: GRID.widthAxis,
		}),
	);

	// --------------------------------------------------
	// 🖌 REDRAW
	// --------------------------------------------------
	worldLayer.batchDraw();
}
