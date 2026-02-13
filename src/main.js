// 📍 src/main.js
// 🚀 The app's entry point. Initializes the canvas and loads cards.

import { initCanvas } from "./renderers/canvasRenderer.js";
import { handleResize, setupInteractionListeners, setupListeners } from "./interactions/listeners.js";
import { loadCards } from "./actions/cardActions.js";
import { initDebugPanel } from "./renderers/debugRenderer.js";
import { drawZones } from "./renderers/zoneRenderer.js";
import { drawGrid } from "./renderers/gridRenderer.js";

// Step 1: Setup Konva canvas
initCanvas();

// Step 2: Register mouse + UI listeners
setupListeners();

// Step 3: Load and render saved cards
loadCards();

// Step 4: Load Debug Panel
initDebugPanel();

// Step 5: Setup Interaction Listeners
setupInteractionListeners();

// Step 6: Listen to stage size
window.addEventListener("resize", handleResize);
handleResize();

// Step 7: Draw Zones
drawZones();

// Step 8: Draw Grids
drawGrid();
