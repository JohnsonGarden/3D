import test from 'node:test'
import assert from 'node:assert/strict'
import { tickFixed } from './fixed-step.ts'

test('fixed simulation stepping is independent of render cadence', () => {
  let a = 0
  let count = 0
  for (let i = 0; i < 10; i++) {
    a = tickFixed(a, 1 / 30, 1 / 60, 6, () => { count++ })
  }
  assert.equal(count, 20)
  assert.ok(a < 1 / 60)
})

test('lag spike caps catch-up and never runs unbounded steps', () => {
  let count = 0
  const tail = tickFixed(0, 8, 1 / 60, 6, () => { count++ })
  assert.equal(count, 6)
  assert.ok(tail >= 0 && tail < 1 / 60)
})

test('invalid timestep is rejected', () => {
  assert.throws(() => tickFixed(0, -1, 1 / 60, 6, () => {}), RangeError)
})
