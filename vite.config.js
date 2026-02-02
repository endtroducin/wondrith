// vite.config.js
import { defineConfig } from "vite";
import rollupNodePolyFill from "rollup-plugin-node-polyfills";

export default defineConfig({
	define: {
		global: "window",
		process: { env: {} },
	},
	optimizeDeps: {
		include: ["events", "buffer", "process"],
	},
	resolve: {
		alias: {
			events: "events",
			buffer: "buffer",
			process: "process",
		},
	},
	build: {
		rollupOptions: {
			plugins: [rollupNodePolyFill()],
		},
	},
});
