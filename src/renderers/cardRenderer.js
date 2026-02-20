// 📍 src/renderers/cardRenderer.js
// ======================================================
// 🧱 CARD RENDERER
// ======================================================
// Draw + update visuals.
// Cards live in worldGroup (camera container).
// X/Y stay world coords. Elevation drives visual scale.
// ======================================================

import Konva from "konva";
import { appState } from "../core/appState.js";
import { CARD_STYLE, COLORS } from "../core/styles.js";
import { mouseenterHandler } from "../interactions/mouseenter.js";
import { mouseleaveHandler } from "../interactions/mouseleave.js";
import { detectZone } from "../actions/zoneActions.js";
import { computeProjectedScale } from "../helpers/projection.js";
import gsap from "gsap";

/* ============================================================
   🧱 DRAW CARD
============================================================ */

export function drawCard(cardData) {
	// --------------------------------------------------
	// 🔎 SSOT REFERENCES
	// --------------------------------------------------
	const worldGroup = appState.world.group;
	const worldLayer = appState.layers.world;

	// --------------------------------------------------
	// 🚪 GUARDS
	// --------------------------------------------------
	if (!worldGroup || !worldLayer) return;

	// --------------------------------------------------
	// 🧮 2.5D SCALE (VISUAL ONLY)
	// --------------------------------------------------
	const scale = computeProjectedScale({
		cameraHeight: appState.camera.height,
		zoom: appState.camera.zoom,
		elevation: cardData.elevation,
	});

	// --------------------------------------------------
	// 🎬 GROUP (WORLD X/Y)
	// --------------------------------------------------
	const group = new Konva.Group({
		x: cardData.position.x,
		y: cardData.position.y,
		scaleX: scale,
		scaleY: scale,
		draggable: true,
		id: cardData._id,
	});

	// --------------------------------------------------
	// 🟦 BACKGROUND
	// --------------------------------------------------
	const background = new Konva.Rect({
		width: CARD_STYLE.width,
		height: CARD_STYLE.height,
		fill: CARD_STYLE.fill,
		cornerRadius: CARD_STYLE.cornerRadius,
		stroke: CARD_STYLE.stroke,
		strokeWidth: CARD_STYLE.strokeWidth,
		shadowBlur: CARD_STYLE.shadowBlur,
		shadowOpacity: CARD_STYLE.shadowOpacity,
	});

	group.background = background;

	// --------------------------------------------------
	// 🔤 TITLE
	// --------------------------------------------------
	const titleText = new Konva.Text({
		text: cardData.title,
		fontSize: 16,
		x: 10,
		y: 10,
		width: CARD_STYLE.width - 20,
		fill: "#222",
	});

	group.titleText = titleText;

	// --------------------------------------------------
	// 📦 BUILD GROUP
	// --------------------------------------------------
	group.add(background);
	group.add(titleText);

	// --------------------------------------------------
	// 🖱️ HOVER
	// --------------------------------------------------
	group.on("mouseenter", mouseenterHandler);
	group.on("mouseleave", mouseleaveHandler);

	// --------------------------------------------------
	// 🧷 ADD TO WORLD
	// --------------------------------------------------
	worldGroup.add(group);
	worldLayer.batchDraw();

	// --------------------------------------------------
	// 💾 TRACK RENDERED REF
	// --------------------------------------------------
	appState.renderedCards[cardData._id] = group;
}

/* ============================================================
   🎨 UPDATE CARD VISUAL
============================================================ */

export function updateCardVisual(cardData, group) {
	// --------------------------------------------------
	// 🔎 SSOT REFERENCES
	// --------------------------------------------------
	const worldLayer = appState.layers.world;
	const background = group.background;

	if (!background) return;

	// --------------------------------------------------
	// 🎨 TARGET STYLES
	// --------------------------------------------------
	let targetColor = COLORS.neutral;
	let targetRadius = 10;

	if (cardData.currentZone === "ideaZone") {
		targetColor = COLORS.ideas;
		targetRadius = 25;
	}

	if (cardData.currentZone === "taskZone") {
		targetColor = COLORS.tasks;
		targetRadius = 0;
	}

	// --------------------------------------------------
	// 🧮 UPDATE 2.5D SCALE (IF ELEVATION CHANGED)
	// --------------------------------------------------
	const targetScale = computeProjectedScale({
		cameraHeight: appState.camera.height,
		zoom: appState.camera.zoom,
		elevation: cardData.elevation,
	});

	// --------------------------------------------------
	// 🌀 ANIMATE
	// --------------------------------------------------
	const tweenState = {
		fill: background.fill(),
		radius: background.cornerRadius()[0] || 0,
		scale: group.scaleX(),
	};

	gsap.to(tweenState, {
		duration: 0.4,
		fill: targetColor,
		radius: targetRadius,
		scale: targetScale,
		ease: "power2.out",
		onUpdate: () => {
			background.fill(tweenState.fill);
			background.cornerRadius([tweenState.radius, tweenState.radius, tweenState.radius, tweenState.radius]);
			group.scale({ x: tweenState.scale, y: tweenState.scale });
			worldLayer.batchDraw();
		},
	});
}

/* ============================================================
   🔄 UPDATE ALL CARDS (ON LOAD)
============================================================ */

export function updateAllCardVisuals() {
	// --------------------------------------------------
	// 🔎 SSOT REFERENCES
	// --------------------------------------------------
	const cards = appState.cards;
	const renderedCards = appState.renderedCards;

	// --------------------------------------------------
	// 🔁 RECONCILE
	// --------------------------------------------------
	Object.values(cards).forEach((card) => {
		const group = renderedCards[card._id];
		if (!group) return;

		// Zone from world X/Y
		const detectedZone = detectZone(card.position);
		card.currentZone = detectedZone ? detectedZone.id : null;

		updateCardVisual(card, group);
	});

	appState.layers.world.batchDraw();
}
