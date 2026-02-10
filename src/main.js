//Imports
import { initCanvas } from "./ui/canvas.js";
import { initDebugPanel } from "./renderers/debugRenderer.js";
import { loadCards, createCard } from "./actions/cardActions.js";

// Import Listeners
import { setupResizeListener, setupMousePositionListener } from "./interactions/listeners.js";

// Kick off the app
initCanvas();
initDebugPanel();
loadCards();

// Setup Listeners
setupResizeListener();
setupMousePositionListener();

// Add a test card on click
document.getElementById("add-card-btn").addEventListener("click", () => {
	createCard("New Card");
});
