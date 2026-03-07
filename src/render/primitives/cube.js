// ==================================================
// 📍 src/render/primitives/cube.js
// ==================================================
// 🧊 TEST CUBE PRIMITIVE (ALL FACES)
// ==================================================

import Konva from "konva";
import { appState } from "../../core/appState.js";

export function renderTestCube({ projector }) {
	const worldLayer = appState.layers.world;
	if (!worldLayer) return;

	worldLayer.find(".cube-shape").forEach((n) => n.destroy());

	const cube = {
		x: 200,
		y: 200,
		z: 25,
		width: 200,
		height: 200,
	};

	const hw = cube.width / 2;
	const hh = cube.height / 2;

	// ground corners
	const A = { x: cube.x - hw, y: cube.y - hh, z: 0 };
	const B = { x: cube.x + hw, y: cube.y - hh, z: 0 };
	const C = { x: cube.x + hw, y: cube.y + hh, z: 0 };
	const D = { x: cube.x - hw, y: cube.y + hh, z: 0 };

	// top corners
	const E = { x: cube.x - hw, y: cube.y - hh, z: cube.z };
	const F = { x: cube.x + hw, y: cube.y - hh, z: cube.z };
	const G = { x: cube.x + hw, y: cube.y + hh, z: cube.z };
	const H = { x: cube.x - hw, y: cube.y + hh, z: cube.z };

	const pA = projector(A);
	const pB = projector(B);
	const pC = projector(C);
	const pD = projector(D);

	const pE = projector(E);
	const pF = projector(F);
	const pG = projector(G);
	const pH = projector(H);

	function face(points, color) {
		worldLayer.add(
			new Konva.Line({
				points,
				fill: color,
				closed: true,
				name: "cube-shape",
			}),
		);
	}

	function edge(p1, p2, color, width) {
		worldLayer.add(
			new Konva.Line({
				points: [p1.x, p1.y, p2.x, p2.y],
				stroke: color,
				strokeWidth: width,
				name: "cube-shape",
			}),
		);
	}

	// --------------------------------------------------
	// 🎨 FACE HELPER
	// --------------------------------------------------

	function face(points, color) {
		worldLayer.add(
			new Konva.Line({
				points,
				fill: color,
				closed: true,
				name: "cube-shape",
			}),
		);
	}

	// --------------------------------------------------
	// 🎨 FACES (6 TOTAL)
	// --------------------------------------------------

	// BACK
	face([pD.x, pD.y, pC.x, pC.y, pG.x, pG.y, pH.x, pH.y], "rgba(0,0,0,0.12)");

	// LEFT
	face([pA.x, pA.y, pD.x, pD.y, pH.x, pH.y, pE.x, pE.y], "rgba(0,0,0,0.12)");

	// RIGHT
	face([pB.x, pB.y, pC.x, pC.y, pG.x, pG.y, pF.x, pF.y], "rgba(0,0,0,0.12)");

	// FRONT2
	face([pA.x, pA.y, pB.x, pB.y, pF.x, pF.y, pE.x, pE.y], "rgba(0,0,0,0.12)");

	// BOTTOM
	face([pA.x, pA.y, pB.x, pB.y, pC.x, pC.y, pD.x, pD.y], "rgba(0,0,0,0.08)");

	// TOP
	face([pE.x, pE.y, pF.x, pF.y, pG.x, pG.y, pH.x, pH.y], "rgba(0,0,0,0.35)");

	//--------------------------------------------------
	// EDGES
	//--------------------------------------------------

	edge(pE, pF, "#000", 3);
	edge(pF, pG, "#000", 3);
	edge(pG, pH, "#000", 3);
	edge(pH, pE, "#000", 3);

	edge(pA, pE, "rgba(0,0,0,0.4)", 1.5);
	edge(pB, pF, "rgba(0,0,0,0.4)", 1.5);
	edge(pC, pG, "rgba(0,0,0,0.4)", 1.5);
	edge(pD, pH, "rgba(0,0,0,0.4)", 1.5);
}
