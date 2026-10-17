import test from 'node:test'
import assert from 'node:assert/strict'
import { validateGlbBytes } from './glb-guard.ts'

function glb(json: object): ArrayBuffer {
  const raw = new TextEncoder().encode(JSON.stringify(json))
  const jsonLength = (raw.length + 3) & ~3
  const out = new ArrayBuffer(20 + jsonLength)
  const view = new DataView(out)
  view.setUint32(0, 0x46546c67, true)
  view.setUint32(4, 2, true)
  view.setUint32(8, out.byteLength, true)
  view.setUint32(12, jsonLength, true)
  view.setUint32(16, 0x4e4f534a, true)
  const dest = new Uint8Array(out, 20)
  dest.fill(0x20)
  dest.set(raw)
  return out
}

test('TDD: valid self-contained glTF v2 metadata is accepted', () => {
  assert.doesNotThrow(() => validateGlbBytes(glb({
    asset: { version: '2.0' },
    buffers: [{ byteLength: 0 }]
  })))
})

test('TDD: reject malformed binary, length and glTF versions', () => {
  assert.throws(() => validateGlbBytes(new ArrayBuffer(4)))
  const b = glb({ asset: { version: '2.0' } })
  new DataView(b).setUint32(8, 99, true)
  assert.throws(() => validateGlbBytes(b))
  assert.throws(() => validateGlbBytes(glb({ asset: { version: '1.0' } })))
})

test('TDD: reject external URLs, including absolute and relative references', () => {
  for (const uri of ['https://example.org/texture.png', '/fetch.jpg', 'relative.bin']) {
    assert.throws(() => validateGlbBytes(glb({
      asset: { version: '2.0' },
      images: [{ uri }]
    })), /External model resources/)
  }
})

test('TDD: permit embedded data URI resources', () => {
  assert.doesNotThrow(() => validateGlbBytes(glb({
    asset: { version: '2.0' },
    images: [{ uri: 'data:image/png;base64,aGVsbG8=' }]
  })))
})
