# Project Constitution v1.1 — LEGO World 3D

Ratified 2026-10-17. v1.1 amendment on 2026-10-17 records photo-first default car creation, paired structural rendering, and city staging as confirmed product intent. Amendments must be explicit, versioned, and reflected in specs, tests and ADRs.

## I. Joy-first child experience
A child can start driving within 30 seconds without creating an account, paying, reading a manual or granting camera/microphone access. Controls visible, intuitive and reversible. No dark patterns, no punitive fail state in the first release.

## II. Real scale and honesty
World units use meters; assets record original size, orientation, reconstruction confidence and scale conversion. Uniform scale only for display. For the first parent-measured truck, the width-anchored uniform calibration is specified in specs/006-proportional-truck-scale: physical 3.1cm width → 2.50m game body width. Preserve known ratios and do not guess bumper overhang. Distinguish observed geometry, inferred geometry and artist-created placeholder. Never market placeholders as scans.

## III. Playability before world size
Prioritize steering, camera, legibility and stable frame pacing. Set budgets and measure actual devices. Never enlarge the map at the cost of control responsiveness. The first slice is one car, one road loop/route, one garage interaction.

## IV. Executable specifications
Every capability has stable requirement IDs, Given/When/Then acceptance examples and a linked test matrix. Spec → plan → tasks → implement → converge. Changes to contracts require changed tests and docs.

## V. TDD and determinism
Write a failing test before simulation/domain changes. Use pure, deterministic fixed-timestep functions; numerical bounds and invariants. Playwright covers UI flows; 3D appearance needs reference-device human review until stable visual baselines exist. No 'green' status without executed evidence.

## VI. Privacy by default
User-supplied HEIC, GLB and music stay local unless a future feature explicitly opts in. No public cloud processing, tracking, accounts, child profile or uploading by default. Clear any imported object URLs and audio when replaced/unmounted.

## VII. Licensed and attributable content
Protect original family works. External maps, music, LEGO parts, logos, and vehicles require provenance and rights checks; source code MIT does not grant rights over them. Use 'unofficial fan project' language as appropriate.

## VIII. Portable agent collaboration
Instructions are tool-neutral in AGENTS.md; Codex/Claude/Copilot adapters only point to the same sources. Keep decisions, assumptions, verification evidence and next steps in Git, not invisible chat history.

## IX. Thin, replaceable architecture
Browser-first and modular: pure domain → scene adapter → UI. No backend until feature requirements prove it. Prefer standard GLB/glTF boundaries and small ADRs to hard coupling.

## X. Photo-first play and geographic phasing (v1.1 amendment)
A child's multiview photos of their own brick creation are the intended primary path to a faithful playable brick/pixel 3D car. Never pass a generic procedural or manually imported placeholder off as automatic photo reconstruction. Realistic styling, when available, must reimagine the **same vehicle structure** and be reversible without gameplay identity loss. Preserve per-car measured proportions under one uniform play-scale factor. Before investing in city-scale fidelity, complete garage/photo intake/model generation and quality driving; later reconstruct **downtown Stockholm, then downtown Frankfurt, then downtown Los Angeles**, prioritizing actual road network and building placement over elaborate facade textures. Fictional test roads remain valid until then. See docs/product-requirements.md and specs/016-photo-first-workflow.

## Quality gates
No merge without requirements trace, deterministic tests, build, interactive smoke check, source/asset-rights review, performance-impact note, and a candid list of unverified areas.
