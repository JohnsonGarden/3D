/**
 * Built-asset-only local HTTP server.
 * No dependencies, API, telemetry, upload handlers or LAN binding.
 * One Node process serving prebuilt Vite dist on 127.0.0.1.
 */
import { createServer } from 'node:http'
import { existsSync, realpathSync, statSync, createReadStream } from 'node:fs'
import { resolve, relative, extname, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const dist = resolve(fileURLToPath(new URL('../dist/', import.meta.url)))
const index = resolve(dist, 'index.html')
const portText = process.env.BRICK_WORLD_PORT ?? '4173'
if (!/^\d{1,5}$/.test(portText)) {
  console.error('端口必须是 0–65535 范围内的整数（0 仅用于测试）。')
  process.exit(2)
}
const port = Number(portText)
if (!Number.isInteger(port) || port < 0 || port > 65535) {
  console.error('无效端口:', portText)
  process.exit(2)
}
if (!existsSync(index)) {
  console.error('找不到 dist/index.html。请先运行 npm run build。')
  process.exit(2)
}

const mime = Object.freeze({
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.wasm': 'application/wasm',
  '.glb': 'model/gltf-binary',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8'
})

function insideDist(path) {
  const rel = relative(realpathSync(dist), path)
  return rel !== '..' && !rel.startsWith('..' + sep) && !rel.startsWith('/') && !rel.startsWith('\\')
}
function send(res, status, body) {
  res.writeHead(status, {'content-type': 'text/plain; charset=utf-8',
    'cache-control': 'no-store', 'x-content-type-options': 'nosniff'})
  res.end(body)
}
const server = createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('allow', 'GET, HEAD')
    send(res, 405, 'Method not allowed')
    return
  }
  // Examine raw path before URL normalization; encoded traversal is rejected.
  const rawPath = (req.url || '/').split('?')[0].split('#')[0]
  let decoded
  try { decoded = decodeURIComponent(rawPath) }
  catch { send(res, 400, 'Invalid path encoding'); return }
  if (!decoded.startsWith('/') || decoded.includes('\\') ||
      decoded.includes('\0') || decoded.split('/').some(segment => segment === '..' || segment === '.')) {
    send(res, 400, 'Invalid path')
    return
  }
  if (decoded === '/__brickworld/health') {
    const json = '{"app":"brickworld3d","version":1}'
    res.writeHead(200, {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store', 'x-content-type-options': 'nosniff',
      'content-length': Buffer.byteLength(json)
    })
    res.end(req.method === 'HEAD' ? undefined : json)
    return
  }
  if (decoded.startsWith('/__brickworld/')) { send(res, 404, 'Not found'); return }
  const pathname = decoded.replace(/^\/+/, '')
  let path = resolve(dist, pathname || 'index.html')
  if (!insideDist(path)) { send(res, 403, 'Forbidden'); return }
  if (!existsSync(path)) {
    // Only HTML navigation routes may use SPA fallback, not missing assets.
    const accept = req.headers.accept || ''
    if (extname(pathname) === '' && accept.includes('text/html')) {
      path = index
    } else { send(res, 404, 'Not found'); return }
  }
  try {
    const fsPath = realpathSync(path)
    if (!insideDist(fsPath) || !statSync(fsPath).isFile()) {
      send(res, 403, 'Forbidden')
      return
    }
    const type = mime[extname(fsPath).toLowerCase()] || 'application/octet-stream'
    const stat = statSync(fsPath)
    res.writeHead(200, {
      'content-type': type,
      'content-length': stat.size,
      'cache-control': fsPath === index ? 'no-cache' : 'public, max-age=3600',
      'x-content-type-options': 'nosniff',
      'referrer-policy': 'no-referrer',
      'x-frame-options': 'DENY'
    })
    if (req.method === 'HEAD') res.end()
    else createReadStream(fsPath).on('error', () => res.destroy()).pipe(res)
  } catch {
    if (!res.headersSent) send(res, 500, 'Unable to serve file')
    else res.destroy()
  }
})

server.on('error', error => {
  console.error('本地端口启动失败：', error.code === 'EADDRINUSE'
    ? '端口 ' + port + ' 已被其他程序占用。可用 BRICK_WORLD_PORT=4174 更换。'
    : error.message)
  process.exitCode = 1
})
server.listen(port, '127.0.0.1', () => {
  const address = server.address()
  console.log('积木世界已启动：http://127.0.0.1:' + address.port)
})
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => server.close(() => process.exit(0)))
}
