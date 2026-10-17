# 017 — Converge independent CI-green feature forks without physics regressions

Status: planned integration; previous green runs from branches are not evidence for a combined build.

## FR-001 — reproducible locked installation
Given a fresh clone, when GitHub Actions or local bootstrap installs packages, then package-lock.json is checked in, `npm ci` runs reproducibly, and play scripts include new pure world-layout tests. Never silently reinstall and mutate the lockfile on CI.

## FR-002 — fictional road junctions
Given the current road practice strip, when driving, then there are three intersecting **fictional** 7m-wide east-west roads at z=-100,-260,-420, with continuous pavement, broken central dash/sidewalk at junctions, responsive scene draw and clear “not a real city map” label. No GIS / Stockholm/LA claims.

## FR-003 — single-source obstacle geometry
Given new cross roads and buildings, when rendering or checking collision, then buildings use the same immutable collision footprints from city-layout.ts (including roadside kiosk) and exclude asphalt; no visual building omitted from collision or simulated obstacle unseen in graphics. Existing 012 bumper SAT + recoverable collisions continue passing. Junctions are passable, not fake road-end blockers.

## FR-004 — preserve accepted cumulative 010–016 features
Given the consolidated branch, when opening the app, then photo selection, garage GLB import/export, touch/keyboard, drivetrain, FPS display, checkpoints and restart stay accessible, and no previously verified behavior is removed to port forked scenery.

## FR-005 — actual combined test evidence
Given the integrated branch, when GitHub Actions executes, then SDD tests, Node tests, deploy tests, browser/GLB/016/photo-intake E2E and production build pass in that same commit. Manual Mac/Safari and reference device FPS remain pending.
