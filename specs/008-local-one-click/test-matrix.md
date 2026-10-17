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
