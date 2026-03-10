// ==================================================
// 📍 src/world/objectFactory.js
// ==================================================
// 🏗️ WORLD OBJECT FACTORY
//
// Creates pure Three.js render objects for entries
// using one shared card model with two visual modes.
//
// Responsibilities:
//   • render entries as floating rounded cards above y = 0
//   • render entries as grounded square towers at or below y = 0
//   • preserve the same top face between both modes
//   • render title text directly on the shared top surface
//
// Does NOT:
//   • store business logic
//   • mutate appState
//   • manage scene placement lifecycle
// ==================================================

// 1️⃣ External libraries
import * as THREE from "three";

/* ============================================================
   SHAPE HELPERS
============================================================ */

function createRoundedRectShape(width, depth, radius) {
	const shape = new THREE.Shape();

	const x = -width / 2;
	const y = -depth / 2;
	const r = Math.min(radius, width / 2, depth / 2);

	shape.moveTo(x + r, y);
	shape.lineTo(x + width - r, y);
	shape.quadraticCurveTo(x + width, y, x + width, y + r);
	shape.lineTo(x + width, y + depth - r);
	shape.quadraticCurveTo(x + width, y + depth, x + width - r, y + depth);
	shape.lineTo(x + r, y + depth);
	shape.quadraticCurveTo(x, y + depth, x, y + depth - r);
	shape.lineTo(x, y + r);
	shape.quadraticCurveTo(x, y, x + r, y);

	return shape;
}

function createRoundedExtrudeGeometry(width, depth, height, radius) {
	const shape = createRoundedRectShape(width, depth, radius);

	return new THREE.ExtrudeGeometry(shape, {
		depth: height,
		bevelEnabled: false,
		curveSegments: 18,
	});
}

function createTitleTexture(title) {
	const canvas = document.createElement("canvas");
	const context = canvas.getContext("2d");

	const width = 1024;
	const height = 320;

	canvas.width = width;
	canvas.height = height;

	context.clearRect(0, 0, width, height);

	const safeTitle = (title ?? "").trim() || "Untitled";

	context.fillStyle = "#172336";
	context.font = "700 88px Arial";
	context.textAlign = "center";
	context.textBaseline = "middle";

	context.fillText(safeTitle, width / 2, height / 2, width - 80);

	const texture = new THREE.CanvasTexture(canvas);
	texture.colorSpace = THREE.SRGBColorSpace;
	texture.needsUpdate = true;
	texture.minFilter = THREE.LinearFilter;
	texture.magFilter = THREE.LinearFilter;

	return texture;
}

function createTopTextPlane(title, width, depth) {
	const geometry = new THREE.PlaneGeometry(width, depth);
	const texture = createTitleTexture(title);

	const material = new THREE.MeshBasicMaterial({
		map: texture,
		transparent: true,
		side: THREE.DoubleSide,
		depthWrite: false,
		depthTest: false,
		alphaTest: 0.01,
		polygonOffset: true,
		polygonOffsetFactor: -4,
		polygonOffsetUnits: -4,
	});

	const mesh = new THREE.Mesh(geometry, material);
	mesh.renderOrder = 20;
	mesh.frustumCulled = false;

	return mesh;
}

/* ============================================================
   MATERIAL HELPERS
============================================================ */

function createBodyMaterial(color) {
	return new THREE.MeshStandardMaterial({
		color,
		roughness: 0.86,
		metalness: 0.02,
	});
}

function createTopMaterial(color) {
	return new THREE.MeshStandardMaterial({
		color: new THREE.Color(color).multiplyScalar(1.04),
		roughness: 0.9,
		metalness: 0.02,
	});
}

function createBandMaterial(color) {
	return new THREE.MeshStandardMaterial({
		color: new THREE.Color(color).multiplyScalar(0.82),
		roughness: 0.88,
		metalness: 0.01,
	});
}

/* ============================================================
   MEASUREMENT HELPERS
============================================================ */

function getEntryMeasurements(entry) {
	const width = Math.max(50, entry.size.x);
	const depth = Math.max(25, entry.size.y);

	// Floating card thickness
	const thickness = Math.max(10, entry.size.z);

	// Shared top position for both modes
	const topWorldZ = Math.max(2, entry.position.z + thickness / 2);

	// Grounded tower grows upward from z = 0 to the same top
	const groundedHeight = Math.max(4, topWorldZ);

	return {
		width,
		depth,
		thickness,
		topWorldZ,
		groundedHeight,
	};
}

/* ============================================================
   PUBLIC FACTORY
============================================================ */

export function createEntryMesh(entry) {
	const measurements = getEntryMeasurements(entry);

	if (entry.position.y > 0) {
		return createFloatingRoundedCard(entry, measurements);
	}

	return createGroundedSquareTower(entry, measurements);
}

/* ============================================================
   FLOATING ROUNDED CARD
============================================================ */

function createFloatingRoundedCard(entry, measurements) {
	const group = new THREE.Group();

	const { width, depth, thickness } = measurements;

	const cornerRadius = Math.min(8, width / 2, depth / 2);

	// --------------------------------------------------
	// Rounded floating body
	// --------------------------------------------------

	const bodyGeometry = createRoundedExtrudeGeometry(width, depth, thickness, cornerRadius);

	const bodyMesh = new THREE.Mesh(bodyGeometry, createBodyMaterial(entry.color));

	// Floating card is centered at entry.position.z
	bodyMesh.position.set(0, 0, entry.position.z - thickness / 2);

	group.add(bodyMesh);

	// --------------------------------------------------
	// Shared top face
	// --------------------------------------------------

	const topGeometry = createRoundedExtrudeGeometry(width - 2, depth - 2, 0.7, Math.max(4, cornerRadius - 1));

	const topMesh = new THREE.Mesh(topGeometry, createTopMaterial(entry.color));

	topMesh.position.set(0, 0, entry.position.z + thickness / 2 - 0.2);

	group.add(topMesh);

	// --------------------------------------------------
	// Title directly on shared top
	// --------------------------------------------------

	const titlePlane = createTopTextPlane(entry.title, Math.max(18, width - 8), Math.max(8, depth - 8));

	titlePlane.position.set(0, 0, entry.position.z + thickness / 2 + 0.35);

	group.add(titlePlane);

	group.position.set(entry.position.x, entry.position.y, 0);

	return group;
}

/* ============================================================
   GROUNDED SQUARE TOWER
============================================================ */

function createGroundedSquareTower(entry, measurements) {
	const group = new THREE.Group();

	const { width, depth, groundedHeight, topWorldZ } = measurements;

	// --------------------------------------------------
	// Main square tower body
	// --------------------------------------------------

	const bodyGeometry = new THREE.BoxGeometry(width, depth, groundedHeight);

	const bodyMesh = new THREE.Mesh(bodyGeometry, createBodyMaterial(entry.color));

	bodyMesh.position.set(0, 0, groundedHeight / 2);
	group.add(bodyMesh);

	// --------------------------------------------------
	// Subtle floor bands
	// --------------------------------------------------

	const floorCount = Math.max(2, Math.floor(groundedHeight / 10));
	const floorSpacing = groundedHeight / floorCount;
	const bandThickness = 0.35;

	for (let index = 1; index < floorCount; index += 1) {
		const bandGeometry = new THREE.BoxGeometry(width + 0.15, depth + 0.15, bandThickness);

		const bandMesh = new THREE.Mesh(bandGeometry, createBandMaterial(entry.color));

		bandMesh.position.set(0, 0, index * floorSpacing);
		group.add(bandMesh);
	}

	// --------------------------------------------------
	// Same top face language as floating card
	// --------------------------------------------------

	const topGeometry = new THREE.BoxGeometry(width - 2, depth - 2, 0.7);

	const topMesh = new THREE.Mesh(topGeometry, createTopMaterial(entry.color));

	topMesh.position.set(0, 0, topWorldZ + 0.35);
	group.add(topMesh);

	// --------------------------------------------------
	// Title directly on shared top
	// --------------------------------------------------

	const titlePlane = createTopTextPlane(entry.title, Math.max(18, width - 8), Math.max(8, depth - 8));

	titlePlane.position.set(0, 0, topWorldZ + 0.75);
	group.add(titlePlane);

	group.position.set(entry.position.x, entry.position.y, 0);

	return group;
}

/* ============================================================
   DISPOSAL
============================================================ */

export function disposeObject3D(object3D) {
	object3D.traverse((child) => {
		if (child.geometry) {
			child.geometry.dispose();
		}

		if (child.material) {
			if (Array.isArray(child.material)) {
				child.material.forEach(disposeMaterial);
			} else {
				disposeMaterial(child.material);
			}
		}
	});
}

function disposeMaterial(material) {
	if (material.map) {
		material.map.dispose();
	}

	material.dispose();
}
