# 009 — Browser-local persistent vehicle garage

Status: implementation committed; browser end-to-end quality gate in progress (2026-10-17). Parent prioritizes gameplay over perfect GLB photo fidelity. 20MB GLB security and no-network policy retained.

## User story
As a parent, when I import a valid child-built vehicle into my garage, then I can revisit it after closing/reopening the browser, select it, return to the procedural fallback, or intentionally delete it without uploading to an external server.

## Technical policy
- Browser IndexedDB metadata & binary GLB separate stores, versioned `brickworld-garage-v1` for this web origin. At most **6** saved cars; each GLB ≤20MB. Keep storage budget honest: browser may enforce quota/eviction/private mode. Do **not** promise indefinite storage.
- Store only explicitly imported GLB bytes and an ID, filename, timestamp. Do **not** persist source HEIC, audio, children metadata, EXIF, credentials, or scan filesystem without consent.
- App remembers selected vehicle using same-origin localStorage if accessible; if preference is missing/invalid, fall back to procedural car.
- Strictly validate saved bytes again at **load time** (container v2 & no external URLs) and 3D bounds. Corrupt models remain selectable/deletable, and never cause a blank world, unhandled crash or network fetch.
- Imported GLB model geometry remains only a user-provided mesh; no photo reconstruction or wheel physics claim.

## Requirements
### FR-001 Save safely after valid import
Given parent selects a valid GLB at most 20MB, when parsing and geometry bounds pass, then save GLB bytes + metadata atomically to local IndexedDB, show the saved car in a list and mark it active. No network calls for the file. Invalid GLB rejected before it reaches storage.

### FR-002 Restore after reload
Given a saved active car, when refreshing the same-origin page, then the garage entries are recovered and the active GLB rendered again automatically. The active name appears in driving HUD. If localStorage is unavailable, listing and manual selection still work.

### FR-003 Select, sample fallback and delete
Given one or more stored cars, when clicking a saved car, then switch the rendered car without re-upload. When clicking the procedural sample, revert without removing user assets. Deleting any entry requires explicit child-safe confirmation; after deletion, list updates and active car falls back to sample if needed.

### FR-004 Quota, unsupported and corruption recovery
Given IndexedDB unavailable, storage quota exceeded, >6 cars, or damaged GLB in existing storage, when reading/writing/activating, then show actionable non-destructive feedback (may continue in procedural car), with no silent 'saved' success and no wipe of other entries.

### FR-005 Non-blocking local-only UI
Given garage overlay, when open, then show clear persistent car list, loading status, save origin notes and manual deletion; navigation and keyboard W/A/S/D/Q/locks remain unaffected after closing. Garage operations never upload models; no additional server endpoint.

### FR-006 Evidence
Given CI, when tests run, then cover IndexedDB persistence, reload & sample round-trip, deletion confirmation, duplicate saves/quota and corruption fallback via Playwright Chromium. Existing 39 simulation, HTTP security and browser driving tests continue passing; record real CI screenshot.
