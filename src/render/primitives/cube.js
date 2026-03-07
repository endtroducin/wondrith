// ==================================================
// 📍 src/render/primitives/cube.js
// ==================================================
// 🧊 TEST CUBE PRIMITIVE
//
// Draws a simple wireframe cube in world space.
// Used only to verify projection + camera.
//
// Receives the projector function from worldRenderer.
// ==================================================

import Konva from "konva";
import { appState } from "../../core/appState.js";

/* ============================================================
   🧊 RENDER TEST CUBE
============================================================ */

export function renderTestCube({ projector }) {
	const worldLayer = appState.layers.world;
	if (!worldLayer) return;

	// --------------------------------------------------
	// 🧹 Clear previous cube
	// --------------------------------------------------

	worldLayer.find(".cube-line").forEach((n) => n.destroy());

	// --------------------------------------------------
	// 🧮 Cube world position
	// --------------------------------------------------

	const centerX = 200;
	const centerY = 200;
	const size = 200;
	const height = 200;

	const half = size / 2;

	const baseX = centerX - half;
	const baseY = centerY - half;

	// --------------------------------------------------
	// 🧮 Define cube corners (world space)
	// --------------------------------------------------

	const A = { x: baseX, y: baseY, z: 0 };
	const B = { x: baseX + size, y: baseY, z: 0 };
	const C = { x: baseX + size, y: baseY + size, z: 0 };
	const D = { x: baseX, y: baseY + size, z: 0 };

	const E = { x: baseX, y: baseY, z: height };
	const F = { x: baseX + size, y: baseY, z: height };
	const G = { x: baseX + size, y: baseY + size, z: height };
	const H = { x: baseX, y: baseY + size, z: height };

	// --------------------------------------------------
	// 🎯 Project points
	// --------------------------------------------------

	const pA = projector(A);
	const pB = projector(B);
	const pC = projector(C);
	const pD = projector(D);

	const pE = projector(E);
	const pF = projector(F);
	const pG = projector(G);
	const pH = projector(H);

	// --------------------------------------------------
	// 🧱 Line helper
	// --------------------------------------------------

	function line(p1, p2, color, width) {
		worldLayer.add(
			new Konva.Line({
				points: [p1.x, p1.y, p2.x, p2.y],
				stroke: color,
				strokeWidth: width,
				name: "cube-line",
			}),
		);
	}

	// --------------------------------------------------
	// ⬛ TOP EDGES (dark)
	// --------------------------------------------------

	line(pE, pF, "#000", 3);
	line(pF, pG, "#000", 3);
	line(pG, pH, "#000", 3);
	line(pH, pE, "#000", 3);

	// --------------------------------------------------
	// ⬇ VERTICAL EDGES
	// --------------------------------------------------

	line(pA, pE, "rgba(0,0,0,0.35)", 1.5);
	line(pB, pF, "rgba(0,0,0,0.35)", 1.5);
	line(pC, pG, "rgba(0,0,0,0.35)", 1.5);
	line(pD, pH, "rgba(0,0,0,0.35)", 1.5);

	// --------------------------------------------------
	// ⬜ BASE EDGES
	// --------------------------------------------------

	line(pA, pB, "rgba(0,0,0,0.15)", 1);
	line(pB, pC, "rgba(0,0,0,0.15)", 1);
	line(pC, pD, "rgba(0,0,0,0.15)", 1);
	line(pD, pA, "rgba(0,0,0,0.15)", 1);
}
