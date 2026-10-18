# 022 — Measured wheel layout handoff

Branch: feat/022-wheel-layout-handoff, stacked on 021.

A guardian can manually enter the axle-center positions from the toy body's front edge, tire count and optional tire diameter, then explicitly export a small versioned JSON. The output records centimetres and manual provenance, without photo bytes, filenames, model bytes or browser object URLs. It does not modify the saved GLB or driving physics.

RED unit-test evidence: https://github.com/JohnsonGarden/3D/actions/runs/39104853073 (missing validator module).

Manual review on the original toy and Mac/Safari remains pending. Automatic photo reconstruction, wheel rigging, per-car applied play scale, realistic car pairing and actual city maps remain unimplemented.
