# 012 — trace matrix

| Requirement | Automated acceptance | Manual/pending |
| --- | --- | --- |
| FR-001 | tests/deploy/lockfile.test.mjs checks lockfile v3 and root deps; fresh npm ci in both Actions jobs verifies transitive integrity | npm ci on user's Mac |
| FR-002 | source contract guards both jobs use npm ci and setup-node cache with dependency path | Real network/local registry variance |
| FR-003 | existing scripts/start-local.sh chooses npm ci with lockfile and denies root before install; Bash launcher regression tests | macOS Finder root-safe first launch |
| FR-004 | Actions spec / Node / deployment / TypeScript/Vite / Chromium E2E | Third-party packages, real mobile FPS |

RED stage: no fabricated lockfile or passing check claims. `package-lock.json` must be a real npm-generated artifact.
