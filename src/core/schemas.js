// 📍 src/core/schemas.js
// ======================================================
// 📦 CARD DATA SCHEMA
// ======================================================
//
// This file defines the canonical structure of a card.
//
// It contains NO rendering logic.
// It contains NO appState references.
// It contains NO database logic.
//
// It is a pure data blueprint.
//
// ======================================================

export function defaultCardSchema(overrides = {}) {
	// 🔹 Timestamp for creation
	const now = new Date().toISOString();

	return {
		// ==================================================
		// 🆔 IDENTITY
		// ==================================================

		_id: `card-${Date.now()}`,

		// ==================================================
		// 📝 CONTENT
		// ==================================================

		title: "New Card",
		description: "",

		// ==================================================
		// 📍 WORLD POSITION
		// ==================================================

		position: {
			x: 100,
			y: 100,
		},

		// ==================================================
		// 🗺️ ZONE STATE
		// ==================================================

		currentZone: null, // "idea" | "plan" | "task" | null

		// ==================================================
		// 📊 METADATA
		// ==================================================

		status: "new", // "new" | "in-progress" | "done"
		createdAt: now,
		updatedAt: now,

		// ==================================================
		// 🧩 OVERRIDES
		// ==================================================

		...overrides,
	};
}
