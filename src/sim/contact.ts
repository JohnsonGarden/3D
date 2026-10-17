import { VEHICLE } from './vehicle.ts'
import type { VehicleState } from './vehicle.ts'
import type { SceneryObstacle } from '../world/city-layout.ts'

const HALF_WIDTH = VEHICLE.width / 2
// Asymmetric measured footprint: extra 0.645m only in front of body.
const FRONT = VEHICLE.length / 2 + VEHICLE.frontBumperProjection
const REAR = VEHICLE.length / 2
const HALF_LENGTH = (FRONT + REAR) / 2
const CENTER_FORWARD = (FRONT - REAR) / 2
const SWEEP_STEP_M = 0.25
const SWEEP_STEP_RAD = 0.025
const MAX_SWEEP_STEPS = 128

function validState(s: Readonly<VehicleState>): boolean {
  return [s.x, s.z, s.heading, s.speed].every(Number.isFinite)
}

/**
 * Separating Axis Test in the X/Z ground plane. No verticality, torque or
 * suspension: this is intentionally an arcade OBB contact proxy.
 */
export function intersectsScenery(
  state: Readonly<VehicleState>,
  obstacles: readonly SceneryObstacle[]
): boolean {
  if (!validState(state)) throw new RangeError('Nonfinite vehicle contact state')
  const c = Math.cos(state.heading)
  const s = Math.sin(state.heading)
  // Positive heading moves -Z forward vector toward +X.
  const frontX = s, frontZ = -c
  const rightX = c, rightZ = s
  const centerX = state.x + frontX * CENTER_FORWARD
  const centerZ = state.z + frontZ * CENTER_FORWARD
  const axes: readonly [number, number][] = [
    [1, 0], [0, 1], [rightX, rightZ], [frontX, frontZ]
  ]
  for (const obstacle of obstacles) {
    if (![obstacle.x, obstacle.z, obstacle.width, obstacle.depth].every(Number.isFinite) ||
        obstacle.width <= 0 || obstacle.depth <= 0) {
      throw new RangeError('Invalid scenery footprint')
    }
    const dx = centerX - obstacle.x
    const dz = centerZ - obstacle.z
    const hx = obstacle.width / 2
    const hz = obstacle.depth / 2
    let separated = false
    for (const [ax, az] of axes) {
      const separation = Math.abs(dx * ax + dz * az)
      const truckRadius =
        HALF_WIDTH * Math.abs(rightX * ax + rightZ * az) +
        HALF_LENGTH * Math.abs(frontX * ax + frontZ * az)
      const obstacleRadius = hx * Math.abs(ax) + hz * Math.abs(az)
      if (separation > truckRadius + obstacleRadius) {
        separated = true
        break
      }
    }
    if (!separated) return true
  }
  return false
}

export type ContactResolution = Readonly<{ state: VehicleState; hit: boolean }>

function interpolate(
  start: Readonly<VehicleState>,
  end: Readonly<VehicleState>,
  ratio: number
): VehicleState {
  return {
    x: start.x + (end.x - start.x) * ratio,
    z: start.z + (end.z - start.z) * ratio,
    heading: start.heading + (end.heading - start.heading) * ratio,
    speed: start.speed + (end.speed - start.speed) * ratio
  }
}

/**
 * Sweep a single already-bounded fixed-step kinematic transition.
 * No collision: return the exact proposed state, no rounding drift.
 * Collision: binary-refine the last non-overlapping pose, zero speed.
 */
export function resolveSceneryContact(
  current: Readonly<VehicleState>,
  proposed: Readonly<VehicleState>,
  obstacles: readonly SceneryObstacle[]
): ContactResolution {
  if (!validState(current) || !validState(proposed)) {
    throw new RangeError('Contact transition requires finite vehicle states')
  }
  if (!obstacles.length) return { state: { ...proposed }, hit: false }
  if (intersectsScenery(current, obstacles)) {
    return { state: { ...current, speed: 0 }, hit: true }
  }
  const travel = Math.hypot(proposed.x - current.x, proposed.z - current.z)
  const turn = Math.abs(proposed.heading - current.heading)
  const rawSteps = Math.max(1, Math.ceil(travel / SWEEP_STEP_M),
    Math.ceil(turn / SWEEP_STEP_RAD))
  if (rawSteps > MAX_SWEEP_STEPS) {
    throw new RangeError('Contact sweep exceeds fixed-step motion budget')
  }
  let previousFraction = 0
  for (let i = 1; i <= rawSteps; i++) {
    const fraction = i / rawSteps
    const candidate = interpolate(current, proposed, fraction)
    if (intersectsScenery(candidate, obstacles)) {
      let safe = previousFraction
      let blocked = fraction
      for (let n = 0; n < 14; n++) {
        const middle = (safe + blocked) / 2
        if (intersectsScenery(interpolate(current, proposed, middle), obstacles)) blocked = middle
        else safe = middle
      }
      return { state: { ...interpolate(current, proposed, safe), speed: 0 }, hit: true }
    }
    previousFraction = fraction
  }
  return { state: { ...proposed }, hit: false }
}
