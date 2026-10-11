import { useEffect, useRef } from 'react'
import { HATCHES } from '../data.js'
import { PATTERNS } from '../patterns.js'
import { fishOn } from '../trips.js'
import { HatchChart, Hook } from '../ui.jsx'

export default function Pattern({ p, region, month, setMonth, trips }) {
  const title = useRef(null)
  useEffect(() => { title.current.focus({ preventScroll: true }) }, [p.id])
  const i = PATTERNS.indexOf(p), prev = PATTERNS.at(i - 1), next = PATTERNS[(i + 1) % PATTERNS.length]
  const season = HATCHES.filter(x => x.r === region.id && x.flies.includes(p.id))
  const log = fishOn(trips, p.name)
  return (
    <main className="wrap">
      <a className="back" href="#/patterns">← All patterns</a>
      <div className="entry-head">
        <div>
          <h1 tabIndex={-1} ref={title}>{p.name}</h1>
          <p className="kind">{p.kind} · fish it in <Hook>{p.sizes}</Hook></p>
          <p className="lede">{p.imitates}</p>
          {log.fish > 0 && <p className="logged">From <a href="#/log">your log</a>: {log.fish} fish on this over {log.days} {log.days === 1 ? 'day' : 'days'}.</p>}
          <h2>Recipe</h2>
          <dl className="recipe">{p.recipe.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
        </div>
        <figure><img src={p.hero} alt={`Finished ${p.name} in the vise`} /></figure>
      </div>
      {season.length > 0 && (
        <section className="block" aria-labelledby="h-when">
          <h2 id="h-when">When it’s on in {region.name}</h2>
          <HatchChart rows={season} month={month} setMonth={setMonth} star={region.id === 'driftless'} />
        </section>
      )}
      <section className="block" aria-labelledby="h-steps">
        <h2 id="h-steps">Tying steps</h2>
        <ol className="steps">
          {p.steps.map((s, n) => (
            <li key={s.img}>
              <img src={s.img} loading="lazy" alt={`Step ${n + 1} at the vise`} />
              <p><span className="n" aria-hidden="true">{n + 1}</span>{s.text}</p>
            </li>
          ))}
        </ol>
        <p className="source">Steps and photographs:{' '}
          {p.source.url
            ? <a href={p.source.url} target="_blank" rel="noreferrer">{[p.source.author, p.source.name].filter(Boolean).join(', ')}</a>
            : `${p.source.name}, p. ${p.source.page}`}.
        </p>
      </section>
      <nav className="pager" aria-label="Patterns">
        <a href={`#/${prev.id}`}>← {prev.name}</a><a href={`#/${next.id}`}>{next.name} →</a>
      </nav>
    </main>
  )
}
