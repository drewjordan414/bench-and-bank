// node --test   (no framework: node:test and node:assert)
import test from 'node:test'
import assert from 'node:assert/strict'
import { span } from '../src/months.js'
import { recommend } from '../src/data.js'
import { cleanTrip, cleanTrips, tripStats, fishOn, newestFirst, TripError } from '../src/trips.js'

test('span joins runs of months and wraps the year', () => {
  assert.equal(span([4, 5, 9, 10]), 'Apr–May, Sep–Oct')
  assert.equal(span([11, 12, 1, 2]), 'Nov–Feb')
  assert.equal(span([6]), 'Jun')
  assert.equal(span([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]), 'All year')
})

test('recommend ranks patterns by how many of the month\'s hatches they cover', () => {
  const { hatches, flies } = recommend('driftless', 5)
  assert.ok(hatches.length > 3)
  assert.ok(hatches.every(h => h.r === 'driftless' && h.m.includes(5)))
  for (let i = 1; i < flies.length; i++) assert.ok(flies[i - 1].for.length >= flies[i].for.length)
  assert.deepEqual(recommend('nowhere', 5), { hatches: [], flies: [] })
})

const good = { date: '2026-10-10', water: '  Timber Coulee  ', lat: '43.71', lng: '-90.93', notes: 'Low and clear.',
  catches: [{ species: 'Brown trout', count: '2', length: '11.5', fly: 'Pheasant Tail Nymph', hook: '#16' }, { species: '', count: '1', length: '', fly: '', hook: '' }] }

test('cleanTrip tidies a form into a trip', () => {
  const t = cleanTrip(good, '2026-10-11')
  assert.equal(t.water, 'Timber Coulee')
  assert.equal(t.lat, 43.71); assert.equal(t.lng, -90.93)
  assert.equal(t.catches.length, 1, 'the untouched row is dropped')
  assert.deepEqual(t.catches[0], { species: 'Brown trout', fly: 'Pheasant Tail Nymph', hook: '#16', length: 11.5, count: 2 })
  assert.ok(t.id)
  assert.equal(cleanTrip({ ...t }, '2026-10-11').id, t.id, 'an existing id is kept')
})

test('cleanTrip allows a day with no pin and no fish', () => {
  const t = cleanTrip({ date: '2026-01-02', water: 'Black Earth Creek', lat: '', lng: '' }, '2026-10-11')
  assert.equal(t.lat, null); assert.deepEqual(t.catches, [])
})

test('cleanTrip refuses what it should', () => {
  const bad = patch => assert.throws(() => cleanTrip({ ...good, ...patch }, '2026-10-11'), TripError)
  bad({ date: '' }); bad({ date: '10/10/2026' }); bad({ date: '2026-10-12' }) // future
  bad({ water: '   ' })
  bad({ lat: '95' }); bad({ lng: '' })                                          // half a pin
  bad({ catches: [{ species: '', fly: 'Adams' }] })                             // a fish with no species
  bad({ catches: [{ species: 'Brown trout', count: '0' }] })
  bad({ catches: [{ species: 'Brown trout', length: '900' }] })
  assert.throws(() => cleanTrips({}), TripError)
  assert.throws(() => cleanTrip(null), TripError)
})

test('stats count fish, not rows', () => {
  const trips = cleanTrips([good, { date: '2026-09-01', water: 'Kinnickinnic', catches: [{ species: 'Brook trout', count: 3, fly: 'pheasant tail nymph' }, { species: 'Brown trout', fly: 'Adams' }] }])
  assert.deepEqual(tripStats(trips).fish, 6)
  assert.deepEqual(fishOn(trips, 'Pheasant Tail Nymph'), { fish: 5, days: 2 })
  assert.deepEqual(fishOn(trips, 'Zonker'), { fish: 0, days: 0 })
  assert.equal(newestFirst(trips)[0].water, 'Timber Coulee')
  assert.deepEqual(tripStats([]), { trips: 0, fish: 0, topFly: null })
})
