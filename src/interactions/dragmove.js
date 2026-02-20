// 📍 src/interactions/dragmove.js

import { appState } from "../core/appState.js";
import { detectZone } from "../actions/zoneActions.js";
import { updateCardVisual } from "../renderers/cardRenderer.js";

export function dragmoveHandler(evt) {
	// ======================================================
	// 🔎 SSOT References
	// ======================================================

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
	// 1️⃣ Update WORLD position (preserve z)
	// ======================================================

	card.position = {
		...card.position,
		x: group.x(),
		y: group.y(),
	};

	// ======================================================
	// 2️⃣ Detect zone
	// ======================================================

	const detectedZone = detectZone(card.position);
	const newZoneId = detectedZone ? detectedZone.id : null;

	// ======================================================
	// 3️⃣ Update visuals if zone changed
	// ======================================================

	if (card.currentZone !== newZoneId) {
		card.currentZone = newZoneId;

		if (renderedCards[cardId]) {
			updateCardVisual(card, renderedCards[cardId]);
		}
	}
}
