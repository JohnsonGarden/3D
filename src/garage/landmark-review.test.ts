import test from 'node:test'
import assert from 'node:assert/strict'
import { LANDMARK_CRITERIA, emptyLandmarkChecks, evaluateLandmarkReview } from './landmark-review.ts'

test('021 five guardian criteria are unchecked by default', () => {
  assert.equal(LANDMARK_CRITERIA.length, 5)
  assert.equal(new Set(LANDMARK_CRITERIA.map(item => item.id)).size, 5)
  const checks = emptyLandmarkChecks()
  assert.equal(Object.keys(checks).length, 5)
  assert.equal(evaluateLandmarkReview(checks, false).checkedCount, 0)
})

test('021 four manual checks require a separate confirmation', () => {
  const ids = LANDMARK_CRITERIA.map(item => item.id)
  for (let n = 0; n <= 5; n++) {
    const checks = emptyLandmarkChecks()
    for (let i = 0; i < n; i++) checks[ids[i]] = true
    const result = evaluateLandmarkReview(checks, false)
    assert.equal(result.checkedCount, n)
    assert.equal(result.canConfirm, n >= 4)
    assert.equal(result.confirmed, false)
    assert.equal(evaluateLandmarkReview(checks, true).confirmed, n >= 4)
  }
})
