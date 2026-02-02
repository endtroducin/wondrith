// src/cards/cardRenderer.js
import Konva from "konva";
import { appState } from "../appState.js";
import { saveCard, deleteCard } from "../db/pouch.js";

export function drawCard(cardData) {
	const s = appState.cardStyle;

	const group = new Konva.Group({
		x: cardData.position.x,
		y: cardData.position.y,
		draggable: true,
		id: cardData._id,
	});

	// ⬜️ Background
	const rect = new Konva.Rect({
		width: s.width,
		height: s.height,
		fill: s.fill,
		cornerRadius: s.cornerRadius,
		stroke: s.stroke,
		strokeWidth: s.strokeWidth,
		shadowBlur: s.shadowBlur,
		shadowOpacity: s.shadowOpacity,
	});

	// 🔤 Title
	const text = new Konva.Text({
		text: cardData.title,
		fontSize: 16,
		x: 10,
		y: 10,
		width: s.width - 20,
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

	// ❌ Delete Button
	const deleteBtn = new Konva.Rect({
		x: s.width - 20,
		y: 5,
		width: 15,
		height: 15,
		fill: "red",
		cornerRadius: 3,
	});

	group.add(rect, text, desc, space, deleteBtn);
	appState.layer.add(group);
	appState.layer.draw();

	// 🧠 Track drag state
	group.on("dragstart", () => {
		appState.debug.activeCardId = cardData._id;
	});

	group.on("dragmove", () => {
		cardData.position = { x: group.x(), y: group.y() };
	});

	group.on("dragend", () => {
		appState.debug.activeCardId = null;
		appState.cards[cardData._id] = cardData;
		saveCard(cardData);
	});

	// Full Schema on Hover
	group.on("mouseenter", () => {
		appState.debug.hoveredCardId = cardData._id;
	});

	group.on("mouseleave", () => {
		appState.debug.hoveredCardId = null;
	});

	deleteBtn.on("click", async () => {
		await deleteCard(cardData._id);
		group.destroy();
		appState.layer.draw();
	});
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
