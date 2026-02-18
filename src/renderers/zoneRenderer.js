// 📍 src/renderers/zoneRenderer.js
// 🎨 Responsible ONLY for drawing zone rectangles.
// This file:
//   - Reads appState.zones
//   - Draws them to the background layer
//   - Does NOT mutate state
//   - Does NOT detect zones
//   - Does NOT handle interaction

import Konva from "konva";
import { appState } from "../core/appState.js";

/* ============================================================
   🎨 DRAW ZONES
============================================================ */

export function drawZones() {
	// --------------------------------------------------
	// 🔎 SSOT References (explicit, always at top)
	// --------------------------------------------------

	const zones = appState.zones;
	const layers = appState.layers;

	const backgroundLayer = layers.background;

	if (!backgroundLayer) {
		console.warn("Background layer not found.");
		return;
	}

	// --------------------------------------------------
	// 🧹 Clear Previous Zones
	// --------------------------------------------------

	// We only remove shapes named "zone"
	backgroundLayer.find(".zone").forEach((node) => node.destroy());

	// --------------------------------------------------
	// 🔁 Draw Each Zone
	// --------------------------------------------------

	Object.values(zones).forEach((zone) => {
		const rect = new Konva.Rect({
			x: zone.x,
			y: zone.y,
			width: zone.width,
			height: zone.height,
			fill: zone.color,
			opacity: 0.2,
			cornerRadius: 10,
			id: zone.id,
			name: "zone", // allows selective clearing
			listening: false, // zones are visual only
		});

		backgroundLayer.add(rect);
	});

	// --------------------------------------------------
	// 🖌️ Redraw Layer
	// --------------------------------------------------

	backgroundLayer.batchDraw();
}
