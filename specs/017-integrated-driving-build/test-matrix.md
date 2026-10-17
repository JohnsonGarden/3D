# 017 — verification traceability
| FR | Automated evidence | Manual |
| --- | --- | --- |
| FR-001 | `tests/deploy/lockfile.test.mjs`, `npm ci` in CI, Node layout-glob tests | Fresh Mac boot without altering unrelated home |
| FR-002 | `src/world/street-layout.test.ts` + `tests/e2e/fictional-streets.spec.ts` | Drive every junction |
| FR-003 | `src/sim/contact.test.ts` additional crossroad clearance + pre-existing SAT/recovery; check World paints CITY_BUILDINGS exactly | Verify no building/road penetration at crossings |
| FR-004 | Existing 010–016 unit and Chromium garage/photo/roadtrip diagnostics tests | Mac/Safari usability and actual photo handling |
| FR-005 | Whole-branch green GitHub Actions matrix including TypeScript/Vite | Reference Apple Silicon FPS and family gameplay |
| FR-006 | Hermetic deploy scripts check 017 branch, root guard, 4175, isolated -017 home; old ./command remains executable | Mac Finder/Gatekeeper and first real network install |
