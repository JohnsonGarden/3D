import test from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync, spawnSync } from 'node:child_process'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { resolve } from 'node:path'

const script = resolve('scripts/start-local.sh')
const command = resolve('启动积木世界.command')

test('macOS click launcher and shell script are executable and have safe syntax', () => {
  assert.ok(existsSync(command))
  assert.ok(existsSync(script))
  assert.ok(statSync(command).mode & 0o111, 'Finder command should preserve executable flag')
  execFileSync('/bin/bash',['-n', script],{stdio:'pipe'})
  execFileSync('/bin/bash',['-n', command],{stdio:'pipe'})
  assert.match(readFileSync(script,'utf8'),/127\.0\.0\.1/)
  assert.doesNotMatch(readFileSync(script,'utf8'),/--host\s+0\.0\.0\.0|sudo |killall /)
})
test('shell help works with no network and explains shutdown', () => {
  const r = spawnSync('/bin/bash',[script,'--help'],{encoding:'utf8',timeout:3000})
  assert.equal(r.status,0,r.stderr)
  assert.match(r.stdout,/--no-open/)
  assert.match(r.stdout,/Ctrl\+C/)
})
test('environment preflight does not download or install anything', () => {
  const r = spawnSync('/bin/bash',[script,'--check'],{encoding:'utf8',timeout:7000})
  assert.equal(r.status,0,r.stderr || r.stdout)
  assert.match(r.stdout,/Node/)
})
