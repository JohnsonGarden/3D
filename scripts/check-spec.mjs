import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const root = 'specs'
const folders = readdirSync(root).filter(name => {
  const path = join(root, name)
  return statSync(path).isDirectory() && /^\d{3}-[\w-]+$/.test(name)
})
const errors = []
if (!folders.length) errors.push('At least one specs/NNN-feature packet is required')
if (!existsSync('.specify/memory/constitution.md') || !existsSync('AGENTS.md')) {
  errors.push('Missing project constitution or AGENTS.md')
}
for (const folder of folders) {
  const base = join(root, folder)
  const get = name => {
    const path = join(base, name)
    if (!existsSync(path)) { errors.push('Missing ' + path); return '' }
    const content = readFileSync(path, 'utf8')
    if (content.trim().length < 100) errors.push('Short/empty ' + path)
    return content
  }
  const spec = get('spec.md')
  const plan = get('plan.md')
  const tasks = get('tasks.md')
  const matrix = get('test-matrix.md')
  const ids = new Set(spec.match(/FR-\d{3}/g) ?? [])
  if (!ids.size) errors.push(folder + ': missing FR-### requirements')
  if (!/Given|when|then/i.test(spec)) errors.push(folder + ': no scenario acceptance language')
  if (!/\[[ x]\]/.test(tasks)) errors.push(folder + ': no task checklist')
  if (plan && !/architecture|design|结构|架构/i.test(plan)) errors.push(folder + ': no design decisions')
  for (const id of ids) {
    if (!matrix.includes(id)) errors.push(folder + ': ' + id + ' missing from test-matrix')
    if (!tasks.includes(id) && !tasks.includes('FR-001..FR-008')) {
      errors.push(folder + ': ' + id + ' missing from tasks')
    }
  }
}
if (errors.length) {
  errors.forEach(error => console.error('FAIL:', error))
  process.exit(1)
}
console.log('PASS: constitution, agent contract and', folders.length, 'SDD feature packet(s) traced')
