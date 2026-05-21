export interface Tag {
  id: string
  ingredient: boolean
}

export interface HomeCategory {
  id: string
  label: string
  description: string
  tags: string[]
  mode?: 'other'
}

export interface Recipe {
  slug: string
  title: string
  image: string
  tags: string[]
  ingredients: string[]
  directions?: string[]
  components?: string[]
  content: string
}

export type RecipeComponent = Recipe
