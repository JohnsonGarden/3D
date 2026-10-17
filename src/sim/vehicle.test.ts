import test from 'node:test'
import assert from 'node:assert/strict'
import {
  advanceVehicle, INITIAL_VEHICLE, speedKmh, VEHICLE
} from './vehicle.ts'

const none = { throttle: 0, steer: 0, brake: false }

test('TDD: initial position and speed are zero', () => {
  assert.deepEqual(INITIAL_VEHICLE, { x: 0, z: 0, heading: 0, speed: 0 })
  assert.equal(speedKmh(INITIAL_VEHICLE), 0)
})

test('TDD: throttle drives forward along negative Z', () => {
  let s = { ...INITIAL_VEHICLE }
  for (let i = 0; i < 60; i++) s = advanceVehicle(s, { ...none, throttle: 1 }, 1 / 60)
  assert.ok(s.speed > 0)
  assert.ok(s.z < 0)
  assert.equal(s.x, 0)
})

test('TDD: forward and reverse speeds are bounded even after long driving', () => {
  let s = { ...INITIAL_VEHICLE }
  for (let i = 0; i < 3000; i++) s = advanceVehicle(s, { ...none, throttle: 50 }, 1 / 60)
  assert.ok(s.speed <= VEHICLE.maxForward)
  s = { ...INITIAL_VEHICLE }
  for (let i = 0; i < 3000; i++) s = advanceVehicle(s, { ...none, throttle: -50 }, 1 / 60)
  assert.ok(s.speed >= -VEHICLE.maxReverse)
})

test('TDD: brake moves toward stop without reversing speed', () => {
  const moving = { ...INITIAL_VEHICLE, speed: 8 }
  let s = moving
  for (let i = 0; i < 60; i++) s = advanceVehicle(s, { ...none, brake: true }, 1 / 60)
  assert.equal(s.speed, 0)
})

test('TDD: steering is directionally correct and stationary steering has no yaw', () => {
  const still = advanceVehicle(INITIAL_VEHICLE, { ...none, steer: 1 }, 1 / 60)
  assert.equal(still.heading, 0)
  const moving = { ...INITIAL_VEHICLE, speed: 5 }
  const right = advanceVehicle(moving, { ...none, steer: 1 }, 1 / 60)
  const left = advanceVehicle(moving, { ...none, steer: -1 }, 1 / 60)
  assert.ok(right.heading > 0 && right.x > 0)
  assert.ok(left.heading < 0 && left.x < 0)
})

test('TDD: coasting slows without drifting through zero', () => {
  const s = advanceVehicle({ ...INITIAL_VEHICLE, speed: 0.01 }, none, 1 / 60)
  assert.equal(s.speed, 0)
})

test('TDD: frame delta is capped to protect simulation from long tab pauses', () => {
  const input = { ...none, throttle: 1 }
  assert.deepEqual(
    advanceVehicle(INITIAL_VEHICLE, input, 10),
    advanceVehicle(INITIAL_VEHICLE, input, VEHICLE.maxStep)
  )
})

test('TDD: invalid numbers are rejected, not propagated into camera/physics', () => {
  assert.throws(() => advanceVehicle(INITIAL_VEHICLE, none, Number.NaN), RangeError)
  assert.throws(() => advanceVehicle(INITIAL_VEHICLE, none, -1), RangeError)
  assert.throws(() => advanceVehicle(INITIAL_VEHICLE, { ...none, steer: Infinity }, 1 / 60), RangeError)
  assert.throws(() => advanceVehicle({ ...INITIAL_VEHICLE, x: NaN }, none, 1 / 60), RangeError)
})
