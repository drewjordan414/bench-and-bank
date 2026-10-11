// node check.js — fails loudly if the hand-written data and the generated patterns drift apart.
import assert from 'node:assert'
import fs from 'node:fs'
import { REGIONS, HATCHES, NOTES, recommend } from './src/data.js'

const here = f => new URL(f, import.meta.url)
const BOOKLET = JSON.parse(fs.readFileSync(here('src/patterns.json')))
const webDir = here('src/web/')
const WEB = fs.existsSync(webDir) ? fs.readdirSync(webDir).filter(f => f.endsWith('.json')).map(f => ({ file: f, ...JSON.parse(fs.readFileSync(new URL(f, webDir))) })) : []
const PATTERNS = [...BOOKLET, ...WEB]
const ids = new Set(PATTERNS.map(p => p.id))
assert(ids.size === PATTERNS.length, 'duplicate pattern id')
for (const p of BOOKLET) {
  assert(NOTES[p.id], `no NOTES entry for ${p.id}`)
  assert(p.steps.length === 6, `${p.id}: booklet patterns have six steps`)
}
for (const p of WEB) {
  assert(p.file === p.id + '.json', `${p.file}: id does not match filename`)
  assert(['Dry Fly', 'Nymph', 'Wet Fly', 'Streamer'].includes(p.kind), `${p.id}: bad kind ${p.kind}`)
  assert(p.name && p.imitates && /^#\d/.test(p.sizes) && /^https?:/.test(p.source?.url), `${p.id}: missing name/imitates/sizes/source`)
  assert(p.steps.length >= 4 && p.steps.length <= 14, `${p.id}: ${p.steps.length} steps`)
  const onDisk = fs.readdirSync(here(`public/img/${p.id}/`)).length
  assert(onDisk === p.steps.length, `${p.id}: ${onDisk} photos on disk for ${p.steps.length} steps`)
}
for (const p of PATTERNS) {
  assert(p.recipe.length >= 3 && p.recipe.every(r => r.length === 2 && r[0] && r[1]), `${p.id}: recipe looks wrong`)
  for (const s of p.steps) assert(s.text && fs.existsSync(here('public/' + s.img)), `${p.id}: bad step ${s.img}`)
}
for (const id in NOTES) assert(ids.has(id), `NOTES has unknown pattern ${id}`)
for (const x of HATCHES) {
  assert(REGIONS.some(r => r.id === x.r), `unknown region ${x.r}`)
  assert(x.m.every(m => m >= 1 && m <= 12), `bad month in ${x.bug}`)
  for (const id of x.flies) assert(ids.has(id), `${x.bug}: unknown pattern ${id}`)
}
// every water has something to tie in every month, ranked most-useful first
for (const r of REGIONS) for (let m = 1; m <= 12; m++) {
  const { flies } = recommend(r.id, m)
  assert(flies.length >= 3, `${r.id} month ${m}: only ${flies.length} patterns`)
  assert(flies.every((f, i) => !i || flies[i - 1].for.length >= f.for.length), 'ranking not sorted')
}
const used = new Set(HATCHES.flatMap(x => x.flies))
const unused = [...ids].filter(id => !used.has(id))
if (unused.length) console.log(`note — in the dictionary but in no hatch row: ${unused.join(', ')}`)
console.log(`ok — ${PATTERNS.length} patterns, ${HATCHES.length} hatch rows, ${REGIONS.length} waters`)
