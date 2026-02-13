// 📍 src/interactions/dragend.js
// 🧲 Handles finishing a drag event on a card — updates DB and triggers rerenders.

import { appState } from "../core/appState.js";
import { saveCard } from "../services/pouchdb.js";
// Optional: import animations if you want post-drag effects

export function dragendHandler(evt) {
	const group = evt.target;
	const cardId = group.id();

	// Clear the active drag state
	appState.debug.activeCardId = null;

	// We already updated position in dragmove,
	// so we persist now that dragging is finished:
	const cardData = appState.cards[cardId];
	saveCard(cardData);

	// If you have logic for zone detection or visuals on drop,
	// you can call those tools here or trigger animations.

	// For example:
	// zoneActions.updateCardZone(cardData);   // if you have zone logic
	// animateCardDrop(cardId);                // if you have animations

	console.log("dragmove");
}
