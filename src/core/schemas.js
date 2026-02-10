// schema/cardTemplate.js

export function defaultCardSchema(overrides = {}) {
	const now = new Date().toISOString();

	return {
		_id: `card-${Date.now()}`,
		title: "New Card",
		description: "...",
		currentZone: "Ideas",
		position: { x: 100, y: 100 },
		status: "new", // 👈 FIXED: can't use TypeScript-style union in plain JS
		createdAt: now,
		updatedAt: now,
		...overrides, // 👈 allows you to customize any field
	};
}
