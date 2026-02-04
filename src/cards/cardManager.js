// src/cards/cardManager.js
import { appState } from "../core/appState.js";
import { saveCard, loadAllCards } from "../db/pouch.js";
import { drawCard } from "./cardRenderer.js";
import { defaultCardSchema } from "../schema/cardTemplate.js";

export async function createCard(title = "New Card") {
	//Create card from cardTemplate.js schema
	const newCard = defaultCardSchema();
	appState.cards[newCard._id] = newCard;
	await saveCard(newCard);
	drawCard(newCard);
}

export async function loadCards() {
	const cards = await loadAllCards();
	cards.forEach((card) => {
		appState.cards[card._id] = card;
		drawCard(card);
	});
}
