// src/cards/cardRenderer.js
import Konva from "konva";
import { appState } from "../core/appState.js";
import { saveCard, deleteCard } from "../db/pouch.js";
import { detectZone } from "../zone/zoneManager.js";
import { updateCardVisual } from "../core/helpers.js";
import { CARD_STYLE } from "../core/constants.js";
import { CARD_DEFAULT_STYLE, CARD_LIFTED_STYLE } from "../core/constants.js";

export function drawCard(cardData) {
	const group = new Konva.Group({
		x: cardData.position.x,
		y: cardData.position.y,
		draggable: true,
		id: cardData._id,
	});

	// ⬜️ Background
	const background = new Konva.Rect({
		width: CARD_STYLE.width,
		height: CARD_STYLE.height,
		fill: CARD_STYLE.fill,
		cornerRadius: CARD_STYLE.cornerRadius,
		stroke: CARD_STYLE.stroke,
		strokeWidth: CARD_STYLE.strokeWidth,
		shadowBlur: CARD_STYLE.shadowBlur,
		shadowOpacity: CARD_STYLE.shadowOpacity,
		name: "background",
	});

	// 🧠 Store a reference directly on the group
	group.background = background;

	// 🔤 Title
	const text = new Konva.Text({
		text: cardData.title,
		fontSize: 16,
		x: 10,
		y: 10,
		width: CARD_STYLE.width - 20,
		fill: "#222",
	});

	// 🔡 Description
	const desc = new Konva.Text({
		text: cardData.description || "",
		fontSize: 12,
		x: 10,
		y: 30,
		width: 140,
		fill: "#444",
	});

	// 🌄 Current Zone
	const space = new Konva.Text({
		text: cardData.currentSpace || "Pending",
		fontsize: 12,
		x: 10,
		y: 50,
		width: 140,
		fill: "#444",
	});

	group.zoneLabel = space;

	// ❌ Delete Button
	const deleteBtn = new Konva.Rect({
		x: CARD_STYLE.width - 20,
		y: 5,
		width: 15,
		height: 15,
		fill: "red",
		cornerRadius: 3,
	});

	group.add(background, text, desc, space, deleteBtn);
	appState.layer.add(group);
	appState.layer.draw();

	// 🧠 Track drag state
	group.on("dragstart", () => {
		appState.debug.activeCardId = cardData._id;
	});

	group.on("dragmove", () => {
		// 1️⃣ Sync card data with visual position
		cardData.position = {
			x: group.x(),
			y: group.y(),
		};

		// 2️⃣ Ask zone system which zone this position belongs to
		const detectedZone = detectZone(cardData.position);

		// 3️⃣ Only react if zone actually changed
		if (cardData.currentZone !== (detectedZone?.id || null)) {
			cardData.currentZone = detectedZone ? detectedZone.id : null;
			updateCardVisual(cardData, group);
			console.log(`📦 Card now in zone: ${cardData.currentZone || "none"}`);
		}
	});

	group.on("dragend", () => {
		appState.debug.activeCardId = null;
		appState.cards[cardData._id] = cardData;
		saveCard(cardData);

		// Reset all cards' corners
		Object.values(appState.cards).forEach((card) => {
			const g = appState.stage.findOne(`#${card._id}`);
			const r = g?.findOne("Rect");
			if (r) r.cornerRadius(8);
		});

		appState.layer.draw();
	});

	// Full Schema on Hover
	group.on("mouseenter", () => {
		appState.debug.hoveredCardId = cardData._id;

		// group.to({
		// 	scaleX: 1.05,
		// 	scaleY: 1.05,
		// 	duration: 0.15,
		// 	shadowBlur: 15,
		// 	shadowOpacity: 0.4,
		// 	easing: Konva.Easings.EaseInOut,
		// });
		// group.getStage().container().style.cursor = "pointer";
	});

	group.on("mouseleave", () => {
		appState.debug.hoveredCardId = null;

		// if (!group.isDragging()) {
		// 	group.to({
		// 		scaleX: 1,
		// 		scaleY: 1,
		// 		duration: 0.15,
		// 		shadowBlur: 5,
		// 		shadowOpacity: 0.2,
		// 		easing: Konva.Easings.EaseInOut,
		// 	});
		// }
		// group.getStage().container().style.cursor = "default";
	});

	group.on("dblclick", () => {
		// Collapse previously expanded card (if any)
		if (appState.debug.expandedCardId) {
			const prevGroup = appState.stage.findOne(`#${appState.debug.expandedCardId}`);
			if (prevGroup && prevGroup !== group) {
				prevGroup.to({
					scaleX: 1,
					scaleY: 1,
					duration: 0.2,
					easing: Konva.Easings.EaseInOut,
				});
			}
		}

		// Expand current card
		group.to({
			scaleX: 2.0,
			scaleY: 2.0,
			duration: 0.2,
			easing: Konva.Easings.EaseInOut,
		});

		group.moveToTop();
		appState.debug.expandedCardId = group.id();
		appState.stage.draw();
	});

	deleteBtn.on("click", async () => {
		await deleteCard(cardData._id);
		group.destroy();
		appState.layer.draw();
	});

	const bounds = group.getClientRect({ relativeTo: group });

	group.offsetX(bounds.width / 2);
	group.offsetY(bounds.height / 2);

	// Update group position to compensate for new offset
	group.position({
		x: cardData.position.x + bounds.width / 2,
		y: cardData.position.y + bounds.height / 2,
	});

	return group;
}

// import Konva from "konva";
// import { appState } from "../appState.js";
// import { saveCard, deleteCard } from "../db/pouch.js";

// // 🃏 Draw a single card on the canvas
// export function drawCard(cardData) {
// 	const s = appState.cardStyle;
// 	const layer = appState.layer;

// 	// Create a Konva group to hold card + text + delete button
// 	const group = new Konva.Group({
// 		x: cardData.position?.x ?? 100,
// 		y: cardData.position?.y ?? 100,
// 		draggable: true,
// 		id: cardData._id,
// 		name: "card-group",
// 	});

// 	// Card background
// 	const rect = new Konva.Rect({
// 		width: s.width,
// 		height: s.height,
// 		fill: s.fill,
// 		cornerRadius: s.cornerRadius,
// 		shadowBlur: s.shadowBlur,
// 		shadowOpacity: s.shadowOpacity,
// 		stroke: s.stroke,
// 		strokeWidth: s.strokeWidth,
// 	});

// 	// Card title
// 	const text = new Konva.Text({
// 		text: cardData.title ?? "Untitled",
// 		fontSize: 16,
// 		x: 10,
// 		y: 10,
// 		width: s.width - 30,
// 		fill: "#222",
// 	});

// 	// Delete button
// 	const deleteBtn = new Konva.Rect({
// 		x: s.width - 20,
// 		y: 5,
// 		width: 15,
// 		height: 15,
// 		fill: "red",
// 		cornerRadius: 3,
// 	});

// 	// ➕ Add elements to the group
// 	group.add(rect, text, deleteBtn);
// 	layer.add(group);
// 	layer.draw();

// 	// Track Dragging
// 	group.on("dragstart", () => {
// 		appState.activeDragCardId = cardData._id;
// 	});

// 	group.on("dragmove", () => {
// 		cardData.position = { x: group.x(), y: group.y() };
// 		appState.cards[cardData._id] = cardData;
// 	});

// 	group.on("dragend", () => {
// 		appState.activeDragCardId = null;
// 		saveCard(cardData);
// 	});

// 	// 🗑️ Delete handler
// 	deleteBtn.on("click", async () => {
// 		await deleteCard(cardData._id);
// 		group.destroy();
// 		layer.draw();
// 	});
// }
