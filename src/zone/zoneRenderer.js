import Konva from "konva";
import { appState } from "../core/appState.js";

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
