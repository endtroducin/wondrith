// 🛠️ Logical tools for managing cards (create, load, draw, save)

import { appState } from "../core/appState.js";
import { saveCard, loadAllCards } from "../services/pouchdb.js";
import { defaultCardSchema } from "../core/schemas.js";
import { drawCard, updateAllCardVisuals } from "../renderers/cardRenderer.js";

// ➕ Create a new card, store it in appState, save to DB, draw it
export async function createCard() {
	const card = defaultCardSchema();
	appState.cards[card._id] = card;
	await saveCard(card);
	drawCard(card);
}

// 📤 Load cards from DB and draw each one
export async function loadCards() {
	const cards = await loadAllCards();
	cards.forEach((card) => {
		appState.cards[card._id] = card;
		drawCard(card);
	});
	updateAllCardVisuals();
}
