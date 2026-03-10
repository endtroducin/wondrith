// ==================================================
// 📍 src/data/entrySchema.js
// ==================================================
// 🧾 ENTRY SCHEMA
//
// Defines the canonical entry document shape for
// tasks and ideas, plus helpers for creating and
// normalizing records.
//
// Responsibilities:
//   • define entry types
//   • create valid task entries
//   • create valid idea entries
//   • normalize loaded records
//   • generate unique ids
//
// Does NOT:
//   • access the database
//   • mutate appState
//   • create Three.js objects
// ==================================================

/* ============================================================
   ENTRY TYPES
============================================================ */

export const ENTRY_TYPES = {
	TASK: "task",
	IDEA: "idea",
};

export const ENTRY_STATUS = {
	ACTIVE: "active",
	ARCHIVED: "archived",
	DELETED: "deleted",
};

/* ============================================================
   ID + TIME HELPERS
============================================================ */

export function createEntryId() {
	const timestamp = Date.now().toString(36);
	const random = crypto.randomUUID().replaceAll("-", "").slice(0, 10);

	return `entry_${timestamp}_${random}`;
}

export function createTimestamp() {
	return new Date().toISOString();
}

/* ============================================================
   BASE ENTRY
============================================================ */

export function createBaseEntry(overrides = {}) {
	const now = createTimestamp();

	return {
		id: createEntryId(),
		type: ENTRY_TYPES.TASK,

		title: "",
		description: "",

		position: {
			x: 0,
			y: 0,
			z: 0,
		},

		visual: {
			color: 0x7fd1ff,
			width: 50,
			depth: 25,
			height: 35,
			radius: 14,
		},

		status: ENTRY_STATUS.ACTIVE,
		tags: [],

		createdAt: now,
		updatedAt: now,

		...overrides,
	};
}

/* ============================================================
   TASK ENTRIES
============================================================ */

export function createTaskEntry(overrides = {}) {
	const baseEntry = createBaseEntry({
		type: ENTRY_TYPES.TASK,
		title: "New Task",
		position: {
			x: 0,
			y: -80,
			z: 0,
		},
		visual: {
			color: 0x7fd1ff,
			width: 50,
			depth: 25,
			height: 40,
			radius: 14,
		},
		task: {
			priority: 2,
			stage: "backlog",
			completedAt: null,
			dueAt: null,
		},
	});

	return normalizeEntry({
		...baseEntry,
		...overrides,
		position: {
			...baseEntry.position,
			...(overrides.position ?? {}),
		},
		visual: {
			...baseEntry.visual,
			...(overrides.visual ?? {}),
		},
		task: {
			...baseEntry.task,
			...(overrides.task ?? {}),
		},
	});
}

/* ============================================================
   IDEA ENTRIES
============================================================ */

export function createIdeaEntry(overrides = {}) {
	const baseEntry = createBaseEntry({
		type: ENTRY_TYPES.IDEA,
		title: "New Idea",
		position: {
			x: 0,
			y: 80,
			z: 8,
		},
		visual: {
			color: 0xb8e1ff,
			width: 50,
			depth: 25,
			height: 18,
			radius: 14,
		},
		idea: {
			confidence: 0.5,
			source: "brainstorm",
		},
	});

	return normalizeEntry({
		...baseEntry,
		...overrides,
		position: {
			...baseEntry.position,
			...(overrides.position ?? {}),
		},
		visual: {
			...baseEntry.visual,
			...(overrides.visual ?? {}),
		},
		idea: {
			...baseEntry.idea,
			...(overrides.idea ?? {}),
		},
	});
}

/* ============================================================
   NORMALIZATION
============================================================ */

export function normalizeEntry(entry) {
	const now = createTimestamp();
	const normalizedType = entry.type === ENTRY_TYPES.IDEA ? ENTRY_TYPES.IDEA : ENTRY_TYPES.TASK;

	const minWidth = 50;
	const minDepth = 25;
	const minHeight = normalizedType === ENTRY_TYPES.IDEA ? 12 : 40;
	const minRadius = 8;

	const normalized = {
		id: entry.id ?? createEntryId(),
		type: normalizedType,

		title: entry.title ?? "",
		description: entry.description ?? "",

		position: {
			x: Number(entry.position?.x ?? 0),
			y: Number(entry.position?.y ?? 0),
			z: Number(entry.position?.z ?? 0),
		},

		visual: {
			color: Number(entry.visual?.color ?? (normalizedType === ENTRY_TYPES.IDEA ? 0xb8e1ff : 0x7fd1ff)),
			width: Math.max(minWidth, Number(entry.visual?.width ?? minWidth)),
			depth: Math.max(minDepth, Number(entry.visual?.depth ?? minDepth)),
			height: Math.max(minHeight, Number(entry.visual?.height ?? minHeight)),
			radius: Math.max(minRadius, Number(entry.visual?.radius ?? 14)),
		},

		status: entry.status ?? ENTRY_STATUS.ACTIVE,
		tags: Array.isArray(entry.tags) ? [...entry.tags] : [],

		createdAt: entry.createdAt ?? now,
		updatedAt: entry.updatedAt ?? now,
	};

	if (normalizedType === ENTRY_TYPES.TASK) {
		normalized.task = {
			priority: Number(entry.task?.priority ?? 2),
			stage: entry.task?.stage ?? "backlog",
			completedAt: entry.task?.completedAt ?? null,
			dueAt: entry.task?.dueAt ?? null,
		};
	}

	if (normalizedType === ENTRY_TYPES.IDEA) {
		normalized.idea = {
			confidence: Number(entry.idea?.confidence ?? 0.5),
			source: entry.idea?.source ?? "brainstorm",
		};
	}

	return normalized;
}

/* ============================================================
   RENDER MAPPERS
============================================================ */

export function entryToTaskRenderState(entry) {
	return {
		id: entry.id,
		kind: "task",
		title: entry.title,
		description: entry.description,
		position: {
			x: entry.position.x,
			y: entry.position.y,
			z: entry.position.z,
		},
		size: {
			x: entry.visual.width,
			y: entry.visual.depth,
			z: entry.visual.height,
		},
		radius: entry.visual.radius,
		color: entry.visual.color,
	};
}

export function entryToIdeaRenderState(entry) {
	return {
		id: entry.id,
		kind: "idea",
		title: entry.title,
		description: entry.description,
		position: {
			x: entry.position.x,
			y: entry.position.y,
			z: entry.position.z,
		},
		size: {
			x: entry.visual.width,
			y: entry.visual.depth,
			z: entry.visual.height,
		},
		radius: entry.visual.radius,
		color: entry.visual.color,
	};
}
