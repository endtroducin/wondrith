// ==================================================
// 📍 src/world/createCard.js
// ==================================================
// 🃏 CREATE CARD
// ==================================================

import * as PIXI from "pixi.js";

/* ============================================================
   🃏 CREATE CARD
============================================================ */

export function createCard(card) {
	const display = new PIXI.Container();

	display.objectId = card.id;

	display.shadow = new PIXI.Graphics();
	display.topFace = new PIXI.Graphics();
	display.frontFace = new PIXI.Graphics();
	display.backFace = new PIXI.Graphics();
	display.sideFace = new PIXI.Graphics();
	display.leftFace = new PIXI.Graphics();
	display.edgeLines = new PIXI.Graphics();

	display.label = new PIXI.Text({
		text: "",
		style: {
			fontFamily: "Arial",
			fontSize: 14,
			fill: 0x334155,
		},
	});

	display.addChild(display.shadow);
	display.addChild(display.backFace);
	display.addChild(display.leftFace);
	display.addChild(display.sideFace);
	display.addChild(display.frontFace);
	display.addChild(display.topFace);
	display.addChild(display.edgeLines);
	display.addChild(display.label);

	return display;
}
