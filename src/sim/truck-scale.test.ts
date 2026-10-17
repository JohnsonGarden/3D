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
    tireDiameter: 1.4, frontBumperProjection: null
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
  assert.equal(c.frontBumperProjectionM, null)
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
