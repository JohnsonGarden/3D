/**
 * Verified-by-parent dimensional landmarks for M1 reconstruction; input in cm.
 * V3 SIDE PROFILE ACCEPTANCE: external size/stance broadly approved, but this
 * is not a photo-faithful asset approval or a physics simulation.
 */
import { TRUCK_DIMENSIONS } from './truck-scale.ts'

export const TOY_PROFILE_CM = Object.freeze({
  cabLength: 4.8,
  chassisGroundClearance: 0.3,
  wheelArchTopTireGap: 0.1,
  wheelArchOpeningLength: 1.6,
  rearFairingLength: 1.6,
  rearFairingRise: 0.6
})

/** A diagram hypothesis, not a parent-confirmed final roof mesh. */
export const V3_UNVERIFIED_ROOF_INTERPRETATION_CM = Object.freeze({
  middleFlatLength: 1.6,
  frontDownslopeLength: 1.6,
  wheelArchTopHeightFromGround: 1.5
})

export const APPROVED_PROFILE_M = Object.freeze({
  cabLength: toWorld(TOY_PROFILE_CM.cabLength),
  chassisGroundClearance: toWorld(TOY_PROFILE_CM.chassisGroundClearance),
  wheelArchTopTireGap: toWorld(TOY_PROFILE_CM.wheelArchTopTireGap),
  wheelArchOpeningLength: toWorld(TOY_PROFILE_CM.wheelArchOpeningLength),
  rearFairingLength: toWorld(TOY_PROFILE_CM.rearFairingLength),
  rearFairingRise: toWorld(TOY_PROFILE_CM.rearFairingRise)
})

function toWorld(centimeters: number): number {
  return centimeters / 100 * TRUCK_DIMENSIONS.scaleFactor
}

export type AxleSpec = Readonly<{
  index: 1 | 2 | 3 | 4
  zFromBodyCenterM: number
  tiresPerSide: 1 | 2
  steerable: boolean
  frontDriveSelectable: boolean
  rearDrivePermanent: boolean
}>
/**
 * Geometry and selectable-drive rules are parent-confirmed.
 * No wheel steering angles, masses, friction or torque transfer are modeled.
 */
export const AXLES: readonly AxleSpec[] = Object.freeze(
  TRUCK_DIMENSIONS.axleLocalZFromBodyCenterM.map((z, i) => Object.freeze({
    index: (i + 1) as AxleSpec['index'],
    zFromBodyCenterM: z,
    tiresPerSide: (i === 0 ? 1 : 2) as AxleSpec['tiresPerSide'],
    steerable: i < 2,
    frontDriveSelectable: i < 2,
    rearDrivePermanent: i >= 2
  }))
)
export const DRIVE_MODES = Object.freeze({
  rearTandem: '8x4',
  allAxles: '8x8'
} as const)
export type DriveMode = typeof DRIVE_MODES[keyof typeof DRIVE_MODES]
export function poweredAxleIndices(mode: DriveMode): number[] {
  if (mode === DRIVE_MODES.allAxles) return [1, 2, 3, 4]
  if (mode === DRIVE_MODES.rearTandem) return [3, 4]
  throw new RangeError('Unsupported drive mode')
}
/** Front group / rear group / central lock: logical controls only at M0. */
export const DIFFERENTIAL_LOCKS = Object.freeze(['front', 'rear', 'center'] as const)
export const APPEARANCE_APPROVAL = Object.freeze({
  version: 'v3',
  externalProportions: 'accepted_for_progress',
  stance: 'accepted_for_progress',
  roofContours: 'needs_photo_review',
  legoPartGeometry: 'needs_photo_review',
  customGlb: 'not_created',
  collisionAndSuspension: 'not_implemented'
} as const)
