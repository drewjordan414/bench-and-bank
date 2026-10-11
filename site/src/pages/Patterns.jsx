import { useState } from 'react'
import { PATTERNS, KINDS } from '../patterns.js'
import { Hook } from '../ui.jsx'

export default function Patterns() {
  const [q, setQ] = useState('')
  const [kind, setKind] = useState('')
  const needle = q.trim().toLowerCase()
  const hits = PATTERNS.filter(p => (!kind || p.kind === kind) &&
    (!needle || [p.name, p.kind, p.imitates, ...p.recipe.flat()].join(' ').toLowerCase().includes(needle)))
  return (
    <main className="wrap">
      <header className="lead row">
        <h1>All {PATTERNS.length} patterns</h1>
        <div className="filters">
          <input type="search" placeholder="Name or material" aria-label="Search patterns by name or material" autoComplete="off" value={q} onChange={e => setQ(e.target.value)} />
          <select aria-label="Kind of fly" value={kind} onChange={e => setKind(e.target.value)}>
            <option value="">Every kind</option>
            {KINDS.map(k => <option key={k}>{k}</option>)}
          </select>
        </div>
      </header>
      <ul className="cards">
        {hits.map(p => (
          <li key={p.id}>
            <a className="card" href={`#/${p.id}`}>
              <img src={p.hero} width="720" height="441" loading="lazy" alt="" />
              <span className="name">{p.name}</span>
              <span className="meta">{p.kind} · <Hook>{p.sizes}</Hook></span>
            </a>
          </li>
        ))}
      </ul>
      {!hits.length && <p className="empty">No pattern matches “{q.trim()}”. Try a material — “peacock”, “elk”, “wire”.</p>}
    </main>
  )
}
