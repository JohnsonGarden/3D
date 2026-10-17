# 010 — design and implementation plan

## Architecture
- Keep IndexedDB schema v1 unchanged; reuse readGarageVehicle(id). Export should be a read-only operation.
- Add src/garage/export.ts as a pure, testable adapter: a bounded safe filename and Blob packaging after existing validateGlbBytes. No DOM or network in this module.
- App.tsx adds an accessible per-car 导出 GLB action, handled only from a direct click. Read the bytes, package them, create a short-lived blob URL and click a transient <a download>. Revoke afterward. Disable overlapping garage operations and display errors without deleting/modifying any data.
- Add Node unit tests for name normalization, boundary/invalid bytes, exact contents and a Chromium E2E download/restore scenario.

## Tradeoffs
- One binary per click instead of ZIP or large JSON/base64 backup: avoids bundlers, RAM amplification, background download blockers and file formats that require bespoke restores.
- A browser download is not proof the parent stored a durable copy. Documentation explicitly recommends saving original GLBs elsewhere.
- No changes to IndexedDB version, GLB loading transform, vehicle scale, server, network permissions or source photos.

## Development stages
SPECIFY → RED test (export module absent and export button absent) → GREEN minimal helper and UI → REFACTOR → CONVERGE real CI and screenshot/download evidence.
