// ==================================================
// 📍 src/render/worldRenderer.js
// ==================================================
// 🌍 WORLD RENDERER (HUB)
//
// This file:
//   • Creates Konva stage + world layer
//   • Syncs canvas size into appState
//   • Adapts PURE projection math into a simple projector()
//   • Calls primitive renderers (grid, cards, cube)
//   • batchDraws once per frame
//
// It does NOT:
//   • Store business logic
//   • Mutate card world coordinates
//   • Handle dragging/panning/zooming (later)
// ==================================================

import Konva from "konva";

import { appState } from "../core/appState.js";

import { projectWorldToScreen } from "../math/projection.js";

import { renderGrid } from "./primitives/grid.js";
import { renderCards } from "./primitives/cards.js";
import { renderTestCube } from "./primitives/cube.js";

/* ============================================================
   🏗 INIT
============================================================ */

export function initWorldRenderer({ containerId = "canvas-container" } = {}) {
	// --------------------------------------------------
	// 🚪 GUARD (PREVENT DUPLICATE INIT)
	// --------------------------------------------------
	if (appState.stage) return;

	// --------------------------------------------------
	// 🏗 CREATE STAGE
	// --------------------------------------------------
	const stage = new Konva.Stage({
		container: containerId,
		width: window.innerWidth,
		height: window.innerHeight,
	});

	// --------------------------------------------------
	// 🧱 CREATE WORLD LAYER
	// --------------------------------------------------
	const worldLayer = new Konva.Layer();
	stage.add(worldLayer);

	// --------------------------------------------------
	// 💾 WRITE TO SSOT
	// --------------------------------------------------
	appState.stage = stage;
	appState.layers.world = worldLayer;

	appState.canvas.width = stage.width();
	appState.canvas.height = stage.height();
}

/* ============================================================
   📏 RESIZE (SYNC STAGE → SSOT)
============================================================ */

export function resizeWorld() {
	const stage = appState.stage;
	if (!stage) return;

	stage.width(window.innerWidth);
	stage.height(window.innerHeight);

	appState.canvas.width = stage.width();
	appState.canvas.height = stage.height();
}

/* ============================================================
   🎥 PROJECTOR ADAPTER (SSOT CAMERA → PURE MATH)
============================================================ */
/**
 * Primitives expect:
 *   projector({ x, y, z }) -> { x, y, scale }
 *
 * math/projection.js is PURE and expects:
 *   projectWorldToScreen(worldPoint, camera)
 *
 * This adapter keeps projection PURE while keeping primitives simple.
 */
function projector(worldPoint) {
	return projectWorldToScreen(worldPoint, appState.camera);
}

/* ============================================================
   🎬 RENDER WORLD (ONE FRAME)
============================================================ */

export function renderWorld() {
	const worldLayer = appState.layers.world;
	if (!worldLayer) return;

	// keep SSOT canvas in sync
	appState.canvas.width = appState.stage.width();
	appState.canvas.height = appState.stage.height();

	// ✅ the one projector used by all primitives
	const projector = (p) =>
		projectWorldToScreen(p, appState.camera, {
			depthScale: 1, // tweak later
		});

	renderGrid({ projector });
	renderCards({ projector });
	renderTestCube({ projector });

	worldLayer.batchDraw();
}
