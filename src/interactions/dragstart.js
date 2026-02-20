// 📍 src/interactions/dragstart.js
// ======================================================
// 🧲 DRAG START
// ======================================================
// Marks the active card in debug state.
// Does NOT move data.
// Does NOT modify zones.
// ======================================================

import { appState } from "../core/appState.js";

export function dragstartHandler(evt) {
	// --------------------------------------------------
	// 🔎 SSOT REFERENCES
	// --------------------------------------------------
	const cards = appState.cards;
	const debug = appState.debug;

	// --------------------------------------------------
	// 🎯 EVENT TARGET
	// --------------------------------------------------
	const group = evt.target;
	const cardId = group.id();
	const card = cards[cardId];

	if (!card) return;

	// --------------------------------------------------
	// 💾 SET ACTIVE CARD
	// --------------------------------------------------
	debug.activeCardId = cardId;
}
