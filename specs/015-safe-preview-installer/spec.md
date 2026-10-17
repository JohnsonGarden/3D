# 015 — Isolated Mac preview one-click launcher

Status: specified. Actual Mac Finder/Gatekeeper acceptance pending.

## Problem
The previous standalone bootstrap downloads an older feature branch into ~/BrickWorld3D and deliberately reuses it without upgrading. New tested gameplay branches (010–014) are therefore not reachable from that launcher, and silently overwriting the parent's existing code or browser garage would be dangerous.

## Requirements
### FR-001 Pinned cumulative preview
Given parent downloads the standalone launcher from the 015 preview feature branch, when double-clicked as a normal macOS account, then it installs the latest **CI-verified cumulative 014 feature snapshot** from this user's repository into a dedicated preview directory and starts the same local-only server. Do not claim it is the default main branch or an automatically updating channel.

### FR-002 No overwrite or root execution
Given an existing normal install in ~/BrickWorld3D, when launching preview, then the existing directory is untouched; preview uses ~/BrickWorld3D-preview unless explicit BRICK_WORLD_HOME is provided. Reuse of an existing preview directory must not replace user-modified files. An unrelated occupied preview path is refused. Effective UID 0 is refused before any download, mkdir, brew or script execution; never bypass Homebrew policy.

### FR-003 Isolated origin and clear risks
Given the older local game may be running at :4173, when preview launches, then prefer 127.0.0.1:4174 rather than accidentally opening the old instance. Explicitly explain that browser IndexedDB/localStorage is origin-specific and preview :4174 has a different garage from :4173; source GLB files can be manually re-imported/exported.

### FR-004 Automated safe-contract evidence
Given Node deployment and TypeScript/Chromium CI, when code changes, then shell syntax, executable permission, pinned HTTPS archive, root guard ordering, non-overwrite behavior, default preview port, and existing local server security remain verified. Real Mac Finder doubleclick and network install are manual checks.

## Non-goals
Code signing/notarization, DMG, migrating/overwriting 009 garage automatically, deleting old installations, self-update daemon, fetching source from untrusted repositories, and preserving selected car across different ports without explicit manual export/import.
