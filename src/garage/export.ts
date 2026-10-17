import { validateGlbBytes } from '../sim/glb-guard.ts'
import { MAX_STORED_GLB_BYTES } from './storage.ts'

/**
 * Export user-imported original bytes as a browser-controlled download.
 * No network, filesystem writes, or DOM side effects occur in this module.
 */
export function safeGarageDownloadName(name: string): string {
  if (typeof name !== 'string' || !name || name.length > 180 || !/\.glb$/i.test(name)) {
    throw new RangeError('Invalid original GLB filename')
  }
  const stem = name.slice(0, -4)
    .replace(/[\u0000-\u001f\u007f<>:"/\\|?*]/g, '_')
    .replace(/^[.\s]+/, '')
    .replace(/[.\s]+$/, '')
  if (!stem) throw new RangeError('Invalid original GLB filename')
  return stem + '.glb'
}

export function prepareGarageExport(
  name: string,
  bytes: ArrayBuffer
): { filename: string, blob: Blob } {
  const filename = safeGarageDownloadName(name)
  if (!(bytes instanceof ArrayBuffer) || bytes.byteLength === 0 ||
      bytes.byteLength > MAX_STORED_GLB_BYTES) {
    throw new RangeError('Stored GLB is empty or exceeds the 20 MB limit')
  }
  validateGlbBytes(bytes)
  // Blob copies bytes. No GLTFLoader or geometry re-serialization: byte-exact backup.
  return { filename, blob: new Blob([bytes], { type: 'model/gltf-binary' }) }
}
