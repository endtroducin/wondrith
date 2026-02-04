export function updateCardVisual(card, group) {
	const rect = group.background;
	const zoneLabel = group.zoneLabel; // 🧾 Reference to the zone text

	if (!rect || !zoneLabel) return;

	// 🎨 Set fill color based on zone
	let fillColor = "#ccc";

	if (card.currentZone === "ideaZone") {
		fillColor = "#90e0ef";
	} else if (card.currentZone === "taskZone") {
		fillColor = "#f4a261";
	}

	// 🖌️ Apply visual updates
	rect.fill(fillColor);

	// ✏️ Update the label text
	zoneLabel.text(card.currentZone || "Pending");

	group.getLayer().batchDraw(); // Redraw
}
