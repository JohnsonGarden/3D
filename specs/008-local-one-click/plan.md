# 008 — Design & architecture

- Entry **`启动积木世界.command`** (executable mode 100755) wraps `scripts/start-local.sh` (POSIX-ish Bash, executable). No hard-coded Desktop, workspace or repo path; Finder may launch with a different working directory.
- Script verifies macOS/Linux; prefer macOS. Probe Node >=22.12 & npm. For interactive mac users only, ask consent before `brew install node@22`; no automatic curl-pipe-shell. Detect common Homebrew paths because Finder's PATH may be limited.
- `npm install --prefer-offline --no-audit --no-fund` and `npm run build` make an independent production `dist` folder. Future lockfile enables `npm ci`; until committed (issue #6), don't claim reproducible dependency resolution.
- Use pure Node standard-library `scripts/serve-local.mjs` instead of adding a server dependency or exposing `vite --host 0.0.0.0`. Port 4173 default. Loopback binding, safe static asset resolving, content-type table, stable app health sentinel. Can start on ephemeral port 0 in CI.
- Launcher polls health, launches default browser on Mac with `open` (optional xdg-open on Linux), retains server's PID and uses a cleanup trap. If occupied by Brick World reuse; if foreign server, error. `--no-open` for automation, `--check` for environment preflight, `--build-only` for build verification.
- Test first `tests/deploy/local-server.test.mjs` against built files with Node HTTP client & subprocess; `tests/deploy/launcher.test.mjs` exercises shell syntax, flags and branch-agnostic environment check. CI order: build before server tests.
- Security: no `sudo`, no project deletion, no remote binary installation. No network listener beyond 127.0.0.1. Child-uploaded GLB/audio remain browser-local. Model retains current limitations.

## Tradeoff
Node remains a prerequisite (or optional user-approved Homebrew install). This is a **one-click project launcher**, not a compiled native application. GitHub ZIP may trigger macOS Gatekeeper confirmation or executable permission preservation differences depending on extraction; show manual fallback `bash scripts/start-local.sh`.
