# 014 — First child-friendly road trip milestones

Status: specified, not yet fully verified in CI.

## Story
A child can see an achievable in-world objective instead of driving along a road without direction: drive through three brightly visible gates on the fictional straight route, receive success progress, and intentionally restart the journey.

## Requirements
### FR-001 Visible route objectives
Given a new scene, when the child begins driving, then three numbered colored checkpoints are visible on the road ahead. A readable bar displays 0/3 and the name of the next checkpoint; no real-world Los Angeles location claim or account is involved.

### FR-002 Deterministic crossing
Given a segment between old/new fixed-timestep X/Z positions, when the segment crosses the next checkpoint radius, then progress increments exactly once, never skips a checkpoint or awards progress outside the radius. If one large valid segment spans several gates, process them in order. Distances are in meters. Invalid values are rejected.

### FR-003 Player control and safety
Given partial or full completion, when a gate is reached then the bar updates without per-frame React churn, with a child-readable final completed message at 3/3. R resets physical vehicle only, retaining in-session progress; "重新开始旅程" resets both checkpoint progress and the truck to spawn. The garage, GLB selection, touch, collision and keyboard remain functional.

### FR-004 Evidence and limits
Given Node/Chromium tests, when run, then test crossing, sequencing, out-of-radius, restart, and actual driving into the first gate, alongside all earlier browser regressions. The three checkpoints form a simple introductory route, **not** an accurate geographical map or a complete open world.

## Non-goals
Persistent cross-browser adventure saves, traffic signals, licensing of maps/streets, route finding, rewards economy, NPCs, multiplayer, precise GPS, dynamic chunk streaming, or HEIC reconstruction.
