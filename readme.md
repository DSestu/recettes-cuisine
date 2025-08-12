## DSestu – Recettes de cuisine

Un site de recettes en français, propulsé par Jekyll et enrichi d’une recherche avancée et de visualisations interactives. Il s’appuie sur Chowdown mais n’est pas un simple fork : de nombreuses fonctionnalités ont été ajoutées et adaptées.

- Site: `https://dsestu.github.io/recettes-cuisine`
- Langue: français

### Fonctionnalités personnalisées majeures

- Recherche avancée (`/recherche/`):
  - Modes de recherche: Tags ou Ingrédients (avec normalisation/canonicalisation FR).
  - Tolérance aux manquants + mode « tolérance infinie » (classement par pertinence).
  - Autocomplete, suggestions Top 20 cliquables (histogrammes D3).
  - Visualisation interactive (D3) avec dispositions: radial, force, cercle, anneaux, spirale.
  - Types de liens: recette→ingrédient, ingrédient↔ingrédient, recette↔recette.
  - Poids d’arêtes: uniforme, fréquence, basé sélection; contrôle d’impact.
  - Plein écran avec mini‑panneau (visibilité nœuds, layout, tolérance, masquage top) + recentrage.
  - Masquage des ingrédients trop fréquents (réduction du bruit) et réintégration rapide.
  - Composants inclus/exclus à la demande.
  - Synchronisation de tous les paramètres avec l’URL pour partager une vue.

- Index ingrédients robuste:
  - Normalisation française (accents, ligatures), singularisation, stopwords culinaires.
  - Regroupement canonique (Levenshtein) pour rapprocher variantes et fautes communes.

### Démarrage rapide

Option Jekyll (local):

1. Installer Jekyll: `gem install bundler jekyll` (ou vérifier: `jekyll -v`)
2. Lancer:

```bash
jekyll serve
```

Site local: `http://127.0.0.1:4000/`

Option Docker Compose:

```bash
docker compose up
```

Notes:

- Port hôte 80 → conteneur 4000.
- Volumes pour externaliser `_components`, `_images`, `_posts`, `_recipes` (voir `docker-compose.yml`).

### Contenu et structure

- `/_recipes`: recettes Markdown
- `/_components`: sous‑recettes réutilisables
- `/images`: images
- `/_data/nutrients.yml`: données nutritionnelles

Front matter type:

```yaml
title: "Ma recette"
layout: recipe
image: images/ma_recette.jpg
tags: ["végétarien", "rapide"]
ingredients:
  - 2 carottes
  - 1 oignon
directions:
  - Émincer l’oignon.
  - Cuire 10 minutes.
```

Pour une recette composant, placez les éléments dans `/_components` puis référencez‑les depuis la recette principale.

### Page Recherche avancée – rappel

- Sélection par saisie, autocomplete, histogrammes cliquables.
- Tolérance aux manquants; mode infini pour classer toutes les recettes par pertinence.
- Graph interactif (zoom/pan/drag) et navigation via clic sur les recettes.
- Plein écran + mini‑commandes; bouton « recentrer » dédié.
- Paramètres d’URL (exemples): `mode=tag|ingredient`, `tags=a,b`, `ingredients=a,b`, `mt=2`, `inf=1`, `viz=1`, `layout=force|radial|circle|rings|spiral`, `links=recipe-token|token-token|recipe-recipe`, `edge=uniform|freq|idf`, `impact=0..100`, `mr`, `mi`, `ht`, `st/sr/sc`.

### Déploiement

- Configuré pour GitHub Pages (`_config.yml`: `url`, `baseurl`). Un push déclenche la reconstruction.

### Remerciements et licence

- Basé sur Chowdown (ClarkLab) avec personnalisations majeures autour de la recherche/dataviz.
- Voir `LICENSE` pour la licence.

—

English note: This is a heavily customized French fork of Chowdown featuring advanced search (tags/ingredients with tolerance and canonicalization), interactive D3 visualizations, and URL‑shareable state.
