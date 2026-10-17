# 016 — Technical plan / architecture

## Design choice
Continue existing browser React/R3F architecture. Add a small pure photo selection validator in `src/garage/photo-intake.ts`; only retain File refs/object URLs in React **session state**, never IndexedDB, remote analytics or backend. One garage panel uses a multiple-accept input, thumbnail list, deterministic validation, explicit replace/clear and revoke cleanup. In the earliest slice the photo set is **only a preview and guidance UI**, not an in-browser reconstruction pipeline.

## Constraints and tradeoffs
- Session-only avoids silently capturing or persisting child photos; reopening the game means reselecting the files. Native HEIC has inconsistent browsers' preview support; initially support JPEG, PNG, WebP only and explain this limitation.
- Cap at 12 photos, <=12 MiB each, <=72 MiB aggregate for resource control. File metadata check is not a full image decoder / adversarial payload scan; browser image decode errors should not be interpreted as imported 3D geometry.
- Make replace atomic: invalid selection must preserve last accepted photo set; same chosen file again is allowed via resetting input.value.
- Blob URLs are a view detail and must be revoked on replacement/clear/unmount; do not include original photo names in network calls.
- Store future `canonicalCarId`, `physicalDimensions`, `worldScale`, `wheelStations`, `brickModelVariant`, `realisticModelVariant`, `provenance/confidence` with separately approved data design, not a fake switch now.
- Continue test/deploy/garage contracts. Test pure validation with node --experimental-strip-types (Node22 TS supported). Use Playwright for preview flows and no regressions in existing garage UI.

## Later architecture decisions (NOT implemented)
1. Pluggable reconstruction adapter (manual parts-based, on-device/local service, optional explicit opt-in remote job), JSON status and self-contained GLB.
2. Vehicle identity/geometry registry with canonical dimensions and scene independent appearance variants; pair realism conversions by source build not generic preset.
3. Geo city importer with OSM-compatible attribution manifest, selected downtown bbox, simplified mesh/LOD and road graph QA in order Stockholm/Frankfurt/Los Angeles.
4. Terrain/material pipeline pursues believable lighting similar in spirit to simulation-driving games while using original or licensed assets.

## Verification
`npm run check:spec`, `npm test`, `npm run build`, `npm run test:deploy`, `npm run test:e2e` in GH Actions; Mac Safari HEIC and real-device photo picker require manual review.
