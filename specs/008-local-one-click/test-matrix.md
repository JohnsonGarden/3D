# 008 — TDD traceability

| Requirement | Automatic proof | Manual/open proof |
| --- | --- | --- |
| FR-001 | Bash syntax and `--help`/root resolution checks, build+HTTP probe in Linux | macOS Finder doubleclick, spaces/Chinese extraction folder |
| FR-002 | Child Node preflight test and `--check`; manual Homebrew flow | Node absent on Mac, user consents to brew install |
| FR-003 | Node HTTP subprocess tests health/root/JS mime/HEAD/traversal/unsupported verbs/loopback/invalid port | Safari + Chromium UI test |
| FR-004 | Node duplicate-port/foreign-process and signal shutdown tests | Mac Terminal Ctrl+C; re-launch prompt |
| FR-005 | GitHub Actions spec + unit + build + server-contract + Chromium | Performance on M5 pending |
| FR-006 | README and source links checked by reviewer | Parent succeeds from downloaded repo ZIP |

RED gate intentionally fails until `scripts/serve-local.mjs` and `scripts/start-local.sh` exist. Never claim Linux CI is a Mac Finder UI test.

## Automated evidence (2026-10-17)
Commit `37f453fcb31402ee354324d9aad1072fc41efe20` CI: 39 Node vehicle tests, 6 deploy tests including shell syntax/Node preflight, local loopback static server, MIME/health/HEAD/invalid path/method, port collision and rejected invalid port, TypeScript build and SDD checker all passed. Link final Actions run after docs converge. macOS Finder opening remains intentionally unverified.

## GREEN (2026-10-17)
GitHub https://github.com/JohnsonGarden/3D/actions/runs/39033643766 at commit `0ddf97de0b271b2137538d1e9cb60661434fb9ff` passed: 39 Node sim tests, 9 deployment contract tests (Node static server, paths/health/HTTP, Bash preflight, standalone installer reuse/occupied-folder), SDD trace and TS/Vite build. 7 Playwright Chromium browser tests pass in separate job. Tests are Linux shell/Chromium, **not** a signed macOS app or Finder UI run.

## Root/Homebrew remediation (FR-007)
- Pure shell test sources `scripts/require-normal-user.sh`, invokes `require_normal_user 0` (nonzero with Chinese root explanation) and `require_normal_user 501` (success). Static checks ensure guards precede `brew`, npm, curl and writes in each launcher.
- Project launcher checks `EUID` before `brew --prefix` and `npm`. Standalone bootstrap checks `EUID` before any download or access to previously installed code. This addresses the reported Homebrew root error without bypassing Homebrew policy.
- CI runs as non-root Linux Ubuntu; **cannot claim real Mac Finder root test**. Parent must retry from an ordinary account and report UID/path ownership on failure.

### Verified CI — root guard (2026-10-17)
https://github.com/JohnsonGarden/3D/actions/runs/39036181217 at commit `32938c213b7877fa4dca239c38a306c02d07433e`: 43/43 Node, 11/11 deploy (previously 9), 12/12 Chromium, typecheck/build and SDD spec check green. The new tests simulate root and normal UID through a pure Bash guard; tests also ensure root checks precede Homebrew/npm/curl. This does NOT substitute for Mac Finder user-environment smoke test.
