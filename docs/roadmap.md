# Product roadmap — an expandable play world

**North star:** A child can recognize their own physical brick-built car, open their digital garage and drive it through a believable, smooth, joyful landscape.

## Personas
- Child driver: immediate play, easy input, no account, safe failure and reset.
- Parent/creator: imports/curates models, optional local music, manages ownership and privacy.
- Creator/developer: repeatable import, validated scale/orientation, predictable performance, reproducible builds.

## User journey
Photograph brick creation → reconstruction/curation → inspect 3D turntable → save in garage → select model → enter road → explore urban/suburban routes → replay/share only with explicit consent.

## Phase M0: runnable vertical slice (current)
One procedural brick car, roads and buildings, camera, keyboard driving and brake, garage overlay, locally imported GLB/music, specs and automated tests. Music stays session-local; GLB can now be explicitly saved to same-origin IndexedDB by the 009 garage slice. No LA exact geography or raw-photo reconstruction claims.

## Parent measurement update (2026-10-17)
A first truck was measured at 10.4cm body length **excluding front bumper**, 3.1cm width, 4.7cm highest front point, 1.4cm tire diameter. We target 2.50m in-world truck width: exact scale 80.645×, body 8.387m, cab 3.790m, tire 1.129m; front bumper adds 0.8cm toy / 0.645m game, total longitudinal reference 9.032m. Axle 1 is 2.4cm behind body front, then gaps 3.2/1.6/1.6cm and axle 4-to-tail 1.6cm; first-to-last span 5.161m. Four-axle renderer now uses these longitudinal measurements. See specs/006-proportional-truck-scale.

## v3 parent review gate (2026-10-17)
**External dimensions and overall low-slung stance APPROVED FOR DEVELOPMENT, not final art approval.** Cabin length 4.8cm; chassis ground clearance revised to 0.3cm; no cargo container; 14 tires on four axles. 8×4/8×8 front-drive coupling and three diff locks confirmed. See [ADR-0002](adr/0002-profile-baseline.md). Don't block engine/garage/world progress on tiny cab contour refinements or claim the current procedural truck faithfully reproduces the HEIC model.

## Phase M1: first authentic car
Evaluate six HEIC views; ask for any missing views and measured brick dimensions. Produce approved GLB with three options: manually reconstructed LDraw/CAD (preferred when brick-accurate), conventional multi-view mesh, AI-assisted draft then manual repair. Side-by-side photo fidelity review, stable center, wheel alignment, parts/provenance data.

## Phase M1a: child-friendly drivetrain controls — first slice shipped
14-tire sample tractor with two steering axle stations, Q-switched 8×4 / 8×8, separate front/rear/center diff-lock buttons, a low-grip demonstration toggle and bounded deterministic motion. Interactive Chrome tests and build passed. **This is simplified gameplay logic**, not real four-axle physical drivetrain or suspension; a subsequent Rapier/terrain milestone is required.

## Phase M1b: Mac one-click local launch
`启动积木世界.command` performs Node/npm prerequisite checks (consent before Homebrew Node install), production build and opens a stdlib HTTP server on 127.0.0.1:4173. No remote service, no .app signing, no background daemon. Linux CI contract tests cover security, HTTP and shell syntax; Mac Finder smoke test is a manual gate. See [008 SDD](../specs/008-local-one-click/spec.md).

## Phase M1c: local persistent garage — 009 delivered
Validated user-imported GLB bytes and metadata in 6-slot IndexedDB; active vehicle can restore after reload, sample fallback and delete confirmation supported. No cloud upload or actual photo reconstruction; browser privacy mode, quotas, cross-origin ports and manual backup limitations documented. Pending actual Mac/Safari test.

## Phase M1d: manual garage backup — 010 in progress
Per-car explicit GLB export provides byte-for-byte original-file download without network upload or IndexedDB mutation. Each GLB must be manually backed up outside the browser and re-imported when needed; the feature is not cloud sync, whole-garage ZIP, or durable browser storage. Mac/Safari manual download still needs validation. See [010 SDD](../specs/010-garage-export/spec.md).

## Phase M1e: touch controls — 011 Chromium CI verified
A five-button, pointer-capture, two-finger press-and-hold UI for small coarse-pointer screens lets children steer while accelerating or braking. Keyboard and phone input resolve into the existing fixed-step vehicle model; cancellation on release/blur/garage prevents stuck throttle. 49 Node, 11 deploy and 16 Chromium tests green in Actions; real iOS Safari child usability and FPS still require manual measurements. See [011 SDD](../specs/011-touch-driving/spec.md).

## Phase M2: satisfying driving and garage
Rapier collision/contacts, suspension and wheel visuals, controller/touch, track reset, more robust vehicle asset review, richer multi-car management UX and metadata/provenance; basic manual GLB export added in M1d. Sound settings and audio accessibility. Aim for kid testing with timed first-drive/steer/recovery sessions.

## Phase M3: Los Angeles-inspired open world
Progressive, chunked neighborhoods: road geometry, traffic signals, junctions, scenery, coastal/suburban road, day/night. Real LA road import is separate GIS/licensing subproject; attribution and ODbL must be satisfied before using OSM data. No unlicensed textures/Google 3D tiles.

## Phase M4: advanced play
More children-created vehicles, collectibles/challenges, curated maps and optional share/export with explicit guardian controls. No networking/multiplayer until privacy + moderation design exists.

## Success measures (targets, not achieved)
- First steerable drive <30s from page load on reference computer without an imported model.
- Desktop median ≥60 FPS and p95 frame time ≤33ms during typical driving after warmup; lower-end graceful fallback ≥30 FPS, all hardware/scene settings documented.
- Key down → perceivable steering ≤100ms on target reference computer (measure, not guarantee).
- 100% first-slice acceptance cases exercised (automated or documented manual evidence).
- Imported GLB keeps aspect ratio, safe error handling, no external upload.
- Parent confirms at least 4/5 recognizable photo landmarks before describing an asset as reconstructed.

## Risks and open decisions
- Six HEIC images might not cover underside, rear, wheels and hidden studs.
- Transparent/glossy repetitive plastic confuses image-only photogrammetry; parts-based assembly may outperform a textured mesh.
- GPU/browser differences; realistic LA geography/photography increases download size, rendering, and legal complexity.
- Who owns the photos/child work, target age/platform, true-to-scale driving vs playful enlarged car; record choices when verified, do not block M0.


## Phase M2a: first deterministic arcade scenery contact — 012
Visible building/kiosk ground footprints and calibrated four-axle truck rectangle share fixed X/Z coordinates. Substepped swept tests prevent obvious forward tunneling, stop at the first contact, and permit reverse or R reset. This removes building ghosting without pretending to be Rapier rigid-body collision, spring suspension, curb dynamics, or real vehicle physics. Apple Silicon/Safari and full model profile QA remain manual. See [012 SDD](../specs/012-static-contact/spec.md).
