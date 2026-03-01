## DSestu – Recettes de cuisine

Site de recettes en français, propulsé par Jekyll (basé sur Chowdown), avec recherche avancée et visualisations interactives.

- **Site:** <https://dsestu.github.io/recettes-cuisine>
- **Langue:** français

---

## Structure du projet

### Répertoires principaux

| Rôle | Chemins |
|------|--------|
| **Contenu** | `_recipes/` (recettes), `_components/` (sous-recettes réutilisables), `_data/` (ex. `recipe_tags.yml`, `nutrients.yml`), `images/`, `images/cards/` (miniatures générées) |
| **Site** | `_config.yml`, `_layouts/`, `_includes/`, `index.html`, `search.html`, `recherche.html` (recherche avancée) |
| **Config** | `home_categories.md` (catégories d’accueil), `.pre-commit-config.yaml`, `pyproject.toml` |
| **Outillage** | `scripts/generate_card_thumbnails.py`, `scripts/migrate_directions_to_body.py` (migration directions liste → Markdown), `prompts/_recipes/`, `prompts/_components/` (prompts pour génération d’images) |
| **Cursor** | `.cursor/rules/*.mdc` (règles pour le formatage et les tags) |

### Format recette / composant

Chaque recette ou composant est un fichier Markdown avec un front matter YAML :

- `layout: recipe`, `title: "Titre"` (guillemets, accents corrects), `image: nom_fichier.ext` (nom de fichier seul, pas de chemin).
- `tags:`, `ingredients:` en listes. Optionnel : `components:` (liste de titres exacts de composants).
- **Directions** : au choix (le layout gère les deux) — **format liste (legacy)** : `directions:` dans le front matter (une ligne par étape) ; **format Markdown (préféré)** : pas de `directions:` ; dans le corps, après la description, une section `## Préparation` avec le déroulé en Markdown (images, tableaux, sous-listes). Quand `directions:` est absent, le corps est affiché comme section préparation et doit contenir ce titre.

Les tags doivent être **canoniques** et figurer dans le registre (voir section suivante). Pour les composants, créer un fichier dans `_components/` et le référencer par son titre dans la recette principale.

**Migration liste → Markdown :** pour convertir des recettes/composants existants vers le format Markdown dans le corps : `uv run python scripts/migrate_directions_to_body.py` (voir docstring ; `--dry-run` pour simuler).

**Images dans la préparation** (format Markdown des directions) : les images sont centrées, affichées en plus petit avec une bordure ; la légende est en petit italique centré au-dessus de l'image et un bouton loupe en haut à droite ; un clic sur l’image ou sur la loupe ouvre la même vue plein écran que l’image hero. En markdown simple : `![description](images/photo.jpg)`. Pour contrôler la taille : syntaxe Kramdown IAL, ex. `![description](images/photo.jpg){: width="300px"}`. Pour une légende au-dessus de l'image : HTML brut avec `<figure class="recipe-inline-image">`, `<figcaption>Légende</figcaption>` puis `<img>`, et optionnellement `data-max-width`, `data-aspect-ratio` sur le figure. Taille et ratio en markdown : IAL `{: data-max-width="400px" data-max-height="300px" data-aspect-ratio="16/9" }`. Les images sont centrées ; la légende s'affiche en petit italique au-dessus de l'image.

---

## Système de tags

### Registre (`_data/recipe_tags.yml`)

Source de vérité pour les tags : liste d’entrées `{ id, ingredient }`.

- **`id`** : chaîne canonique du tag (ASCII, facile à taper, ex. `oeufs`, `creme`, `gateau`). C’est cette valeur qui est utilisée dans les recettes et dans les catégories d’accueil.
- **`ingredient`** : `true` pour un ingrédient physique (liste de courses), `false` pour un type de plat, une cuisine, une méthode, etc.
- Une seule forme canonique par concept (pas de doublon singulier/pluriel ou accentué/non accentué).

### Catégories d’accueil (`home_categories.md`)

Le front matter `categories:` définit l’ordre et le contenu des catégories affichées sur la page d’accueil :

- Chaque entrée a `id`, `label`, `description` et `tags: [...]`.
- L’ordre des entrées = ordre d’affichage.
- Seuls des tags présents dans `recipe_tags.yml` doivent apparaître dans les `tags:` des catégories.
- La catégorie spéciale `id: "others"` avec `mode: "other"` sert à regrouper côté interface les recettes qui n’ont aucun tag dans les autres catégories ; sa liste `tags:` reste vide.

### Dans les recettes et composants

Utiliser uniquement des tags qui existent dans le registre (valeur `id`). Les variantes (accents, singulier/pluriel) sont considérées comme le même concept ; on écrit toujours la forme canonique du registre.

Sur demande, un « cold run » peut normaliser tous les tags des recettes/composants et synchroniser les listes de tags des catégories à partir du contenu.

---

## Images cartes (thumbnails) et pre-commit

Les vignettes des recettes (cartes sur l’accueil et les pages de recherche) sont des images redimensionnées dans `images/cards/` (largeur max 480 px), générées par le script Python pour alléger les pages.

### Prérequis

- [uv](https://docs.astral.sh/uv/) (environnement Python)
- [pre-commit](https://pre-commit.com/)

### Installation une fois pour toutes (à la racine du dépôt)

1. **`uv sync`** — crée l’environnement Python et installe les dépendances (Pillow, voir `pyproject.toml`).
2. **`pre-commit install`** — installe le hook git.

### Quand le hook s’exécute

Le hook s’exécute au commit si des fichiers ont changé dans `images/` (sauf `images/cards/`) ou dans `scripts/generate_card_thumbnails.py`. Il régénère alors les miniatures. Si seuls des fichiers dans `images/cards/` ont été modifiés (par le hook ou manuellement), il faut les ajouter au commit (`git add images/cards/`) et committer à nouveau.

### Lancement manuel

```bash
uv run python scripts/generate_card_thumbnails.py
```

Puis `jekyll build` ou `jekyll serve` selon les besoins.

La définition du hook est dans `.pre-commit-config.yaml` (hook local unique, `uv run python scripts/...`).

---

## Règles Cursor

Les règles se trouvent dans `.cursor/rules/` (fichiers `.mdc`). Elles assurent un formatage cohérent, l’usage correct des tags, la synchronisation des catégories d’accueil et, optionnellement, la galerie de prompts pour la génération d’images.

| Fichier | Intention | Quand ça s’applique |
|---------|-----------|--------------------|
| `format-pasted-recipe.mdc` | Formater les recettes collées ou éditées, orthographe FR, tags issus du registre, pas de « : » dans les étapes, gestion des composants. Ne pas modifier quantités ni intention. | Toujours (alwaysApply). Collage d’une recette brute ou édition dans `_recipes/` ou `_components/`. |
| `home-categories.mdc` | Garder les catégories d’accueil (`home_categories.md`) alignées avec les tags canoniques lors de l’édition de recettes/composants ; support du cold run catégories/tags. | Toujours. Création ou édition de recettes/composants, ou demande explicite de sync / cold run. |
| `update-recipe-prompt-gallery.mdc` | Créer ou mettre à jour le prompt de génération d’image (réaliste, fidèle à la recette) dans `prompts/_recipes/` ou `prompts/_components/`. | À la création ou à l’édition de fichiers dans `_recipes/` ou `_components/` (règle ciblée par globs, alwaysApply: false). |

---

## Démarrage rapide

**Jekyll en local :**

1. Installer Jekyll : `gem install bundler jekyll` (ou vérifier avec `jekyll -v`).
2. Lancer : `jekyll serve`.

Site local : <http://127.0.0.1:4000/>

**Docker Compose :**

```bash
docker compose up
```

- Port hôte 80 → conteneur 4000.
- Volumes pour externaliser `_components`, `_images`, `_posts`, `_recipes` (voir `docker-compose.yml`).

---

## Recherche avancée

La page `/recherche/` permet de filtrer par tags ou ingrédients (avec normalisation FR), avec tolérance aux manquants, mode « tolérance infinie », autocomplete, visualisation interactive (D3) et synchronisation des paramètres dans l’URL. Voir la page pour les paramètres d’URL détaillés.

---

## Déploiement

Configuré pour GitHub Pages (`_config.yml` : `url`, `baseurl`). Un push déclenche la reconstruction.

---

## Remerciements et licence

Basé sur [Chowdown](https://github.com/clarklab/chowdown) (ClarkLab) avec personnalisations majeures (recherche, dataviz). Voir `LICENSE` pour la licence.

---

*English: Heavily customized French fork of Chowdown with advanced search (tags/ingredients, tolerance, canonicalization), interactive D3 visualizations, and URL-shareable state.*
