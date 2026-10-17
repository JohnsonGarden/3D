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
- Local-launch slice 008: Finder entry `启动积木世界.command` and standalone `下载并启动积木世界.command` (GitHub archive to ~/BrickWorld3D, preserves existing files), `scripts/start-local.sh`, `scripts/serve-local.mjs` must remain loopback-only and require explicit user consent for Homebrew install; do not add sudo, daemon, telemetry, remote file uploads, or expose 0.0.0.0. npm CI includes `npm run test:deploy` after build. Document Mac smoke tests honestly as pending until run on user's hardware.
- Persistent garage 009 stores validated explicitly chosen GLB bytes in same-origin IndexedDB with 6-slot cap and manual deletion; this is **not** durable backup, cloud sync, or cross-browser persistence.
- Offline backup 010: per-vehicle explicit export of original GLB bytes via browser download; validate before export, sanitize filename, no remote upload, no auto-export or guarantee of external backup. Automated Chromium evidence green; Finder/Safari manual checks pending.
- Touch input 011: handle multiple concurrent pointer IDs without sticky throttle; reset on pointer release/cancel/capture lost, blur and garage; use the existing fixed-step model, no per-frame React state. Verify on phone-sized Chromium; real devices pending. Must never persist HEIC/music automatically or upload user media. Keep corrupt GLB fallback and guard startup restore.
- Local installer security hotfix: `scripts/require-normal-user.sh` and both .command launchers reject effective UID 0 BEFORE any brew/npm/download/write. Never bypass this or invoke Homebrew as root. Test simulated root & normal-user paths in `tests/deploy/launcher.test.mjs`. Previously installed copies of standalone launcher are intentionally NOT automatically overwritten.
- Avoid fake claims: IndexedDB ≠ guaranteed storage/backup; placeholder brick car ≠ reconstructed car; stylized city ≠ GIS-faithful LA.

## Where to work
- `src/sim/`: pure vehicle model, fixed-step tests.
- `src/world/`: GPU-dependent scene, asset loading and camera.
- `src/`: UI entry points, keyboard, music, overlay.
- `specs/`: feature contracts and verification traces.
- `docs/`: evergreen architecture, pipeline, legal and milestone log.
- `scripts/`: enforceable checks. `tests/e2e/`: observable browser paths.

If the next task is too large, split it at a child-visible playable checkpoint rather than scaffolding an unused abstraction.


- Scenery contact 012: `src/world/city-layout.ts` must remain single source of truth for solid building footprints in both R3F meshes and `src/sim/contact.ts`. Measured truck is a 2D swept oriented rectangle with extra front bumper; do not describe it as a rigid-body simulator, curb/ground contact, per-tire collision or imported-GLB exact mesh. Fixed-step contact must be deterministic, bounded, recoverable via reverse/reset and emit React state only on collision status transitions.


- Performance diagnostics 013: only measure browser R3F real frame intervals opt-in, during foreground driving. Bound sample retention, filter paused/background gaps, publish at most about once/second, no telemetry or React state per RAF tick. 60 FPS median and 33ms p95 are target conditions pending a reference Mac run; do not substitute CI/headless browser for hardware benchmarks.


- Road-trip 014: the three fictional road gates share `src/game/checkpoints.ts` geometry and their simulated swept trigger. Progress increments only upon the next checkpoint, never each rendered frame; R resets truck only, while explicitly named journey restart clears progress and truck. Do not portray fictional gate names as real LA geography, and do not promise savegame persistence.


- Preview installer 015 is purposefully isolated: preview branch `下载并启动积木世界.command` downloads pinned cumulative 014 code into `~/BrickWorld3D-preview`, default loopback port 4174, and refuses UID 0 or occupied foreign directories. Old `~/BrickWorld3D` / :4173 remains untouched. **Never** auto-migrate browser IndexedDB between origin ports or auto-overwrite user-owned code; explicit per-GLB backups are the handoff. GitHub Actions shell tests do not prove Finder download or notarization.


- Product direction amendment 016 (parent accepted 2026-10-17): **multi-angle photos of child-built brick vehicle → faithful playable brick/pixel-style model (default) → same car in garage/drive → optionally toggle structure-derived realistic vehicle**. Photo conversion and paired realistic variants are **not implemented** as of 016 capture intake; no fake model/reconstruction, no generic car skin presented as structural conversion. Each toy has its own measured ratios + isotropic play scale. Current 2.50m truck is only one calibrated fixture. Prioritize garage, photo ingestion/faithful model, driving; early cities are fictional practice roads. Real downtown maps only in order **Stockholm → Frankfurt → Los Angeles**, prioritize geospatial road/building topology, ambient driving-game realism without copying assets. Read `docs/product-requirements.md` and `specs/016-photo-first-workflow/spec.md`. Child photos local-first; no implicit remote inference.

- Convergence 017: independent reproducible-install (fork 012) and fictional-junctions (fork 013) are incorporated into cumulative garage/driving/photo branch via a careful port, **not** wholesale substitution of earlier World.tsx. `src/world/street-layout.ts` generates fictional road/junction geometry and safe building candidates; `src/world/city-layout.ts` is the **single final source** of solid footprints, rendered through instancing and reused in `src/sim/contact.ts`. Keep 014 gates, 013 RAF metrics, 016 local photo picker intact. Three crossroads are practice scenery, **not** approved GIS Stockholm/Frankfurt/LA. Locked CI uses npm ci. 017 needs actual combined-branch Actions and manual Mac verification before integration.

- 017 preview launcher inherits strict 015 root + preservation contract but targets **`feat/017-integrate-branches`**, installs **`~/BrickWorld3D-preview-017`** and defaults to **`127.0.0.1:4175`**. Old :4173/:4174 and homes remain untouched and separate browser origins. Local `下载并启动积木世界.command` on this branch now points at 017; historical 015 branch installer remains pinned to 014. First real Finder/network launch and hardware quality must be manually checked.

- Capture milestone 018: **per-photo manually entered view**, truthful missing-angle checklist and guardian-supplied physical cm dimensions live only in session state; explicit JSON capture manifest contains filenames/size/MIME/view/optional verified-by-user dimensions but **never file bytes, EXIF or blob URL**. Do not mark angle annotations as visual recognition or announce photo→GLB success. Original imported GLBs remain unchanged; a future car-specific scaling/geometry gate is still needed.
