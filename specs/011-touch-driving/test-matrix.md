# 011 — test trace matrix

| Requirement | Automated | Manual |
| --- | --- | --- |
| FR-001 | Playwright emulated touchscreen viewport 390x844 shows 5 large accessible buttons; desktop prior tests unaffected | iPhone Safari safe-area and visual overlap |
| FR-002 | Node pure input resolver tests keyboard/touch combinations and conflicts; Chromium hold accelerator creates speed | True two-finger driving on device |
| FR-003 | Node neutral controls after pointer removals; Chromium touch release + garage hidden/restore, blur logic reviewed | Pointer-cancel, interruption during calls/tab switch |
| FR-004 | GitHub Actions full spec/unit/deploy/build/Chromium suite plus screenshot evidence | Mac M5 performance benchmarks |

Tests authored before feature implementation; do not infer mobile device FPS from Chromium emulation.

## GREEN evidence
Actions https://github.com/JohnsonGarden/3D/actions/runs/39039385172 — 49 Node unit, 11 deploy and 16 Chromium browser tests passed; TypeScript/Vite build, 7 SDD packets passed. Touch-mobile evidence screenshot is written to `test-results/touch-driving-mobile-chromium.png` by Chromium. Mobile emulation is not a measured physical iOS device.
