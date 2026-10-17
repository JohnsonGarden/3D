import test from 'node:test'
import assert from 'node:assert/strict'
import {
  TOY_TRUCK_CM, TARGET_TRUCK_WIDTH_M, TRUCK_DIMENSIONS,
  calibrateTruck, scaleImportedModelByWidth
} from './truck-scale.ts'

const near = (a: number, b: number) => assert.ok(Math.abs(a - b) < 1e-9, a + ' vs ' + b)

test('RED/FR-001: measurements are stored in cm without inventing front bumper', () => {
  assert.deepEqual(TOY_TRUCK_CM, {
    bodyLength: 10.4, bodyWidth: 3.1, cabHighestPoint: 4.7,
    tireDiameter: 1.4, frontBumperProjection: 0.8,
    frontAxleOffset: 2.4, axleSpacing: [3.2, 1.6, 1.6], rearAxleOffset: 1.6
  })
  near(TARGET_TRUCK_WIDTH_M, 2.5)
})

test('RED/FR-001: single factor yields measured real-world dimensions', () => {
  const c = calibrateTruck(TOY_TRUCK_CM, TARGET_TRUCK_WIDTH_M)
  near(c.scaleFactor, 2.5 / .031)
  near(c.bodyLengthM, 10.4 / 3.1 * 2.5)
  near(c.bodyWidthM, 2.5)
  near(c.cabHighestPointM, 4.7 / 3.1 * 2.5)
  near(c.tireDiameterM, 1.4 / 3.1 * 2.5)
  near(c.frontBumperProjectionM, .8 / 3.1 * 2.5)
  near(c.totalLengthWithBumperM, 11.2 / 3.1 * 2.5)
  assert.deepEqual(c, TRUCK_DIMENSIONS)
})

test('RED/FR-001: dimensionless ratios remain invariant (no stretching)', () => {
  near(TRUCK_DIMENSIONS.bodyLengthM / TRUCK_DIMENSIONS.bodyWidthM, 10.4 / 3.1)
  near(TRUCK_DIMENSIONS.cabHighestPointM / TRUCK_DIMENSIONS.bodyWidthM, 4.7 / 3.1)
  near(TRUCK_DIMENSIONS.tireDiameterM / TRUCK_DIMENSIONS.bodyWidthM, 1.4 / 3.1)
})

test('RED/FR-003: imported arbitrary-unit mesh is uniformly width-calibrated', () => {
  const c = scaleImportedModelByWidth({ x: .031, y: .047, z: .104 })
  near(c.scaleFactor, 2.5 / .031)
  near(c.worldWidthM, 2.5)
  near(c.worldHeightM, TRUCK_DIMENSIONS.cabHighestPointM)
  near(c.worldLengthM, TRUCK_DIMENSIONS.bodyLengthM)
})

test('RED/FR-003: reject empty, zero width, NaN or absurd imported model dimensions', () => {
  for (const size of [
    { x: 0, y: 1, z: 3 },
    { x: -1, y: 1, z: 2 },
    { x: 1, y: 0, z: 3 },
    { x: NaN, y: 1, z: 3 },
    { x: 1, y: 1, z: Infinity },
    { x: 1, y: 1, z: 3000 }
  ]) assert.throws(() => scaleImportedModelByWidth(size), RangeError)
})

test('RED/FR-002: truck fits a nominal 3.5m lane with 0.5m each side', () => {
  near(TRUCK_DIMENSIONS.laneWidthM, 3.5)
  near((TRUCK_DIMENSIONS.laneWidthM - TRUCK_DIMENSIONS.bodyWidthM) / 2, 0.5)
})

test('FR-006: four axle centers follow all user-measured intervals from front body', () => {
  const c = TRUCK_DIMENSIONS
  assert.equal(c.axleFromFrontM.length, 4)
  for (const [i, cm] of [2.4, 5.6, 7.2, 8.8].entries()) {
    near(c.axleFromFrontM[i], cm / 3.1 * 2.5)
    near(c.axleLocalZFromBodyCenterM[i], (cm - 10.4 / 2) / 3.1 * 2.5)
  }
  for (const [i, cm] of [3.2, 1.6, 1.6].entries()) {
    near(c.axleSpacingM[i], cm / 3.1 * 2.5)
    near(c.axleFromFrontM[i + 1] - c.axleFromFrontM[i], c.axleSpacingM[i])
  }
  near(c.firstToFourthAxleM, 6.4 / 3.1 * 2.5)
  near(c.rearAxleOffsetM, 1.6 / 3.1 * 2.5)
  near(c.frontBumperProjectionM, 0.8 / 3.1 * 2.5)
  near(c.totalLengthWithBumperM, 11.2 / 3.1 * 2.5)
  near(c.bodyLengthM + c.frontBumperProjectionM, c.totalLengthWithBumperM)
})

test('FR-006: reject axle data that does not close against observed body length', () => {
  assert.throws(() => calibrateTruck({
    ...TOY_TRUCK_CM, rearAxleOffset: 2.0
  }, 2.5), RangeError)
  assert.throws(() => calibrateTruck({
    ...TOY_TRUCK_CM, axleSpacing: [3.2, 0, 1.6]
  }, 2.5), RangeError)
  assert.throws(() => calibrateTruck({
    ...TOY_TRUCK_CM, frontAxleOffset: NaN
  }, 2.5), RangeError)
})
