// Two sources, one shape. Booklet patterns (generated, six steps each) get their notes from data.js;
// web patterns are one JSON file each in src/web/ and carry their own.
import BOOKLET from './patterns.json'
import { NOTES } from './data.js'

const WEB = Object.values(import.meta.glob('./web/*.json', { eager: true, import: 'default' }))

export const PATTERNS = [
  ...BOOKLET.map(p => ({ ...p, imitates: NOTES[p.id][0], sizes: NOTES[p.id][1], source: { name: 'SWTU Fly Tying I', page: p.page } })),
  ...WEB,
].map(p => ({ ...p, hero: p.steps.at(-1).img })).toSorted((a, b) => a.name.localeCompare(b.name)) // a dictionary reads A–Z

export const KINDS = [...new Set(PATTERNS.map(p => p.kind))].sort()
export const byId = Object.fromEntries(PATTERNS.map(p => [p.id, p]))
export const byName = Object.fromEntries(PATTERNS.map(p => [p.name.toLowerCase(), p]))
