import matter from 'gray-matter'
import { load as parseYaml } from 'js-yaml'
import type { Recipe, RecipeComponent, Tag, HomeCategory } from '../types'

function slugFrom(path: string): string {
  return path.split('/').pop()!.replace(/\.md$/, '')
}

export function parseRecipe(slug: string, raw: string): Recipe {
  const { data, content } = matter(raw)
  return {
    slug,
    title: String(data['title'] ?? ''),
    image: String(data['image'] ?? slug),
    tags: (data['tags'] as string[] | undefined) ?? [],
    ingredients: (data['ingredients'] as string[] | undefined) ?? [],
    directions: data['directions'] as string[] | undefined,
    components: data['components'] as string[] | undefined,
    content,
  }
}

export function parseComponent(slug: string, raw: string): RecipeComponent {
  return parseRecipe(slug, raw)
}

export function parseTags(raw: string): Tag[] {
  const parsed = parseYaml(raw)
  if (!Array.isArray(parsed)) return []
  return parsed.map((entry: unknown) => {
    const e = entry as Record<string, unknown>
    return {
      id: String(e['id'] ?? ''),
      ingredient: Boolean(e['ingredient'] ?? true),
    }
  })
}

export function parseCategories(raw: string): HomeCategory[] {
  const { data } = matter(raw)
  const cats = data['categories'] as Array<Record<string, unknown>> | undefined
  if (!Array.isArray(cats)) return []
  return cats.map(c => ({
    id: String(c['id'] ?? ''),
    label: String(c['label'] ?? ''),
    description: String(c['description'] ?? ''),
    tags: (c['tags'] as string[] | undefined) ?? [],
    mode: c['mode'] === 'other' ? 'other' : undefined,
  }))
}

// Used by Vite glob loaders — exported for reuse in recipes.ts / components.ts
export { slugFrom }
