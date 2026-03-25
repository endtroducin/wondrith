---
alwaysApply: true
---

HARD REQUIREMENT: all PixiJS code in this repo must target PixiJS v8.

Required:
- import from `pixi.js`
- `const app = new Application()`
- `await app.init(...)`
- use `app.canvas`, not `app.view`

Forbidden unless explicitly migrating old code:
- `app.view`
- `new Application({...})` one-step initialization
- legacy `@pixi/*` imports
- mixed v7/v8 examples

Before answering, verify the code uses PixiJS v8 patterns only.
If uncertain, say what looks legacy and output the v8 version instead.