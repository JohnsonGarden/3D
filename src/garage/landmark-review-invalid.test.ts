import test from 'node:test'
import assert from 'node:assert/strict'
import { emptyLandmarkChecks, evaluateLandmarkReview } from './landmark-review.ts'

test('021 rejects malformed checklist and confirmation at runtime',()=>{
  const checks=emptyLandmarkChecks()
  assert.throws(()=>evaluateLandmarkReview({...checks,extra:true} as never,true),RangeError)
  assert.throws(()=>evaluateLandmarkReview({...checks,wheels:'yes'} as never,true),RangeError)
  assert.throws(()=>evaluateLandmarkReview(checks,1 as never),RangeError)
})
