# SDD + TDD agent harness

This repository implements a **lightweight Spec Kit-inspired process**, NOT a claim that Spec Kit CLI is installed. Agent adapters point to AGENTS.md. Source of truth: constitution → feature specification → plan/ADR → test matrix → tasks → code and evidence.

## Feature packet contract
Each `specs/NNN-slug/` contains four files:
- `spec.md`: problem, boundaries, numbered FR-### requirements, Given/When/Then, measurable NFR and non-goals.
- `plan.md`: architecture, data flow, risks, dependencies, sequence and explicit tradeoffs.
- `tasks.md`: smallest checkpoints and checkboxes with requirement IDs.
- `test-matrix.md`: each requirement → exact automated test or explicit manual acceptance.

Maintain `docs/adr/` when making expensive-to-reverse architectural changes; never introduce 'ghost requirements' in a prompt only.

## Required agent development loop
**SPECIFY** acceptance first → **PLAN** thin vertical design → **TASKS** by observable slice → **RED** failing test → **GREEN** minimal implementation → **REFACTOR** → **CONVERGE** test, lint/type/build, evidence, screenshots/performance log. If tests can't run, say *not verified* and keep task open.

### Codex prompt (copy into Codex)
'Read AGENTS.md, constitution, active specs/001-driveable-slice files. Pick the smallest unchecked task with a requirement ID. First add a failing test and show its actual failure. Then implement and run check:spec, test, build, and when UI changes, test:e2e. Record results and trace each acceptance case. Do not change original HEIC photos or misrepresent placeholder assets. Submit a small PR with remaining issues.'

### Claude Code / Copilot
Read CLAUDE.md or .github/copilot-instructions.md, which delegate to AGENTS.md. The same contracts and commands apply; no provider-specific hallucinated slash commands.

## Gate definitions
- `npm run check:spec`: checks packet structure, FR IDs, acceptance coverage reference and non-empty files.
- `npm test`: deterministic simulation tests in Node. No network or GPU needed.
- `npm run build`: TypeScript + bundler build.
- `npm run test:e2e`: real Chromium UI smoke; needs Playwright install. Does NOT prove 3D visual correctness.
- CI runs these on PRs. Performance/photorealism/recognizability remain manual criteria until measured or automated tools are added.

## Human acceptance log template
Date / branch / commit / OS / browser / GPU / viewport / scenario / screenshot-or-video / expected / actual / FPS-median / p95 frame time / errors / decision.

## Useful patterns
GitHub Spec Kit: https://github.com/github/spec-kit (constitution → specify → plan → tasks → implement → converge)
OpenSpec: https://openspec.dev/docs/schemas/spec-driven (proposal/spec/design/tasks)
Playwright: https://playwright.dev/docs/test-snapshots (stable baseline conditions required)
React Three Fiber: https://docs.pmnd.rs/react-three-fiber/advanced/scaling-performance (instancing/reuse/draw-call budgets).
