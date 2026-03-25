import { Application, Graphics } from "pixi.js";

async function setupPixi() {
	const app = new Application({ width: window.innerWidth, height: window.innerHeight });
	document.body.appendChild(app.view);

	// Perspective parameters
	const nearPlane = 0.1;
	const farPlane = 1000;
	const fov = Math.PI / 3; // Field of view
	const aspectRatio = app.screen.width / app.screen.height;
	const scale = (nearPlane + farPlane) / (farPlane - nearPlane);

	// Function to project 3D coordinates onto 2D
	function project(x, y, z) {
		if (z < nearPlane || z > farPlane) return null;
		const nx = (x / z) * scale;
		const ny = (y / z) * scale;
		return { x: nx, y: ny };
	}

	// Create a Graphics object for the 3D grid
	const grid = new Graphics();

	// Draw grid lines from 3D coordinates
	function drawGrid(graphics, width, height) {
		graphics.clear();
		const z = 100; // Fixed Z value for grid lines

		graphics.lineStyle(1, 0xcccccc); // Light grey for standard lines
		for (let x = -width / 2; x <= width / 2; x += 25) {
			const p1 = project(x, -height / 2, z);
			const p2 = project(x, height / 2, z);
			if (p1 && p2) {
				graphics.moveTo(p1.x + width / 2, -p1.y + height / 2);
				graphics.lineTo(p2.x + width / 2, -p2.y + height / 2);
			}
		}

		for (let y = -height / 2; y <= height / 2; y += 25) {
			const p1 = project(-width / 2, y, z);
			const p2 = project(width / 2, y, z);
			if (p1 && p2) {
				graphics.moveTo(p1.x + width / 2, -p1.y + height / 2);
				graphics.lineTo(p2.x + width / 2, -p2.y + height / 2);
			}
		}

		graphics.endFill();
	}

	drawGrid(grid, app.screen.width, app.screen.height);
	app.stage.addChild(grid);

	// Function to draw 3D elements
	function draw3DElement(graphics, x, y, z) {
		const projected = project(x, y, z);
		if (projected) {
			graphics.beginFill(0xff0000); // Red color
			graphics.drawCircle(projected.x + app.screen.width / 2, -projected.y + app.screen.height / 2, 5);
			graphics.endFill();
		}
	}

	// Draw some 3D elements
	draw3DElement(grid, 100, 100, 50);
	draw3DElement(grid, -100, -100, 75);
	draw3DElement(grid, 0, 0, 100);

	// Function to resize the canvas and redraw the grid
	function resize() {
		app.renderer.resize(window.innerWidth, window.innerHeight);
		drawGrid(grid, window.innerWidth, window.innerHeight);
	}

	// Resize the canvas on window resize
	window.addEventListener("resize", resize);

	// Initial resize to set up the correct size on load
	resize();
}

setupPixi();
