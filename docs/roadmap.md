# Product roadmap — an expandable play world

**North star:** A child can recognize their own physical brick-built car, open their digital garage and drive it through a believable, smooth, joyful landscape.

## Personas
- Child driver: immediate play, easy input, no account, safe failure and reset.
- Parent/creator: imports/curates models, optional local music, manages ownership and privacy.
- Creator/developer: repeatable import, validated scale/orientation, predictable performance, reproducible builds.

## User journey — accepted photo-first target, not yet fully implemented
Build physical brick car → photograph several angles → inspect an authentic, **brick/pixel-style 3D** rendition at **proportion-preserving driving scale** → save and select in garage → practice-road drive → **optionally toggle a structure-derived realistic car** (only when that separately generated, verified variant exists) → later explore licensed city-center maps. Manual GLB import remains an advanced fallback. See [confirmed product requirements](product-requirements.md) and [016 spec](../specs/016-photo-first-workflow/spec.md).

## Phase M0: runnable vertical slice (current)
One procedural brick car, roads and buildings, camera, keyboard driving and brake, garage overlay, locally imported GLB/music, specs and automated tests. Music stays session-local; GLB can now be explicitly saved to same-origin IndexedDB by the 009 garage slice. No LA exact geography or raw-photo reconstruction claims.

## Parent measurement update (2026-10-17)
A first truck was measured at 10.4cm body length **excluding front bumper**, 3.1cm width, 4.7cm highest front point, 1.4cm tire diameter. We target 2.50m in-world truck width: exact scale 80.645×, body 8.387m, cab 3.790m, tire 1.129m; front bumper adds 0.8cm toy / 0.645m game, total longitudinal reference 9.032m. Axle 1 is 2.4cm behind body front, then gaps 3.2/1.6/1.6cm and axle 4-to-tail 1.6cm; first-to-last span 5.161m. Four-axle renderer now uses these longitudinal measurements. See specs/006-proportional-truck-scale.

## v3 parent review gate (2026-10-17)
**External dimensions and overall low-slung stance APPROVED FOR DEVELOPMENT, not final art approval.** Cabin length 4.8cm; chassis ground clearance revised to 0.3cm; no cargo container; 14 tires on four axles. 8×4/8×8 front-drive coupling and three diff locks confirmed. See [ADR-0002](adr/0002-profile-baseline.md). Don't block engine/garage/world progress on tiny cab contour refinements or claim the current procedural truck faithfully reproduces the HEIC model.

## Phase M1: photo-first authentic brick/pixel cars — top new capability
Child/guardian normally adds **multiple viewpoints** of each unique physical brick vehicle. Capture guided angles and scale cues; check occlusion, provenance and measurements. Reconstruct and review an authentic brick/pixel style GLB with preserved wheel locations, part silhouette and proportional scale before marking it as photo-generated. Choose a measured reconstruction adapter (manual CAD/LDraw, multiview, AI draft and manual review). **No current automatic photo→3D capability.** The 016 implementation first adds local photo-set intake without pretending it generates a car. The first truck's known scale is not a universal template.

## Phase M1f: paired realistic car variant — after verified brick reconstruction
Generate an **automotive-looking body based on the child's actual truck/car structure**, retaining cab/body layout, axle/wheel geometry and recognisable identity; it is a geometry transformation, not a material skin on an unrelated vehicle. Allow free LEGO/pixel ↔ realistic switching once the pair exists, preserving drive physics and garage identity. Absent variant must be clearly unavailable; no fake control.

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

## Phase M3 (LATER): licensed, authentic city-center maps — STOCKHOLM FIRST
Real-world map work is deliberately deferred until photo-derived authentic cars, multi-car garage and satisfying driving exist. Only central district extents, each explicitly bounded and source-verified:
1. **Stockholm / 斯德哥尔摩** downtown — first map.
2. **Frankfurt / 法兰克福** downtown — second map.
3. **Los Angeles / 洛杉矶** downtown — third map.

Connectivity, actual street orientation, significant building blocks and relative placement matter more than photoreal facade textures. Aim for atmospheric simulation-driving scenery at a credible level (SnowRunner is a visual quality analogy, **not an asset source**). OSM/geodata licenses and attribution are explicit gates; no proprietary Google 3D tiles. The existing fictional LA-inspired test track is **not** a completed LA city map.

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
- GPU/browser differences; authentic Stockholm/Frankfurt/LA geography increases data, rendering and license obligations. Realistic car variant requires structural modeling, not just texturing.
- Who owns the photos/child work, target age/platform, true-to-scale driving vs playful enlarged car; record choices when verified, do not block M0.


## Phase M2a: first deterministic arcade scenery contact — 012
Visible building/kiosk ground footprints and calibrated four-axle truck rectangle share fixed X/Z coordinates. Substepped swept tests prevent obvious forward tunneling, stop at the first contact, and permit reverse or R reset. This removes building ghosting without pretending to be Rapier rigid-body collision, spring suspension, curb dynamics, or real vehicle physics. Apple Silicon/Safari and full model profile QA remain manual. See [012 SDD](../specs/012-static-contact/spec.md).


## Phase M2b: opt-in browser FPS/p95 instrumentation — 013
A 300-frame bounded RAF interval window reports median FPS and p95 ms at <=1Hz while diagnostics are explicitly enabled during active driving. It provides real reference-device observation but **not** GPU timer queries, a remote benchmark or proof that the M5/phone meets success targets. Record warm-up, browser, viewport and screenshot manually. See [013 SDD](../specs/013-frame-diagnostics/spec.md).


## Phase M2c: three visible road-trip markers — 014
A simple fictional road game loop: three in-world colored gates with pure segment-crossing scoring, progress UI, and explicit journey restart. Improves child motivation and gives a deterministic acceptance path for future chunked neighborhoods. Progress stays session-local; not a road graph, licensed LA city reconstruction or savegame system. See [014 SDD](../specs/014-roadtrip-checkpoints/spec.md).


## Phase M2d: isolated cumulative preview launcher — 015
Reuses the already executable one-click .command on the preview branch, pins the 014 cumulative verified gameplay source and installs under ~/BrickWorld3D-preview by default, with loopback port 4174. Original install and its :4173 IndexedDB origin are untouched. Existing preview files are reused without auto-overwrite. This is not a signed .app or an auto-updater; Mac Finder/security and first real-network installation require manual acceptance. See [015 SDD](../specs/015-safe-preview-installer/spec.md).


## Phase M2e: fork convergence — 017
Consolidate separate lockfile + three **fictional** cross-street experiments into one cumulative branch preserving deterministic scenery contact, road-trip gates, frame diagnostics, six-slot garage and photo intake. Crossing buildings are omitted **in the same shared geometry source** for visuals and collisions; npm lockfile enables `npm ci`. Do **not** mistake this for the later geospatial **Stockholm → Frankfurt → Los Angeles** central-city maps. See [017 SDD](../specs/017-integrated-driving-build/spec.md). Combined-branch CI and actual Mac testing tracked in tasks.


### 017 isolated Mac preview handoff
The same checked standalone Finder bootstrap is pointed to cumulative `feat/017-integrate-branches` under **~/BrickWorld3D-preview-017** and default **127.0.0.1:4175** to avoid accidentally launching stale 014 code or overwriting old :4173/:4174 garages. Existing installed code is never auto-updated. The new preview includes session-only photo picking, does **not** generate 3D from photos, and is not a signed notarized app. Actual Finder install on the parent's Mac remains manual.

## Phase M1g — 018 annotated photo capture handoff
The existing 016 session-only photo picker now records manually tagged viewpoint per image and optional physical toy body L/W/H, reports missing front/rear/left/right/top/diagonal categories, and exports a JSON metadata-only capture manifest. This is **not** a photogrammetry/AI reconstruction pass or a claim of geometry fidelity; the current truck-only 2.50m scale is not replaced. See [018](../specs/018-photo-coverage-manifest/spec.md).

## Phase M1h — 019 on-device photo capture hints
Once a selected JPG/PNG/WebP decodes, a bounded 160px canvas analyzes extreme exposure, original decoded resolution, contrast and neighboring-pixel variation. The resulting warning is on-screen only, with no EXIF/network/IndexedDB write. It is a lightweight heuristic, **not** model reconstruction fidelity or actual blur detection. [019 SDD](../specs/019-local-photo-quality/spec.md).
