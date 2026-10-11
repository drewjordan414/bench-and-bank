import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'

// ponytail: hash routing (#/adams, #/log) by hand; reach for react-router when routes need params or nesting.
const onHash = cb => { addEventListener('hashchange', cb); return () => removeEventListener('hashchange', cb) }
export const useHash = () => useSyncExternalStore(onHash, () => location.hash)

// useState that remembers its value. localStorage can throw (private windows) — the page works without it.
export function useSaved(key, fallback, valid) {
  const [value, set] = useState(() => {
    try { const s = localStorage.getItem(key); return valid(s) ? s : fallback } catch { return fallback }
  })
  useEffect(() => { try { localStorage.setItem(key, value) } catch {} }, [key, value])
  return [value, set]
}

// The trip log lives in data/trips.json behind /api/trips (see vite.config.js).
// status: loading | ready | down. Saving is only offered when the log was read cleanly, so a failed read can never be overwritten with an empty list.
export function useTrips() {
  const [state, setState] = useState({ trips: [], status: 'loading', problem: '', mirror: '' }) // mirror: how the last save's copy to MongoDB went
  useEffect(() => {
    let live = true
    fetch('/api/trips')
      .then(async r => { const body = await r.json(); if (!r.ok) throw new Error(body.error); return body })
      .then(trips => live && setState({ trips, status: 'ready', problem: '', mirror: '' }))
      .catch(e => live && setState({ trips: [], status: 'down', problem: e.message, mirror: '' }))
    return () => { live = false }
  }, [])
  const save = useCallback(async trips => {
    const r = await fetch('/api/trips', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(trips) })
    const body = await r.json().catch(() => ({}))
    if (!r.ok) throw new Error(body.error || 'The trip could not be saved.')
    setState({ trips: body, status: 'ready', problem: '', mirror: r.headers.get('X-Mirror') || 'off' })
  }, [])
  return { ...state, save }
}
