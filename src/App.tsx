import { useCallback, useEffect, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { Box3, Object3D, Vector3 } from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import World from './world/World.tsx'
import { validateGlbBytes } from './sim/glb-guard.ts'
import { TRUCK_DIMENSIONS, scaleImportedModelByWidth } from './sim/truck-scale.ts'
import type { DriverInput } from './sim/vehicle.ts'

const MAX_GLB = 20 * 1024 * 1024
const MAX_AUDIO = 30 * 1024 * 1024

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
  const [model, setModel] = useState<Object3D | null>(null)
  const [modelName, setModelName] = useState('阳光积木小车 · 示例模型')
  const [musicUrl, setMusicUrl] = useState<string | null>(null)
  const [musicName, setMusicName] = useState<string | null>(null)
  const [error, setError] = useState('')
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
  }, [updateControls])

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

  const loadModel = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!file.name.toLowerCase().endsWith('.glb') || file.size > MAX_GLB || file.size === 0) {
      setError('请选择不超过 20 MB 的 .glb 模型文件。')
      return
    }
    try {
      const bytes = await file.arrayBuffer()
      validateGlbBytes(bytes)
      const parsed = await new GLTFLoader().parseAsync(bytes, '')
      const box = new Box3().setFromObject(parsed.scene)
      const dimension = box.getSize(new Vector3())
      if (box.isEmpty() || ![dimension.x, dimension.y, dimension.z].every(Number.isFinite) ||
          Math.max(dimension.x, dimension.y, dimension.z) <= 0) {
        throw new Error('empty or invalid geometry')
      }
      scaleImportedModelByWidth(dimension)
      setModel(parsed.scene)
      setModelName(file.name)
      setError('')
      setGarageOpen(true)
    } catch {
      setError('无法读取这个 GLB，请检查模型是否完整，并尝试重新导出。原车辆仍然保留。')
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
          <World controls={controls} garageOpen={garageOpen} resetCount={resetCount}
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
        <aside className="controls-help" aria-label="驾驶操作说明">
          <span><kbd>W</kbd> / <kbd>↑</kbd> 前进</span>
          <span><kbd>S</kbd> / <kbd>↓</kbd> 倒车</span>
          <span><kbd>A</kbd><kbd>D</kbd> / ← → 转向</span>
          <span><kbd>Space</kbd> 刹车</span>
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
            <div><strong>{modelName}</strong><small>{model ? '自定义 GLB · 会话临时导入' : '程序化示例 · 尚非照片重建'}</small></div>
          </div>
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
              <div><dt>轴距 1–2 / 2–3 / 3–4</dt><dd>{TRUCK_DIMENSIONS.axleSpacingM.map(x => x.toFixed(2)).join(' / ')} m</dd></div>
            </dl>
          </div>
          <label className="file-button">导入孩子的小车（GLB）
            <input aria-label="导入 GLB 模型" type="file" accept=".glb,model/gltf-binary" onChange={loadModel}/>
          </label>
          <p className="hint">只在本机浏览器中读取，不会上传。模型暂不永久保存。导入模型以 X 轴包围盒宽度统一缩放至 2.50 m。若含后视镜等突起则需人工校准，车头方向应为 -Z。</p>
          <button className="drive-button" onClick={() => setGarageOpen(false)}>开始驾驶 →</button>
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
