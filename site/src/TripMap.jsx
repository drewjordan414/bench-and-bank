import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// USGS topo: public domain, no key, and it names the creeks.
const TILES = 'https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}'

// Leaflet owns this div; React only tells it what changed. Pins are vector circles styled in style.css (.pin).
export default function TripMap({ trips, selected, onSelect, draft, picking, onPick, home, goTo }) {
  const el = useRef(null), map = useRef(null), pins = useRef(null)
  const latest = useRef({})
  latest.current = { onSelect, onPick, picking }

  useEffect(() => {
    const m = map.current = L.map(el.current).setView(home.at, home.zoom)
    L.tileLayer(TILES, { maxZoom: 16, attribution: 'Map: USGS The National Map' }).addTo(m)
    pins.current = L.layerGroup().addTo(m)
    m.on('click', e => latest.current.onPick(e.latlng))
    const placed = trips.filter(t => t.lat != null).map(t => [t.lat, t.lng])
    if (placed.length) m.fitBounds(placed, { padding: [48, 48], maxZoom: 12 })
    return () => m.remove()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps -- built once; the effects below keep it current

  useEffect(() => {
    pins.current.clearLayers()
    for (const t of trips) {
      if (t.lat == null || t.id === draft?.id) continue
      const label = document.createElement('span')
      label.textContent = `${t.water} · ${t.date}` // textContent: a water name is never treated as HTML
      L.circleMarker([t.lat, t.lng], { radius: 8, className: t.id === selected ? 'pin is-on' : 'pin', bubblingMouseEvents: false }) // a click on a pin selects it; it is not a click on the map
        .bindTooltip(label).on('click', () => latest.current.onSelect(t.id)).addTo(pins.current)
    }
    if (draft?.lat != null) L.circleMarker([draft.lat, draft.lng], { radius: 9, className: 'pin is-draft', interactive: false }).addTo(pins.current)
  }, [trips, selected, draft])

  useEffect(() => {
    const t = trips.find(t => t.id === selected)
    if (t?.lat != null) map.current.panTo([t.lat, t.lng])
  }, [selected]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { if (goTo) map.current.fitBounds(goTo, { maxZoom: 14 }) }, [goTo]) // a place picked from the search

  // Leaflet writes its own classes onto its container, so the class React changes lives on a wrapper.
  return <div className={picking ? 'map picking' : 'map'} role="region" aria-label="Map of logged trips"><div ref={el} /></div>
}
