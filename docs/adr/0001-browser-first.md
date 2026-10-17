# ADR-0001 — Browser-first modular 3D vertical slice

Status: accepted for M0 (2026-10-17). Revisit after performance/child usability studies.

## Decision
Start browser-first with Vite + TypeScript + React Three Fiber / Three.js. Put vehicle kinematics into a pure module; wrap WebGL scene behind one world module. Use GLB for validated assets. Keep uploads session-local. Adopt Spec Kit-shaped SDD artifacts and test-first, not a wholesale dependency on Spec Kit CLI; optional future CLI integration should preserve existing contracts.

## Considered
- Unity/Godot: strong richer physics/editor/content pipelines, heavier initial toolchain and less frictionless click-to-play browser sharing.
- Vanilla Three.js: smallest deps, but application UI/state composition and maintainability less convenient for this experience.
- Full photogrammetry first: high uncertainty and no playable feedback before mesh is accepted.

## Consequences
+ A shareable web prototype, unit-testable pure code, no initial backend.
- Simplified M0 car behavior isn't yet rigid-body vehicle simulation.
- Browser/WebGL constraints; realistic physics/perception may later justify physics-specialized engine or hybrid.
- User GLB is **not** generated from HEIC; LA-looking streets are procedural placeholders.
