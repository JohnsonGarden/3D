# Agent instructions — LEGO World 3D

Applies to Codex, Claude Code, Copilot and other agents. READ THIS FIRST.

## Source of truth (priority order)
1. `.specify/memory/constitution.md`: immutable quality, safety and UX principles.
2. Active `specs/<number>-<feature>/spec.md`: WHAT, observable scenarios and acceptance.
3. `plan.md` plus an ADR: WHY/HOW, scale, physics and rendering decisions.
4. `test-matrix.md` and `tasks.md`: executable evidence and current task sequence.
5. Code and tests. If code disagrees with accepted spec, raise it; never silently rewrite the spec to make a test pass.

## Mandatory SDD + TDD loop
- Orient: inspect repository and read active spec/plan/tests; pick ONE vertical slice.
- Specify: write measurable Given/When/Then and constraints BEFORE implementation.
- Design: note trade-offs and ADR for durable architectural decisions. Avoid speculative services and major dependencies.
- RED: write failing deterministic unit or behavior test first. Capture the failing command/error in PR.
- GREEN: implement minimum behavior to pass test, separate pure simulation from renderer.
- REFACTOR: preserve acceptance tests; keep scene lifecycles, asset disposal and accessible controls correct.
- CONVERGE: run `npm run check:spec && npm test && npm run build` and (if browser changes) `npm run test:e2e`; map results to requirement IDs; update tasks, deviations and evidence. Never claim unexecuted checks passed.
- Deliver one small PR referencing requirement IDs, tests, performance/UX impact, screenshots for visual changes, explicit remaining risks.

## Rules
- Protect the six original `IMG_0719.HEIC`–`IMG_0724.HEIC`; no edits or unexpected redistribution.
- 1 Three.js world unit = 1 meter. Parent-measured source truck is 10.4cm body length (front bumper excluded), 3.1cm body width, 4.7cm max cab point, 1.4cm tire diameter. Scale uniformly to 2.50m body width (factor 80.645...), yielding 8.387m body length, 3.790m cab peak, 1.129m wheel diameter; front bumper protrusion 0.8cm → 0.645m and total 9.032m. Four axle centers from body front 2.4/5.6/7.2/8.8cm (front/rear body offsets 2.4/1.6cm, axle gaps 3.2/1.6/1.6cm), uniformly ×80.645. No invention of axle steering/suspension/wheel lateral placements. Road lanes target 3.5m. See specs/006-proportional-truck-scale; no arbitrary per-axis scaling.
- Target desktop 60 fps with graceful 30 fps degradation; use instancing, reuse materials, limit lights/shadows/draw calls, avoid React state updates each frame. Measure before optimizing.
- Keyboard and pointer controls must be discoverable; no forced autoplay; user-controlled volume and music local-first. Child-friendly, no telemetry/accounts by default.
- Simulation is deterministic and fixed timestep. Clamp inputs and delta, forbid NaN/Infinity; do not tie physics to fluctuating render FPS. Rapier optional until collision requirement lands.
- GLB input: extension, size, parse failures and clean object URLs; never eval external scripts, never require remote uploads.
- No copied copyrighted 3D maps, trademark claims, or commercially incompatible assets. Maintain attribution manifest as assets arrive.
- Don't change base/raw-photo branches without user-approved integration; work on feature branches, PR to photo branch initially.
- Do not 'fix' flaky tests by skipping them. If WebGL is unavailable in CI, test user-visible fallback and report rendering checks as manual/pending.
- Driving slice 007: 14 tires visual, two front axles visual steer, default 8×4 (rear A3/A4 powered), optional 8×8; diff-lock logical toggles front/rear/center, Q/1/2/3/T. Low-grip coefficient is a toy demo, **not** realistic tire force, suspension, traction, or gear torque. Imported GLB remains not wheel-rigged.
- Avoid fake claims: prototype garage ≠ persistent garage; placeholder brick car ≠ reconstructed car; stylized city ≠ GIS-faithful LA.

## Where to work
- `src/sim/`: pure vehicle model, fixed-step tests.
- `src/world/`: GPU-dependent scene, asset loading and camera.
- `src/`: UI entry points, keyboard, music, overlay.
- `specs/`: feature contracts and verification traces.
- `docs/`: evergreen architecture, pipeline, legal and milestone log.
- `scripts/`: enforceable checks. `tests/e2e/`: observable browser paths.

If the next task is too large, split it at a child-visible playable checkpoint rather than scaffolding an unused abstraction.
