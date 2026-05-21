import { parseCategories } from './parse'
import type { HomeCategory } from '../types'

const raw = import.meta.glob('../../../home_categories.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const firstFile = Object.values(raw)[0] ?? ''

export const categories: HomeCategory[] = parseCategories(firstFile)
