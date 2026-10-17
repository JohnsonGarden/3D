/**
 * 016 — pure photo metadata preflight. Browser File objects are not read here;
 * neither this utility nor the UI uploads or persists any child photos.
 */
export const MAX_PHOTOS = 12
export const MAX_PHOTO_BYTES = 12 * 1024 * 1024
export const MAX_PHOTO_BATCH_BYTES = 72 * 1024 * 1024

export type PhotoCandidate = Readonly<Pick<File, 'name' | 'size' | 'type'>>

const formats: Readonly<Record<string, string>> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp'
}

/** Throws RangeError without side effects. Input order is preserved. */
export function validatePhotoSelection<T extends PhotoCandidate>(photos: readonly T[]): T[] {
  if (photos.length < 1 || photos.length > MAX_PHOTOS) {
    throw new RangeError('请选择 1–12 张照片；建议包含车头、车尾、左右两侧和斜侧面。')
  }
  let bytes = 0
  for (const photo of photos) {
    if (!photo.name || photo.name.length > 180) {
      throw new RangeError('照片文件名过长或无效，请改名后重新选择。')
    }
    const dot = photo.name.lastIndexOf('.')
    const ext = dot === -1 ? '' : photo.name.slice(dot).toLowerCase()
    const expected = formats[ext]
    if (!expected || (photo.type !== '' && photo.type.toLowerCase() !== expected)) {
      throw new RangeError('目前只支持 JPG、PNG、WebP 照片；HEIC 暂未开放，请先转换为 JPG。')
    }
    if (!Number.isSafeInteger(photo.size) || photo.size < 1 || photo.size > MAX_PHOTO_BYTES) {
      throw new RangeError('每张照片应大于 0、且不超过 12 MiB。')
    }
    bytes += photo.size
    if (bytes > MAX_PHOTO_BATCH_BYTES) {
      throw new RangeError('所选照片总大小不可超过 72 MiB，请减少数量或缩小文件。')
    }
  }
  return [...photos]
}
