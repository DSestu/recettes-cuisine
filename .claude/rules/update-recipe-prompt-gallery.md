---
description: When adding or editing a recipe or component, create or update the matching image-generation prompt under prompts/_recipes or prompts/_components.
globs:
  - _recipes/**/*.md
  - _components/**/*.md
---

# Update generative prompt gallery (autoloaded)

**When this applies:** You create or modify a file in `_recipes/` or `_components/`.

**Action:** Create or update the corresponding prompt file under `prompts/_recipes/<same_filename>.md` (for recipes) or `prompts/_components/<same_filename>.md` (for components). Create the folders if they don't exist. Same base filename as the source recipe/component.

**File content:** Only the generative prompt text. No frontmatter, no title, no `Prompt:` label. The file is consumed as-is by image-generation models that accept long descriptive text.

## Prompt style

- **Long and precise.** Several paragraphs or many sentences (≥80–150 words; more for complex dishes).
- **Full flowing sentences**, not short clauses; each sentence develops one concrete idea.
- **Stick to the recipe.** The image must show what the recipe actually produces: correct dish name, every main ingredient (realistic proportions), garnishes and plating implied by the directions. **Do not add elements absent from the recipe** (no random herbs or citrus unless listed). Colours, textures, arrangement should match a home-cooked or traditionally served version.

## Realistic, non-AI look

- Ask for a **realistic photograph**: "photograph", "shot on a real camera", "documentary style", "natural food photography".
- **Natural or diffused daylight**, soft shadows, slight scene variation. Avoid perfect studio lighting.
- **Small natural imperfections** where they fit: uneven soup surface, a drip or smear, condensation on a glass, irregular vegetable pieces, worn-but-clean tableware.
- **Avoid these synthetic-cue words:** "perfect", "flawless", "hyperrealistic", "8k", "ultra detailed" (in the tech sense).
- **Atmosphere:** warm, cozy ambiance; shallow depth of field; rustic wooden table; French touch; background out of frame or heavily blurred cozy home interior.
- **No humans, hands, or faces.**

## Reference example (tone and style)

Ramen prompt: "Natural food photograph of a deep ceramic bowl on a worn rustic wooden table, top-down angle. The bowl holds exactly what the recipe yields: golden alkaline noodles in soy-mirin broth, a few slices of char siu with caramelized edges, tender cabbage strips, crisp bean sprouts, and a scatter of chopped garlic; light steam rises from the surface. Lighting is natural or diffused daylight with soft shadows; the broth surface is not perfectly even. Shallow depth of field, background out of frame or softly blurred. The image looks like a real photograph of a home-cooked dish, appetizing and warm. No people or hands in frame."

For components or simpler dishes, keep the same sentence length, recipe fidelity, and realistic-photo language.
