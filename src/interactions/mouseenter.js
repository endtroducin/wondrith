// 📍 src/interactions/mouseenter.js
// 🖱️ Handles card hover enter interaction.
//
// Responsibility:
// - Detect which card is being hovered
// - Update SSOT (appState.debug.hoveredCardId)
//
// Does NOT:
// - Render anything
// - Animate anything
// - Modify card data
//

import { appState } from "../core/appState.js";

export function mouseenterHandler(evt) {
	// --------------------------------------------------
	// 🔎 Explicit SSOT references
	// --------------------------------------------------

	const debug = appState.debug;

	// --------------------------------------------------
	// 🧱 Determine correct group
	// --------------------------------------------------

	// If event fires on a child shape (Rect/Text),
	// we want the parent group (the card container).
	const group = evt.target.getParent();

	if (!group) return;

	const cardId = group.id();

	// --------------------------------------------------
	// 📝 Update SSOT
	// --------------------------------------------------

	debug.hoveredCardId = cardId;

	console.log("Hovered card:", cardId);
}
