# 022 — Measured wheel layout handoff

Branch: feat/022-wheel-layout-handoff, stacked on 021.

A guardian can manually enter the axle-center positions from the toy body's front edge, tire count and optional tire diameter, then explicitly export a small versioned JSON. The output records centimetres and manual provenance, without photo bytes, filenames, model bytes or browser object URLs. It does not modify the saved GLB or driving physics.

RED unit-test evidence: https://github.com/JohnsonGarden/3D/actions/runs/39104853073 (missing validator module).

Manual review on the original toy and Mac/Safari remains pending. Automatic photo reconstruction, wheel rigging, per-car applied play scale, realistic car pairing and actual city maps remain unimplemented.

GREEN: https://github.com/JohnsonGarden/3D/actions/runs/39105145050 — 20 SDD packets, 91/91 Node, 17/17 deploy, TypeScript/Vite build, 29/29 Chromium first-pass (no retries). The previous Chromium run 39104963048 caught a mistaken test expectation: replacing photos also clears physical dimensions, so the form intentionally disappears until dimensions are re-entered. The acceptance test now verifies that actual behavior.
