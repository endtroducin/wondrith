// 📍 src/interactions/mouseleave.js
// 🖱️ Handles card hover exit interaction.
//
// Responsibility:
// - Clear hovered card from SSOT
//
// Does NOT:
// - Render
// - Animate
// - Modify card data
//

import { appState } from "../core/appState.js";

export function mouseleaveHandler(evt) {
	// --------------------------------------------------
	// 🔎 Explicit SSOT reference
	// --------------------------------------------------

	const debug = appState.debug;

	// --------------------------------------------------
	// 📝 Clear hover state
	// --------------------------------------------------

	debug.hoveredCardId = null;

	// --------------------------------------------------
	// 🧱 Optional future expansion
	// --------------------------------------------------
	// If you later want hover-out animations,
	// you can safely access:
	//
	// const group = evt.target;
	// and pass it to an animation function.
}
