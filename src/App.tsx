import { useCallback, useEffect, useRef, useState } from 'react'
import type { ChangeEvent, PointerEvent as ReactPointerEvent } from 'react'
import { Box3, Object3D, Vector3 } from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import World from './world/World.tsx'
import { validateGlbBytes } from './sim/glb-guard.ts'
import { TRUCK_DIMENSIONS, scaleImportedModelByWidth } from './sim/truck-scale.ts'
import type { DriverInput } from './sim/vehicle.ts'
import { resolveDriverInput } from './controls/input.ts'
import type { FrameMetrics } from './sim/frame-metrics.ts'
import { ROAD_TRIP, upcomingCheckpoint } from './game/checkpoints.ts'
import type { TouchAction } from './controls/input.ts'
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
import { validatePhotoSelection, MAX_PHOTOS } from './garage/photo-intake.ts'
import {
  VIEW_OPTIONS, evaluatePhotoCoverage, parseToyDimensions, createCaptureManifest
} from './garage/capture-manifest.ts'
import type { PhotoView, ToyDimensionFields } from './garage/capture-manifest.ts'

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
  const touchPointers = useRef(new Map<number, TouchAction>())
  const controls = useRef<DriverInput>({ throttle: 0, steer: 0, brake: false })
  const [garageOpen, setGarageOpen] = useState(false)
  const [resetCount, setResetCount] = useState(0)
  const [speed, setSpeed] = useState(0)
  const [collision, setCollision] = useState(false)
  const [showPerformance, setShowPerformance] = useState(false)
  const [frameStats, setFrameStats] = useState<FrameMetrics | null>(null)
  const [checkpointCount, setCheckpointCount] = useState(0)
  const [journeyResetCount, setJourneyResetCount] = useState(0)
  const [drivetrain, setDrivetrain] = useState(INITIAL_DRIVETRAIN)
  const drivetrainRef = useRef(INITIAL_DRIVETRAIN)
  drivetrainRef.current = drivetrain
  const dispatchDrivetrain = useCallback((action: DrivetrainAction) => {
    setDrivetrain(current => drivetrainReducer(current, action))
  }, [])
  const [model, setModel] = useState<Object3D | null>(null)
  const [modelName, setModelName] = useState(SAMPLE_NAME)
  const [photoPreviews, setPhotoPreviews] = useState<{
    name:string; url:string; type:string; size:number; view:PhotoView
  }[]>([])
  const [toyDimensions, setToyDimensions] = useState<ToyDimensionFields>({
    length:'',width:'',height:''
  })
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
    controls.current = resolveDriverInput(keys.current, new Set(touchPointers.current.values()))
  }, [])

  const beginTouch = useCallback((action: TouchAction, event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    event.preventDefault()
    touchPointers.current.set(event.pointerId, action)
    try { event.currentTarget.setPointerCapture(event.pointerId) }
    catch { /* Synthetic pointer events may not support capture. */ }
    updateControls()
  }, [updateControls])

  const endTouch = useCallback((event: ReactPointerEvent<HTMLButtonElement>) => {
    touchPointers.current.delete(event.pointerId)
    updateControls()
  }, [updateControls])

  useEffect(() => {
    if (garageOpen) {
      keys.current.clear()
      touchPointers.current.clear()
      updateControls()
    }
  }, [garageOpen, updateControls])

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return
      const key = event.key.toLowerCase()
      if (key === 'g' && !event.repeat) {
        setGarageOpen(wasOpen => !wasOpen)
        keys.current.clear()
        touchPointers.current.clear()
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
    const blur = () => { keys.current.clear(); touchPointers.current.clear(); updateControls() }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    window.addEventListener('blur', blur)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
      window.removeEventListener('blur', blur)
    }
  }, [updateControls, garageOpen, dispatchDrivetrain])

  // A selected photo set is session-only. Whenever it changes (or App unmounts),
  // discard the previous set's browser-only object URLs, including image buffers.
  useEffect(() => () => {
    photoPreviews.forEach(preview => URL.revokeObjectURL(preview.url))
  }, [photoPreviews])

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

  const loadPhotos = (event: ChangeEvent<HTMLInputElement>) => {
    const photos = Array.from(event.target.files ?? [])
    event.target.value = '' // allow reselecting the same photo set later
    if (!photos.length) return
    try {
      const checked = validatePhotoSelection(photos)
      const urls: typeof photoPreviews = []
      try {
        checked.forEach(file => {
          urls.push({name:file.name,size:file.size,type:file.type,
            view:'unassigned',url:URL.createObjectURL(file)})
        })
      } catch {
        urls.forEach(item=>URL.revokeObjectURL(item.url))
        throw new Error('无法创建照片预览，请尝试更小的照片。')
      }
      setPhotoPreviews(urls)
      setToyDimensions({length:'',width:'',height:''})
      setError('')
    } catch (cause) {
      // A bad replacement must never destroy previously selected previews.
      setError(cause instanceof Error ? cause.message : '无法读取所选照片，请重新选择。')
    }
  }

  const exportCaptureManifest = () => {
    let objectUrl: string | null = null
    try {
      const dimensions = parseToyDimensions(toyDimensions)
      const manifest = createCaptureManifest(photoPreviews,dimensions)
      // The manifest is metadata only, intentionally never contains photo bytes
      // or short-lived browser object URLs. Download requires an explicit click.
      const blob = new Blob([JSON.stringify(manifest,null,2)],{type:'application/json'})
      objectUrl = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = objectUrl
      anchor.download = 'brickworld-capture.json'
      document.body.appendChild(anchor)
      try { anchor.click() } finally { anchor.remove() }
      const revoke = objectUrl
      window.setTimeout(()=>URL.revokeObjectURL(revoke),2000)
      objectUrl = null
      setError('')
    } catch (err) {
      if (objectUrl) URL.revokeObjectURL(objectUrl)
      setError(err instanceof Error ? err.message : '采集清单导出失败。')
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
        <div className="toolbar-actions">
          <button type="button" className="performance-toggle" aria-pressed={showPerformance}
            aria-label={showPerformance ? '隐藏性能诊断' : '显示性能诊断'}
            onClick={() => setShowPerformance(open => !open)}>
            {showPerformance ? '隐藏性能' : '性能诊断'}
          </button>
          <button className="toolbar-button" onClick={() => {
            keys.current.clear(); touchPointers.current.clear(); updateControls(); setGarageOpen(open => !open)
          }} aria-expanded={garageOpen} aria-controls="garage-panel">
            {garageOpen ? '返回驾驶' : '打开车库'} <span className="keycap">G</span>
          </button>
        </div>
      </header>

      <section className="journey-strip" role="region" aria-label="公路旅行进度">
        <div className="journey-progress">
          <strong>积木公路旅行 <span>{checkpointCount} / {ROAD_TRIP.length}</span></strong>
          <small>{upcomingCheckpoint(checkpointCount)
            ? '下一站：' + upcomingCheckpoint(checkpointCount)!.label
            : '三站全部抵达！恭喜完成旅程！'}</small>
        </div>
        <div className="journey-dots" aria-label="已完成的路标">
          {ROAD_TRIP.map((gate, index) =>
            <span key={gate.id} className={index < checkpointCount ? 'done' : ''}
              aria-label={gate.label + (index < checkpointCount ? '已抵达' : '未抵达')}/>)}
        </div>
        <button type="button" onClick={() => {
          keys.current.clear()
          touchPointers.current.clear()
          updateControls()
          setCheckpointCount(0)
          setJourneyResetCount(n=>n+1)
          setResetCount(n=>n+1)
        }}>重新开始旅程</button>
      </section>

      <div className="world-stage">
        {webgl ?
          <World controls={controls} drivetrain={drivetrainRef} garageOpen={garageOpen} resetCount={resetCount}
            model={model} onSpeed={setSpeed} onCollision={setCollision}
            monitorPerformance={showPerformance} onPerformance={setFrameStats}
            journeyResetCount={journeyResetCount} onCheckpoint={setCheckpointCount} />
          : <div role="alert" className="fallback">
              当前浏览器无法启动 WebGL 2。请开启硬件加速并更新浏览器，或换一台支持 3D 图形的电脑。
            </div>}
        <div className="scene-label">PRACTICE ROADS <span>虚构场景 · 非真实地图 · 3 个十字路口</span></div>
        {showPerformance && (
          <section className="performance-panel" role="region" aria-label="性能诊断">
            <strong>本机浏览器帧率诊断</strong>
            {frameStats
              ? <div className="performance-values">
                  <p>帧率中位数 <b>{frameStats.medianFps.toFixed(1)} FPS</b></p>
                  <p>p95 帧间隔 <b>{frameStats.p95Ms.toFixed(1)} ms</b></p>
                  <small>有效样本 {frameStats.count} 帧 · 滚动窗口</small>
                </div>
              : <p role="status">采样中……至少等待 30 个有效帧。</p>}
            <p className="performance-note">来自浏览器动画帧，非 GPU 耗时或设备跑分。关闭后不保存、不上传；请在实际 Mac 上记录指标。</p>
          </section>
        )}
        <section className="hud" aria-label="驾驶信息">
          <p>正在驾驶</p><strong>{speed}<small> km/h</small></strong>
          <p className="model-label">{modelName}</p>
          {collision && <p className="contact-alert" role="status" aria-label="驾驶碰撞提示">碰撞：车辆已停车 · 按 R 重置或倒车离开</p>}
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
        {!garageOpen && (
          <section className="touch-controls" aria-label="触屏驾驶控制">
            <div className="touch-steering" aria-label="转向">
              <button type="button" aria-label="左转（按住）"
                onPointerDown={e => beginTouch('left', e)}
                onPointerUp={endTouch} onPointerCancel={endTouch}
                onLostPointerCapture={endTouch}>←<span>左转</span></button>
              <button type="button" aria-label="右转（按住）"
                onPointerDown={e => beginTouch('right', e)}
                onPointerUp={endTouch} onPointerCancel={endTouch}
                onLostPointerCapture={endTouch}>→<span>右转</span></button>
            </div>
            <div className="touch-pedals" aria-label="油门和制动">
              <button type="button" aria-label="倒车（按住）"
                onPointerDown={e => beginTouch('reverse', e)}
                onPointerUp={endTouch} onPointerCancel={endTouch}
                onLostPointerCapture={endTouch}>▼<span>倒车</span></button>
              <button type="button" aria-label="刹车（按住）" className="touch-brake"
                onPointerDown={e => beginTouch('brake', e)}
                onPointerUp={endTouch} onPointerCancel={endTouch}
                onLostPointerCapture={endTouch}>■<span>刹车</span></button>
              <button type="button" aria-label="油门（按住）" className="touch-accelerate"
                onPointerDown={e => beginTouch('accelerate', e)}
                onPointerUp={endTouch} onPointerCancel={endTouch}
                onLostPointerCapture={endTouch}>▲<span>油门</span></button>
            </div>
          </section>
        )}
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
          <section className="photo-intake" aria-label="从多角度照片制作小车">
            <h2>① 拍下孩子搭建的积木车</h2>
            <p>选择多个角度的照片：车头、车尾、左侧、右侧、斜前方，以及能看到车顶的位置。尽量光线均匀、背景简单，最好放一把尺子或已知尺寸的积木作比例参考。</p>
            <p className="photo-intake-notice"><strong>当前阶段：</strong>仅在本机预览照片；<strong>照片还不能自动生成 3D 模型</strong>。下一步才会接入忠于积木结构的建模和写实风转换。现阶段可以继续导入已有 GLB 体验驾驶。</p>
            <div className="photo-actions">
              <label className="file-button">选择多角度照片
                <input aria-label="选择小车多角度照片" type="file" multiple
                  accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                  onChange={loadPhotos}/>
              </label>
              <button type="button" onClick={() => {
                setPhotoPreviews([])
                setToyDimensions({length:'',width:'',height:''})
                setError('')
              }}
                disabled={photoPreviews.length === 0} aria-label="清空已选照片">清空已选照片</button>
            </div>
            <p className="photo-count">{photoPreviews.length
              ? `已选 ${photoPreviews.length} 张照片`
              : '尚未选择照片'}</p>
            {photoPreviews.length > 0 && <div className="photo-preview-grid">
              {photoPreviews.map((preview, index) =>
                <figure key={preview.url}>
                  <img src={preview.url} alt={'照片预览：' + preview.name} loading="lazy"/>
                  <figcaption>{index + 1}. {preview.name}</figcaption>
                  <label className="photo-view-label">拍摄角度
                    <select aria-label={'照片角度：' + preview.name}
                      value={preview.view}
                      onChange={event => {
                        const next=event.target.value as PhotoView
                        setPhotoPreviews(list=>list.map(p=>
                          p.url===preview.url?{...p,view:next}:p))
                      }}>
                      {VIEW_OPTIONS.map(option =>
                        <option key={option.value} value={option.value}>{option.label}</option>)}
                    </select>
                  </label>
                </figure>)}
            </div>}
            <div role="status" aria-label="照片拍摄覆盖度" className="photo-coverage">
              {evaluatePhotoCoverage(photoPreviews).annotated
                ? '已人工标注主要方向（不代表照片清晰、可重建或已建模）。'
                : '缺少：' + evaluatePhotoCoverage(photoPreviews).missing.map(key => ({
                    front:'车头',rear:'车尾',left:'左侧',right:'右侧',top:'顶部',diagonal:'斜侧'
                  }[key])).join('、')}
            </div>
            <fieldset className="toy-measurements">
              <legend>实物小车测量（cm，选填，必须一起填长宽高）</legend>
              {([
                ['length','实物车长（cm）'],['width','实物车宽（cm）'],
                ['height','实物车高（cm）']
              ] as const).map(([field,title]) => (
                <label key={field}>{title}
                  <input type="number" inputMode="decimal" step="0.1" min="0.5" max="200"
                    aria-label={title} value={toyDimensions[field]}
                    onChange={e=>setToyDimensions(old=>({...old,[field]:e.target.value}))}
                    placeholder="0.5–200" />
                </label>
              ))}
            </fieldset>
            <button type="button" className="capture-download"
              disabled={photoPreviews.length===0}
              onClick={exportCaptureManifest}>导出采集清单 JSON</button>
            <small>采集清单仅包含照片文件名、大小、人工标注角度和填写的厘米尺寸；不含原始照片、EXIF 或预览 URL。文件名可能有个人信息，只有点击后才会下载。本功能不会自动识别拍摄角度，不会自动建模或改变驾驶模型。</small>
            <small>最多 {MAX_PHOTOS} 张，每张 12 MiB、共 72 MiB；目前仅支持 JPG、PNG、WebP。HEIC 请先转换 JPG。照片仅保留当前页面内存，不会上传，也不会自动存入车库。</small>
          </section>
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
          <button className="drive-button" onClick={() => {keys.current.clear(); touchPointers.current.clear(); updateControls(); setGarageOpen(false)}} disabled={garageBusy}>开始驾驶 →</button>
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
