// src/
// ├── appState.js              # 🧠 Global single source of truth (SSOT)
// ├── main.js                  # 🚀 Entrypoint that wires everything together

// ├── canvas/                  # 🎨 Visuals and drawing logic
// │   ├── canvas.js            # Init Konva stage/layers
// │   ├── cardRenderer.js      # Only draws cards (no logic)
// │   └── gridRenderer.js      # Optional: grid drawing

// ├── logic/                   # 🧩 Business logic and state updates
// │   └── cardManager.js       # Add, move, delete, update cards

// ├── db/                      # 💾 Persistence layer (PouchDB)
// │   └── pouch.js             # Save/load cards

// ├── ui/                      # 🧑‍💻 DOM overlays (debug panel, etc.)
// │   └── debugPanel.js

// ├── system/                  # ⚙️ Global listeners, sync tools
// │   └── listeners.js

// ├── helpers/                 # 🔣 Math, utils, transforms
// │   └── mathHelpers.js

// └── style/
//     └── debug.css            # Optional styles

// src/main.js
import { initCanvas } from "./canvas/canvas.js";
import { initDebugPanel } from "./ui/debugPanel.js";
import { loadCards, createCard } from "./cards/cardManager.js";

// Kick off the app
initCanvas();
initDebugPanel();
loadCards();

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
