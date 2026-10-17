# 001 — Implementation plan

## Minimal architecture
React shell for input hints, garage, file/audio selectors. R3F Canvas scene: ground, lanes, sidewalks, reusable boxes/trees and placeholder brick car. Fixed-timestep pure `advanceVehicle` with clamp, speed bounds and position; World owns mutable ref and interpolated chase camera. As gameplay demands contacts, introduce Rapier behind adapter and ADR update.

## Sequence
1. Codify constitution, spec/test matrix and CI; start simulation pure tests (RED).
2. Vehicle model with acceleration, braking, reverse cap, steering and finite bounds (GREEN).
3. R3F scene plus camera and responsive keyboard controls; no frame-loop React setState.
4. Garage overlay and local GLB import, local BGM with explicit controls.
5. Playwright first-drive and garage smoke; TS build and CI.
6. Human browser performance/visual/scale checks; record evidence, fix highest impact.

## Data boundaries
File input creates browser object URLs only after checking size/type. Cleanup URLs and geometry on replacement. GLB loads only in memory. Six source HEIC assets remain untouched and need separate M1 pipeline.

## Major risks
Headless WebGL may fail in CI; test accessible DOM controls and error path. Asset axes can be wrong; provide manual orientation validation before persistent import. Visuals are placeholder. Simplified acceleration not physical tire simulation.

## Verification commands
`npm run check:spec`, `npm test`, `npm run build`, `npm run test:e2e`. Manual 3D checklist in test-matrix. No performance result claimed until actual browser instrumentation.
