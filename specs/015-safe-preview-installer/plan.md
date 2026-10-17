# 015 — safe preview launch plan

## Design
- Reuse the **existing executable standalone .command file** on this preview branch, keeping git mode 100755. Set pinned source archive from 014 branch rather than mutable main (the known-verified cumulative build).
- Change default install directory from ~/BrickWorld3D to ~/BrickWorld3D-preview; retain explicit BRICK_WORLD_HOME override and current preservation semantics.
- Set BRICK_WORLD_PORT=4174 only for the delegated start-local script when caller has no override. Continue server binding on 127.0.0.1 and secure health checks; port busy should fail cleanly, never open an unrelated process.
- Preserve effective UID 0 guard prior to all writes/network; do not alter Homebrew or npm behavior.
- Add CI deployment tests exercising hermetic reuse & no-download, default port 4174, path, HTTPS and guard; no GitHub/network download in CI.
- Document deliberately different per-origin IndexedDB in README and user-facing script.

## Tradeoffs
- Preview branch pinned explicitly to previously confirmed 014 CI-green code, not this 015 wrapper PR. No auto-updates; repeat download to different directory after backup for newer previews.
- An existing preview install is reused without upgrades; warn prominently rather than risking destroying modifications.
- Old installation and browser garage remain wholly untouched. Port 4174 creates a **different browser data origin** by design.

## Harness
SPEC → RED tests → shell edits → deployment CI + browser regressions → manual Finder Gatekeeper approval and first network install.
