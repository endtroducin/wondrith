// ==================================================
// 📍 src/renderers/zoneRenderer.js
// ==================================================
// 🎨 Draws logical world zones.
// Zones exist in WORLD space.
// They attach to worldGroup so camera affects them.
// ==================================================

import Konva from "konva";
import { appState } from "../core/appState.js";
import { DEFAULT_ZONES } from "../core/styles.js";

export function drawZones() {
	// --------------------------------------------------
	// 🔎 SSOT REFERENCES
	// --------------------------------------------------
	const worldGroup = appState.world.group;

	// --------------------------------------------------
	// 🧹 CLEAR PREVIOUS ZONES
	// --------------------------------------------------
	worldGroup.find(".zone").forEach((node) => node.destroy());

	// --------------------------------------------------
	// 💾 ENSURE ZONES EXIST IN STATE
	// --------------------------------------------------
	appState.zones = DEFAULT_ZONES;

	// --------------------------------------------------
	// 🎨 DRAW EACH ZONE
	// --------------------------------------------------
	Object.values(appState.zones).forEach((zone) => {
		const rect = new Konva.Rect({
			x: zone.x,
			y: zone.y,
			width: zone.width,
			height: zone.height,
			fill: zone.color,
			opacity: 0.15,
			name: "zone",
		});

		worldGroup.add(rect);
	});

	// --------------------------------------------------
	// 🖌 REDRAW WORLD
	// --------------------------------------------------
	appState.layers.world.batchDraw();
}
