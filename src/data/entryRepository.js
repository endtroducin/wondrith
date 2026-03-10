// ==================================================
// 📍 src/data/entryRepository.js
// ==================================================
// 📚 ENTRY REPOSITORY
//
// Provides the only persistence API for loading,
// creating, updating, and deleting entry records.
//
// Responsibilities:
//   • load entries
//   • create entries
//   • update entries
//   • delete entries
//   • seed starter data
//
// Does NOT:
//   • create Three.js objects
//   • render the world
//   • store state outside Dexie and appState
// ==================================================

// 1️⃣ External libraries
import Dexie from "dexie";

// 3️⃣ Constants
import { db } from "./db.js";

// 4️⃣ Internal modules
import {
	ENTRY_TYPES,
	ENTRY_STATUS,
	createIdeaEntry,
	createTaskEntry,
	createTimestamp,
	normalizeEntry,
} from "./entrySchema.js";

/* ============================================================
   LOAD
============================================================ */

export async function listEntries() {
	const records = await db.entries.where("status").notEqual(ENTRY_STATUS.DELETED).toArray();

	return records.map(normalizeEntry);
}

export async function getEntryById(entryId) {
	const record = await db.entries.get(entryId);

	return record ? normalizeEntry(record) : null;
}

/* ============================================================
   CREATE
============================================================ */

export async function createEntry(entryInput) {
	const normalizedEntry = normalizeEntry(entryInput);

	await db.entries.add(normalizedEntry);

	return normalizedEntry;
}

export async function createTask(taskOverrides = {}) {
	const taskEntry = createTaskEntry(taskOverrides);

	await db.entries.add(taskEntry);

	return taskEntry;
}

export async function createIdea(ideaOverrides = {}) {
	const ideaEntry = createIdeaEntry(ideaOverrides);

	await db.entries.add(ideaEntry);

	return ideaEntry;
}

/* ============================================================
   UPDATE
============================================================ */

export async function updateEntry(entryId, patch) {
	const currentEntry = await db.entries.get(entryId);

	if (!currentEntry) {
		throw new Error(`Entry not found: ${entryId}`);
	}

	const mergedEntry = normalizeEntry({
		...currentEntry,
		...patch,
		position: {
			...(currentEntry.position ?? {}),
			...(patch.position ?? {}),
		},
		visual: {
			...(currentEntry.visual ?? {}),
			...(patch.visual ?? {}),
		},
		task: {
			...(currentEntry.task ?? {}),
			...(patch.task ?? {}),
		},
		idea: {
			...(currentEntry.idea ?? {}),
			...(patch.idea ?? {}),
		},
		updatedAt: createTimestamp(),
	});

	await db.entries.put(mergedEntry);

	return mergedEntry;
}

export async function updateEntryPosition(entryId, positionPatch) {
	return updateEntry(entryId, {
		position: positionPatch,
	});
}

export async function updateEntryTitle(entryId, title) {
	return updateEntry(entryId, {
		title,
	});
}

export async function updateEntryDescription(entryId, description) {
	return updateEntry(entryId, {
		description,
	});
}

/* ============================================================
   DELETE
============================================================ */

export async function softDeleteEntry(entryId) {
	return updateEntry(entryId, {
		status: ENTRY_STATUS.DELETED,
	});
}

export async function hardDeleteEntry(entryId) {
	await db.entries.delete(entryId);
}

/* ============================================================
   BULK
============================================================ */

export async function replaceAllEntries(entries) {
	const normalizedEntries = entries.map(normalizeEntry);

	await db.transaction("rw", db.entries, async () => {
		await db.entries.clear();
		await db.entries.bulkPut(normalizedEntries);
	});

	return normalizedEntries;
}

/* ============================================================
   SEEDING
============================================================ */

export async function seedStarterEntries() {
	const existingCount = await db.entries.count();

	if (existingCount > 0) {
		return listEntries();
	}

	const starterEntries = [
		createIdeaEntry({
			title: "World Map Concept",
			description: "Shape the first spatial map of the system.",
			position: { x: 40, y: 28, z: 10 },
			visual: { radius: 4.5, color: 0xb8e1ff },
		}),
		createIdeaEntry({
			title: "Focus Ritual",
			description: "Daily rhythm and startup sequence.",
			position: { x: 90, y: 42, z: 16 },
			visual: { radius: 6.0, color: 0xd7c7ff },
		}),
		createIdeaEntry({
			title: "Planning Dashboard",
			description: "Make the planning layer easier to scan.",
			position: { x: 140, y: 18, z: 8 },
			visual: { radius: 3.8, color: 0xffd9b3 },
		}),
		createTaskEntry({
			title: "Build Renderer",
			description: "Create scene, camera, and render scheduling.",
			position: { x: 30, y: -18, z: 0 },
			visual: { width: 7, depth: 7, height: 14, color: 0x7fd1ff },
		}),
		createTaskEntry({
			title: "Add State Sync",
			description: "Hook persistent entries to app state.",
			position: { x: 80, y: -34, z: 0 },
			visual: { width: 9, depth: 9, height: 22, color: 0x80ffbf },
		}),
		createTaskEntry({
			title: "Camera Controls",
			description: "Polish camera presets and transitions.",
			position: { x: 130, y: -14, z: 0 },
			visual: { width: 6, depth: 6, height: 10, color: 0xffb36b },
		}),
	];

	await db.entries.bulkAdd(starterEntries);

	return starterEntries;
}

/* ============================================================
   DEBUG
============================================================ */

export async function clearAllEntries() {
	await db.entries.clear();
}
