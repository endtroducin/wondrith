// src/main.js
import { initCanvas } from "./canvas/canvas.js";
import { initDebugPanel } from "./ui/debugPanel.js";
import { loadCards, createCard } from "./cards/cardManager.js";

// Import Listeners
import { setupResizeListener, setupMousePositionListener } from "./core/listeners.js";
// import { startProximityMonitor } from "./cards/proximityManager.js";

// Kick off the app
initCanvas();
initDebugPanel();
loadCards();

// Setup Listeners
setupResizeListener();
setupMousePositionListener();
// startProximityMonitor();

// Add a test card on click
document.getElementById("add-card-btn").addEventListener("click", () => {
	createCard("New Card");
});

// // main.js
// import { initCanvas } from "./canvas/canvas.js"; // 📦 Import the canvas initializer
// import { initDebugPanel } from "./ui/debugPanel.js";
// import "./style/debug.css";
// import { saveCard, loadAllCards } from "./db/pouch.js";
// import { drawCard } from "./cards/cardRenderer.js";
// import { appState } from "./appState.js";

// import { Buffer } from "buffer";
// import process from "process";

// window.Buffer = Buffer;
// window.process = process;

// // 🚀 Kick off the canvas setup
// initCanvas(); // This creates the stage, layer, and draws the rectangle
// initDebugPanel();

// // ➕ Create and add a new card
// async function addNewCard() {
// 	const newCard = {
// 		_id: `card-${Date.now()}`,
// 		title: "New Card",
// 		type: "card",
// 		position: { x: 100, y: 100 },
// 		createdAt: new Date().toISOString(),
// 	};

// 	await saveCard(newCard);
// 	appState.cards[newCard._id] = newCard;
// 	drawCard(newCard);
// }

// // 🔁 Load existing cards on start
// async function loadCards() {
// 	const cards = await loadAllCards();
// 	cards.forEach((card) => {
// 		appState.cards[card._id] = card;
// 		drawCard(card);
// 	});
// }

// // 🧠 Hook up the button
// document.getElementById("add-card-btn").addEventListener("click", addNewCard);

// // 📦 Start
// loadCards();
