import test from 'node:test'
import assert from 'node:assert/strict'
import { ROAD_TRIP, advanceCheckpoints, upcomingCheckpoint } from './checkpoints.ts'

const point = (x:number,z:number)=>({x,z})

test('014 exactly three reachable in-order fictional road gates',()=>{
  assert.equal(ROAD_TRIP.length,3)
  assert.deepEqual(ROAD_TRIP.map(g=>g.z),[-42,-105,-190])
  assert.ok(ROAD_TRIP.every(g=>g.x===1.75 && g.radius===3 && g.label.length>0))
  assert.equal(upcomingCheckpoint(0)?.id,'gate-1')
  assert.equal(upcomingCheckpoint(3),null)
})

test('014 first gate awarded once on an actual segment crossing',()=>{
  assert.equal(advanceCheckpoints(point(1.75,-20),point(1.75,-50),0),1)
  assert.equal(advanceCheckpoints(point(1.75,-50),point(1.75,-52),1),1)
  assert.equal(advanceCheckpoints(point(1.75,-50),point(1.75,-50),1),1)
})

test('014 crossing misses gate if too far to one side and cannot skip order',()=>{
  assert.equal(advanceCheckpoints(point(12,-20),point(12,-205),0),0)
  assert.equal(advanceCheckpoints(point(1.75,-110),point(1.75,-190),0),0,
    'not entitled to gate 2 without crossing gate 1')
})

test('014 large segment crossing every gate awards each in sequence',()=>{
  assert.equal(advanceCheckpoints(point(1.75,0),point(1.75,-230),0),3)
  assert.equal(advanceCheckpoints(point(1.75,-190),point(1.75,0),3),3)
})

test('014 invalid game progress and coordinates rejected',()=>{
  assert.throws(()=>advanceCheckpoints(point(0,0),point(NaN,-42),0),RangeError)
  assert.throws(()=>advanceCheckpoints(point(0,0),point(0,0),-1),RangeError)
  assert.throws(()=>advanceCheckpoints(point(0,0),point(0,0),4),RangeError)
})
