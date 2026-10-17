import test from 'node:test'
import assert from 'node:assert/strict'
import {
  advanceVehicle, INITIAL_VEHICLE, speedKmh, VEHICLE
} from './vehicle.ts'

const none = { throttle: 0, steer: 0, brake: false }

test('TDD: initial position and speed are zero', () => {
  assert.deepEqual(INITIAL_VEHICLE, { x: 1.75, z: 0, heading: 0, speed: 0 })
  assert.equal(speedKmh(INITIAL_VEHICLE), 0)
})

test('TDD: throttle drives forward along negative Z', () => {
  let s = { ...INITIAL_VEHICLE }
  for (let i = 0; i < 60; i++) s = advanceVehicle(s, { ...none, throttle: 1 }, 1 / 60)
  assert.ok(s.speed > 0)
  assert.ok(s.z < 0)
  assert.equal(s.x, 1.75)
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
  assert.ok(right.heading > 0 && right.x > moving.x)
  assert.ok(left.heading < 0 && left.x < moving.x)
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

test('physical truck sizes are derived from parent measurements', () => {
  assert.ok(Math.abs(VEHICLE.length - 10.4 / 3.1 * 2.5) < 1e-9)
  assert.equal(VEHICLE.width, 2.5)
  assert.ok(Math.abs(VEHICLE.height - 4.7 / 3.1 * 2.5) < 1e-9)
  assert.ok(Math.abs(VEHICLE.wheelDiameter - 1.4 / 3.1 * 2.5) < 1e-9)
  assert.ok(VEHICLE.wheelbase > 4 && VEHICLE.wheelbase < VEHICLE.length)
})

test('four-axle kinematic stand-in uses observed first-to-fourth axle span', () => {
  const expected = 6.4 / 3.1 * 2.5
  assert.ok(Math.abs(VEHICLE.wheelbase - expected) < 1e-9)
  assert.ok(Math.abs(VEHICLE.totalLength - 11.2 / 3.1 * 2.5) < 1e-9)
  assert.ok(Math.abs(VEHICLE.frontBumperProjection - 0.8 / 3.1 * 2.5) < 1e-9)
})

test('paved mode changes do not create fictional free acceleration', async () => {
  const { INITIAL_DRIVETRAIN, drivetrainReducer } = await import('./drivetrain.ts')
  const all = drivetrainReducer(INITIAL_DRIVETRAIN, {type:'toggle-drive'})
  const input = { ...none, throttle: 1, steer: 0.4 }
  assert.deepEqual(
    advanceVehicle(INITIAL_VEHICLE,input,1/60,INITIAL_DRIVETRAIN),
    advanceVehicle(INITIAL_VEHICLE,input,1/60,all)
  )
})

test('on illustrative loose surface AWD gains low-speed traction; locks remain bounded', async () => {
  const { INITIAL_DRIVETRAIN, drivetrainReducer } = await import('./drivetrain.ts')
  const loose = drivetrainReducer(INITIAL_DRIVETRAIN,{type:'toggle-surface'})
  const all = drivetrainReducer(loose,{type:'toggle-drive'})
  const locked = drivetrainReducer(all,{type:'toggle-lock',lock:'center'})
  const input = { ...none, throttle:1, steer:0 }
  const r = advanceVehicle(INITIAL_VEHICLE,input,1/60,loose)
  const a = advanceVehicle(INITIAL_VEHICLE,input,1/60,all)
  const l = advanceVehicle(INITIAL_VEHICLE,input,1/60,locked)
  assert.ok(r.speed < a.speed && a.speed < l.speed)
  assert.ok(l.speed <= VEHICLE.acceleration / 60)
})

test('backward-compatible default driving matches explicit 8x4 paved profile', async () => {
  const { INITIAL_DRIVETRAIN } = await import('./drivetrain.ts')
  const input = { ...none, throttle: 1, steer:0.7 }
  assert.deepEqual(
    advanceVehicle(INITIAL_VEHICLE,input,1/60),
    advanceVehicle(INITIAL_VEHICLE,input,1/60,INITIAL_DRIVETRAIN)
  )
})
