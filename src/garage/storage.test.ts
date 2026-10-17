import test from 'node:test'
import assert from 'node:assert/strict'
import {GARAGE_LIMIT, GARAGE_DATABASE, GARAGE_LIMIT as MAX_CARS,
  GarageLimitError,validateGarageCandidate} from './storage.ts'

test('garage v1 has a dedicated browser origin namespace and six-vehicle cap',()=>{
  assert.equal(GARAGE_DATABASE, 'brickworld-garage-v1')
  assert.equal(GARAGE_LIMIT, 6)
  assert.equal(MAX_CARS,6)
})
test('garage candidate allows valid GLB name, positive local size, and available slot',()=>{
  assert.doesNotThrow(()=>validateGarageCandidate(0,new ArrayBuffer(1024),'孩子的卡车.glb'))
  assert.doesNotThrow(()=>validateGarageCandidate(5,new ArrayBuffer(20), 'a.GLB'))
})
test('garage rejects seventh car before opening any other file slots',()=>{
  assert.throws(()=>validateGarageCandidate(6,new ArrayBuffer(20),'truck.glb'),GarageLimitError)
  assert.throws(()=>validateGarageCandidate(9,new ArrayBuffer(20),'truck.glb'),GarageLimitError)
})
test('garage enforces bounded names, byte sizes and count',()=>{
  assert.throws(()=>validateGarageCandidate(-1,new ArrayBuffer(20),'a.glb'),RangeError)
  assert.throws(()=>validateGarageCandidate(0,new ArrayBuffer(0),'a.glb'),RangeError)
  assert.throws(()=>validateGarageCandidate(0,new ArrayBuffer(20),'a.zip'),RangeError)
  assert.throws(()=>validateGarageCandidate(0,new ArrayBuffer(20),'x'.repeat(185)+'.glb'),RangeError)
  assert.throws(()=>validateGarageCandidate(0,new ArrayBuffer(20*1024*1024+1),'a.glb'),RangeError)
})
