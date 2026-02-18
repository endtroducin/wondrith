// 📍 src/actions/cardActions.js
// 🛠️ Card actions (create, load)
//
// This file:
//   • Writes to appState.cards
//   • Calls persistence layer
//   • Triggers rendering
//
// It does NOT:
//   • Handle drag logic
//   • Handle hover logic
//   • Calculate visuals
//   • Directly modify Konva nodes
//
// It orchestrates card lifecycle.

import { appState } from "../core/appState.js";
import { saveCard, loadAllCards } from "../services/pouchdb.js";
import { defaultCardSchema } from "../core/schemas.js";
import { drawCard, updateAllCardVisuals } from "../renderers/cardRenderer.js";

// ==================================================
// ➕ CREATE CARD
// ==================================================

export async function createCard() {
	// --------------------------------------------------
	// 🧠 CREATE DATA OBJECT (pure schema)
	// --------------------------------------------------
	const newCard = defaultCardSchema();

	// --------------------------------------------------
	// 💾 WRITE TO SSOT (appState)
	// --------------------------------------------------
	appState.cards[newCard._id] = newCard;

	// --------------------------------------------------
	// 🗄️ PERSIST TO DATABASE
	// --------------------------------------------------
	await saveCard(newCard);

	// --------------------------------------------------
	// 🎨 RENDER CARD
	// --------------------------------------------------
	drawCard(newCard);
}

// ==================================================
// 📤 LOAD CARDS
// ==================================================

export async function loadCards() {
	// --------------------------------------------------
	// 📦 STATE REFERENCES (SECONDARY SSOT)
	// --------------------------------------------------
	const cards = appState.cards;

	// --------------------------------------------------
	// 🗄️ LOAD FROM DATABASE
	// --------------------------------------------------
	const loadedCards = await loadAllCards();

	// --------------------------------------------------
	// 💾 WRITE EACH CARD TO SSOT
	// --------------------------------------------------
	loadedCards.forEach((cardData) => {
		cards[cardData._id] = cardData;
	});

	// --------------------------------------------------
	// 🎨 RENDER EACH CARD FROM SSOT
	// --------------------------------------------------
	Object.values(cards).forEach((cardData) => {
		drawCard(cardData);
	});

	// --------------------------------------------------
	// 🎯 RECONCILE VISUAL STATE WITH ZONES
	// --------------------------------------------------
	updateAllCardVisuals();
}
