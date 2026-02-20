// 📍 src/core/schemas.js
// ======================================================
// 📦 CARD DATA SCHEMA
// ======================================================
//
// Defines canonical structure for cards.
// Pure data blueprint — no rendering logic.
//

// 📍 src/core/schemas.js
// ======================================================
// 📦 CARD DATA SCHEMA
// ======================================================
// Pure data blueprint. No appState. No rendering. No DB.
// ======================================================

export function defaultCardSchema(overrides = {}) {
	// --------------------------------------------------
	// 🕒 DERIVED VALUES
	// --------------------------------------------------
	const now = new Date().toISOString();

	const baseCard = {
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
		// 🌍 WORLD SPACE (GROUND PLANE)
		// ==================================================
		// x/y are ALWAYS ground-plane world coordinates
		// (this keeps drag + zone math sane)
		position: {
			x: 100,
			y: 100,
		},

		// ==================================================
		// 🧱 2.5D VERTICALITY (TOWARD VIEWER)
		// ==================================================
		// elevation = where the bottom of the object is (toward camera)
		// height    = how tall it extends upward from elevation
		//
		// NOTE: for MVP, we only use elevation for SCALE.
		// height becomes useful when you draw cubes/buildings later.
		elevation: 30, // e.g. 30..60 for ideas (clouds), 1..25 for tasks
		height: 10, // e.g. buildings later

		// ==================================================
		// 🗺️ ZONE STATE
		// ==================================================
		currentZone: null, // "ideaZone" | "taskZone" | null

		// ==================================================
		// 📊 WORKFLOW STATE
		// ==================================================
		status: "new",

		// ==================================================
		// 🕒 METADATA
		// ==================================================
		createdAt: now,
		updatedAt: now,
	};

	// --------------------------------------------------
	// 🧩 APPLY OVERRIDES
	// --------------------------------------------------
	return {
		...baseCard,
		...overrides,
	};
}
