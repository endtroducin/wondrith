// 📍 src/interactions/dragmove.js
// 🧲 Handles movement during drag on a card.

// This updates the card’s world position in your app state.
// It does not write to DB or redraw anything else — that should be done
// at dragend.

import { appState } from "../core/appState.js";
import { detectZone } from "../actions/zoneActions.js";
import { updateCardVisual } from "../renderers/cardRenderer.js";

//!TO DO removed consts

export function dragmoveHandler(evt) {
	const group = evt.target;
	const cardId = group.id();

	// 🔎 Get the card from SSOT
	const card = appState.cards[cardId];
	if (!card) return;

	// 1️⃣ Update world position
	card.position.x = group.x();
	card.position.y = group.y();

	// 2️⃣ Detect zone based on WORLD position
	const detectedZone = detectZone(card.position);

	const newZoneId = detectedZone ? detectedZone.id : null;

	// 3️⃣ Only react if zone changed
	if (card.currentZone !== newZoneId) {
		card.currentZone = newZoneId;

		// Update appearance
		updateCardVisual(card, group);

		console.log("Zone changed →", newZoneId);
	}

	// // 1️⃣ Update position in SSOT
	// card.position = {
	// 	x: Math.round(group.x()),
	// 	y: Math.round(group.y()),
	// };

	// // 2️⃣ Track pointer position globally
	// // const pos = appState.stage.getPointerPosition();
	// // appState.mouse.x = pos?.x;
	// // appState.mouse.y = pos?.y;

	// // 3️⃣ Ask zone system which zone this position belongs to
	// const detectedZone = detectZone(card.position);

	// // 4️⃣ Only react if zone actually changed
	// const newZoneId = detectedZone?.id || null;

	// if (card.currentZone !== newZoneId) {
	// 	card.currentZone = newZoneId;

	// 	// Update visual style
	// 	updateCardVisual(card, group);

	// 	console.log(`📦 Card now in zone: ${card.currentZone || "none"}`);
	// }
}
