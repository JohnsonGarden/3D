# 017 — tasks
- [x] T-001 [FR-001,FR-002,FR-003,FR-004,FR-005] Write integration contract and non-regression obligations.
- [x] T-002 [FR-001,FR-002,FR-003] Port fork tests first; demonstrate RED on integrated branch.
- [x] T-003 [FR-001] Port audited npm lockfile, npm ci Actions, update Node world tests.
- [x] T-004 [FR-002,FR-003] Integrate crossings without losing city-layout shared footprints or 014 checkpoints.
- [ ] T-005 [FR-004,FR-005] Verify same-branch Node, TS, deploy, Chromium; record honest evidence.
- [ ] T-006 [FR-004,FR-005,FR-006] Real Mac Finder/Safari/driver scene QA and manual framerate (pending).
- [x] T-007 [FR-006] Port verified root-safe 015 installer to isolated 017 archive/home/port with RED→GREEN deploy tests.

## Integration TDD and CI evidence (2026-10-17)
- **RED** [run 39043123107](https://github.com/JohnsonGarden/3D/actions/runs/39043123107): imported street/layout and lockfile tests failed before their implementation was ported.
- **GREEN before installer revision** [run 39043328153](https://github.com/JohnsonGarden/3D/actions/runs/39043328153): 15 SDD packets, 72/72 Node, 17/17 deploy, 22/22 Chromium; build passed. Those branch integrations preserve prior 014 and 016 features.
- **RED isolated installer** [run 39043529004](https://github.com/JohnsonGarden/3D/actions/runs/39043529004): expected 017 URL/home/port before installer was adapted; deploy failures recorded, not ignored.
- **Install revision** [run 39043617866](https://github.com/JohnsonGarden/3D/actions/runs/39043617866): 72/72 Node, 17/17 deploy, production build. Chromium concluded success but had **one retry/flaky** in frame-metrics readiness (21 first-attempt passes, 1 passed on retry); not considered flake-free. Follow-up `tests/e2e/frame-diagnostics.spec.ts` waits for real sampled metrics for up to 45 s under slow headless WebGL instead of accepting placeholder values. Await its own post-fix complete-branch run before checking T-005.
- **Manual T-006 pending**, record device evidence with [017 Mac smoke checklist](../../docs/preview-017-smoke.md). No photo reconstruction or GIS city data is part of 017.
