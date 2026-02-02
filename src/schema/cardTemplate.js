// schema/cardTemplate.js
export const defaultCardSchema = () => ({
	_id: `card-${Date.now()}`,
	title: "New Card",
	type: "card",
	position: { x: 100, y: 100 },
	currentSpace: null,
	createdAt: new Date().toISOString(),
	description: "Short summary here",
	tags: ["todo"],
	lastUpdated: new Date().toISOString(),
});
