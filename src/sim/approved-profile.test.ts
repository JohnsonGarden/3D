import test from 'node:test'
import assert from 'node:assert/strict'
import { TRUCK_DIMENSIONS } from './truck-scale.ts'
import {
  TOY_PROFILE_CM, APPROVED_PROFILE_M, V3_UNVERIFIED_ROOF_INTERPRETATION_CM,
  AXLES, DRIVE_MODES, poweredAxleIndices, DIFFERENTIAL_LOCKS, APPEARANCE_APPROVAL
} from './approved-profile.ts'

const near = (actual: number, expected: number) =>
  assert.ok(Math.abs(actual - expected) < 1e-9, `${actual} != ${expected}`)

test('v3 profile records revised 0.3 cm ground clearance, not superseded 0.6 cm', () => {
  assert.equal(TOY_PROFILE_CM.chassisGroundClearance, 0.3)
  near(APPROVED_PROFILE_M.chassisGroundClearance, 0.3 / 3.1 * 2.5)
  assert.equal(TOY_PROFILE_CM.cabLength, 4.8)
  near(APPROVED_PROFILE_M.cabLength, 4.8 / 3.1 * 2.5)
})

test('wheel arch, tire gap and rear fairing preserve one isotropic multiplier', () => {
  for (const key of ['wheelArchTopTireGap', 'wheelArchOpeningLength', 'rearFairingLength', 'rearFairingRise'] as const) {
    near(APPROVED_PROFILE_M[key], TOY_PROFILE_CM[key] / 100 * TRUCK_DIMENSIONS.scaleFactor)
  }
  assert.equal(TOY_PROFILE_CM.wheelArchTopTireGap, 0.1)
  assert.equal(V3_UNVERIFIED_ROOF_INTERPRETATION_CM.middleFlatLength, 1.6)
})

test('exactly four axle stations, fourteen tires and front-two steering', () => {
  assert.equal(AXLES.length, 4)
  assert.equal(AXLES.reduce((count, a) => count + 2 * a.tiresPerSide, 0), 14)
  assert.deepEqual(AXLES.map(a => a.steerable), [true, true, false, false])
  assert.deepEqual(AXLES.map(a => a.frontDriveSelectable), [true, true, false, false])
  assert.deepEqual(AXLES.map(a => a.rearDrivePermanent), [false, false, true, true])
  for (const [i, axle] of AXLES.entries()) {
    near(axle.zFromBodyCenterM, TRUCK_DIMENSIONS.axleLocalZFromBodyCenterM[i])
  }
})

test('two confirmed powertrain modes and three logical diff-lock positions', () => {
  assert.deepEqual(poweredAxleIndices(DRIVE_MODES.rearTandem), [3, 4])
  assert.deepEqual(poweredAxleIndices(DRIVE_MODES.allAxles), [1, 2, 3, 4])
  assert.deepEqual(DIFFERENTIAL_LOCKS, ['front', 'rear', 'center'])
  assert.throws(() => poweredAxleIndices('bogus' as '8x4'), RangeError)
})

test('v3 acceptance is a non-blocking profile gate, not authentic asset signoff', () => {
  assert.equal(APPEARANCE_APPROVAL.externalProportions, 'accepted_for_progress')
  assert.equal(APPEARANCE_APPROVAL.stance, 'accepted_for_progress')
  assert.equal(APPEARANCE_APPROVAL.customGlb, 'not_created')
  assert.equal(APPEARANCE_APPROVAL.roofContours, 'needs_photo_review')
})
