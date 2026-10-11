import { lazy, Suspense, useEffect, useLayoutEffect, useRef } from 'react'
import { REGIONS } from './data.js'
import { byId } from './patterns.js'
import { useHash, useSaved, useTrips } from './hooks.js'
import Plan from './pages/Plan.jsx'
import Patterns from './pages/Patterns.jsx'
import Pattern from './pages/Pattern.jsx'

const Log = lazy(() => import('./pages/Log.jsx')) // the map library loads only when the log is opened

const NAV = [['plan', '#/', 'What to tie'], ['patterns', '#/patterns', 'Patterns'], ['log', '#/log', 'Trip log']]
const TITLES = { plan: 'What to tie', patterns: 'Patterns', log: 'Trip log' }

export default function App() {
  const route = useHash().slice(2)
  const p = byId[route]
  const page = p ? 'pattern' : route === 'log' || route === 'patterns' ? route : 'plan'
  const [regionId, setRegion] = useSaved('region', 'driftless', s => REGIONS.some(r => r.id === s))
  const [month, setMonth] = useSaved('month', String(new Date().getMonth() + 1), s => +s >= 1 && +s <= 12)
  const region = REGIONS.find(r => r.id === regionId)
  const store = useTrips()
  useEffect(() => { document.title = `${p ? p.name : TITLES[page]} · Bench & Bank` }, [p, page])

  // Each list page remembers where you were, so coming back from a pattern does not start you at the top again.
  const current = useRef(page), scrolls = useRef({})
  current.current = page
  useEffect(() => {
    const note = () => { if (current.current !== 'pattern') scrolls.current[current.current] = scrollY }
    addEventListener('scroll', note, { passive: true })
    return () => removeEventListener('scroll', note)
  }, [])
  useLayoutEffect(() => { scrollTo(0, p ? 0 : scrolls.current[page] || 0) }, [p, page])

  return (
    <>
      <header className="top">
        <div className="wrap">
          <a className="brand" href="#/">Bench & Bank</a>
          <nav aria-label="Sections">
            {NAV.map(([id, href, label]) => <a key={id} href={href} aria-current={id === page || (id === 'patterns' && p) ? 'page' : undefined}>{label}</a>)}
          </nav>
        </div>
      </header>

      {page === 'pattern' && <Pattern p={p} region={region} month={+month} setMonth={setMonth} trips={store.trips} />}
      {page === 'plan' && <Plan region={region} setRegion={setRegion} month={+month} setMonth={setMonth} />}
      {page === 'patterns' && <Patterns />}
      {page === 'log' && <Suspense fallback={<main className="wrap"><p className="empty">Opening the log…</p></main>}><Log store={store} region={region} /></Suspense>}

      <footer className="foot">
        <div className="wrap">
          <p>Tying steps, recipes and photographs are from <cite>Fly Tying I: A Course for Beginners</cite>, Southern Wisconsin Chapter of Trout Unlimited, and from the web tutorials credited on each pattern’s page. Kept here for personal use; not for republication.</p>
          <p>Hatch calendars are a guide, not a forecast. Water temperature decides. The booklet ties its patterns on a #10–14 hook so the work is visible; fish them in the sizes the hatch chart gives.</p>
        </div>
      </footer>
    </>
  )
}
