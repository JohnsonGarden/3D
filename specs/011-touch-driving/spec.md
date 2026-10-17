# 011 — Child-friendly touch driving controls

Status: proposed; verify on Chromium emulated touch first, real phones/tablets later.

## User story
A child opens the local 3D world on a touch-capable phone/tablet and immediately sees large press-and-hold acceleration, reverse, left/right steering and braking controls without a physical keyboard.

## Guardrails
- This is an alternative input device for the existing fixed-step deterministic kinematic driving model; no fabricated mechanical physics.
- At rest or after cancel, pointer loss, blur or entering garage, controls must return to neutral. No sticky throttle, runaway car, or blocked garage actions.
- Support simultaneous steering + acceleration/braking by distinct touches, keyboard compatibility, accessible names and no multi-touch double-counting.
- No new dependency, server, microphone, motion sensor permission, analytics, login or raw HEIC access.
- Mobile UI must not hide the car or reset/garage controls; keyboard help can be replaced by touch help on coarse screens.

## Requirements
### FR-001 Discoverable mobile input
Given a <=900px coarse-pointer viewport, when the world opens, then the child can see clearly named left/right, forward, reverse and brake buttons with >=54px hit targets. Fine-pointer desktop retains the keyboard-first HUD.

### FR-002 Composable press-and-hold actions
Given at least one active pointer, when acceleration and steer controls are held simultaneously, then the vehicle uses both intentions each fixed tick; releases are neutralized independently. Conflicting left/right or forward/reverse cancel one another, brake takes precedence.

### FR-003 Robust cancellation
Given the driver has a touch control held, when that pointer ends, is cancelled, loses capture, window blurs or garage opens, then it is no longer considered active. When garage closes, no previous touch causes acceleration.

### FR-004 Automated acceptance and backwards compatibility
Given CI, when tests run, then pure keyboard/pointer aggregation unit tests and a real Chromium mobile-emulation pointer-hold driving test pass. Existing keyboard, garage, export and drivetrain tests remain green.

## Non-goals
Gamepad support, tilt control, force feedback, native iOS application, physical tire forces, and performance benchmark claims on real mobile devices.
