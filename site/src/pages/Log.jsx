import { useEffect, useRef, useState } from 'react'
import { PATTERNS, byName } from '../patterns.js'
import { SPECIES, cleanTrip, newestFirst, today, tripStats } from '../trips.js'
import TripMap from '../TripMap.jsx'
import { Hook } from '../ui.jsx'

const blankFish = () => ({ species: '', count: '1', length: '', fly: '', hook: '' })
const blankTrip = () => ({ date: today(), water: '', lat: '', lng: '', notes: '', catches: [blankFish()] })
// A saved trip back into form strings.
const toForm = t => ({ ...t, lat: t.lat ?? '', lng: t.lng ?? '', catches: [...t.catches.map(c => ({ ...c, count: String(c.count), length: c.length ?? '' })), blankFish()] })
const fmtDate = iso => { const [y, m, d] = iso.split('-').map(Number); return new Date(y, m - 1, d).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) }

// Find a place by name. Nominatim is OpenStreetMap's free geocoder: no key, but it asks for one search per
// second at most and no search-as-you-type, so this only looks when you press Search.
// ponytail: US only (countrycodes=us) because every water here is; drop the parameter to search the world.
function MapSearch({ onGo }) {
  const [q, setQ] = useState('')
  const [hits, setHits] = useState(null) // null: not searched; []: nothing found
  const [state, setState] = useState('idle') // idle | busy | failed
  async function search(e) {
    e.preventDefault()
    if (!q.trim() || state === 'busy') return
    setState('busy'); setHits(null)
    try {
      const r = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=6&countrycodes=us&q=${encodeURIComponent(q.trim())}`)
      if (!r.ok) throw new Error(r.status)
      const found = (await r.json()).map(h => {
        const [s, n, w, e] = (h.boundingbox || []).map(Number)
        return { id: h.place_id, name: String(h.display_name), bounds: [[s, w], [n, e]] }
      }).filter(h => h.bounds.flat().every(Number.isFinite))
      setHits(found); setState('idle')
      if (found.length === 1) onGo(found[0].bounds)
    } catch { setState('failed') }
  }
  return (
    <div className="map-search">
      <form role="search" onSubmit={search}>
        <input type="search" aria-label="Find a place on the map" placeholder="Find a creek, town or access point" value={q} onChange={e => setQ(e.target.value)} />
        <button className="primary" disabled={state === 'busy'}>{state === 'busy' ? 'Searching…' : 'Search'}</button>
      </form>
      {state === 'failed' && <p className="error" role="alert">The place search is not answering. The map still works: zoom to the spot by hand.</p>}
      {hits && !hits.length && <p className="hint" role="status">Nothing found for “{q.trim()}”. Try adding the county or state.</p>}
      {hits && hits.length > 1 && (
        <ul aria-label="Places found">
          {hits.map(h => <li key={h.id}><button type="button" className="quiet" onClick={() => { onGo(h.bounds); setHits(null) }}>{h.name}</button></li>)}
        </ul>
      )}
    </div>
  )
}

function TripForm({ form, setForm, onSave, onCancel, error, waters, busy }) {
  const set = patch => setForm(f => ({ ...f, ...patch }))
  const setFish = (i, patch) => setForm(f => ({ ...f, catches: f.catches.map((c, n) => n === i ? { ...c, ...patch } : c) }))
  return (
    <form className="trip-form" onSubmit={e => { e.preventDefault(); onSave() }} noValidate>
      <h2>{form.id ? 'Edit trip' : 'Log a trip'}</h2>
      <div className="fields two">
        <label>Date<input type="date" required max={today()} value={form.date} onChange={e => set({ date: e.target.value })} /></label>
        <label>Water<input type="text" required maxLength={80} list="waters" placeholder="Timber Coulee Creek" value={form.water} onChange={e => set({ water: e.target.value })} /></label>
      </div>
      <datalist id="waters">{waters.map(w => <option key={w} value={w} />)}</datalist>

      <fieldset>
        <legend>Where</legend>
        <p className="hint">Click the map to drop a pin, or type the coordinates. A trip can be saved without one.</p>
        <div className="fields pin-fields">
          <label>Latitude<input type="number" step="any" min="-90" max="90" inputMode="decimal" value={form.lat} onChange={e => set({ lat: e.target.value })} /></label>
          <label>Longitude<input type="number" step="any" min="-180" max="180" inputMode="decimal" value={form.lng} onChange={e => set({ lng: e.target.value })} /></label>
          {(form.lat !== '' || form.lng !== '') && <button type="button" className="quiet" onClick={() => set({ lat: '', lng: '' })}>Clear pin</button>}
        </div>
      </fieldset>

      <fieldset>
        <legend>Fish</legend>
        <p className="hint">One row per kind of fish and fly. Leave it empty for a day with nothing to hand.</p>
        {form.catches.map((c, i) => (
          <div className="fields fish" key={i}>
            <label>Species<input type="text" list="species" maxLength={40} value={c.species} onChange={e => setFish(i, { species: e.target.value })} /></label>
            <label>Caught on<input type="text" list="flies" maxLength={60} value={c.fly} onChange={e => setFish(i, { fly: e.target.value })} /></label>
            <label>How many<input type="number" min="1" max="99" inputMode="numeric" value={c.count} onChange={e => setFish(i, { count: e.target.value })} /></label>
            <label>Length, in<input type="number" min="0" max="60" step="0.5" inputMode="decimal" value={c.length} onChange={e => setFish(i, { length: e.target.value })} /></label>
            <label>Hook<input type="text" maxLength={12} placeholder="#16" value={c.hook} onChange={e => setFish(i, { hook: e.target.value })} /></label>
            {form.catches.length > 1 && <button type="button" className="quiet remove" aria-label={`Remove fish ${i + 1}`} onClick={() => set({ catches: form.catches.filter((_, n) => n !== i) })}>Remove</button>}
          </div>
        ))}
        <button type="button" className="quiet" onClick={() => set({ catches: [...form.catches, blankFish()] })}>Add another</button>
        <datalist id="species">{SPECIES.map(s => <option key={s} value={s} />)}</datalist>
        <datalist id="flies">{PATTERNS.map(p => <option key={p.id} value={p.name} />)}</datalist>
      </fieldset>

      <label>Notes<textarea rows="4" maxLength={2000} placeholder="Weather, water level, what worked." value={form.notes} onChange={e => set({ notes: e.target.value })} /></label>

      {error && <p className="error" role="alert">{error}</p>}
      <div className="actions">
        <button type="submit" className="primary" disabled={busy}>{busy ? 'Saving…' : 'Save trip'}</button>
        <button type="button" className="quiet" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  )
}

function Trip({ t, on, onSelect, onEdit, onDelete }) {
  const [asking, setAsking] = useState(false)
  const el = useRef(null)
  useEffect(() => { if (on) el.current.scrollIntoView({ block: 'nearest', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }) }, [on])
  return (
    <li ref={el} className={on ? 'trip on' : 'trip'}>
      <p className="when">{fmtDate(t.date)}</p>
      <h3>{t.water}</h3>
      {t.catches.length ? (
        <ul className="fishes">
          {t.catches.map((c, i) => {
            const p = byName[c.fly.toLowerCase()]
            return (
              <li key={i}>
                <b>{c.count > 1 ? `${c.count} × ` : ''}{c.species}</b>{c.length != null && `, ${c.length} in`}
                {c.fly && <> on {p ? <a href={`#/${p.id}`}>{c.fly}</a> : c.fly}</>}{c.hook && <> <Hook>{c.hook}</Hook></>}
              </li>
            )
          })}
        </ul>
      ) : <p className="none">Nothing to hand.</p>}
      {t.notes && <p className="notes">{t.notes}</p>}
      <div className="actions">
        {t.lat != null && <button className="quiet" onClick={onSelect} aria-pressed={on}>Show on map</button>}
        <button className="quiet" onClick={onEdit}>Edit</button>
        {asking
          ? <><span>Delete this trip?</span> <button className="quiet danger" onClick={onDelete}>Yes, delete</button> <button className="quiet" onClick={() => setAsking(false)}>Keep</button></>
          : <button className="quiet" onClick={() => setAsking(true)}>Delete</button>}
      </div>
    </li>
  )
}

export default function Log({ store, region }) {
  const { trips, status, problem, mirror, save } = store
  const [form, setForm] = useState(null) // the trip being written, as form strings; null when reading the log
  const [selected, setSelected] = useState(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [goTo, setGoTo] = useState(null)
  const stats = tripStats(trips)

  async function commit(next, done) {
    setBusy(true); setError('')
    try { await save(next); done() } catch (e) { setError(e.message) } finally { setBusy(false) }
  }
  function onSave() {
    let t
    try { t = cleanTrip(form) } catch (e) { return setError(e.message) }
    commit(trips.some(x => x.id === t.id) ? trips.map(x => x.id === t.id ? t : x) : [...trips, t], () => { setForm(null); setSelected(t.id) })
  }
  const pin = form && form.lat !== '' && form.lng !== '' && Number.isFinite(+form.lat) && Number.isFinite(+form.lng)
    ? { id: form.id, lat: +form.lat, lng: +form.lng } : form ? { id: form.id } : null

  return (
    <main className="wrap">
      <header className="lead row">
        <div>
          <h1>Trip log</h1>
          {stats.trips > 0 && <p className="lede">{stats.fish} fish over {stats.trips} {stats.trips === 1 ? 'trip' : 'trips'}.{stats.topFly && ` Most have come on the ${stats.topFly[0]}.`}</p>}
        </div>
        {status === 'ready' && !form && <p className="start"><span className="hint">Click the map where you fished, or</span> <button className="primary" onClick={() => { setError(''); setForm(blankTrip()) }}>Log a trip</button></p>}
      </header>

      {mirror === 'ok' && <p className="saved" role="status">Saved on this Mac and copied to Anton.</p>}
      {mirror === 'failed' && <p className="saved late" role="status">Saved on this Mac. Anton could not be reached, so its copy is behind; it catches up the next time the log is opened or saved on the home network.</p>}
      {status === 'loading' && <p className="empty">Reading the log…</p>}
      {status === 'down' && (
        <p className="error" role="alert">
          The trip log could not be read, so nothing can be saved right now. {problem || 'It is stored by the local server: start the site with tools/dev.sh.'}
        </p>
      )}
      {status === 'ready' && (
        <div className="log">
          <div className="map-col">
            <MapSearch onGo={setGoTo} />
            <TripMap trips={trips} selected={selected} onSelect={setSelected} draft={pin} picking={!!form} goTo={goTo}
              onPick={ll => { setError(''); setForm(f => ({ ...(f || blankTrip()), lat: ll.lat.toFixed(5), lng: ll.lng.toFixed(5) })) }} home={region} />
          </div>
          <div>
            {form
              ? <TripForm form={form} setForm={setForm} onSave={onSave} onCancel={() => { setForm(null); setError('') }} error={error} busy={busy}
                  waters={[...new Set(trips.map(t => t.water))].sort()} />
              : trips.length ? (
                <>
                  {error && <p className="error" role="alert">{error}</p>}
                  <ol className="trips">
                    {newestFirst(trips).map(t => (
                      <Trip key={t.id} t={t} on={t.id === selected} onSelect={() => setSelected(t.id)}
                        onEdit={() => { setError(''); setSelected(t.id); setForm(toForm(t)) }}
                        onDelete={() => commit(trips.filter(x => x.id !== t.id), () => setSelected(null))} />
                    ))}
                  </ol>
                </>
              ) : <p className="empty">No trips yet. Log one and it will show up here and on the map.</p>}
          </div>
        </div>
      )}
    </main>
  )
}
