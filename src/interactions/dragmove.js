// 📍 src/interactions/dragmove.js
// 🧲 Handles movement during drag on a card.
//
// Responsibilities:
// - Update card position in appState
// - Detect zone based on world position
// - Update visual style if zone changes
//
// This file does NOT:
// - Save to database
// - Handle camera
// - Handle other cards
//

import { appState } from "../core/appState.js";
import { detectZone } from "../actions/zoneActions.js";
import { updateCardVisual } from "../renderers/cardRenderer.js";

export function dragmoveHandler(evt) {
	// ======================================================
	// 🔎 Explicit SSOT References
	// ======================================================

	const stage = appState.stage;
	const cards = appState.cards;
	const renderedCards = appState.renderedCards;

	const group = evt.target;
	const cardId = group.id();
	const card = cards[cardId];

	if (!card) {
		console.warn("Card not found in appState:", cardId);
		return;
	}

	// ======================================================
	// 1️⃣ Update world position in SSOT
	// ======================================================

	card.position.x = group.x();
	card.position.y = group.y();

	// ======================================================
	// 2️⃣ Detect which zone the card is inside
	// ======================================================

	const detectedZone = detectZone(card.position);
	const newZoneId = detectedZone ? detectedZone.id : null;

	// ======================================================
	// 3️⃣ If zone changed → update card state + visuals
	// ======================================================

	if (card.currentZone !== newZoneId) {
		card.currentZone = newZoneId;

		// Update visual style
		if (renderedCards[cardId]) {
			updateCardVisual(card, renderedCards[cardId]);
		}

		console.log("Zone changed →", newZoneId);
	}

	// Optional:
	// stage.batchDraw(); // only if needed
}
