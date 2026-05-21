import { parseTags } from './parse'
import type { Tag } from '../types'

const raw = import.meta.glob('../../../_data/recipe_tags.yml', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const firstFile = Object.values(raw)[0] ?? ''

export const tags: Tag[] = parseTags(firstFile)
