import { Link } from 'react-router-dom'
import { recipes } from '../data/recipes'
import { components } from '../data/components'

// Build global tag → count map once
const ALL_TAGS = new Map<string, number>()
for (const item of [...recipes, ...components]) {
  for (const tag of item.tags) {
    const t = String(tag).trim()
    if (t) ALL_TAGS.set(t, (ALL_TAGS.get(t) ?? 0) + 1)
  }
}
const MAX_VAL = ALL_TAGS.size ? Math.max(...ALL_TAGS.values()) : 1

function lerp(a: number, b: number, t: number) { return a + (b - a) * t }
function hex(r: number, g: number, b: number) {
  return '#' + [r, g, b].map(x => Math.round(x).toString(16).padStart(2, '0')).join('')
}
function parseHex(h: string): [number, number, number] {
  const n = parseInt(h.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function colorScale(val: number): string {
  const d1 = MAX_VAL * 0.4
  const [r0, g0, b0] = parseHex('#F53200')
  const [r1, g1, b1] = parseHex('#f97316')
  const [r2, g2, b2] = parseHex('#22c55e')
  if (val <= d1) {
    const t = d1 ? val / d1 : 0
    return hex(lerp(r0, r1, t), lerp(g0, g1, t), lerp(b0, b1, t))
  }
  const t = MAX_VAL === d1 ? 1 : (val - d1) / (MAX_VAL - d1)
  return hex(lerp(r1, r2, t), lerp(g1, g2, t), lerp(b1, b2, t))
}

interface Props {
  tags: string[]
}

export function TagPills({ tags }: Props) {
  const sorted = [...tags].sort((a, b) => {
    const ca = ALL_TAGS.get(String(a).trim()) ?? 0
    const cb = ALL_TAGS.get(String(b).trim()) ?? 0
    if (cb !== ca) return cb - ca
    return String(a).localeCompare(String(b), 'fr', { sensitivity: 'base' })
  })

  return (
    <div className="flex flex-wrap gap-2">
      {sorted.map(tag => {
        const t = String(tag).trim()
        const cnt = ALL_TAGS.get(t) ?? 0
        const color = colorScale(cnt)
        return (
          <span key={t} className="tag-sugg relative inline-block">
            <Link
              to={`/recherche?tags=${encodeURIComponent(t)}`}
              className="sugg-pill px-3 py-1 rounded-full border-2 border-white text-sm text-white transition"
              style={{ background: color, boxShadow: '0 6px 14px rgba(0,0,0,0.10)' }}
            >
              {t}
            </Link>
            <span
              className="count-tip absolute -top-2 -right-2 rounded-full text-white border-2 border-white text-[11px] leading-none px-1.5 py-0.5"
              style={{ background: color, boxShadow: '0 6px 12px rgba(0,0,0,0.12)' }}
              title={`${cnt} occurrence${cnt !== 1 ? 's' : ''}`}
            >
              {cnt}
            </span>
          </span>
        )
      })}
    </div>
  )
}
