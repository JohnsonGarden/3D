import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync, existsSync} from 'node:fs'

test('012 committed npm v3 lock matches direct runtime and dev dependencies', () => {
  assert.equal(existsSync('package-lock.json'),true,'commit package-lock.json before installing')
  const manifest=JSON.parse(readFileSync('package.json','utf8'))
  const lock=JSON.parse(readFileSync('package-lock.json','utf8'))
  assert.equal(lock.lockfileVersion,3)
  assert.equal(lock.name,manifest.name)
  assert.deepEqual(lock.packages[''].dependencies,manifest.dependencies)
  assert.deepEqual(lock.packages[''].devDependencies,manifest.devDependencies)
  assert.ok(Object.keys(lock.packages).length > 30,'lockfile must include real resolved transitive packages')
})

test('012 both GitHub Actions jobs must use npm ci and lock-keyed npm cache',()=>{
  const ci=readFileSync('.github/workflows/ci.yml','utf8')
  const installs=ci.match(/- run: npm ci --no-audit --no-fund/g) ?? []
  const cachePaths=ci.match(/cache-dependency-path: package-lock.json/g) ?? []
  assert.equal(installs.length,2)
  assert.equal(cachePaths.length,2)
  assert.equal((ci.match(/cache: npm/g) ?? []).length,2)
  assert.equal(ci.includes('npm install --no-audit --no-fund'),false)
})

test('012 one-click local installation already prefers npm ci with committed lock',()=>{
  const script=readFileSync('scripts/start-local.sh','utf8')
  assert.match(script,/if \[\[ -f package-lock\.json \]\]; then[\s\S]*?npm ci --no-audit --no-fund/)
  assert.match(script,/require_normal_user "\$EUID"/)
})
