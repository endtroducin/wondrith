// 📍 src/interactions/dragend.js
// 🧲 Handles finishing a drag event on a card.
//
// Responsibilities:
// - Clear active drag state
// - Persist card data to database
// - Optionally finalize visual state
//
// This file does NOT:
// - Detect zones (handled in dragmove)
// - Update camera
// - Redraw everything
//

import { appState } from "../core/appState.js";
import { saveCard } from "../services/pouchdb.js";
import { updateCardVisual } from "../renderers/cardRenderer.js";

export function dragendHandler(evt) {
	// ======================================================
	// 🔎 Explicit References (SSOT access)
	// ======================================================

	const stage = appState.stage;
	const cards = appState.cards;
	const renderedCards = appState.renderedCards;
	const debug = appState.debug;

	const group = evt.target;
	const cardId = group.id();
	const cardData = cards[cardId];

	if (!cardData) {
		console.warn("Card not found in appState:", cardId);
		return;
	}

	// ======================================================
	// 1️⃣ Clear active drag state
	// ======================================================

	debug.activeCardId = null;

	// ======================================================
	// 2️⃣ Persist final position to DB
	// ======================================================

	saveCard(cardData);

	// ======================================================
	// 3️⃣ Ensure final visual state is correct
	// ======================================================

	if (renderedCards[cardId]) {
		updateCardVisual(cardData, renderedCards[cardId]);
	}

	stage.batchDraw();

	console.log("Drag ended:", cardId);
}
