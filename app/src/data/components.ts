import { parseComponent, slugFrom } from './parse'
import type { RecipeComponent } from '../types'

const modules = import.meta.glob('../../../_components/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

export const components: RecipeComponent[] = Object.entries(modules).map(
  ([path, raw]) => parseComponent(slugFrom(path), raw)
)
