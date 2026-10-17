# 017 Mac 家长验收单 — isolated cumulative preview

**Status: MANUAL PENDING.** This is a checklist, not proof that it has been run on the parent's Mac. Follow only with an ordinary macOS account (NEVER sudo or root).

## A. Install safety and first launch

1. From [017 branch launcher](../下载并启动积木世界.command), download the standalone `下载并启动积木世界.command` file from the 017 feature branch, verify repo is `JohnsonGarden/3D`; double-click in Finder. If macOS blocks an unknown file, review System Settings → Privacy & Security permission; do not bypass security checks or execute unknown downloads.
2. Check Terminal `id -u` is **not 0**, and that the script identifies archive `feat/017-integrate-branches.zip` (reviewed **branch**, not a cryptographically pinned immutable commit).
3. Expected new home: `~/BrickWorld3D-preview-017` (do **not** use `~/BrickWorld3D` or `~/BrickWorld3D-preview`). Expected local URL: `http://127.0.0.1:4175`.
4. Verify original ports `:4173` and `:4174` and directories still work/are intact if previously present. Re-run the 017 script: it must reuse the existing 017 installation **without overwriting local edits**. If replacing an old 017 install, make an explicit backup/move and freshly install into a new directory; there is intentionally no auto update.
5. Note that all browser storage is **origin-specific**: 4175 is distinct from 4173/4174, and Chrome/Safari don't share IndexedDB. Existing GLB entries require manual prior export and fresh import.

## B. Parent-visible features (check on desktop Chrome, then Safari)

- [ ] Garage opens from `G` and button, sample truck remains driveable.
- [ ] Pick 2+ real JPG/PNG/WebP images of a child-created car: verify thumbnails and names, replace with new selection, clear selection; photos must **not** pretend to generate a 3D car or overwrite a selected/saved GLB.
- [ ] Try HEIC and bad file deliberately: clear unsupported-format message, last accepted photo set remains. (HEIC native import/conversion is **not** implemented.)
- [ ] GLB manual import and six-slot garage still work; export one and compare to original via hash or size; don't expect browser-local storage to be a guaranteed backup.
- [ ] Drive forward/backward, front-axle steering, 8×4 / 8×8 and three logical diff locks, keyboard and touch if available. Note current controls/traction are **arcade approximations**.
- [ ] Drive through the 3 fictional perpendicular-road junctions, inspect for road edge gaps, car clipping, building solids. Collide deliberately with roadside kiosk, then reverse / reset. Note curbs/ground are not yet physical colliders.
- [ ] Drive through 3 colored road-trip checkpoints; verify progress 0/3→3/3 and restart separately from R vehicle reset.
- [ ] Turn on local performance panel; capture median FPS / p95 frame ms after warm-up, 2 minutes of driving at normal display resolution, WebGL settings, OS/browser + device model. Target median >=60 fps and p95 <=33ms (target only, NOT confirmed).
- [ ] Confirm actual photo exposure/privacy behavior manually in browser network inspector: no uploaded photos to remote reconstruction APIs by default.

## C. Known limitations / not acceptance criteria yet

- No automatic multiple-photo→3D reconstruction, no structure-derived realistic vehicle variant/style toggle yet, no HEIC decoding.
- Street scene is **fictional practice roads**, not a real map of Stockholm, Frankfurt or Los Angeles. Later city order: Stockholm center → Frankfurt center → Los Angeles center.
- Not a signed macOS .app or notarized DMG, real Safari file dialog, real first-download networking and family photo model fidelity remain unverified until exercised.
- No automatic GitHub commit updates, no import/export of child's HEIC originals, no background telemetry.

## Evidence recording

Record date, Mac model, macOS/browser version, URL/port, photo formats/count, first-launch result, screenshots of photos/road/collision/FPS, specific failure/repro steps, and whether data stayed local. Paste acceptance notes into `specs/017-integrated-driving-build/tasks.md` without personal image content or geolocation.
