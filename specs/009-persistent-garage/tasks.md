# 009 — tasks
- [x] T-001 [FR-001,FR-002,FR-003,FR-004,FR-005,FR-006] Specify local garage UX, storage schema and acceptance.
- [x] T-002 [FR-001,FR-002,FR-003,FR-004,FR-006] Author failing Chromium E2E with real tiny geometry-bearing self-contained GLB.
- [x] T-003 [FR-001,FR-004] Implement IndexedDB atomic metadata+bytes adapter with <=6 slots.
- [x] T-004 [FR-002,FR-003,FR-004] Implement safe selected-id preference and startup restore.
- [x] T-005 [FR-001,FR-003,FR-005] Complete garage car list, selection, explicit delete confirmation, loading/error messaging.
- [x] T-006 [FR-006] Run Node spec/unit/build/security/deploy + Playwright; inspect screenshot.
- [ ] T-007 [FR-004] Manual Chrome/Safari low-disk/private-mode storage check, M5 benchmark; pending.

## Convergence evidence — 2026-10-17
- Last browser-evidence code commit `485bb7aa80788fbf04af3224aa6d1550424eed5c`; green Actions https://github.com/JohnsonGarden/3D/actions/runs/39035059140
- SDD trace: 5 spec packets; 43/43 Node unit tests (39 sim + 4 garage candidate), 9/9 deployment HTTP/shell contract tests, TypeScript/Vite production build passed.
- 12/12 Chromium E2E tests (7 existing driving + 5 garage). Garage tests import a real self-contained tiny geometry-bearing GLB, select, refresh, confirm/cancel delete, inject corrupted IndexedDB bytes and recover, verify 6-slot cap and absence of POST/PUT/PATCH requests.
- Browser artifact `playable-browser-evidence` includes `test-results/persistent-garage-chromium.png`, visually inspected after real import (shows saved entry, delete action and calibrated garage).
- Remaining manual T-007: Safari, MacBook Air M5 actual FPS, storage eviction/private mode, app update while IndexedDB present, full child-created GLB and family review.
