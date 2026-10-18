# 024 — Explicit session-only visual scale for an imported GLB

FR-001 Given a selected saved GLB, guardian-entered toy dimensions and an explicit target world body width, when the guardian confirms the visual scale, then apply **one isotropic multiplier** to the rendered imported model. Keep its X-width/Y-height/Z-length ratios and ground alignment unchanged. The target is based on the GLB X-axis bounding width, which can include mirrors/protrusions; do not claim exact body-width alignment.

FR-002 Given a missing GLB, incomplete/invalid measurements, malformed target width, or unreviewed proportions, when applying, then reject the action and retain the prior visual state. Display that this is a visual preview only, not authentic reconstruction or verified body geometry.

FR-003 Given the selected GLB, photo set or toy/axle measurements change, when the user continues, then clear any previously applied visual scale and revert to the legacy 2.50 m imported-GLB default. Explicit revert must work without deleting or modifying any saved GLB.

FR-004 Given an accepted session-only scale, when driving or returning to the garage, then preserve the visual preview for that unchanged selection; never change vehicle physics, collisions, wheel rigging, checkpoint state or garage IndexedDB bytes.

FR-005 Given local photos, HEIC originals and an imported GLB, when reviewing/applying scale, then no photo/model bytes, filenames or EXIF leave the browser; no paid AI API or automatic photo reconstruction is used. No main merge or destructive garage migration.
