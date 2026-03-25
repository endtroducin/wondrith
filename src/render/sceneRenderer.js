// ==================================================
// 📍 src/render/sceneRenderer.js
// ==================================================
// 🎬 SCENE RENDERER
//
// Renders cards as true world-space rectangular prisms
// under a perspective camera looking straight down.
// ==================================================

import { appState } from "../core/appState.js";
import { STYLES } from "../constants/styles.js";
import { getCardClassification } from "../core/getCardClassification.js";
import { projectWorldToScreen } from "../world/projectWorldToScreen.js";
import { createCard } from "../world/createCard.js";

/* ============================================================
   🎨 GET CARD COLORS
============================================================ */

function getCardColors(classification) {
	return STYLES.card.colors[classification];
}

/* ============================================================
   🧱 ENSURE CARD DISPLAYS EXIST
============================================================ */

function ensureCardDisplays(layers, displayMap) {
	for (const card of appState.cards) {
		if (displayMap.has(card.id)) {
			continue;
		}

		const display = createCard(card);
		displayMap.set(card.id, display);
		layers.cardLayer.addChild(display);
	}
}

/* ============================================================
   📐 GET PRISM CORNERS
============================================================ */

function getProjectedPrismCorners(card) {
	const halfWidth = card.width / 2;
	const halfDepth = card.depth / 2;

	// Bottom footprint corners on the base plane.
	const frontLeftBottom = projectWorldToScreen(card.x - halfWidth, card.y + halfDepth, card.z);

	const frontRightBottom = projectWorldToScreen(card.x + halfWidth, card.y + halfDepth, card.z);

	const backLeftBottom = projectWorldToScreen(card.x - halfWidth, card.y - halfDepth, card.z);

	const backRightBottom = projectWorldToScreen(card.x + halfWidth, card.y - halfDepth, card.z);

	// Top corners at elevated height.
	const frontLeftTop = projectWorldToScreen(card.x - halfWidth, card.y + halfDepth, card.z + card.height);

	const frontRightTop = projectWorldToScreen(card.x + halfWidth, card.y + halfDepth, card.z + card.height);

	const backLeftTop = projectWorldToScreen(card.x - halfWidth, card.y - halfDepth, card.z + card.height);

	const backRightTop = projectWorldToScreen(card.x + halfWidth, card.y - halfDepth, card.z + card.height);

	return {
		frontLeftBottom,
		frontRightBottom,
		backLeftBottom,
		backRightBottom,
		frontLeftTop,
		frontRightTop,
		backLeftTop,
		backRightTop,
	};
}

/* ============================================================
   🧮 GET TOP CENTER
============================================================ */

function getTopFaceCenter(corners) {
	return {
		x: (corners.frontLeftTop.x + corners.frontRightTop.x + corners.backLeftTop.x + corners.backRightTop.x) / 4,
		y: (corners.frontLeftTop.y + corners.frontRightTop.y + corners.backLeftTop.y + corners.backRightTop.y) / 4,
	};
}

/* ============================================================
   🃏 UPDATE ONE CARD DISPLAY
============================================================ */

function updateCardDisplay(display, card) {
	const classification = getCardClassification(card);
	const colors = getCardColors(classification);

	// Clear all graphics because we redraw from world state every frame.
	display.shadow.clear();
	display.topFace.clear();
	display.frontFace.clear();
	display.sideFace.clear();
	display.leftFace.clear();
	display.backFace.clear();
	display.edgeLines.clear();

	const {
		frontLeftBottom,
		frontRightBottom,
		backLeftBottom,
		backRightBottom,
		frontLeftTop,
		frontRightTop,
		backLeftTop,
		backRightTop,
	} = getProjectedPrismCorners(card);

	/* ============================================================
	   🌫️ SHADOW
	============================================================ */

	display.shadow
		.moveTo(frontLeftBottom.x + STYLES.card.shadowOffsetX, frontLeftBottom.y + STYLES.card.shadowOffsetY)
		.lineTo(frontRightBottom.x + STYLES.card.shadowOffsetX, frontRightBottom.y + STYLES.card.shadowOffsetY)
		.lineTo(backRightBottom.x + STYLES.card.shadowOffsetX, backRightBottom.y + STYLES.card.shadowOffsetY)
		.lineTo(backLeftBottom.x + STYLES.card.shadowOffsetX, backLeftBottom.y + STYLES.card.shadowOffsetY)
		.closePath()
		.fill(colors.shadow);

	/* ============================================================
	   🎨 TOP FACE
	============================================================ */

	display.topFace
		.moveTo(frontLeftTop.x, frontLeftTop.y)
		.lineTo(frontRightTop.x, frontRightTop.y)
		.lineTo(backRightTop.x, backRightTop.y)
		.lineTo(backLeftTop.x, backLeftTop.y)
		.closePath()
		.fill(colors.top)
		.stroke({
			width: 2,
			color: colors.stroke,
		});

	/* ============================================================
	   🎨 FRONT FACE
	============================================================ */

	display.frontFace
		.moveTo(frontLeftBottom.x, frontLeftBottom.y)
		.lineTo(frontRightBottom.x, frontRightBottom.y)
		.lineTo(frontRightTop.x, frontRightTop.y)
		.lineTo(frontLeftTop.x, frontLeftTop.y)
		.closePath()
		.fill(colors.front)
		.stroke({
			width: 2,
			color: colors.stroke,
		});

	/* ============================================================
	   🎨 BACK FACE
	============================================================ */

	display.backFace
		.moveTo(backLeftBottom.x, backLeftBottom.y)
		.lineTo(backRightBottom.x, backRightBottom.y)
		.lineTo(backRightTop.x, backRightTop.y)
		.lineTo(backLeftTop.x, backLeftTop.y)
		.closePath()
		.fill(colors.side)
		.stroke({
			width: 2,
			color: colors.stroke,
			alpha: 0.65,
		});

	/* ============================================================
	   🎨 RIGHT FACE
	============================================================ */

	display.sideFace
		.moveTo(frontRightBottom.x, frontRightBottom.y)
		.lineTo(backRightBottom.x, backRightBottom.y)
		.lineTo(backRightTop.x, backRightTop.y)
		.lineTo(frontRightTop.x, frontRightTop.y)
		.closePath()
		.fill(colors.side)
		.stroke({
			width: 2,
			color: colors.stroke,
		});

	/* ============================================================
	   🎨 LEFT FACE
	============================================================ */

	display.leftFace
		.moveTo(frontLeftBottom.x, frontLeftBottom.y)
		.lineTo(backLeftBottom.x, backLeftBottom.y)
		.lineTo(backLeftTop.x, backLeftTop.y)
		.lineTo(frontLeftTop.x, frontLeftTop.y)
		.closePath()
		.fill(colors.side)
		.stroke({
			width: 2,
			color: colors.stroke,
			alpha: 0.75,
		});

	/* ============================================================
	   ✏️ EDGE LINES
	============================================================ */

	display.edgeLines
		.moveTo(frontLeftBottom.x, frontLeftBottom.y)
		.lineTo(frontLeftTop.x, frontLeftTop.y)
		.moveTo(frontRightBottom.x, frontRightBottom.y)
		.lineTo(frontRightTop.x, frontRightTop.y)
		.moveTo(backLeftBottom.x, backLeftBottom.y)
		.lineTo(backLeftTop.x, backLeftTop.y)
		.moveTo(backRightBottom.x, backRightBottom.y)
		.lineTo(backRightTop.x, backRightTop.y)
		.stroke({
			width: 1.5,
			color: colors.stroke,
			alpha: 0.6,
		});

	/* ============================================================
	   📝 LABEL
	============================================================ */

	const topCenter = getTopFaceCenter({
		frontLeftTop,
		frontRightTop,
		backLeftTop,
		backRightTop,
	});

	display.label.text = card.title || "Untitled";
	display.label.x = topCenter.x - display.label.width / 2;
	display.label.y = topCenter.y - display.label.height / 2 - 4;

	// Sort by ground-plane y.
	display.zIndex = card.y;
	display.alpha = classification === "transitioning" ? 0.95 : 1;
}

/* ============================================================
   🎬 CREATE SCENE RENDERER
============================================================ */

export function createSceneRenderer(layers) {
	const displayMap = new Map();

	return {
		render() {
			ensureCardDisplays(layers, displayMap);

			for (const card of appState.cards) {
				const display = displayMap.get(card.id);

				if (!display) {
					continue;
				}

				updateCardDisplay(display, card);
			}
		},
	};
}
