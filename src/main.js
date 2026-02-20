// 📍 src/main.js
// 🚀 Application entry point.
// This file ONLY orchestrates initialization order.

import { appState } from "./core/appState.js";
import { DEFAULT_ZONES } from "./core/styles.js";

import { initCanvas } from "./renderers/canvasRenderer.js";
import { drawZones } from "./renderers/zoneRenderer.js";
import { drawGrid } from "./renderers/gridRenderer.js";
import { loadCards } from "./actions/cardActions.js";
import { initDebugPanel } from "./renderers/debugRenderer.js";
import { setupListeners, setupInteractionListeners, handleResize } from "./interactions/listeners.js";
import { applyCameraTransform } from "./actions/cameraActions.js";

// =====================================================
// 1️⃣ Initialize Canvas + Layers
// =====================================================
initCanvas();

// =====================================================
// 2️⃣ Initialize Core State
// =====================================================

// Clone default zones into SSOT
appState.zones = structuredClone(DEFAULT_ZONES);

// Set initial camera zone
appState.camera.activeZone = "plan";

// =====================================================
// 3️⃣ Draw Static World (background layer)
// =====================================================
drawZones();
drawGrid();

// =====================================================
// 4️⃣ Load Data (cards)
// =====================================================
loadCards();
// ⚠️ loadCards internally calls drawCard
// ⚠️ and updateAllCardVisuals after load

// =====================================================
// 5️⃣ Setup Interaction System
// =====================================================
setupListeners();
setupInteractionListeners();

// =====================================================
// 6️⃣ Setup Debug UI
// =====================================================
initDebugPanel();

// =====================================================
// 7️⃣ Handle Resize
// =====================================================
window.addEventListener("resize", handleResize);
handleResize();

// =====================================================
// 8️⃣ Sync Camera to State
// =====================================================
applyCameraTransform();
