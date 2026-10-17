# 009 — Engineering plan and architectural decision

## Design
- `src/garage/storage.ts` is a pure browser API adapter, no React/Three dependencies. IndexedDB v1 has `vehicles` metadata object store keyed by ID and `blobs` binary ArrayBuffer object store keyed by ID. One readwrite transaction saves and deletes metadata+binary atomically. `getAll` only on metadata (not all large blobs). Limit 6 slots and 20MB/GLB, handle browser QuotaExceededError.
- `src/App.tsx` single selected-object lifecycle. The same `validateGlbBytes + GLTFLoader.parseAsync + scaleImportedModelByWidth` flow is used for imports, clicks and restore. Persist only after validation. Keep previous car after failed save/parse.
- `src/garage/preference.ts` uses guarded same-origin localStorage for active vehicle id. Invalid preference never blocks IndexedDB usage; selection is an option, not a requirement for storage.
- Guard asynchronous startup restore vs user-triggered upload (ignore stale restore based on a selection-version ref), clean up unused parsed objects when possible. Do not ask for delete confirmation before simply switching to default.
- IDB error handling uses clear visual message and never automatically erases corruption; explicit delete per vehicle. Browser storage availability is origin-specific; `127.0.0.1:4173` and a different port are separate garages.
- In 3D scene, show saved GLB geometry or procedural car; no new 3D assets or network dependencies.

## TDD
- RED: Playwright uploads an in-memory self-contained GLB with actual vertex POSITION data, expects persistent list, reload and deletion. Previous garage is session-only so these fail.
- GREEN: adapter/UI and failure states.
- CI: run existing Playwright suite with new tests; test no unexpected network upload and app recovery.
- Security: no data URLs from untrusted GLB beyond GLB guard, no external resource URIs, no log of binary model bytes.

## Non-goals
Cloud sync, account, Safari/Chrome cross-browser sharing, migrating storage between different local ports, drag/drop large archives, background music persistence, wheel rigging, browser quota guarantee, downloaded ZIP asset previews, photo fidelity signoff.
