# 023 — Per-car world-scale handoff

FR-001 Given a guardian-measured toy, when choosing a target body width in metres, then derive body length, height, axle positions and tire diameter with one isotropic scale.

FR-002 Given invalid target width or invalid measurements, when calculating, then reject rather than invent dimensions.

FR-003 Given an explicit export, when downloading, then produce local metadata-only JSON and no image bytes, names, URLs or GLB data.

FR-004 Given photo or vehicle replacement, when returning, then reset the preview; never change saved GLB, sample collider or driving physics.

FR-005 Given an unknown tire diameter, when deriving, then preserve unknown as null rather than inferring wheel or drivetrain geometry.
