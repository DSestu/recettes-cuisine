import { describe, it, expect } from 'vitest'
import { parseRecipe, parseComponent, parseTags, parseCategories } from './parse'

const RECIPE_MARKDOWN_BODY = `---
layout: recipe
title: "Aiguillettes de poulet"
image: aiguillettes_poulet

tags:
- repas
- poulet
- creme

ingredients:
- 400 g d'aiguillettes de poulet
- 20 cl de crème
---

Pour 4 personnes.

## Préparation

- Saisir les aiguillettes.
- Lier la sauce avec la crème.
`

const RECIPE_YAML_DIRECTIONS = `---
layout: recipe
title: "Sauce ankake"
image: ankake_sauce

tags:
- japon
- sauce
- condiment

ingredients:
- 50ml de dashi

directions:
- Mélanger le dashi.
- Laisser mijoter.
---

Quantité pour 1 personne.
`

const RECIPE_WITH_COMPONENTS = `---
layout: recipe
title: "Bavette sauce au vin"
image: bavette_sauce_au_vin

tags:
- viande
- boeuf

ingredients:
- 1 kg de bavette

components:
- Sauce au vin rouge
---

Pour 6 personnes.

## Préparation

- Saisir la bavette.
`

const TAGS_YAML = `- id: ail
  ingredient: true
- id: alcool
  ingredient: false
- id: poulet
  ingredient: true
`

const CATEGORIES_MD = `---
layout: null
categories:
  - id: "main_dishes"
    label: "Plats principaux"
    description: "Plats principaux."
    tags:
      - plat
      - repas

  - id: "others"
    label: "Autres"
    description: "Autres recettes."
    mode: "other"
    tags: []
---

Ce fichier définit les catégories.
`

describe('parseRecipe', () => {
  it('parses title, image, tags, ingredients from frontmatter', () => {
    const recipe = parseRecipe('aiguillettes_poulet', RECIPE_MARKDOWN_BODY)
    expect(recipe.slug).toBe('aiguillettes_poulet')
    expect(recipe.title).toBe('Aiguillettes de poulet')
    expect(recipe.image).toBe('aiguillettes_poulet')
    expect(recipe.tags).toEqual(['repas', 'poulet', 'creme'])
    expect(recipe.ingredients).toHaveLength(2)
  })

  it('parses Markdown body recipes (no directions: in frontmatter)', () => {
    const recipe = parseRecipe('aiguillettes_poulet', RECIPE_MARKDOWN_BODY)
    expect(recipe.directions).toBeUndefined()
    expect(recipe.content).toContain('## Préparation')
    expect(recipe.content).toContain('Saisir les aiguillettes')
  })

  it('parses legacy YAML directions list', () => {
    const recipe = parseRecipe('ankake_sauce', RECIPE_YAML_DIRECTIONS)
    expect(recipe.directions).toEqual(['Mélanger le dashi.', 'Laisser mijoter.'])
  })

  it('parses components list', () => {
    const recipe = parseRecipe('bavette', RECIPE_WITH_COMPONENTS)
    expect(recipe.components).toEqual(['Sauce au vin rouge'])
  })

  it('returns empty arrays for missing tags/ingredients', () => {
    const minimal = `---\nlayout: recipe\ntitle: "Test"\nimage: test\n---\n`
    const recipe = parseRecipe('test', minimal)
    expect(recipe.tags).toEqual([])
    expect(recipe.ingredients).toEqual([])
  })
})

describe('parseComponent', () => {
  it('parses a component with YAML directions', () => {
    const comp = parseComponent('ankake_sauce', RECIPE_YAML_DIRECTIONS)
    expect(comp.slug).toBe('ankake_sauce')
    expect(comp.title).toBe('Sauce ankake')
    expect(comp.directions).toEqual(['Mélanger le dashi.', 'Laisser mijoter.'])
  })
})

describe('parseTags', () => {
  it('parses tag entries from YAML string', () => {
    const tags = parseTags(TAGS_YAML)
    expect(tags).toHaveLength(3)
    expect(tags[0]).toEqual({ id: 'ail', ingredient: true })
    expect(tags[1]).toEqual({ id: 'alcool', ingredient: false })
  })
})

describe('parseCategories', () => {
  it('parses category list from home_categories.md content', () => {
    const cats = parseCategories(CATEGORIES_MD)
    expect(cats).toHaveLength(2)
    expect(cats[0].id).toBe('main_dishes')
    expect(cats[0].label).toBe('Plats principaux')
    expect(cats[0].tags).toEqual(['plat', 'repas'])
    expect(cats[0].mode).toBeUndefined()
  })

  it('identifies the others category by mode', () => {
    const cats = parseCategories(CATEGORIES_MD)
    const others = cats.find(c => c.id === 'others')
    expect(others?.mode).toBe('other')
  })
})
