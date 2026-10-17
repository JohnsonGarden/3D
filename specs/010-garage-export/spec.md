# 010 — Local GLB export and recoverable garage backups

Status: proposed (2026-10-17). Parent Mac/Safari verification pending.

## Problem and user story
A parent can save imported GLB vehicles to this browser's IndexedDB, but browser data is not a durable backup. As a parent, I need a deliberate, offline export of the original binary so I can move it to a safe folder, re-import later, or carry it to another browser.

## Invariants
- Only explicitly selected stored vehicle GLB is exported. No automatic exports, remote requests, sync, accounts, HEIC, music, public sharing, or third-party runtime dependencies.
- Export the **original stored bytes**, not a screenshot or rescaled/reconstructed replacement. Do not silently discard metadata or modify the stored vehicle.
- Preserve the existing six-slot garage, selected model, corruption fallback, 20 MB boundary, and keyboard driving.
- Export only after a click, with a safe .glb download name and clear non-destructive error on corrupted/unavailable data. Export does not delete or mutate the stored car.

## Requirements and scenarios
### FR-001 Export a selected stored vehicle
Given a valid GLB stored in the garage, when the parent clicks that vehicle's 导出 GLB action, then a browser save/download begins with the same GLB bytes and a safe filename. Exporting does not navigate away, select another car, delete files, or send a POST/PUT/PATCH network request.

### FR-002 Correctness and input safety
Given an existing entry, when its bytes are read for export, then the GLB v2 container validation, 20 MB cap and safe filename policy are checked. The downloaded binary equals the stored input byte-for-byte; it is not passed through Three.js serialization. Only the browser download is permitted.

### FR-003 Recover gracefully
Given a corrupted blob, missing blob, blocked storage or invalid saved name, when a parent clicks export, then an actionable on-screen error appears; no bogus download starts, existing records remain listed and can still be deleted or re-imported.

### FR-004 Document the portability limit
Given a parent relying on the garage for their child's work, when reading instructions, then the UI and README explain that each exported GLB is a manual backup, imports can be repeated on another origin, and app storage is not guaranteed forever. Browser save/download still needs an explicit user action.

## Non-goals
Multi-car ZIP, cloud sync, account sharing, thumbnails, native Finder access, HEIC reconstruction, raw-photo export, or full original model rights/provenance attestation. These remain later enhancements.
