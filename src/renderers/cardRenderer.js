// 📍 src/renderers/cardRenderer.js
// 🧱 Responsible ONLY for drawing + updating card visuals.
// This file:
//   - Creates Konva groups
//   - Applies visual styling
//   - Animates visual changes
//   - Stores rendered references
//
// It does NOT:
//   - Detect zones
//   - Mutate card data
//   - Save to DB
//   - Handle drag logic

import Konva from "konva";
import { appState } from "../core/appState.js";
import { CARD_STYLE, COLORS } from "../core/styles.js";
import { mouseenterHandler } from "../interactions/mouseenter.js";
import { mouseleaveHandler } from "../interactions/mouseleave.js";
import { detectZone } from "../actions/zoneActions.js";
import gsap from "gsap";

/* ============================================================
   🧱 DRAW CARD
============================================================ */

export function drawCard(cardData) {
	// --------------------------------------------------
	// 🔎 SSOT REFERENCES (declared up top, always)
	// --------------------------------------------------

	const worldLayer = appState.layers.world;

	// --------------------------------------------------
	// 🎬 Create Group
	// --------------------------------------------------

	const group = new Konva.Group({
		x: cardData.position.x,
		y: cardData.position.y,
		draggable: true,
		id: cardData._id,
	});

	// --------------------------------------------------
	// 🟦 Background
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

	// Store direct reference (no findOne ever again)
	group.background = background;

	// --------------------------------------------------
	// 🔤 Title
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
	// 📦 Add to Group
	// --------------------------------------------------

	group.add(background);
	group.add(titleText);

	// --------------------------------------------------
	// 🖱️ Hover Listeners
	// --------------------------------------------------

	group.on("mouseenter", mouseenterHandler);
	group.on("mouseleave", mouseleaveHandler);

	// --------------------------------------------------
	// 🖼️ Add to Layer
	// --------------------------------------------------

	worldLayer.add(group);
	worldLayer.draw();

	// --------------------------------------------------
	// 💾 Store Render Reference in SSOT
	// --------------------------------------------------

	appState.renderedCards[cardData._id] = group;
}

/* ============================================================
   🎨 UPDATE CARD VISUAL
============================================================ */

export function updateCardVisual(cardData, group) {
	// --------------------------------------------------
	// 🔎 SSOT References
	// --------------------------------------------------

	const worldLayer = appState.layers.world;
	const background = group.background;

	if (!background) return;

	// --------------------------------------------------
	// 🎨 Determine Target Style
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
	// 🌀 Animate Using GSAP
	// --------------------------------------------------

	const tweenState = {
		fill: background.fill(),
		radius: background.cornerRadius()[0] || 0,
	};

	gsap.to(tweenState, {
		duration: 0.4,
		fill: targetColor,
		radius: targetRadius,
		ease: "power2.out",

		onUpdate: () => {
			background.fill(tweenState.fill);
			background.cornerRadius([tweenState.radius, tweenState.radius, tweenState.radius, tweenState.radius]);

			worldLayer.batchDraw();
		},
	});
}

/* ============================================================
   🔄 UPDATE ALL CARDS (On Load)
============================================================ */

export function updateAllCardVisuals() {
	// --------------------------------------------------
	// 🔎 SSOT References
	// --------------------------------------------------

	const cards = appState.cards;
	const renderedCards = appState.renderedCards;

	// --------------------------------------------------
	// 🔁 Reconcile each card
	// --------------------------------------------------

	Object.values(cards).forEach((card) => {
		const group = renderedCards[card._id];
		if (!group) return;

		// 🔍 Recalculate zone from world position
		const detectedZone = detectZone(card.position);
		card.currentZone = detectedZone ? detectedZone.id : null;

		// 🎨 Apply correct visual state
		updateCardVisual(card, group);
	});

	// --------------------------------------------------
	// 🎬 Ensure redraw
	// --------------------------------------------------

	appState.layers.world.batchDraw();
}
