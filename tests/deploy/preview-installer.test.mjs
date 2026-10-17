import test from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync,mkdirSync,writeFileSync,readFileSync,rmSync,statSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
const launcher=resolve('下载并启动积木世界.command')

test('017 isolated preview installer with cumulative 017 source, distinct home and port',()=>{
  const code=readFileSync(launcher,'utf8')
  assert.match(code,/feat\/017-integrate-branches\.zip/)
  assert.match(code,/BrickWorld3D-preview-017/)
  assert.match(code,/BRICK_WORLD_PORT.*4175/)
  assert.match(code,/127\.0\.0\.1|start-local\.sh/)
  assert.ok(statSync(launcher).mode & 0o111)
  const rootGuard=code.indexOf('EUID')
  assert.ok(rootGuard>0 && rootGuard < code.indexOf('curl --fail'))
})

test('017 valid user preview folder is reused with no download and default 4175',()=>{
  const home=mkdtempSync(join(tmpdir(),'brickworld-preview-'))
  try {
    mkdirSync(join(home,'scripts'))
    writeFileSync(join(home,'package.json'),'{}')
    writeFileSync(join(home,'scripts/start-local.sh'),
      '#!/bin/bash\nprintf "PORT=%s\\n" "$BRICK_WORLD_PORT"\n')
    const run=spawnSync('/bin/bash',[launcher,'--no-open'],{
      encoding:'utf8',timeout:4000,
      env:{...process.env,BRICK_WORLD_HOME:home}
    })
    assert.equal(run.status,0,run.stderr)
    assert.match(run.stdout,/PORT=4175/)
    assert.equal(readFileSync(join(home,'package.json'),'utf8'),'{}')
  }finally{rmSync(home,{recursive:true,force:true})}
})

test('017 caller-supplied port remains authoritative',()=>{
  const home=mkdtempSync(join(tmpdir(),'brickworld-preview-custom-'))
  try {
    mkdirSync(join(home,'scripts'))
    writeFileSync(join(home,'package.json'),'{}')
    writeFileSync(join(home,'scripts/start-local.sh'),
      '#!/bin/bash\nprintf "PORT=%s\\n" "$BRICK_WORLD_PORT"\n')
    const run=spawnSync('/bin/bash',[launcher],{
      encoding:'utf8',timeout:4000,
      env:{...process.env,BRICK_WORLD_HOME:home,BRICK_WORLD_PORT:'4500'}
    })
    assert.equal(run.status,0,run.stderr)
    assert.match(run.stdout,/PORT=4500/)
  }finally{rmSync(home,{recursive:true,force:true})}
})
