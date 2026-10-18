import test from 'node:test'
import assert from 'node:assert/strict'
import { reviewModelProportions } from './model-proportions.ts'

const toy = {lengthCm:12,widthCm:6,heightCm:6}

test('020 matching measured and GLB ratios give only an advisory',()=>{
 const result=reviewModelProportions(toy,{x:1,y:1,z:2})
 assert.equal(result.toyLengthToWidth,2)
 assert.equal(result.modelLengthToWidth,2)
 assert.equal(result.toyHeightToWidth,1)
 assert.equal(result.modelHeightToWidth,1)
 assert.equal(result.lengthDifferencePct,0)
 assert.equal(result.heightDifferencePct,0)
 assert.equal(result.needsReview,false)
})

test('020 ratios beyond 10 percent are flagged',()=>{
 const r=reviewModelProportions({lengthCm:12,widthCm:6,heightCm:2},{x:1,y:1,z:2})
 assert.equal(r.lengthDifferencePct,0)
 assert.ok(r.heightDifferencePct>100)
 assert.equal(r.needsReview,true)
})

test('020 uniform GLB scaling preserves the review',()=>{
 const a=reviewModelProportions(toy,{x:1,y:1,z:2})
 const b=reviewModelProportions(toy,{x:20,y:20,z:40})
 assert.deepEqual(a,b)
})

test('020 invalid geometry or toy dimensions fail closed',()=>{
 for(const s of [{x:0,y:1,z:2},{x:1,y:NaN,z:2},{x:1,y:1,z:Infinity}])
  assert.throws(()=>reviewModelProportions(toy,s),RangeError)
 assert.throws(()=>reviewModelProportions({lengthCm:12,widthCm:0,heightCm:6},{x:1,y:1,z:2}),RangeError)
})
