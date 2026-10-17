/**
 * Browser-only IndexedDB garage. Files never leave the browser.
 * Metadata & binary are separate object stores so listing does not read all GLBs.
 * This is browser-origin storage (and may be evicted/private-mode blocked).
 */
export const GARAGE_DATABASE = 'brickworld-garage-v1'
export const GARAGE_LIMIT = 6
export const MAX_STORED_GLB_BYTES = 20 * 1024 * 1024
export const ACTIVE_VEHICLE_KEY = 'brickworld-garage-active-v1'
export type GarageEntry = Readonly<{ id: string; name: string; savedAt: number }>

export class GarageLimitError extends Error {
  constructor() { super('车库最多保留 6 辆车。请先删除一辆，再保存新车。') }
}

export function validateGarageCandidate(count: number, bytes: ArrayBuffer, name: string): void {
  if (!Number.isInteger(count) || count < 0) throw new RangeError('Invalid car count')
  if (count >= GARAGE_LIMIT) throw new GarageLimitError()
  if (!(bytes instanceof ArrayBuffer) || !bytes.byteLength ||
      bytes.byteLength > MAX_STORED_GLB_BYTES || typeof name !== 'string' ||
      !name.toLowerCase().endsWith('.glb') || name.length > 180) {
    throw new RangeError('无效的 GLB 文件大小或名称')
  }
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('当前浏览器不支持本地车库存储'))
      return
    }
    let request: IDBOpenDBRequest
    try { request = indexedDB.open(GARAGE_DATABASE, 1) }
    catch (error) { reject(error); return }
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains('vehicles')) db.createObjectStore('vehicles', { keyPath: 'id' })
      if (!db.objectStoreNames.contains('blobs')) db.createObjectStore('blobs')
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('无法打开车库数据库'))
    request.onblocked = () => reject(new Error('浏览器中的其他标签页正在占用旧车库，请关闭旧标签页重试'))
  })
}

export async function listGarageEntries(): Promise<GarageEntry[]> {
  const db = await openDatabase()
  try {
    return await new Promise<GarageEntry[]>((resolve, reject) => {
      const tx = db.transaction('vehicles', 'readonly')
      const req = tx.objectStore('vehicles').getAll()
      req.onerror = () => reject(req.error)
      req.onsuccess = () => {
        const records = req.result as GarageEntry[]
        resolve(records.filter(item =>
          typeof item.id === 'string' && typeof item.name === 'string' &&
          Number.isFinite(item.savedAt)
        ).sort((a,b) => b.savedAt - a.savedAt))
      }
    })
  } finally { db.close() }
}

export async function readGarageVehicle(id: string): Promise<ArrayBuffer> {
  const db = await openDatabase()
  try {
    return await new Promise<ArrayBuffer>((resolve, reject) => {
      const tx = db.transaction('blobs', 'readonly')
      const req = tx.objectStore('blobs').get(id)
      req.onsuccess = () => {
        if (!(req.result instanceof ArrayBuffer)) reject(new Error('本地车辆模型不存在或数据受损'))
        else resolve(req.result)
      }
      req.onerror = () => reject(req.error)
    })
  } finally { db.close() }
}

export async function saveGarageVehicle(name: string, bytes: ArrayBuffer): Promise<GarageEntry> {
  const db = await openDatabase()
  try {
    return await new Promise<GarageEntry>((resolve, reject) => {
      const tx = db.transaction(['vehicles','blobs'], 'readwrite')
      const vehicles = tx.objectStore('vehicles')
      const blobs = tx.objectStore('blobs')
      const entry: GarageEntry = {id: crypto.randomUUID(), name, savedAt: Date.now()}
      let failure: Error | null = null
      tx.oncomplete = () => resolve(entry)
      tx.onerror = () => reject(failure ?? tx.error ?? new Error('无法保存本地模型'))
      tx.onabort = () => reject(failure ?? tx.error ?? new Error('存储空间不足或存储事务已取消'))
      const count = vehicles.count()
      count.onsuccess = () => {
        try {
          validateGarageCandidate(count.result, bytes, name)
          vehicles.add(entry)
          blobs.add(bytes, entry.id)
        } catch (e) {
          failure = e instanceof Error ? e : new Error('无法保存本地模型')
          tx.abort()
        }
      }
    })
  } finally { db.close() }
}

export async function deleteGarageVehicle(id: string): Promise<void> {
  const db = await openDatabase()
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(['vehicles','blobs'], 'readwrite')
      tx.objectStore('vehicles').delete(id)
      tx.objectStore('blobs').delete(id)
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error ?? new Error('删除失败'))
      tx.onabort = () => reject(tx.error ?? new Error('删除事务已取消'))
    })
  } finally { db.close() }
}

export function readSelectedGarageId(): string | null {
  try { return localStorage.getItem(ACTIVE_VEHICLE_KEY) }
  catch { return null }
}
export function writeSelectedGarageId(id: string | null): void {
  try {
    if (id === null) localStorage.removeItem(ACTIVE_VEHICLE_KEY)
    else localStorage.setItem(ACTIVE_VEHICLE_KEY, id)
  } catch {
    // Selection preference is best effort; IndexedDB still stores the GLB.
  }
}
