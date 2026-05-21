import { useState } from 'react'
import { marked } from 'marked'

interface Props {
  ingredients: string[]
}

marked.setOptions({ breaks: false })

export function IngredientList({ ingredients }: Props) {
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
      <h2 className="uppercase text-primary font-semibold mb-2">Ingrédients</h2>
      <ul className="flex flex-col gap-2 mb-8" itemProp="ingredients">
        {ingredients.map((ing, i) => (
          <li
            key={i}
            itemProp="recipeIngredient"
            className={`flex items-start gap-3 text-lg leading-loose cursor-pointer${checked.has(i) ? ' row-checked' : ''}`}
            onClick={() => toggle(i)}
          >
            <span className="row-check-bubble mt-1.5" aria-hidden="true" />
            <span dangerouslySetInnerHTML={{ __html: marked.parseInline(ing) as string }} />
          </li>
        ))}
      </ul>
    </div>
  )
}
