// 📍 src/helpers/height.js
// ======================================================
// 📐 HEIGHT DERIVATION
// ======================================================
//
// Converts friction level + type into world height.
// Pure math. No appState references.
//

const IDEA_HEIGHT_MAP = {
	3: 50,
	2: 40,
	1: 30,
};

const TASK_HEIGHT_MAP = {
	3: 30,
	2: 20,
	1: 10,
};

export function deriveHeight(card) {
	// --------------------------------------------------
	// 🔍 STATE REFERENCES
	// --------------------------------------------------

	const { type, frictionLevel } = card;

	// --------------------------------------------------
	// 📐 HEIGHT RESOLUTION
	// --------------------------------------------------

	if (type === "idea") {
		return IDEA_HEIGHT_MAP[frictionLevel] || 30;
	}

	if (type === "task") {
		return TASK_HEIGHT_MAP[frictionLevel] || 10;
	}

	return 1;
}
