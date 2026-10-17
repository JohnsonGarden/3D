import { useCallback, useEffect, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { Box3, Object3D, Vector3 } from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import World from './world/World.tsx'
import { validateGlbBytes } from './sim/glb-guard.ts'
import { TRUCK_DIMENSIONS, scaleImportedModelByWidth } from './sim/truck-scale.ts'
import type { DriverInput } from './sim/vehicle.ts'
import {
  INITIAL_DRIVETRAIN, drivetrainReducer, tractionCoefficient, poweredAxles
} from './sim/drivetrain.ts'
import type { DiffLock, DrivetrainAction } from './sim/drivetrain.ts'
import { APPROVED_PROFILE_M } from './sim/approved-profile.ts'
import {
  listGarageEntries, readGarageVehicle, saveGarageVehicle, deleteGarageVehicle,
  readSelectedGarageId, writeSelectedGarageId, GarageLimitError, GARAGE_LIMIT
} from './garage/storage.ts'
import type { GarageEntry } from './garage/storage.ts'
import { prepareGarageExport } from './garage/export.ts'

const MAX_GLB = 20 * 1024 * 1024
const MAX_AUDIO = 30 * 1024 * 1024
const SAMPLE_NAME = '阳光积木小车 · 示例模型'

// One import/restore parsing path; validated both before saving and after reading
// IndexedDB. Never allow corrupt stored GLBs to trigger remote URL fetches.
async function parseGarageModel(bytes: ArrayBuffer): Promise<Object3D> {
  validateGlbBytes(bytes)
  const parsed = await new GLTFLoader().parseAsync(bytes, '')
  const bounds = new Box3().setFromObject(parsed.scene)
  const size = bounds.getSize(new Vector3())
  if (bounds.isEmpty() || ![size.x,size.y,size.z].every(Number.isFinite)) {
    throw new Error('Empty or invalid GLB geometry')
  }
  scaleImportedModelByWidth(size)
  return parsed.scene
}


function isTypingTarget(target: EventTarget | null): boolean {
  return target instanceof HTMLElement &&
    Boolean(target.closest('input, textarea, select, [contenteditable="true"]'))
}

function canRenderWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2'))
  } catch {
    return false
  }
}

export default function App() {
  const keys = useRef(new Set<string>())
  const controls = useRef<DriverInput>({ throttle: 0, steer: 0, brake: false })
  const [garageOpen, setGarageOpen] = useState(false)
  const [resetCount, setResetCount] = useState(0)
  const [speed, setSpeed] = useState(0)
  const [drivetrain, setDrivetrain] = useState(INITIAL_DRIVETRAIN)
  const drivetrainRef = useRef(INITIAL_DRIVETRAIN)
  drivetrainRef.current = drivetrain
  const dispatchDrivetrain = useCallback((action: DrivetrainAction) => {
    setDrivetrain(current => drivetrainReducer(current, action))
  }, [])
  const [model, setModel] = useState<Object3D | null>(null)
  const [modelName, setModelName] = useState(SAMPLE_NAME)
  const [musicUrl, setMusicUrl] = useState<string | null>(null)
  const [musicName, setMusicName] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [garageEntries, setGarageEntries] = useState<GarageEntry[]>([])
  const [garageReady, setGarageReady] = useState(false)
  const [garageBusy, setGarageBusy] = useState(false)
  const [selectedGarageId, setSelectedGarageId] = useState<string | null>(null)
  const [pendingDelete, setPendingDelete] = useState<GarageEntry | null>(null)
  const selectionVersion = useRef(0)
  const [webgl] = useState(canRenderWebGL)

  const updateControls = useCallback(() => {
    const held = keys.current
    controls.current = {
      throttle: Number(held.has('w') || held.has('arrowup')) -
        Number(held.has('s') || held.has('arrowdown')),
      steer: Number(held.has('d') || held.has('arrowright')) -
        Number(held.has('a') || held.has('arrowleft')),
      brake: held.has(' ')
    }
  }, [])

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return
      const key = event.key.toLowerCase()
      if (key === 'g' && !event.repeat) {
        setGarageOpen(wasOpen => !wasOpen)
        keys.current.clear()
        updateControls()
        return
      }
      if (key === 'r' && !event.repeat) {
        setResetCount(value => value + 1)
        return
      }
      if (!garageOpen && !event.repeat && ['q', '1', '2', '3', 't'].includes(key)) {
        event.preventDefault()
        if (key === 'q') dispatchDrivetrain({type: 'toggle-drive'})
        else if (key === 't') dispatchDrivetrain({type: 'toggle-surface'})
        else {
          const lock = ({ '1': 'front', '2': 'rear', '3': 'center' } as const)[key as '1'|'2'|'3']
          dispatchDrivetrain({type: 'toggle-lock', lock})
        }
        return
      }
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(key)) {
        event.preventDefault()
        keys.current.add(key)
        updateControls()
      }
    }
    const up = (event: KeyboardEvent) => {
      keys.current.delete(event.key.toLowerCase())
      updateControls()
    }
    const blur = () => { keys.current.clear(); updateControls() }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    window.addEventListener('blur', blur)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
      window.removeEventListener('blur', blur)
    }
  }, [updateControls, garageOpen, dispatchDrivetrain])

  // URL belongs to the browser session, and is revoked on replacement / unmount.
  useEffect(() => () => {
    if (musicUrl) URL.revokeObjectURL(musicUrl)
  }, [musicUrl])

  useEffect(() => () => {
    if (!model) return
    model.traverse(obj => {
      const mesh = obj as Object3D & {
        geometry?: { dispose: () => void },
        material?: { dispose: () => void } | Array<{ dispose: () => void }>
      }
      mesh.geometry?.dispose()
      if (Array.isArray(mesh.material)) mesh.material.forEach(m => m.dispose())
      else mesh.material?.dispose()
    })
  }, [model])


  // Browser-origin persistence. Do not overwrite an in-flight user selection
  // when a slower asynchronous startup restore finishes.
  useEffect(() => {
    let cancelled = false
    const token = selectionVersion.current
    async function restoreGarage() {
      try {
        const entries = await listGarageEntries()
        if (cancelled) return
        setGarageEntries(entries)
        const savedId = readSelectedGarageId()
        const active = entries.find(entry => entry.id === savedId)
        if (active && token === selectionVersion.current) {
          try {
            const data = await readGarageVehicle(active.id)
            const restored = await parseGarageModel(data)
            if (cancelled || token !== selectionVersion.current) return
            setModel(restored)
            setModelName(active.name)
            setSelectedGarageId(active.id)
          } catch {
            if (cancelled || token !== selectionVersion.current) return
            writeSelectedGarageId(null)
            setError('无法恢复已保存的车辆模型。已切回示例车；车库中的原文件仍可手动删除。')
          }
        } else if (savedId && !active) {
          writeSelectedGarageId(null)
        }
      } catch {
        if (!cancelled) {
          setError('本地车库暂时不可用。请检查浏览器存储权限；示例车仍可正常驾驶。')
        }
      } finally {
        if (!cancelled) setGarageReady(true)
      }
    }
    void restoreGarage()
    return () => { cancelled = true }
  }, [])

  const selectSample = () => {
    selectionVersion.current++
    writeSelectedGarageId(null)
    setSelectedGarageId(null)
    setModel(null)
    setModelName(SAMPLE_NAME)
    setError('')
  }

  const selectSaved = async (entry: GarageEntry) => {
    const token = ++selectionVersion.current
    setGarageBusy(true)
    try {
      const bytes = await readGarageVehicle(entry.id)
      const loaded = await parseGarageModel(bytes)
      if (selectionVersion.current !== token) return
      setModel(loaded)
      setModelName(entry.name)
      setSelectedGarageId(entry.id)
      writeSelectedGarageId(entry.id)
      setError('')
    } catch {
      if (selectionVersion.current === token) {
        setError('无法读取已保存的车辆。当前车辆保持不变；请删除损坏文件后重新导入。')
      }
    } finally {
      if (selectionVersion.current === token) setGarageBusy(false)
    }
  }

  const confirmRemove = async () => {
    const item = pendingDelete
    if (!item) return
    setGarageBusy(true)
    try {
      await deleteGarageVehicle(item.id)
      setGarageEntries(await listGarageEntries())
      if (selectedGarageId === item.id) selectSample()
      // If a restore finishes after deletion, its token no longer matches.
      if (readSelectedGarageId() === item.id) writeSelectedGarageId(null)
      setPendingDelete(null)
    } catch {
      setError('无法删除本地车辆。请检查浏览器存储权限，然后重试。')
    } finally {
      setGarageBusy(false)
    }
  }

  const exportSaved = async (entry: GarageEntry) => {
    if (garageBusy) return
    setGarageBusy(true)
    let downloadUrl: string | null = null
    try {
      const bytes = await readGarageVehicle(entry.id)
      const { filename, blob } = prepareGarageExport(entry.name, bytes)
      downloadUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename
      link.style.display = 'none'
      document.body.appendChild(link)
      try { link.click() } finally { link.remove() }
      // Delay revocation so WebKit/Chromium can finish acquiring the file.
      const urlToRevoke = downloadUrl
      window.setTimeout(() => URL.revokeObjectURL(urlToRevoke), 2000)
      downloadUrl = null
      setError('')
    } catch {
      setError('无法导出这辆车：本地 GLB 缺失、损坏或浏览器存储不可用。车库记录仍保留，请尝试重新导入原始文件。')
    } finally {
      if (downloadUrl) URL.revokeObjectURL(downloadUrl)
      setGarageBusy(false)
    }
  }

  const loadModel = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!file.name.toLowerCase().endsWith('.glb') || file.size > MAX_GLB || file.size === 0) {
      setError('请选择不超过 20 MB 的 .glb 模型文件。')
      return
    }
    const token = ++selectionVersion.current
    setGarageBusy(true)
    try {
      const bytes = await file.arrayBuffer()
      const loaded = await parseGarageModel(bytes)
      if (token !== selectionVersion.current) return
      const entry = await saveGarageVehicle(file.name, bytes)
      if (token !== selectionVersion.current) return
      setGarageEntries(await listGarageEntries())
      setModel(loaded)
      setModelName(entry.name)
      setSelectedGarageId(entry.id)
      writeSelectedGarageId(entry.id)
      setError('')
      setGarageOpen(true)
    } catch (cause) {
      if (cause instanceof GarageLimitError) setError(cause.message)
      else if (cause instanceof RangeError || (cause instanceof Error && /GLB|model|geometry/i.test(cause.message))) {
        setError('无法保存这个 GLB，请检查模型结构、文件名及大小，原车辆仍然保留。')
      } else {
        setError('无法写入本地车库。请检查浏览器存储空间或隐私模式，原车辆仍然保留。')
      }
    } finally {
      if (token === selectionVersion.current) setGarageBusy(false)
    }
  }

  const loadMusic = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if ((!file.type.startsWith('audio/') &&
      !/\.(mp3|m4a|wav|ogg|aac)$/i.test(file.name)) ||
      file.size === 0 || file.size > MAX_AUDIO) {
      setError('请选择不超过 30 MB 的音频文件。')
      return
    }
    setMusicUrl(URL.createObjectURL(file))
    setMusicName(file.name)
    setError('')
  }

  return (
    <main className="shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-square">L</span>
          <div><strong>BRICK WORLD</strong><small>孩子的积木驾驶乐园 · 技术原型</small></div>
        </div>
        <button className="toolbar-button" onClick={() => {
          keys.current.clear(); updateControls(); setGarageOpen(open => !open)
        }} aria-expanded={garageOpen} aria-controls="garage-panel">
          {garageOpen ? '返回驾驶' : '打开车库'} <span className="keycap">G</span>
        </button>
      </header>

      <div className="world-stage">
        {webgl ?
          <World controls={controls} drivetrain={drivetrainRef} garageOpen={garageOpen} resetCount={resetCount}
            model={model} onSpeed={setSpeed} />
          : <div role="alert" className="fallback">
              当前浏览器无法启动 WebGL 2。请开启硬件加速并更新浏览器，或换一台支持 3D 图形的电脑。
            </div>}
        <div className="scene-label">LOS ANGELES INSPIRED <span>虚构场景 · 非真实地图</span></div>
        <section className="hud" aria-label="驾驶信息">
          <p>正在驾驶</p><strong>{speed}<small> km/h</small></strong>
          <p className="model-label">{modelName}</p>
          <button onClick={() => setResetCount(n => n + 1)}>重置车辆 <span className="keycap">R</span></button>
        </section>
        <section className="drivetrain-panel" aria-label="传动系统">
          <div className="drivetrain-panel-head">
            <span>四轴传动</span>
            <span className="drivetrain-tag">驾驶演示</span>
          </div>
          <button className="drive-mode-toggle" type="button"
            aria-label="切换驱动模式" aria-pressed={drivetrain.mode === '8x8'}
            onClick={() => dispatchDrivetrain({type:'toggle-drive'})}>
            <span>驱动模式 <kbd>Q</kbd></span>
            <strong>{drivetrain.mode === '8x8' ? '8×8 全轮驱动' : '8×4 后双桥驱动'}</strong>
          </button>
          <p className="powered-axles">驱动轴：{poweredAxles(drivetrain).join(' · ')}　/　4 轴</p>
          <div className="lock-grid" aria-label="差速锁开关">
            {([
              ['front', '前桥组', '1'],
              ['rear', '后桥组', '2'],
              ['center', '中央', '3']
            ] as [DiffLock, string, string][]).map(([lock, label, key]) => (
              <button key={lock} className={drivetrain.locks[lock] ? 'lock-active' : ''}
                type="button" aria-label={'差速锁：' + label}
                aria-pressed={drivetrain.locks[lock]}
                onClick={() => dispatchDrivetrain({type:'toggle-lock',lock})}>
                <small>{label} <kbd>{key}</kbd></small>
                <strong>{drivetrain.locks[lock] ? '锁止' : '解锁'}</strong>
              </button>
            ))}
          </div>
          <button className="surface-toggle" type="button"
            aria-label="切换路面附着力" aria-pressed={drivetrain.surface === 'loose'}
            onClick={() => dispatchDrivetrain({type:'toggle-surface'})}>
            <span>路况演示 <kbd>T</kbd></span>
            <strong>{drivetrain.surface === 'paved' ? '铺装公路' : '低附着路面'}</strong>
          </button>
          <p className="grip-label">演示抓地系数 {(tractionCoefficient(drivetrain)*100).toFixed(0)}%</p>
          <p className="drivetrain-disclaimer">
            示意驾驶模型：切换驱动与差速锁影响低附着路面抓地估算，
            不代表真实差速器、轮胎受力或悬架仿真。
          </p>
        </section>
        <aside className="controls-help" aria-label="驾驶操作说明">
          <span><kbd>W</kbd> / <kbd>↑</kbd> 前进</span>
          <span><kbd>S</kbd> / <kbd>↓</kbd> 倒车</span>
          <span><kbd>A</kbd><kbd>D</kbd> / ← → 转向</span>
          <span><kbd>Space</kbd> 刹车</span>
          <span><kbd>Q</kbd> 驱动切换 · <kbd>1</kbd><kbd>2</kbd><kbd>3</kbd> 差速锁 · <kbd>T</kbd> 低附着路面</span>
        </aside>
      </div>

      {garageOpen && <div className="garage-backdrop">
        <section id="garage-panel" className="garage-panel" role="dialog"
          aria-modal="true" aria-label="我的车库">
          <div className="garage-header">
            <div><p className="eyebrow">MY GARAGE</p><h1>我的积木车库</h1></div>
            <button onClick={() => setGarageOpen(false)} aria-label="关闭车库">✕</button>
          </div>
          <div className="garage-car">
            <span aria-hidden="true">▰</span>
            <div><strong>{modelName}</strong>
              <small>{model ? '本地已保存 GLB · 非照片自动重建' : '程序化示例 · 尚非照片重建'}</small>
            </div>
          </div>
          <section className="garage-library" aria-label="已保存车辆">
            <div className="garage-library-heading">
              <strong>我的本地车辆</strong>
              <small>{garageEntries.length}/{GARAGE_LIMIT} 个保存位</small>
            </div>
            <p className="garage-local-notice">已保存在本机浏览器 · 不上传云端。请逐辆点击“导出 GLB”手动备份到安全位置；更换浏览器、端口或清理数据都可能失去车库记录。备份文件可重新导入。</p>
            {!garageReady && <p role="status">正在读取本地车库...</p>}
            <div className="garage-entry">
              <button type="button" aria-label="选择程序化示例车"
                aria-pressed={selectedGarageId === null}
                disabled={garageBusy} onClick={selectSample}>
                默认示例卡车 <small>随时可驾驶</small>
              </button>
            </div>
            {garageEntries.map(entry => (
              <div className="garage-entry" key={entry.id}>
                <button type="button" className="garage-entry-name"
                  aria-label={'选择车辆：' + entry.name}
                  aria-pressed={selectedGarageId === entry.id}
                  disabled={garageBusy} onClick={() => void selectSaved(entry)}>
                  {entry.name} <small>本机保存</small>
                </button>
                <button type="button" className="garage-export"
                  aria-label={'导出车辆：' + entry.name}
                  disabled={garageBusy} onClick={() => void exportSaved(entry)}>导出 GLB</button>
                <button type="button" className="garage-delete"
                  aria-label={'删除车辆：' + entry.name}
                  disabled={garageBusy} onClick={() => setPendingDelete(entry)}>删除</button>
              </div>
            ))}
          </section>
          {pendingDelete && (
            <section className="garage-confirm" role="dialog" aria-modal="true"
              aria-label="确认删除车辆">
              <p>确定永久删除“{pendingDelete.name}”吗？此操作只删除本机保存的这辆车，不能撤销。</p>
              <div>
                <button type="button" onClick={() => setPendingDelete(null)}
                  disabled={garageBusy}>取消删除</button>
                <button type="button" onClick={() => void confirmRemove()}
                  disabled={garageBusy}>确认永久删除</button>
              </div>
            </section>
          )}
          <div className="calibration" aria-label="等比例放大标定">
            <p className="eyebrow">卡车真实尺寸 · 以实测车宽为基准</p>
            <strong>{TRUCK_DIMENSIONS.scaleFactor.toFixed(2)}× 等比例放大</strong>
            <dl>
              <div><dt>车身长（不含前防撞栏）</dt><dd>{TRUCK_DIMENSIONS.bodyLengthM.toFixed(2)} m</dd></div>
              <div><dt>车身宽</dt><dd>{TRUCK_DIMENSIONS.bodyWidthM.toFixed(2)} m</dd></div>
              <div><dt>车头最高点</dt><dd>{TRUCK_DIMENSIONS.cabHighestPointM.toFixed(2)} m</dd></div>
              <div><dt>轮胎直径</dt><dd>{TRUCK_DIMENSIONS.tireDiameterM.toFixed(2)} m</dd></div>
              <div><dt>前防撞梁向前突出</dt><dd>{TRUCK_DIMENSIONS.frontBumperProjectionM.toFixed(2)} m</dd></div>
              <div><dt>总长（含前防撞梁）</dt><dd>{TRUCK_DIMENSIONS.totalLengthWithBumperM.toFixed(2)} m</dd></div>
              <div><dt>第一至第四轴轴距</dt><dd>{TRUCK_DIMENSIONS.firstToFourthAxleM.toFixed(2)} m</dd></div>
              <div><dt>底盘离地</dt><dd>{APPROVED_PROFILE_M.chassisGroundClearance.toFixed(2)} m</dd></div>
              <div><dt>轮胎总数（设计目标）</dt><dd>14 条</dd></div>
              <div><dt>轴距 1–2 / 2–3 / 3–4</dt><dd>{TRUCK_DIMENSIONS.axleSpacingM.map(x => x.toFixed(2)).join(' / ')} m</dd></div>
            </dl>
          </div>
          <label className="file-button">导入孩子的小车（GLB）
            <input aria-label="导入 GLB 模型" type="file" accept=".glb,model/gltf-binary"
              disabled={garageBusy || !garageReady} onChange={loadModel}/>
          </label>
          <p className="hint">只在本机浏览器中读取，不会上传。导入成功后自动保存到此浏览器的 IndexedDB（最多 6 辆）；可在上方手动切换和删除。导入模型以 X 轴包围盒宽度统一缩放至 2.50 m。若含后视镜等突起则需人工校准，车头方向应为 -Z。</p>
          <button className="drive-button" onClick={() => {keys.current.clear(); updateControls(); setGarageOpen(false)}} disabled={garageBusy}>开始驾驶 →</button>
        </section>
      </div>}
      <section className="music-box" aria-label="背景音乐">
        <label className="music-upload">♫ {musicName ? '更换音乐' : '上传自己的背景音乐'}
          <input type="file" aria-label="选择背景音乐" accept="audio/*" onChange={loadMusic}/>
        </label>
        {musicUrl && <audio controls preload="none" src={musicUrl} aria-label="音乐播放器" />}
      </section>
      {error && <div className="toast" role="alert">{error}<button onClick={() => setError('')}>关闭</button></div>}
      <footer>非 LEGO 官方项目 · 首版仅本地运行 · 原始照片未转换成模型</footer>
    </main>
  )
}
