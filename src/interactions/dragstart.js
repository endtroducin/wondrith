// 📍 src/interactions/dragstart.js
// 🧲 Handles the start of a drag interaction on a card.

// We only ever import appState — interactions should not do heavy logic,
// rendering, or persistence. They react to user input and update state.

import { appState } from "../core/appState.js";

export function dragstartHandler(evt) {
	// evt.target is the Konva shape that started dragging
	const group = evt.target;

	// Store active dragged card in appState
	appState.debug.activeCardId = group.id();

	// Optional: you could add lift animation here, like raise scale
	// But that should live in animations/cardsAnimations.js
	console.log("dragstart");
}
