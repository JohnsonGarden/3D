# 008 — One-click local install & launch, macOS first

Status: scoped. Implement RED → GREEN → converge via GitHub Actions.

## User goal
As a parent on a MacBook Air, I can unpack the project's development-branch ZIP, double-click **启动积木世界.command**, and play without entering npm commands or exposing my children's assets over LAN.

## Functional requirements
### FR-001 Finder one-click launcher
Given extracted repository contents in an arbitrary user path (including Chinese characters/spaces), when double-clicking the executable `.command`, then it resolves its own repository root, checks prerequisites, installs dependencies on first use, builds a production bundle, runs the local-only server, opens the URL in the default browser, and holds the Terminal process to permit explicit shutdown.

### FR-002 Honest prerequisite handling
Given no usable Node.js >=22.12 / npm installation, when launching, then show readable next steps and never silently run a privileged or untrusted install script. On macOS, if Homebrew exists, the user may explicitly opt in to `brew install node@22`; if unavailable, show https://nodejs.org/en/download and exit clearly. Re-run after installing.

### FR-003 Loopback-only serving and route integrity
Given a built `dist`, serve HTTP only on `127.0.0.1:4173` by default; support overriding the port from a validated environment variable. Serve static assets and SPA root, honor HEAD, refuse unsupported methods, block decoded traversal / backslashes, set correct MIME and no-sniff. No API, telemetry, file upload or external binding. Do not use Vite's HMR development mode for this launcher.

### FR-004 Re-launch and shutdown
Given an existing local Brick World server on the selected port, avoid spawning a second server or destroying it; optionally reopen browser. Given a port taken by a different process, exit with an explanation and port override instead of killing processes. When pressing Ctrl+C, stop **only the child process started by this launcher**; no sudo, killall or deleting user files. A build/install failure must return nonzero, not claim success.

### FR-005 Reliable checks & trace
Given CI Linux/Chromium (Mac unavailable in Actions), run Node HTTP contract tests for root/assets/health/HEAD/405/path traversal/port validation and Bash script syntax/--check, alongside existing specs/unit/build/browser. Actually double-clicking the script on macOS still requires parent smoke test; no false Mac test claim.

### FR-006 Clear install instructions
Given the README, explain how to download correct development branch archive (main still has no runnable app), unzip, optionally grant macOS permission once, double-click, inspect URL, and stop via Ctrl+C. Tell user that first launch needs Internet for npm and Node (if missing); subsequent launches require installed deps and local build only, with no uploads.

## Non-goals
Packaging a notarized .app/.dmg, Apple Developer signing, auto-updaters, making npm/Node dependency disappear, background daemon/login item, serving to phones via LAN, durable garage storage, or native Apple Silicon benchmark numbers.
