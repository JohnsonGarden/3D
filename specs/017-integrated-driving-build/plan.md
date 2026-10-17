# 017 — integration plan / architecture

## Design
Carry only the necessary parts of two sibling forks 012-reproducible-install and 013-fictional-streets onto the **fully cumulative** 016 branch. The 012/013 source branch began from 011; copying its World.tsx outright would erase 012 collision, 013 frame diagnostics, 014 checkpoint gates and 016 photo intake. Instead treat source fork street-layout.ts as **pure reference data**, adapt rendering in current World and share all solid building geometry with collision via city-layout.ts.

- World street layout geometry: crossings, road markers and segmented sidewalks; instanced rendering to limit draw calls.
- city-layout retains obstacle IDs for static-contact tests and kiosk/garage and composes cross-street-safe building footprints from street layout, rendering **exactly CITY_BUILDINGS**. No false walls or invisible solid lot.
- Existing shared deterministic collision and road-trip gate coordinates remain unchanged.
- Copy npm package-lock from fork and switch CI to `npm ci`; new `src/world/*.test.ts` runs in Node.
- Keep 016 product direction unchanged: 3 junctions are **test track only**, not LA, Stockholm or any real city.

## TDD / gates
Create 017 tests/contract and bring 013 fork's own unit/E2E tests into branch first; then port. Confirm old collision assumptions around 42 solids become range/geometry invariant without weakening bumper/reverse assertions. Run actual same-branch Actions. Future true georeferenced city data remains a separate program.
