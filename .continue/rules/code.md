---
alwaysApply: true
---

- Keep edits small and task-focused
- Prefer existing repo patterns over new abstractions
- Do not guess missing files, APIs, or behavior
- Keep canonical state in core/appState
- Renderers must read state and stay visual only
- Controllers/input code may mutate state
- Match nearby naming and code style
- Comment non-obvious logic and assumptions
- Only use code compatible with pixi.js v8 to avoid PixiJS Deprecation Warnings