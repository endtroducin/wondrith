import { appState } from "../core/appState.js";

export function mouseenterHandler(evt) {
	// Ensure we always get the group, even if the event came from a child shape
	const group = evt.target.getParent();
	if (!group) return;

	const cardId = group.id();
	appState.debug.hoveredCardId = cardId;

	console.log("Hovered card:", cardId);
}
