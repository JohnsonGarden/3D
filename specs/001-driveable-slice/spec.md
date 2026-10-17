# 001 — The first driveable LEGO world (M0)

Status: accepted for prototype, not completed. Last revised 2026-10-17.

## Intent and primary user story
As a child, I want to instantly drive a colorful brick car in a believable toy-friendly world, open its garage and listen to music a parent chooses, so that my creation feels alive. Parent can later import an independently prepared GLB without data leaving the device.

## Scope
Single page WebGL prototype, one default stylized car, flat road with simple cityscape, chase camera, keyboard driving/brake/reset, session garage overlay, session-local GLB chooser and browser audio. Desktop Chrome/Safari first.

## Functional requirements and scenarios
### FR-001 Immediate world entry
Given a WebGL-capable supported desktop browser, when page opens, then a visible game scene and clear input instructions appear without account/login. On WebGL failure, show understandable recovery guidance.

### FR-002 Responsive driving controls
Given garage is closed, when W/S/A/D or arrow keys are pressed, then movement and turning are bounded and predictable; Space brakes, R resets, keys released stop applying throttle. No negative infinite speed, NaN or teleportation.

### FR-003 Believable world scale and follow-camera
Given the parent-measured truck, when it moves, then chase camera follows smoothly, road lane is 3.5 m and truck physical proportions use the calibrated 2.50m width per specs/006-proportional-truck-scale. Scene is explicitly LA-inspired, not georeferenced.

### FR-004 Garage session
Given the page is loaded, when G or the Garage button is used, then garage view opens/closes, shows selected car and an option to import GLB; while open, simulation input is paused.

### FR-005 Local model selection
Given parent selects a valid GLB ≤ 20 MB, when parsed successfully, then display replaces the placeholder with uniformly scaled model; failure shows error and retains existing car. Never upload the file or automatically claim photo reconstruction.

### FR-006 Local background music
Given user selects audio ≤ 30 MB, when user initiates playback, then browser plays it locally with pause/volume controls. Reject invalid files, avoid autoplay and revoke replaced blob URL.

### FR-007 Recoverability and accessibility
Given a child has driven or changed panels, when Reset is activated or user returns from garage, then controls and scene remain responsive; keyboard shortcuts do not interfere with focused form controls.

### FR-008 Reproducible quality
Given a change to source, when CI runs, then the feature packet, deterministic unit tests, build and observable browser smoke test gate merge.

## Non-functional requirements
- NFR-001 Target desktop 60 fps typical scene, degrade to 30 fps on weaker hardware; performance target is **not measured yet**.
- NFR-002 Deterministic simulation 60 fixed steps/sec with cap on catch-up and physically bounded parameters.
- NFR-003 Local-only user-selected HEIC/GLB/music; no backend, telemetry, storage, EXIF export.
- NFR-004 No undocumented copy of proprietary visual assets; provenance for future LDraw/maps.
- NFR-005 Testable startup, input and garage paths without dependency on screenshot pixel identity across GPUs.

## Explicit non-goals M0
- Automatic HEIC → 3D reconstruction, authentic photo match, persistent garage, accurate LA map, AI-generated streets, traffic AI, multiplayer, rigid-body suspension, mobile controls, downloadable game package.

## Critical acceptance conditions
FR-001/002/004/006/007 visible in manual/browser smoke; FR-002 and NFR-002 deterministic unit tests; FR-005 malformed file handling UI test plus valid GLB manual inspection; FR-003 measurements in scene and visual review. See test-matrix.md. If capability remains unverified, it stays pending rather than silently marked complete.
