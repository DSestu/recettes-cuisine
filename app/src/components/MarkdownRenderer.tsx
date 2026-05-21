import { useState, useEffect, useRef } from 'react'
import { marked } from 'marked'

interface Props {
  content: string
  className?: string
}

const DIRECTIONS_CLASS =
  'text-left text-lg leading-loose [&>*]:mb-6 [&_h2]:text-base [&_h2]:uppercase [&_h2]:text-primary [&_h2]:font-semibold [&_h2]:mb-2 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-3 [&_ol]:flex [&_ol]:flex-col [&_ol]:gap-3 [&_a]:underline [&_a]:decoration-[3px] [&_a]:decoration-primary [&_a]:underline-offset-2'

export function MarkdownRenderer({ content, className }: Props) {
  const html = marked.parse(content) as string
  const ref = useRef<HTMLDivElement>(null)

  // Attach row-check toggle to every <li> after render
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const items = Array.from(el.querySelectorAll('ul li'))
    items.forEach(li => {
      const handler = () => li.classList.toggle('row-checked')
      ;(li as HTMLElement).style.cursor = 'pointer'
      li.addEventListener('click', handler)
      // Store handler for cleanup
      ;(li as HTMLElement & { _rcHandler?: () => void })._rcHandler = handler
    })
    return () => {
      items.forEach(li => {
        const h = (li as HTMLElement & { _rcHandler?: () => void })._rcHandler
        if (h) li.removeEventListener('click', h)
      })
    }
  }, [html])

  return (
    <div
      ref={ref}
      itemProp="recipeInstructions"
      className={className ?? DIRECTIONS_CLASS}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

export function DirectionsList({ directions }: { directions: string[] }) {
  const [checked, setChecked] = useState<Set<number>>(new Set())

  function toggle(i: number) {
    setChecked(prev => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  return (
    <div>
      <h2 className="uppercase text-primary font-semibold mb-2">Préparation</h2>
      <ul className="flex flex-col gap-3 mb-8" itemProp="recipeInstructions">
        {directions.map((step, i) => (
          <li
            key={i}
            className={`flex gap-3 items-start text-lg leading-loose cursor-pointer${checked.has(i) ? ' row-checked' : ''}`}
            onClick={() => toggle(i)}
          >
            <span className="row-check-bubble mt-1.5" aria-hidden="true" />
            <span dangerouslySetInnerHTML={{ __html: marked.parseInline(step) as string }} />
          </li>
        ))}
      </ul>
    </div>
  )
}
