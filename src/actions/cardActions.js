// src/cards/cardManager.js
import { appState } from "../core/appState.js";
import { saveCard, loadAllCards } from "../services/pouchdb.js";
import { drawCard } from "../renderers/cardRenderer.js";
import { defaultCardSchema } from "../core/schemas.js";
import { detectZone } from "./zoneActions.js";
import { updateCardVisual } from "../renderers/zoneRenderer.js";

export async function createCard(overrides = {}) {
	const newCard = defaultCardSchema(overrides);
	appState.cards[newCard._id] = newCard;
	await saveCard(newCard);
	drawCard(newCard);
}

export async function loadCards() {
	const cards = await loadAllCards();

	cards.forEach((card) => {
		// 👣 Detect which zone the card is in (based on x, y)
		const detectedZone = detectZone(card.position);

		if (detectedZone) {
			card.currentZone = detectedZone.id; // Update zone ID
		} else {
			card.currentZone = null; // Not in any zone
		}

		appState.cards[card._id] = card;

		// 🧱 Draw on canvas
		const group = drawCard(card);

		// 🎨 Apply correct visual for current zone
		updateCardVisual(card, group);
	});
}
