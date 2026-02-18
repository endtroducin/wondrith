// 📍 src/interactions/dragstart.js
// 🧲 Handles the start of a drag interaction on a card.
//
// Responsibilities:
// - Mark which card is currently being dragged
// - (Optional) trigger visual lift
//
// Does NOT:
// - Save to DB
// - Detect zones
// - Move camera
//

import { appState } from "../core/appState.js";

export function dragstartHandler(evt) {
	// ======================================================
	// 🔎 Explicit SSOT References
	// ======================================================

	const debug = appState.debug;
	const renderedCards = appState.renderedCards;

	const group = evt.target;
	const cardId = group.id();

	// ======================================================
	// 1️⃣ Mark active dragged card
	// ======================================================

	debug.activeCardId = cardId;

	// ======================================================
	// 2️⃣ Optional: Lift animation (visual only)
	// ======================================================

	// If you want:
	// const cardGroup = renderedCards[cardId];
	// animateCardLift(cardGroup);

	console.log("Drag started →", cardId);
}
