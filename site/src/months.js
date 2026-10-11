export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

// [4,5,9,10] -> "Apr–May, Sep–Oct"
export function span(months) {
  if (months.length === 12) return 'All year'
  const runs = []
  for (const x of [...months].sort((a, b) => a - b)) (runs.at(-1)?.at(-1) === x - 1 ? runs.at(-1) : runs[runs.push([]) - 1]).push(x)
  if (runs.length > 1 && runs[0][0] === 1 && runs.at(-1).at(-1) === 12) runs[0] = [...runs.pop(), ...runs[0]] // Nov–Mar wraps the year
  const short = n => MONTHS[n - 1].slice(0, 3)
  return runs.map(r => r.length > 1 ? `${short(r[0])}–${short(r.at(-1))}` : short(r[0])).join(', ')
}
