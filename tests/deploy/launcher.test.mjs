import test from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync, spawnSync } from 'node:child_process'
import { existsSync, readFileSync, statSync, mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { resolve, join } from 'node:path'
import { tmpdir } from 'node:os'

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

const bootstrap = resolve('下载并启动积木世界.command')
test('standalone downloader is executable, syntax valid and points to HTTPS GitHub branch', () => {
  assert.ok(existsSync(bootstrap))
  assert.ok(statSync(bootstrap).mode & 0o111)
  execFileSync('/bin/bash',['-n',bootstrap],{stdio:'pipe'})
  const contents = readFileSync(bootstrap,'utf8')
  assert.match(contents,/https:\/\/github\.com\/JohnsonGarden\/3D\/archive\/refs\/heads\/feat\/lego-world-harness-v0\.zip/)
  assert.doesNotMatch(contents,/curl[^\n]*\|\s*bash|sudo |killall /)
})

test('installer uses previously downloaded project without overwriting or contacting GitHub', () => {
  const folder = mkdtempSync(join(tmpdir(),'brick-world-中文 path '))
  try {
    mkdirSync(join(folder,'scripts'))
    writeFileSync(join(folder,'package.json'),'{}')
    writeFileSync(join(folder,'scripts/start-local.sh'),'#!/bin/bash\necho SAFE_REUSE "${1:-}"\n')
    const launched = spawnSync('/bin/bash',[bootstrap,'--no-open'],{
      encoding:'utf8',timeout:3000,
      env:{...process.env,BRICK_WORLD_HOME:folder,PATH:'/usr/bin:/bin'}
    })
    assert.equal(launched.status,0,launched.stderr)
    assert.match(launched.stdout,/SAFE_REUSE --no-open/)
    assert.equal(readFileSync(join(folder,'package.json'),'utf8'),'{}')
  } finally {rmSync(folder,{recursive:true,force:true})}
})

test('bootstrap refuses to overwrite an unrelated existing user folder', () => {
  const folder = mkdtempSync(join(tmpdir(),'brick-world-occupied '))
  try {
    writeFileSync(join(folder,'important.txt'),'do not delete')
    const launched = spawnSync('/bin/bash',[bootstrap],{encoding:'utf8',timeout:3000,
      env:{...process.env,BRICK_WORLD_HOME:folder,PATH:'/usr/bin:/bin'}
    })
    assert.notEqual(launched.status,0)
    assert.equal(readFileSync(join(folder,'important.txt'),'utf8'),'do not delete')
  } finally {rmSync(folder,{recursive:true,force:true})}
})
