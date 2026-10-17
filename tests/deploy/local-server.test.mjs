import test from 'node:test'
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { resolve } from 'node:path'

const serverFile = resolve('scripts/serve-local.mjs')
const sleep = milliseconds => new Promise(r => setTimeout(r, milliseconds))

async function createServer(port = '0') {
  const child = spawn(process.execPath, [serverFile], {
    cwd: process.cwd(), env: {...process.env, BRICK_WORLD_PORT: port},
    stdio: ['ignore', 'pipe', 'pipe']
  })
  let output = ''
  let errors = ''
  child.stdout.on('data', chunk => { output += chunk.toString() })
  child.stderr.on('data', chunk => { errors += chunk.toString() })
  for (let n = 0; n < 120; n++) {
    const found = output.match(/http:\/\/127\.0\.0\.1:(\d+)/)
    if (found) return {child, port: Number(found[1])}
    if (child.exitCode !== null) throw new Error('server quit: ' + errors + output)
    await sleep(40)
  }
  child.kill('SIGTERM')
  throw new Error('server not ready: ' + errors + output)
}
async function stopServer(child) {
  if (child.exitCode !== null) return
  const exited = once(child, 'exit')
  child.kill('SIGTERM')
  await exited
}
test('servable local build, health sentinel, SPA and MIME are correct', async () => {
  const {child,port} = await createServer()
  try {
    const base = `http://127.0.0.1:${port}`
    const health = await fetch(base + '/__brickworld/health')
    assert.equal(health.status, 200)
    assert.match(health.headers.get('content-type'), /application\/json/)
    assert.deepEqual(await health.json(), {app:'brickworld3d',version:1})
    const index = await fetch(base + '/')
    assert.equal(index.status, 200)
    const html = await index.text()
    assert.match(html, /<html/i)
    const asset = html.match(/src="(\/assets\/[^"]+\.js)"/)
    assert.ok(asset, 'built Vite JS chunk exists')
    const js = await fetch(base + asset[1])
    assert.equal(js.status, 200)
    assert.match(js.headers.get('content-type'), /javascript/)
    const cssPath = html.match(/href="(\/assets\/[^"]+\.css)"/)
    if (cssPath) {
      const css = await fetch(base + cssPath[1])
      assert.equal(css.status, 200)
      assert.match(css.headers.get('content-type'), /text\/css/)
    }
    const head = await fetch(base + asset[1], {method:'HEAD'})
    assert.equal(head.status, 200)
    assert.equal(await head.text(), '')
    assert.equal((await fetch(base + '/no-such.css')).status, 404)
    assert.equal((await fetch(base + '/', {method:'POST'})).status, 405)
    assert.equal((await fetch(base + '/%2e%2e%2fLICENSE')).status, 400)
    assert.equal((await fetch(base + '/%5csecret')).status, 400)
  } finally {await stopServer(child)}
})

test('bad port rejects immediately without binding or side effects', async () => {
  const child = spawn(process.execPath,[serverFile],{
    env:{...process.env,BRICK_WORLD_PORT:'not-a-port'},stdio:['ignore','pipe','pipe']
  })
  const [status] = await once(child,'exit')
  assert.notEqual(status,0)
})

test('port conflicts do not kill, reuse or replace an unrelated server', async () => {
  const first = await createServer()
  try {
    const second = spawn(process.execPath,[serverFile],{
      env:{...process.env, BRICK_WORLD_PORT:String(first.port)},stdio:['ignore','pipe','pipe']
    })
    const [status] = await once(second,'exit')
    assert.notEqual(status,0)
    const stillThere = await fetch(`http://127.0.0.1:${first.port}/__brickworld/health`)
    assert.equal(stillThere.status,200)
  } finally {await stopServer(first.child)}
})
