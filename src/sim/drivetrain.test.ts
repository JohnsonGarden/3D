import test from 'node:test'
import assert from 'node:assert/strict'
import {
  INITIAL_DRIVETRAIN, drivetrainReducer, tractionCoefficient,
  axleSteerAngles, effectiveSteerAngle, poweredAxles, tireLayout
} from './drivetrain.ts'

test('first drive uses two rear powered axles, 14 tires and double-front steering', () => {
  assert.equal(INITIAL_DRIVETRAIN.mode, '8x4')
  assert.equal(INITIAL_DRIVETRAIN.surface, 'paved')
  assert.deepEqual(INITIAL_DRIVETRAIN.locks, { front: false, rear: false, center: false })
  assert.deepEqual(poweredAxles(INITIAL_DRIVETRAIN), [3, 4])
  assert.deepEqual(tireLayout.map(a => a.tiresPerSide * 2), [2, 4, 4, 4])
  assert.deepEqual(tireLayout.map(a => a.steerable), [true, true, false, false])
})

test('Q-equivalent drive switch is reversible, powers all four and does not edit locks', () => {
  const all = drivetrainReducer(INITIAL_DRIVETRAIN, {type: 'toggle-drive'})
  assert.equal(all.mode, '8x8')
  assert.deepEqual(poweredAxles(all), [1, 2, 3, 4])
  assert.deepEqual(all.locks, INITIAL_DRIVETRAIN.locks)
  assert.deepEqual(drivetrainReducer(all, {type:'toggle-drive'}), INITIAL_DRIVETRAIN)
})

test('diff lock 1,2,3 are independently reversible logical states', () => {
  const front = drivetrainReducer(INITIAL_DRIVETRAIN, {type: 'toggle-lock', lock:'front'})
  const rear = drivetrainReducer(front, {type: 'toggle-lock', lock:'rear'})
  const center = drivetrainReducer(rear, {type: 'toggle-lock', lock:'center'})
  assert.deepEqual(center.locks, {front: true, rear: true, center: true})
  assert.deepEqual(drivetrainReducer(center, {type:'toggle-lock',lock:'front'}).locks, {
    front:false, rear:true, center:true
  })
  assert.deepEqual(INITIAL_DRIVETRAIN.locks, {front:false,rear:false,center:false})
})

test('steering angles: both front axles turn in same direction, rear axle angles are zero', () => {
  for (const input of [-1, -0.3, 0, 0.75, 1]) {
    const angles = axleSteerAngles(input)
    assert.equal(angles.length, 4)
    assert.equal(angles[2], 0)
    assert.equal(angles[3], 0)
    if (input !== 0) {
      assert.ok(angles[0] * input > 0)
      assert.ok(angles[1] * input > 0)
      assert.ok(Math.abs(angles[0]) > Math.abs(angles[1]))
      assert.ok(effectiveSteerAngle(input) * input > 0)
    }
  }
  assert.deepEqual(axleSteerAngles(500), axleSteerAngles(1))
  assert.throws(() => axleSteerAngles(Number.NaN), RangeError)
})

test('paved asphalt has same traction for 8x4/8x8 and locks; loose ground favors more driven axles', () => {
  const base = INITIAL_DRIVETRAIN
  const awd = drivetrainReducer(base, {type:'toggle-drive'})
  assert.equal(tractionCoefficient(base), 1)
  assert.equal(tractionCoefficient(awd), 1)
  const looseRear = drivetrainReducer(base, {type:'toggle-surface'})
  const looseAll = drivetrainReducer(awd, {type:'toggle-surface'})
  assert.equal(looseRear.surface, 'loose')
  assert.ok(tractionCoefficient(looseRear) < tractionCoefficient(looseAll))
  const locked = drivetrainReducer(looseAll, {type:'toggle-lock',lock:'center'})
  assert.ok(tractionCoefficient(locked) > tractionCoefficient(looseAll))
  for (const state of [base,awd,looseRear,looseAll,locked]) {
    assert.ok(tractionCoefficient(state) > 0 && tractionCoefficient(state) <= 1)
  }
  assert.deepEqual(drivetrainReducer(looseRear, {type:'toggle-surface'}),base)
})

test('invalid runtime drivetrain data fails bounded safety checks', () => {
  assert.throws(() => tractionCoefficient({
    ...INITIAL_DRIVETRAIN, mode:'8x16'
  } as never), RangeError)
  assert.throws(() => drivetrainReducer(INITIAL_DRIVETRAIN, {
    type:'toggle-lock', lock:'bogus'
  } as never), RangeError)
})
