import { useState } from 'react'
import { REGIONS, HATCHES, recommend } from '../data.js'
import { MONTHS } from '../months.js'
import { byId } from '../patterns.js'
import { Choice, HatchChart, Hook } from '../ui.jsx'

// The answer to "what do I tie?": most useful patterns first, each with the hatches and hook sizes it is for.
const FIRST = 6
function Picks({ flies }) {
  const [all, setAll] = useState(false)
  return (
    <>
      <ol className="picks">
        {(all ? flies : flies.slice(0, FIRST)).map(f => {
          const p = byId[f.id]
          return (
            <li key={p.id}>
              <a className="pick" href={`#/${p.id}`}>
                <img src={p.hero} width="720" height="441" loading="lazy" alt="" />
                <span>
                  <span className="name">{p.name}</span>
                  {f.for.map(x => <span className="for" key={x.bug}>{x.bug} <Hook>{x.hook}</Hook></span>)}
                </span>
              </a>
            </li>
          )
        })}
      </ol>
      {flies.length > FIRST && (
        <button className="quiet" onClick={() => setAll(!all)} aria-expanded={all}>{all ? 'Show fewer' : `Show all ${flies.length}`}</button>
      )}
    </>
  )
}

export default function Plan({ region, setRegion, month, setMonth }) {
  const { hatches, flies } = recommend(region.id, month)
  const [year, setYear] = useState(false) // this month's hatches by default; the whole year's chart on request
  const all = HATCHES.filter(x => x.r === region.id)
  return (
    <main className="wrap">
      <header className="lead">
        <Choice label="Water" value={region.id} onChange={setRegion} options={REGIONS.map(r => [r.id, r.name.replace(/^the /, '')])} />
        <h1>What to tie for <b>{region.name}</b> in <b>{MONTHS[month - 1]}</b></h1>
        <p className="lede">{region.where}</p>
      </header>
      <div className="split">
        <section aria-labelledby="h-hatch">
          <h2 id="h-hatch">What’s hatching</h2>
          <HatchChart rows={year ? all : hatches} month={month} setMonth={setMonth} star={region.id === 'driftless'} />
          <button className="quiet" onClick={() => setYear(!year)} aria-expanded={year}>{year ? `Show only ${MONTHS[month - 1]}` : `Show the whole year (${all.length} hatches)`}</button>
          <p className="source">{region.source}</p>
        </section>
        <section aria-labelledby="h-tie">
          <h2 id="h-tie">Tie these first</h2>
          <Picks key={region.id + month} flies={flies} />
        </section>
      </div>
    </main>
  )
}
