# 018 — architecture and implementation plan

## Design
- src/garage/capture-manifest.ts implements pure readonly photo-angle assessment, dimension validation and JSON-safe capture manifest shape with no DOM/files/network and no object URLs.
- Existing App.tsx photoPreviews carry {name, url, type, size, view}; photo batch selection resets labels to unassigned while cleanup effect revokes obsolete preview URLs, and invalid replacements leave current state alone.
- Per preview native <select> for viewpoint. A compact checklist, three controlled toy-cm measurements and a deliberate JSON-download button live in the existing garage dialog.
- Output is a small Blob URL, browser-driven download, with short delayed revocation consistent with GLB export. No photo bytes, EXIF, original File/URL or persistence. Header makes limitations explicit.

## Engineering tradeoffs
- A manually marked photo angle describes user intent; it is not verified computer vision. Keep even "complete" feedback qualified.
- No new packages, no IndexedDB migration and no changes to physical sim/vehicle import scaling.
- Guard public JSON against executable/URL objects via explicit schema selection, simple validated primitives and deep copy. Filename is from existing validated 016 metadata (can be sensitive, so deliberate export).
- Document requirement for explicit scale mapping of each future reconstructed or imported vehicle in later SDD.

## Harness sequence
SPEC + RED unit/E2E → GREEN helper/UI → refactor → full npm ci/CI SDD, unit/deploy/build/Chromium → manual Safari/Mac checks.
