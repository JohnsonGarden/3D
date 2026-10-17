# 012 — trace matrix

| Requirement | Automated acceptance | Manual/pending |
| --- | --- | --- |
| FR-001 | tests/deploy/lockfile.test.mjs checks lockfile v3 and root deps; fresh npm ci in both Actions jobs verifies transitive integrity | npm ci on user's Mac |
| FR-002 | source contract guards both jobs use npm ci and setup-node cache with dependency path | Real network/local registry variance |
| FR-003 | existing scripts/start-local.sh chooses npm ci with lockfile and denies root before install; Bash launcher regression tests | macOS Finder root-safe first launch |
| FR-004 | Actions spec / Node / deployment / TypeScript/Vite / Chromium E2E | Third-party packages, real mobile FPS |

GREEN: https://github.com/JohnsonGarden/3D/actions/runs/39039886486 (head 88b01474...), 49 Node + 14 deploy + 16 Chromium E2E, 8 SDD packets, production build green with npm ci in both jobs. The lockfile was produced from a real npm 22 CI install; Mac/Finder remains a separate unexecuted manual check.
