import { useState, useEffect, useRef } from 'react'
import { marked } from 'marked'

interface Props {
  content: string
  className?: string
}

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '')

const DIRECTIONS_CLASS =
  'text-left text-lg leading-loose [&>*]:mb-6 [&_h2]:text-base [&_h2]:uppercase [&_h2]:text-primary [&_h2]:font-semibold [&_h2]:mb-2 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-3 [&_ol]:flex [&_ol]:flex-col [&_ol]:gap-3 [&_a]:underline [&_a]:decoration-[3px] [&_a]:decoration-primary [&_a]:underline-offset-2'

function rewriteImagePaths(md: string): string {
  return md.replace(/\(\.\.\/images\//g, `(${BASE}/images/`)
}

function toFullSrc(src: string): string {
  return src.replace(/\.webp(\?|#|$)/i, '.full.webp$1')
}

const renderer = new marked.Renderer()
renderer.image = ({ href, text }: { href: string; text: string; title: string | null }) => {
  const caption = text?.trim()
    ? `<figcaption>${text.trim()}</figcaption>`
    : ''
  return `<figure class="recipe-inline-image"><img src="${href}" alt="${text ?? ''}" loading="lazy">${caption}</figure>`
}

interface LightboxState { src: string; alt: string }

function Lightbox({ src, alt, onClose }: LightboxState & { onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/85 transition-opacity duration-300"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white bg-black/40 hover:bg-black/60 rounded-full w-10 h-10 flex items-center justify-center text-2xl leading-none"
        aria-label="Fermer"
      >×</button>
      <img
        src={src}
        alt={alt}
        className="max-w-[92vw] max-h-[92vh] object-contain rounded-lg shadow-2xl"
      />
    </div>
  )
}

export function MarkdownRenderer({ content, className }: Props) {
  const html = marked.parse(rewriteImagePaths(content), { renderer }) as string
  const ref = useRef<HTMLDivElement>(null)
  const [lightbox, setLightbox] = useState<LightboxState | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Row-check toggle on list items
    const items = Array.from(el.querySelectorAll('ul li'))
    items.forEach(li => {
      const handler = () => li.classList.toggle('row-checked')
      ;(li as HTMLElement).style.cursor = 'pointer'
      li.addEventListener('click', handler)
      ;(li as HTMLElement & { _rcHandler?: () => void })._rcHandler = handler
    })

    // Lightbox on inline images
    const figures = Array.from(el.querySelectorAll<HTMLElement>('figure.recipe-inline-image'))
    figures.forEach(fig => {
      const img = fig.querySelector('img')
      if (!img) return
      const handler = () => setLightbox({ src: toFullSrc(img.src), alt: img.alt })
      fig.addEventListener('click', handler)
      ;(fig as HTMLElement & { _imgHandler?: () => void })._imgHandler = handler
    })

    return () => {
      items.forEach(li => {
        const h = (li as HTMLElement & { _rcHandler?: () => void })._rcHandler
        if (h) li.removeEventListener('click', h)
      })
      figures.forEach(fig => {
        const h = (fig as HTMLElement & { _imgHandler?: () => void })._imgHandler
        if (h) fig.removeEventListener('click', h)
      })
    }
  }, [html])

  return (
    <>
      <div
        ref={ref}
        itemProp="recipeInstructions"
        className={className ?? DIRECTIONS_CLASS}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {lightbox && <Lightbox {...lightbox} onClose={() => setLightbox(null)} />}
    </>
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
