# 012 — Reproducible npm install and CI dependency resolution

Status: RED contract authored (2026-10-17); verification pending.

## Problem
The current Mac one-click startup conditionally uses `npm ci` only if a package-lock.json exists; the repository has no lockfile, and both CI jobs use floating npm install. A new GitHub archive can therefore select different patch versions without a deliberate code update.

## Required behavior
### FR-001 Committed lockfile
Given the same checked-out commit with Node 22/npm 10, when installing from a fresh checkout, then `package-lock.json` exists in the repository, is lockfile version 3, and its root package dependencies/devDependencies agree with package.json. Do not synthesize guesses about transitive versions.

### FR-002 Frozen CI dependency installation
Given a clean GitHub Actions checkout, when unit/spec/build and Chromium E2E jobs prepare dependencies, then both use `npm ci --no-audit --no-fund`, fail if lock and manifest disagree, and restore/store package manager download cache keyed by committed lockfile. No unexpected npm install mutation in CI.

### FR-003 One-click launcher aligned with lock
Given the existing Mac project launcher, when dependencies are missing or the manifest changes, then it installs from the committed lock using npm ci. It must continue refusing root before invoking npm/Homebrew, preserve loopback serving, consent policy and read-only user media.

### FR-004 Regression evidence
Given CI, when the lockfile and config are committed, then frozen npm install, existing SDD/Node/deployment/Chromium tests, and production build pass. State that cache speeds downloading but does not make first offline install possible or guarantee Mac Gatekeeper/Finder behavior.

## Non-goals
Vendoring node_modules, pinning the OS/Apple silicon drivers, eliminating first-run Internet requirements, signing an app, or upgrading dependency major versions for their own sake.
