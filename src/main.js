// ==================================================
// 📍 src/main.js
// ==================================================
// 🚀 APPLICATION ENTRY
//
// This file:
//   • Seeds initial state (test cards)
//   • Initializes world renderer
//   • Renders first frame
//   • Hooks window resize to rerender
//
// It does NOT:
//   • Contain rendering logic
//   • Contain projection math
//   • Contain interaction logic
// ==================================================

import { appState } from "./core/appState.js";
import { initPointerControls } from "./interaction/pointerController.js";
import { initWorldRenderer, renderWorld, resizeWorld } from "./render/worldRenderer.js";
/* ============================================================
   🧪 SEED TEST DATA
============================================================ */

function seedTestCards() {
	appState.cards["card-1"] = {
		_id: "card-1",
		kind: "card", // future: "task" draws cube
		title: "Card 1",
		position: { x: 200, y: 250, z: 0 },
		width: 180,
		height: 120,
	};

	appState.cards["card-2"] = {
		_id: "card-2",
		kind: "card",
		title: "Card 2",
		position: { x: 520, y: 320, z: 0 },
		width: 180,
		height: 120,
	};
}

/* ============================================================
   🚀 BOOT
============================================================ */

seedTestCards();

initWorldRenderer({
	containerId: "canvas-container",
});

initPointerControls();

renderWorld();

window.addEventListener("resize", () => {
	resizeWorld();
	renderWorld();
});
