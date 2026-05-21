import { parseRecipe, slugFrom } from './parse'
import type { Recipe } from '../types'

const modules = import.meta.glob('../../../_recipes/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

export const recipes: Recipe[] = Object.entries(modules).map(([path, raw]) =>
  parseRecipe(slugFrom(path), raw)
)
