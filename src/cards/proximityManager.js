import { appState } from "../core/appState.js";

export function startProximityMonitor() {
	const proximity = 200;
	const alignmentThreshold = 20;

	setInterval(() => {
		const draggingId = appState.debug.activeCardId;
		if (!draggingId) return;

		const draggedGroup = appState.stage.findOne(`#${draggingId}`);
		const draggedRect = draggedGroup?.findOne("Rect");
		if (!draggedGroup || !draggedRect) return;

		const draggedBounds = draggedGroup.getClientRect();
		const draggedCenterY = draggedBounds.y + draggedBounds.height / 2;
		const draggedCenterX = draggedBounds.x + draggedBounds.width / 2;

		// Reset all corners
		Object.entries(appState.cards).forEach(([id]) => {
			const group = appState.stage.findOne(`#${id}`);
			const rect = group?.findOne("Rect");
			if (rect) {
				rect.cornerRadius(8);
			}
		});

		for (const [id, card] of Object.entries(appState.cards)) {
			if (id === draggingId) continue;

			const otherGroup = appState.stage.findOne(`#${id}`);
			const otherRect = otherGroup?.findOne("Rect");
			if (!otherGroup || !otherRect) continue;

			const otherBounds = otherGroup.getClientRect();
			const otherCenterY = otherBounds.y + otherBounds.height / 2;
			const otherCenterX = otherBounds.x + otherBounds.width / 2;

			const yDiff = draggedCenterY - otherCenterY;
			const xDiff = Math.abs(draggedCenterX - otherCenterX);

			const isVerticallyAligned = xDiff < alignmentThreshold;

			if (Math.abs(yDiff) < proximity && isVerticallyAligned) {
				if (yDiff < 0) {
					// Dragged ABOVE other
					draggedRect.cornerRadius([8, 8, 0, 0]);
					otherRect.cornerRadius([0, 0, 8, 8]);
				} else {
					// Dragged BELOW other
					draggedRect.cornerRadius([0, 0, 8, 8]);
					otherRect.cornerRadius([8, 8, 0, 0]);
				}

				draggedRect.getLayer().batchDraw();
				otherRect.getLayer().batchDraw();
			}
		}
	}, 100);
}
