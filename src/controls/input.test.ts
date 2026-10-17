import test from 'node:test'
import assert from 'node:assert/strict'
import { resolveDriverInput } from './input.ts'

test('011 keyboard and touch input merge without dropping either source', () => {
  assert.deepEqual(resolveDriverInput(new Set(['w','a']), new Set(['right'])),
    {throttle:1,steer:0,brake:false})
  assert.deepEqual(resolveDriverInput(new Set(['arrowup']), new Set(['left'])),
    {throttle:1,steer:-1,brake:false})
  assert.deepEqual(resolveDriverInput(new Set(), new Set(['accelerate','right'])),
    {throttle:1,steer:1,brake:false})
})

test('011 conflicting actions cancel, brake remains available', () => {
  assert.deepEqual(resolveDriverInput(new Set(['w','s']), new Set(['left','right'])),
    {throttle:0,steer:0,brake:false})
  assert.deepEqual(resolveDriverInput(new Set(['arrowup']), new Set(['reverse','brake'])),
    {throttle:0,steer:0,brake:true})
  assert.deepEqual(resolveDriverInput(new Set([' ']), new Set(['accelerate'])),
    {throttle:1,steer:0,brake:true})
})

test('011 released/cancelled pointers resolve to neutral without sticky throttle', () => {
  const pointerActions = new Map<number, 'accelerate'|'left'>()
  pointerActions.set(21,'accelerate')
  pointerActions.set(23,'left')
  const read=()=>resolveDriverInput(new Set(),new Set(pointerActions.values()))
  assert.deepEqual(read(), {throttle:1,steer:-1,brake:false})
  pointerActions.delete(23)
  assert.deepEqual(read(), {throttle:1,steer:0,brake:false})
  pointerActions.delete(21)
  assert.deepEqual(read(), {throttle:0,steer:0,brake:false})
})
