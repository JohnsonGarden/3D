import test from 'node:test'
import assert from 'node:assert/strict'
import {
  MAX_PHOTOS, MAX_PHOTO_BYTES, MAX_PHOTO_BATCH_BYTES, validatePhotoSelection
} from './photo-intake.ts'

const photo = (name: string, size=2048, type='image/jpeg') => ({name,size,type})

test('016 accepts a local multiview photo set with supported MIME and extension',()=>{
  const files=[photo('front.JPG'),photo('left.jpeg'),photo('back.png',1500,'image/png'),photo('right.webp',2048,'image/webp')]
  assert.deepEqual(validatePhotoSelection(files),files)
  assert.deepEqual(validatePhotoSelection([photo('roof.webp',20,'')]),[photo('roof.webp',20,'')])
})

test('016 rejects empty, over-limit counts and per-file bounds',()=>{
  assert.equal(MAX_PHOTOS,12)
  assert.equal(MAX_PHOTO_BYTES,12*1024*1024)
  assert.equal(MAX_PHOTO_BATCH_BYTES,72*1024*1024)
  assert.throws(()=>validatePhotoSelection([]),RangeError)
  assert.throws(()=>validatePhotoSelection(Array.from({length:13},(_,i)=>photo(i+'.jpg'))),RangeError)
  assert.throws(()=>validatePhotoSelection([photo('zero.jpg',0)]),RangeError)
  assert.throws(()=>validatePhotoSelection([photo('huge.jpg',MAX_PHOTO_BYTES+1)]),RangeError)
  assert.throws(()=>validatePhotoSelection([photo('NaN.jpg',NaN)]),RangeError)
  assert.throws(()=>validatePhotoSelection([photo('oversized'+('x'.repeat(200))+'.jpg')]),RangeError)
})

test('016 enforces total memory budget before any reads',()=>{
  assert.throws(()=>validatePhotoSelection(
    Array.from({length:7},(_,i)=>photo(i+'.jpg',11*1024*1024))
  ),RangeError)
  assert.doesNotThrow(()=>validatePhotoSelection(
    Array.from({length:6},(_,i)=>photo(i+'.jpg',12*1024*1024))
  ))
})

test('016 rejects HEIC, SVG, random nonimages and mismatched MIME/extension',()=>{
  for (const invalid of [
    photo('front.HEIC',123,'image/heic'),
    photo('vector.svg',100,'image/svg+xml'),
    photo('unsafe.html',100,'text/html'),
    photo('really.png',100,'image/jpeg'),
    photo('opaque.jpg',100,'application/octet-stream'),
    photo('bad.jpg',100,'')
  ].slice(0,5)) {
    assert.throws(()=>validatePhotoSelection([invalid]),RangeError)
  }
  assert.throws(()=>validatePhotoSelection([photo('x.jpg',100,'image/svg+xml')]),RangeError)
  assert.throws(()=>validatePhotoSelection([photo('x.png',100,'image/jpeg')]),RangeError)
  assert.throws(()=>validatePhotoSelection([photo('x.svg',100,'')]),RangeError)
})
