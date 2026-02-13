// 📍 src/core/schemas.js
// 📦 Data blueprint for cards. Called whenever we want to create a new one.

export function defaultCardSchema() {
	return {
		_id: `card-${Date.now()}`, // Unique ID
		title: "New Card",
		description: "",
		position: { x: 100, y: 100 }, // Start near top-left
		currentZone: null,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	};
}

// // schema/cardTemplate.js

// export function defaultCardSchema(overrides = {}) {
// 	const now = new Date().toISOString();

// 	return {
// 		_id: `card-${Date.now()}`,
// 		title: "New Card",
// 		description: "...",
// 		currentZone: "Ideas",
// 		position: { x: 100, y: 100 },
// 		status: "new", // 👈 FIXED: can't use TypeScript-style union in plain JS
// 		createdAt: now,
// 		updatedAt: now,
// 		...overrides, // 👈 allows you to customize any field
// 	};
// }
