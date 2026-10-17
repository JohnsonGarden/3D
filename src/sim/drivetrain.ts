import { AXLES, DIFFERENTIAL_LOCKS, DRIVE_MODES, poweredAxleIndices } from './approved-profile.ts'
import type { DriveMode } from './approved-profile.ts'

export type DiffLock = typeof DIFFERENTIAL_LOCKS[number]
export type Surface = 'paved' | 'loose'
export type DrivetrainState = Readonly<{
  mode: DriveMode
  locks: Readonly<Record<DiffLock, boolean>>
  surface: Surface
}>
export type DrivetrainAction =
  | Readonly<{ type: 'toggle-drive' }>
  | Readonly<{ type: 'toggle-lock'; lock: DiffLock }>
  | Readonly<{ type: 'toggle-surface' }>

export const INITIAL_DRIVETRAIN: DrivetrainState = Object.freeze({
  mode: DRIVE_MODES.rearTandem,
  locks: Object.freeze({front: false, rear: false, center: false}),
  surface: 'paved'
})

export const tireLayout = AXLES

export function poweredAxles(state: Readonly<DrivetrainState>): number[] {
  return poweredAxleIndices(state.mode)
}

export function drivetrainReducer(
  state: Readonly<DrivetrainState>,
  action: DrivetrainAction
): DrivetrainState {
  if (action.type === 'toggle-drive') {
    return Object.freeze({...state, mode: state.mode === DRIVE_MODES.rearTandem
      ? DRIVE_MODES.allAxles : DRIVE_MODES.rearTandem})
  }
  if (action.type === 'toggle-surface') {
    return Object.freeze({...state, surface: state.surface === 'paved' ? 'loose' : 'paved'})
  }
  if (action.type === 'toggle-lock') {
    if (!DIFFERENTIAL_LOCKS.includes(action.lock)) {
      throw new RangeError('Unknown differential lock')
    }
    return Object.freeze({...state, locks: Object.freeze({
      ...state.locks,
      [action.lock]: !state.locks[action.lock]
    })})
  }
  throw new RangeError('Unsupported drivetrain action')
}

/**
 * Pedagogical traction proxy; never call this a force/torque solver.
 * Dry-road AWD & locking DO NOT increase power or speed.
 * On loose ground more powered axles/locks improve illustrative grip.
 */
export function tractionCoefficient(state: Readonly<DrivetrainState>): number {
  if (!['8x4','8x8'].includes(state.mode) ||
      !['paved','loose'].includes(state.surface) ||
      !DIFFERENTIAL_LOCKS.every(lock => typeof state.locks?.[lock] === 'boolean')) {
    throw new RangeError('Invalid drivetrain state')
  }
  if (state.surface === 'paved') return 1
  const all = state.mode === DRIVE_MODES.allAxles
  let grip = 0.42 + (all ? 0.23 : 0)
  if (state.locks.rear) grip += 0.08
  if (all && state.locks.front) grip += 0.07
  if (all && state.locks.center) grip += 0.07
  return Math.min(0.88, grip)
}

/**
 * Axle-1 and axle-2 angles are deliberate arcade steering proxies,
 * not Ackermann geometry or real suspension measurements.
 * Positive logical steer means right; Three.js mesh yaw uses NEGATIVE.
 */
export function axleSteerAngles(input: number): readonly [number, number, 0, 0] {
  if (!Number.isFinite(input)) throw new RangeError('Steering input must be finite')
  const s = Math.max(-1, Math.min(1, input))
  return [s * 0.40, s * 0.26, 0, 0]
}

export function effectiveSteerAngle(input: number): number {
  const [one, two] = axleSteerAngles(input)
  return one * 0.6 + two * 0.4
}
