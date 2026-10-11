// Trip log rules. Pure, so the browser form, the save endpoint (vite.config.js) and the tests all share them.

export const SPECIES = ['Brown trout', 'Rainbow trout', 'Brook trout', 'Cutthroat trout', 'Tiger trout', 'Lake trout', 'Mountain whitefish']

export class TripError extends Error {}

const text = (v, max) => String(v ?? '').trim().slice(0, max)
function number(v, lo, hi, what) {
  if (v === '' || v == null) return null
  const n = Number(v)
  if (!Number.isFinite(n) || n < lo || n > hi) throw new TripError(`${what} should be between ${lo} and ${hi}.`)
  return n
}

export const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` }

// Takes whatever the form or the file holds and returns a well-formed trip, or throws a TripError a person can read.
export function cleanTrip(raw, latest = today()) {
  if (!raw || typeof raw !== 'object') throw new TripError('That is not a trip.')
  const date = text(raw.date, 10)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date))) throw new TripError('Pick the date of the trip.')
  if (date > latest) throw new TripError('That date is in the future.')
  const water = text(raw.water, 80)
  if (!water) throw new TripError('Name the water you fished.')
  const lat = number(raw.lat, -90, 90, 'Latitude'), lng = number(raw.lng, -180, 180, 'Longitude')
  if ((lat == null) !== (lng == null)) throw new TripError('A pin needs both latitude and longitude.')
  const catches = (Array.isArray(raw.catches) ? raw.catches : []).slice(0, 50)
    .map(c => ({ species: text(c?.species, 40), fly: text(c?.fly, 60), hook: text(c?.hook, 12), length: number(c?.length, 0, 60, 'Length'), count: number(c?.count, 1, 99, 'Count') ?? 1 }))
    .filter(c => c.species || c.fly || c.hook || c.length != null) // an untouched row is not a fish
  for (const c of catches) {
    if (!c.species) throw new TripError('Each fish needs a species.')
    c.count = Math.round(c.count)
  }
  return { id: text(raw.id, 40) || crypto.randomUUID(), date, water, lat, lng, catches, notes: text(raw.notes, 2000) }
}

export function cleanTrips(raw) {
  if (!Array.isArray(raw) || raw.length > 5000) throw new TripError('The log should be a list of trips.')
  return raw.map(t => cleanTrip(t, '9999-12-31')) // the file is not re-judged on dates
}

export const newestFirst = trips => [...trips].sort((a, b) => b.date.localeCompare(a.date))

export function tripStats(trips) {
  const byFly = new Map()
  let fish = 0
  for (const t of trips) for (const c of t.catches) {
    fish += c.count
    if (c.fly) byFly.set(c.fly, (byFly.get(c.fly) || 0) + c.count)
  }
  const topFly = [...byFly].sort((a, b) => b[1] - a[1])[0] || null
  return { trips: trips.length, fish, topFly }
}

// How a pattern has done: fish caught on it and the days it caught them.
export function fishOn(trips, flyName) {
  const name = flyName.toLowerCase()
  let fish = 0, days = 0
  for (const t of trips) {
    const n = t.catches.reduce((sum, c) => sum + (c.fly.toLowerCase() === name ? c.count : 0), 0)
    if (n) { fish += n; days++ }
  }
  return { fish, days }
}
