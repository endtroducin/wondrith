// ==================================================
// 📍 src/world/worldBuilder.js
// ==================================================
// 🌐 WORLD BUILDER
//
// Builds static world visuals and synchronizes
// render objects from appState using stable mesh
// registries and shared entry rendering rules.
//
// Responsibilities:
//   • create grid
//   • create planning horizon
//   • create lighting
//   • create entry meshes from appState
//   • recreate geometry when visual mode changes
//   • expose draggable mesh lookup
//
// Does NOT:
//   • store application state
//   • contain business logic
//   • handle user input
// ==================================================

// 1️⃣ External libraries
import * as THREE from "three";

// 2️⃣ Core state
import { appState } from "../core/appState.js";

// 3️⃣ Constants
import { WORLD } from "../constants/worldConfig.js";

// 4️⃣ Internal modules
import { createEntryMesh, disposeObject3D } from "./objectFactory.js";

/* ============================================================
   MODULE STATE
============================================================ */

let scene;

let staticGroup;
let dynamicGroup;
let ideaGroup;
let taskGroup;
let annotationGroup;

const ideaMeshById = new Map();
const taskMeshById = new Map();

const ideaSnapshotById = new Map();
const taskSnapshotById = new Map();

const entityIdByMeshUuid = new Map();
const entityTypeByMeshUuid = new Map();

/* ============================================================
   RENDER MODE HELPERS
============================================================ */

const HORIZON_MODE_BUFFER = 10;

function resolveRenderMode(y, previousMode) {
	if (previousMode === "floatingRounded") {
		if (y < -HORIZON_MODE_BUFFER) {
			return "groundedSquare";
		}

		return "floatingRounded";
	}

	if (previousMode === "groundedSquare") {
		if (y > HORIZON_MODE_BUFFER) {
			return "floatingRounded";
		}

		return "groundedSquare";
	}

	return y > 0 ? "floatingRounded" : "groundedSquare";
}

/* ============================================================
   INIT WORLD
============================================================ */

export function initWorldBuilder(sceneRef) {
	scene = sceneRef;

	staticGroup = new THREE.Group();
	dynamicGroup = new THREE.Group();
	ideaGroup = new THREE.Group();
	taskGroup = new THREE.Group();
	annotationGroup = new THREE.Group();

	dynamicGroup.add(ideaGroup);
	dynamicGroup.add(taskGroup);

	scene.add(staticGroup);
	scene.add(dynamicGroup);

	buildStaticWorld();
	syncWorldFromState();
}

/* ============================================================
   STATIC WORLD
============================================================ */

function buildStaticWorld() {
	const ambientLight = new THREE.AmbientLight(0xffffff, WORLD.AMBIENT_LIGHT_INTENSITY);

	staticGroup.add(ambientLight);

	const directionalLight = new THREE.DirectionalLight(0xffffff, WORLD.DIRECTIONAL_LIGHT_INTENSITY);

	directionalLight.position.set(
		WORLD.DIRECTIONAL_LIGHT_POSITION.x,
		WORLD.DIRECTIONAL_LIGHT_POSITION.y,
		WORLD.DIRECTIONAL_LIGHT_POSITION.z,
	);

	staticGroup.add(directionalLight);

	staticGroup.add(createLayeredGrid());
	staticGroup.add(createAxisHints());
	staticGroup.add(createPlanningHorizon());

	buildGridAnnotations();
	staticGroup.add(annotationGroup);
}

/* ============================================================
   GRID HELPERS
============================================================ */

function createLayeredGrid() {
	const gridGroup = new THREE.Group();

	const minorStep = 25;
	const minorDivisions = WORLD.GRID_SIZE / minorStep;

	const minorGrid = new THREE.GridHelper(WORLD.GRID_SIZE, minorDivisions, 0x16324a, 0x16324a);

	minorGrid.rotation.x = Math.PI / 2;
	minorGrid.position.z = -0.02;
	minorGrid.material.transparent = true;
	minorGrid.material.opacity = 0.32;
	minorGrid.material.depthWrite = false;

	gridGroup.add(minorGrid);

	const majorStep = 100;
	const majorDivisions = WORLD.GRID_SIZE / majorStep;

	const majorGrid = new THREE.GridHelper(WORLD.GRID_SIZE, majorDivisions, 0x2f5b7a, 0x2f5b7a);

	majorGrid.rotation.x = Math.PI / 2;
	majorGrid.position.z = -0.01;
	majorGrid.material.transparent = true;
	majorGrid.material.opacity = 0.72;
	majorGrid.material.depthWrite = false;

	gridGroup.add(majorGrid);

	return gridGroup;
}

/* ============================================================
   HORIZON + AXES
============================================================ */

function createAxisHints() {
	const group = new THREE.Group();

	const xMaterial = new THREE.LineBasicMaterial({
		color: 0xff6b6b,
		transparent: true,
		opacity: 0.65,
	});

	const yMaterial = new THREE.LineBasicMaterial({
		color: 0x4dd0e1,
		transparent: true,
		opacity: 0.65,
	});

	const zMaterial = new THREE.LineBasicMaterial({
		color: 0xa5d6a7,
		transparent: true,
		opacity: 0.65,
	});

	const xGeometry = new THREE.BufferGeometry().setFromPoints([
		new THREE.Vector3(-400, 0, 0.05),
		new THREE.Vector3(400, 0, 0.05),
	]);

	const yGeometry = new THREE.BufferGeometry().setFromPoints([
		new THREE.Vector3(0, -400, 0.05),
		new THREE.Vector3(0, 400, 0.05),
	]);

	const zGeometry = new THREE.BufferGeometry().setFromPoints([
		new THREE.Vector3(0, 0, 0),
		new THREE.Vector3(0, 0, 120),
	]);

	group.add(new THREE.Line(xGeometry, xMaterial));
	group.add(new THREE.Line(yGeometry, yMaterial));
	group.add(new THREE.Line(zGeometry, zMaterial));

	return group;
}

function createPlanningHorizon() {
	const halfLength = WORLD.HORIZON_LENGTH / 2;

	const geometry = new THREE.BufferGeometry().setFromPoints([
		new THREE.Vector3(-halfLength, 0, 0.03),
		new THREE.Vector3(halfLength, 0, 0.03),
	]);

	const material = new THREE.LineBasicMaterial({
		color: WORLD.HORIZON_COLOR,
		transparent: true,
		opacity: WORLD.HORIZON_OPACITY,
	});

	return new THREE.Line(geometry, material);
}

/* ============================================================
   GRID ANNOTATIONS
============================================================ */

function buildGridAnnotations() {
	clearGroup(annotationGroup);

	const step = 100;
	const halfSize = WORLD.GRID_SIZE / 2;
	const labelHeight = 2;

	for (let x = -halfSize; x <= halfSize; x += step) {
		if (x === 0) {
			continue;
		}

		const label = createTextSprite(String(x), {
			fontSize: 52,
			textColor: "#ff8a8a",
			backgroundColor: "rgba(10, 14, 20, 0.78)",
			padding: 18,
		});

		label.position.set(x, 0, labelHeight);
		annotationGroup.add(label);
	}

	for (let y = -halfSize; y <= halfSize; y += step) {
		if (y === 0) {
			continue;
		}

		const label = createTextSprite(String(y), {
			fontSize: 52,
			textColor: "#7ce9f7",
			backgroundColor: "rgba(10, 14, 20, 0.78)",
			padding: 18,
		});

		label.position.set(0, y, labelHeight);
		annotationGroup.add(label);
	}

	const originLabel = createTextSprite("0", {
		fontSize: 56,
		textColor: "#ffffff",
		backgroundColor: "rgba(10, 14, 20, 0.9)",
		padding: 18,
	});

	originLabel.position.set(0, 0, labelHeight + 0.5);
	annotationGroup.add(originLabel);
}

function createTextSprite(text, options = {}) {
	const {
		fontSize = 48,
		fontFamily = "Arial",
		textColor = "#ffffff",
		backgroundColor = "rgba(0, 0, 0, 0.75)",
		padding = 16,
	} = options;

	const canvas = document.createElement("canvas");
	const context = canvas.getContext("2d");

	context.font = `bold ${fontSize}px ${fontFamily}`;

	const metrics = context.measureText(text);
	const textWidth = Math.ceil(metrics.width);
	const textHeight = fontSize;

	canvas.width = textWidth + padding * 2;
	canvas.height = textHeight + padding * 2;

	context.font = `bold ${fontSize}px ${fontFamily}`;
	context.textAlign = "center";
	context.textBaseline = "middle";

	context.fillStyle = backgroundColor;
	context.beginPath();
	context.roundRect(0, 0, canvas.width, canvas.height, 18);
	context.fill();

	context.fillStyle = textColor;
	context.fillText(text, canvas.width / 2, canvas.height / 2);

	const texture = new THREE.CanvasTexture(canvas);
	texture.colorSpace = THREE.SRGBColorSpace;
	texture.needsUpdate = true;

	const material = new THREE.SpriteMaterial({
		map: texture,
		transparent: true,
		depthWrite: false,
	});

	const sprite = new THREE.Sprite(material);

	const worldScale = 0.12;
	sprite.scale.set(canvas.width * worldScale, canvas.height * worldScale, 1);

	return sprite;
}

/* ============================================================
   DYNAMIC WORLD SYNC
============================================================ */

export function syncWorldFromState() {
	syncIdeaMeshesFromState();
	syncTaskMeshesFromState();
}

function syncIdeaMeshesFromState() {
	const nextIds = new Set();

	for (const idea of appState.ideas) {
		nextIds.add(idea.id);

		let mesh = ideaMeshById.get(idea.id);
		const nextSnapshot = createIdeaSnapshot(idea);
		const prevSnapshot = ideaSnapshotById.get(idea.id);

		if (!mesh) {
			mesh = createEntryMesh(idea);

			ideaGroup.add(mesh);
			ideaMeshById.set(idea.id, mesh);
			ideaSnapshotById.set(idea.id, nextSnapshot);

			entityIdByMeshUuid.set(mesh.uuid, idea.id);
			entityTypeByMeshUuid.set(mesh.uuid, "idea");

			continue;
		}

		if (!prevSnapshot || hasIdeaGeometryChanged(prevSnapshot, nextSnapshot)) {
			ideaGroup.remove(mesh);
			entityIdByMeshUuid.delete(mesh.uuid);
			entityTypeByMeshUuid.delete(mesh.uuid);
			disposeObject3D(mesh);

			const nextMesh = createEntryMesh(idea);

			ideaGroup.add(nextMesh);
			ideaMeshById.set(idea.id, nextMesh);
			ideaSnapshotById.set(idea.id, nextSnapshot);

			entityIdByMeshUuid.set(nextMesh.uuid, idea.id);
			entityTypeByMeshUuid.set(nextMesh.uuid, "idea");

			continue;
		}

		if (!areIdeaSnapshotsEqual(prevSnapshot, nextSnapshot)) {
			applyEntryStateToMesh(mesh, idea);
			ideaSnapshotById.set(idea.id, nextSnapshot);
		}
	}

	for (const [ideaId, mesh] of ideaMeshById.entries()) {
		if (nextIds.has(ideaId)) {
			continue;
		}

		ideaGroup.remove(mesh);
		entityIdByMeshUuid.delete(mesh.uuid);
		entityTypeByMeshUuid.delete(mesh.uuid);
		ideaMeshById.delete(ideaId);
		ideaSnapshotById.delete(ideaId);

		disposeObject3D(mesh);
	}
}

function syncTaskMeshesFromState() {
	const nextIds = new Set();

	for (const task of appState.tasks) {
		nextIds.add(task.id);

		let mesh = taskMeshById.get(task.id);
		const nextSnapshot = createTaskSnapshot(task);
		const prevSnapshot = taskSnapshotById.get(task.id);

		if (!mesh) {
			mesh = createEntryMesh(task);

			taskGroup.add(mesh);
			taskMeshById.set(task.id, mesh);
			taskSnapshotById.set(task.id, nextSnapshot);

			entityIdByMeshUuid.set(mesh.uuid, task.id);
			entityTypeByMeshUuid.set(mesh.uuid, "task");

			continue;
		}

		if (!prevSnapshot || hasTaskGeometryChanged(prevSnapshot, nextSnapshot)) {
			taskGroup.remove(mesh);
			entityIdByMeshUuid.delete(mesh.uuid);
			entityTypeByMeshUuid.delete(mesh.uuid);
			disposeObject3D(mesh);

			const nextMesh = createEntryMesh(task);

			taskGroup.add(nextMesh);
			taskMeshById.set(task.id, nextMesh);
			taskSnapshotById.set(task.id, nextSnapshot);

			entityIdByMeshUuid.set(nextMesh.uuid, task.id);
			entityTypeByMeshUuid.set(nextMesh.uuid, "task");

			continue;
		}

		if (!areTaskSnapshotsEqual(prevSnapshot, nextSnapshot)) {
			applyEntryStateToMesh(mesh, task);
			taskSnapshotById.set(task.id, nextSnapshot);
		}
	}

	for (const [taskId, mesh] of taskMeshById.entries()) {
		if (nextIds.has(taskId)) {
			continue;
		}

		taskGroup.remove(mesh);
		entityIdByMeshUuid.delete(mesh.uuid);
		entityTypeByMeshUuid.delete(mesh.uuid);
		taskMeshById.delete(taskId);
		taskSnapshotById.delete(taskId);

		disposeObject3D(mesh);
	}
}

/* ============================================================
   SNAPSHOT HELPERS
============================================================ */

function createIdeaSnapshot(idea) {
	const previousSnapshot = ideaSnapshotById.get(idea.id);
	const previousMode = previousSnapshot?.renderMode;

	return {
		x: idea.position.x,
		y: idea.position.y,
		z: idea.position.z,
		sizeX: idea.size.x,
		sizeY: idea.size.y,
		sizeZ: idea.size.z,
		color: idea.color,
		title: idea.title,
		renderMode: resolveRenderMode(idea.position.y, previousMode),
	};
}

function createTaskSnapshot(task) {
	const previousSnapshot = taskSnapshotById.get(task.id);
	const previousMode = previousSnapshot?.renderMode;

	return {
		x: task.position.x,
		y: task.position.y,
		z: task.position.z,
		sizeX: task.size.x,
		sizeY: task.size.y,
		sizeZ: task.size.z,
		color: task.color,
		title: task.title,
		renderMode: resolveRenderMode(task.position.y, previousMode),
	};
}

function areIdeaSnapshotsEqual(previous, next) {
	if (!previous || !next) {
		return false;
	}

	return (
		previous.x === next.x &&
		previous.y === next.y &&
		previous.z === next.z &&
		previous.sizeX === next.sizeX &&
		previous.sizeY === next.sizeY &&
		previous.sizeZ === next.sizeZ &&
		previous.color === next.color &&
		previous.title === next.title &&
		previous.renderMode === next.renderMode
	);
}

function areTaskSnapshotsEqual(previous, next) {
	if (!previous || !next) {
		return false;
	}

	return (
		previous.x === next.x &&
		previous.y === next.y &&
		previous.z === next.z &&
		previous.sizeX === next.sizeX &&
		previous.sizeY === next.sizeY &&
		previous.sizeZ === next.sizeZ &&
		previous.color === next.color &&
		previous.title === next.title &&
		previous.renderMode === next.renderMode
	);
}

function hasIdeaGeometryChanged(previous, next) {
	return (
		previous.z !== next.z ||
		previous.sizeX !== next.sizeX ||
		previous.sizeY !== next.sizeY ||
		previous.sizeZ !== next.sizeZ ||
		previous.color !== next.color ||
		previous.title !== next.title ||
		previous.renderMode !== next.renderMode
	);
}

function hasTaskGeometryChanged(previous, next) {
	return (
		previous.z !== next.z ||
		previous.sizeX !== next.sizeX ||
		previous.sizeY !== next.sizeY ||
		previous.sizeZ !== next.sizeZ ||
		previous.color !== next.color ||
		previous.title !== next.title ||
		previous.renderMode !== next.renderMode
	);
}

/* ============================================================
   MESH APPLY HELPERS
============================================================ */

function applyEntryStateToMesh(mesh, entry) {
	mesh.position.set(entry.position.x, entry.position.y, 0);
}

/* ============================================================
   DRAG LOOKUP
============================================================ */

export function getDraggableMeshes() {
	return [...ideaMeshById.values(), ...taskMeshById.values()];
}

export function getEntityIdForMesh(mesh) {
	return entityIdByMeshUuid.get(mesh.uuid) ?? null;
}

export function getEntityTypeForMesh(mesh) {
	return entityTypeByMeshUuid.get(mesh.uuid) ?? null;
}

/* ============================================================
   GROUP HELPERS
============================================================ */

function clearGroup(group) {
	if (!group) {
		return;
	}

	while (group.children.length > 0) {
		const child = group.children[0];
		group.remove(child);
		disposeObject3D(child);
	}
}

/* ============================================================
   DISPOSE
============================================================ */

export function disposeWorldBuilder() {
	if (!scene) {
		return;
	}

	clearGroup(ideaGroup);
	clearGroup(taskGroup);
	clearGroup(annotationGroup);
	clearGroup(staticGroup);

	scene.remove(staticGroup);
	scene.remove(dynamicGroup);

	ideaMeshById.clear();
	taskMeshById.clear();
	ideaSnapshotById.clear();
	taskSnapshotById.clear();
	entityIdByMeshUuid.clear();
	entityTypeByMeshUuid.clear();

	scene = undefined;
	staticGroup = undefined;
	dynamicGroup = undefined;
	ideaGroup = undefined;
	taskGroup = undefined;
	annotationGroup = undefined;
}
