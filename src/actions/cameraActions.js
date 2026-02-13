import { appState } from "../core/appState.js";

export function clampCameraPosition(x, y, zoom = 1) {
	const { width, height } = appState.canvas;

	// ⚠️ Prevent moving camera left past x=0
	const clampedX = Math.max(x, 0);

	// 🧮 Vertical anchors (world coordinates)
	const ideaBottom = appState.zones.ideaZone.y + appState.zones.ideaZone.height;
	const taskTop = appState.zones.taskZone.y;

	// Convert anchors to screen space (they should appear fixed)
	const minY = -ideaBottom * zoom + height; // ideaZone bottom pinned to bottom
	const maxY = -taskTop * zoom; // taskZone top pinned to top

	// Clamp Y position to keep anchors pinned
	const clampedY = Math.min(Math.max(y, minY), maxY);

	return { x: clampedX, y: clampedY };
}

// Get center of canvas
function getViewportCenter() {
	return {
		x: appState.canvas.width / 2,
		y: appState.canvas.height / 2,
	};
}

// 🔁 Pan camera to a target zone: "idea", "plan", "task"
export function moveCameraTo(zoneName) {
	const zoom = appState.stage.scaleX(); // Assuming uniform scaling
	const center = getViewportCenter();

	let worldY;

	switch (zoneName) {
		case "idea":
			// pin bottom of idea zone to bottom of screen
			worldY = -appState.zones.ideaZone.y - appState.zones.ideaZone.height + center.y / zoom;
			break;
		case "plan":
			// center of screen = y=0 in world
			worldY = 0;
			break;
		case "task":
			// pin top of task zone to top of screen
			worldY = -appState.zones.taskZone.y + center.y / zoom;
			break;
		default:
			console.warn("Unknown zone target:", zoneName);
			return;
	}

	// Clamp against x=0 rule
	const clamped = {
		x: Math.max(0, 0),
		y: worldY,
	};

	appState.stage.position(clamped);
	appState.stage.batchDraw();
}
