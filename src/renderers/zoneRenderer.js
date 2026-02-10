// 🔧 Core
import Konva from "konva";
import { appState } from "../core/appState.js";

// 📦 Constants
import { DEFAULT_ZONES } from "../core/styles.js";

appState.zones = DEFAULT_ZONES;

export function drawZones() {
	const { layer } = appState;

	Object.values(appState.zones).forEach((zone) => {
		const rect = new Konva.Rect({
			x: zone.x,
			y: zone.y,
			width: zone.width,
			height: zone.height,
			fill: zone.color,
			cornerRadius: 10,
			opacity: 0.2,
			id: zone.id,
		});

		const label = new Konva.Text({
			x: zone.x + 10,
			y: zone.y + 10,
			text: zone.label,
			fontSize: 16,
			fill: "#000",
			fontStyle: "bold",
		});

		layer.add(rect);
		layer.add(label);
	});

	layer.draw();
}

export function updateCardVisual(card, group) {
	const rect = group.background;
	const zoneLabel = group.zoneLabel; // 🧾 Reference to the zone text

	if (!rect || !zoneLabel) return;

	// 🎨 Set fill color based on zone
	let fillColor = "#ccc";

	if (card.currentZone === "ideaZone") {
		fillColor = "#90e0ef";
	} else if (card.currentZone === "taskZone") {
		fillColor = "#f4a261";
	}

	// 🖌️ Apply visual updates
	rect.fill(fillColor);

	// ✏️ Update the label text
	zoneLabel.text(card.currentZone || "Pending");

	group.getLayer().batchDraw(); // Redraw
}
