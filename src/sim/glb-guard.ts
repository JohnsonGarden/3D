/** Validate GLB v2 container before third-party GLTFLoader parses any references.
 * This is a bounded local-input safety gate, not a complete sandbox.
 */
export function validateGlbBytes(bytes: ArrayBuffer): void {
  if (bytes.byteLength < 20) throw new Error('Truncated GLB')
  const view = new DataView(bytes)
  if (view.getUint32(0, true) !== 0x46546c67) throw new Error('Invalid GLB magic')
  if (view.getUint32(4, true) !== 2) throw new Error('Only GLB v2 is supported')
  if (view.getUint32(8, true) !== bytes.byteLength) throw new Error('Invalid GLB length')
  const jsonLength = view.getUint32(12, true)
  if (view.getUint32(16, true) !== 0x4e4f534a ||
      jsonLength > bytes.byteLength - 20 || jsonLength > 2_000_000) {
    throw new Error('Invalid GLB JSON chunk')
  }
  let json: unknown
  try {
    const text = new TextDecoder('utf-8', { fatal: true })
      .decode(new Uint8Array(bytes, 20, jsonLength)).trim()
    json = JSON.parse(text)
  } catch {
    throw new Error('GLB JSON is invalid')
  }
  if (typeof json !== 'object' || json === null) throw new Error('GLB root missing')
  const root = json as Record<string, unknown>
  const asset = root.asset as Record<string, unknown> | undefined
  if (!asset || asset.version !== '2.0') throw new Error('Invalid glTF asset version')
  for (const type of ['images', 'buffers'] as const) {
    const entries = root[type]
    if (entries === undefined) continue
    if (!Array.isArray(entries) || entries.length > 500) throw new Error('Invalid resource list')
    for (const entry of entries) {
      if (typeof entry !== 'object' || entry === null) throw new Error('Invalid resource')
      const uri = (entry as Record<string, unknown>).uri
      // A data URI is embedded in the file. No HTTP(S), protocol-relative, local
      // path or plugin URI may be referenced from a user-supplied GLB.
      if (uri !== undefined && (typeof uri !== 'string' || !uri.startsWith('data:'))) {
        throw new Error('External model resources are not allowed')
      }
    }
  }
  if (Array.isArray(root.nodes) && root.nodes.length > 10000) {
    throw new Error('Too many model nodes')
  }
}
