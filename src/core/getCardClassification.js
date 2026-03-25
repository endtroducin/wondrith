// ==================================================
// 📍 src/core/getCardClassification.js
// ==================================================
// 🧭 GET CARD CLASSIFICATION
//
// Cards are not intrinsically tasks or ideas.
// Their role is derived from spatial position.
// ==================================================

import { appState } from "./appState.js";

/* ============================================================
   🧭 GET CARD CLASSIFICATION
============================================================ */

export function getCardClassification(card) {
	// Pull the conversion band boundaries from app state.
	const { conversionBandTop, conversionBandBottom } = appState.world;

	// Above the band = idea behavior.
	if (card.y < conversionBandTop) {
		return "idea";
	}

	// Below the band = task behavior.
	if (card.y > conversionBandBottom) {
		return "task";
	}

	// Inside the band = transition state.
	return "transitioning";
}
