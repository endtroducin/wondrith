// ==================================================
// 📍 src/render/primitives/cards.js
// ==================================================
// 🧊 CARD RENDERER (PRIMITIVE)
//
// This file:
//   • Ensures persistent Konva nodes per card
//   • Projects world → screen via provided projector
//   • Positions/scales nodes
//
// It does NOT:
//   • Change appState.cards positions
//   • Handle input
//   • Do 2.5D depth (step 5/8)
// ==================================================

import Konva from "konva";
import { appState } from "../../core/appState.js";

/* ============================================================
   🎨 STYLE
============================================================ */

const CARD_STYLE = {
	fill: "#89cff0",
	stroke: "#000",
	strokeWidth: 2,
	cornerRadius: 6,
	titleColor: "#000",
	titleSize: 16,
	padding: 10,
};

/* ============================================================
   🧱 ENSURE NODE
============================================================ */

function ensureCardNode(card) {
	const worldLayer = appState.layers.world;
	if (!worldLayer) return null;

	let group = appState.rendered.cards[card._id];

	if (!group) {
		group = new Konva.Group({
			id: card._id,
			draggable: false, // step 7 will enable proper drag
		});

		const bg = new Konva.Rect({
			name: "bg",
			width: card.width,
			height: card.height,
			fill: CARD_STYLE.fill,
			stroke: CARD_STYLE.stroke,
			strokeWidth: CARD_STYLE.strokeWidth,
			cornerRadius: CARD_STYLE.cornerRadius,
		});

		const title = new Konva.Text({
			name: "title",
			text: card.title ?? card._id,
			x: CARD_STYLE.padding,
			y: CARD_STYLE.padding,
			fontSize: CARD_STYLE.titleSize,
			fill: CARD_STYLE.titleColor,
			width: card.width - CARD_STYLE.padding * 2,
		});

		group.add(bg);
		group.add(title);

		worldLayer.add(group);
		appState.rendered.cards[card._id] = group;
	}

	return group;
}

/* ============================================================
   🎬 RENDER ALL CARDS
============================================================ */

export function renderCards({ projector }) {
	const cards = Object.values(appState.cards);

	for (const card of cards) {
		// --------------------------------------------------
		// 🧬 DEFAULTS
		// --------------------------------------------------
		card.position = card.position || { x: 0, y: 0, z: 0 };
		card.width = Number.isFinite(card.width) ? card.width : 160;
		card.height = Number.isFinite(card.height) ? card.height : 110;
		card.title = card.title ?? "New Card";

		// --------------------------------------------------
		// 🧱 ENSURE NODE
		// --------------------------------------------------
		const group = ensureCardNode(card);
		if (!group) continue;

		// --------------------------------------------------
		// 📐 PROJECT + APPLY
		// --------------------------------------------------
		const p = projector({
			x: card.position.x,
			y: card.position.y,
			z: card.position.z ?? 0,
		});

		group.position({ x: p.x, y: p.y });
		group.scale({ x: p.scale ?? 1, y: p.scale ?? 1 });

		// --------------------------------------------------
		// 🔤 KEEP TITLE WIDTH IN SYNC IF CARD DIM CHANGES
		// --------------------------------------------------
		const bg = group.findOne(".bg");
		const title = group.findOne(".title");

		if (bg) {
			bg.width(card.width);
			bg.height(card.height);
		}

		if (title) {
			title.text(card.title);
			title.width(card.width - CARD_STYLE.padding * 2);
		}
	}
}
