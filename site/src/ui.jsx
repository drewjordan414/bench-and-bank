import { MONTHS } from './months.js'

export const Hook = ({ children }) => <span className="hook">{children}</span>

// Every option visible, one click each. Real radios underneath, so arrow keys and screen readers work.
export function Choice({ label, value, onChange, options }) {
  return (
    <div className="seg" role="radiogroup" aria-label={label}>
      {options.map(([v, text]) => (
        <label key={v}>
          <input type="radio" name={label} value={v} checked={v === value} onChange={() => onChange(v)} />
          <span>{text}</span>
        </label>
      ))}
    </div>
  )
}

// The hatch chart every fly shop prints: insects down the side, months across, a bar where the hatch is on.
// The month headings are also how you choose the month.
export function HatchChart({ rows, month, setMonth, star }) {
  return (
    <table className="chart">
      <thead>
        <tr>
          <th scope="col">Insect</th>
          <th scope="col" className="hk">Hook</th>
          {MONTHS.map((m, i) => (
            <th key={m} scope="col" className={i + 1 === month ? 'mo now' : 'mo'}>
              <button type="button" aria-pressed={i + 1 === month} aria-label={m} onClick={() => setMonth(String(i + 1))}>{m[0]}<span>{m.slice(1, 3)}</span></button>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map(x => {
          const on = x.m.includes(month)
          return (
            <tr key={x.bug} className={on ? 'on' : undefined}>
              <th scope="row">
                {x.bug}{star && x.g ? '\u00a0*' : ''}
                {on && x.note && <small>{x.note}</small>}
                {on && !x.flies.length && <small>Nothing in the dictionary for this one yet.</small>}
              </th>
              <td className="hk"><Hook>{x.hook}</Hook></td>
              {MONTHS.map((m, i) => (
                <td key={m} className={i + 1 === month ? 'mo now' : 'mo'}>{x.m.includes(i + 1) && <span className="bar"><span className="vh">{m}</span></span>}</td>
              ))}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
