import { useSearchParams } from 'react-router-dom'

const COLS_OPTIONS = [2, 3, 4, 5] as const
const DEFAULT_COLS = 5

export function useColsValue(): number {
  const [params] = useSearchParams()
  const raw = parseInt(params.get('cols') ?? '', 10)
  return COLS_OPTIONS.includes(raw as (typeof COLS_OPTIONS)[number]) ? raw : DEFAULT_COLS
}

export function ColsSelector() {
  const [params, setParams] = useSearchParams()
  const current = useColsValue()

  function select(n: number) {
    const next = new URLSearchParams(params)
    next.set('cols', String(n))
    setParams(next, { replace: true })
  }

  return (
    <div className="hidden md:flex items-center gap-2 ml-auto">
      <span className="text-xs text-orange-700/60 select-none">Colonnes</span>
      <div className="inline-flex rounded-lg border border-primary/30 bg-white/70 backdrop-blur p-0.5">
        {COLS_OPTIONS.map(n => (
          <button
            key={n}
            type="button"
            aria-pressed={current === n}
            aria-label={`Afficher ${n} colonnes`}
            onClick={() => select(n)}
            className={`px-3 py-1 text-sm rounded-md transition ${
              current === n
                ? 'bg-primary text-white shadow-sm'
                : 'text-red-900/70 hover:bg-primary/10'
            }`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  )
}
