import test from 'node:test'
import assert from 'node:assert/strict'
import { tinyTruckGlb } from '../../tests/e2e/tiny-glb.fixture.ts'
import { prepareGarageExport, safeGarageDownloadName } from './export.ts'

test('010 safe export filename keeps Chinese and strips path/control chars', () => {
  assert.equal(safeGarageDownloadName('孩子的四轴卡车.glb'), '孩子的四轴卡车.glb')
  assert.equal(safeGarageDownloadName('bad/\\path:<truck>?.GLB'), 'bad__path__truck__.glb')
  assert.throws(() => safeGarageDownloadName('photo.heic'), RangeError)
  assert.throws(() => safeGarageDownloadName(''), RangeError)
  assert.throws(() => safeGarageDownloadName('../..'), RangeError)
})

test('010 export preserves original GLB bytes without re-encoding geometry', async () => {
  const original = tinyTruckGlb()
  const bytes = original.buffer.slice(original.byteOffset, original.byteOffset + original.byteLength)
  const exported = prepareGarageExport('小车.glb', bytes)
  assert.equal(exported.filename, '小车.glb')
  assert.equal(exported.blob.type, 'model/gltf-binary')
  assert.deepEqual(Buffer.from(await exported.blob.arrayBuffer()), original)
})

test('010 invalid or oversized saved binary never produces a downloadable blob', () => {
  assert.throws(() => prepareGarageExport('bad.glb', new ArrayBuffer(4)), /GLB/)
  assert.throws(() => prepareGarageExport('bad.glb', new ArrayBuffer(20*1024*1024+1)), RangeError)
  const fixture = tinyTruckGlb()
  const bytes = fixture.buffer.slice(fixture.byteOffset, fixture.byteOffset + fixture.byteLength)
  assert.throws(() => prepareGarageExport('../../secret.json', bytes), RangeError)
})
