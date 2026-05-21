import { load as parseYaml } from 'js-yaml'
import type { Recipe, RecipeComponent, Tag, HomeCategory } from '../types'

function slugFrom(path: string): string {
  return path.split('/').pop()!.replace(/\.md$/, '')
}

// When a YAML list item contains "key: value", js-yaml parses it as an object.
// Reconstruct it back to a "key: value" string.
function yamlItemToString(v: unknown): string {
  if (typeof v === 'string') return v
  if (v !== null && typeof v === 'object') {
    const entries = Object.entries(v as Record<string, unknown>)
    if (entries.length === 1) return `${entries[0][0]}: ${entries[0][1]}`
    return JSON.stringify(v)
  }
  return String(v ?? '')
}

function parseFrontmatter(raw: string): { data: Record<string, unknown>; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) return { data: {}, content: raw }
  try {
    const data = (parseYaml(match[1]) as Record<string, unknown>) ?? {}
    return { data, content: match[2] }
  } catch {
    return { data: {}, content: raw }
  }
}

export function parseRecipe(slug: string, raw: string): Recipe {
  const { data, content } = parseFrontmatter(raw)
  return {
    slug,
    title: String(data['title'] ?? ''),
    image: String(data['image'] ?? slug),
    tags: ((data['tags'] as unknown[] | undefined) ?? []).map(yamlItemToString),
    ingredients: ((data['ingredients'] as unknown[] | undefined) ?? []).map(yamlItemToString),
    directions: data['directions']
      ? ((data['directions'] as unknown[]) ?? []).map(yamlItemToString)
      : undefined,
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
  const { data } = parseFrontmatter(raw)
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
