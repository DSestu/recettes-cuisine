# SPEC — Calendrier des ingrédients (Gantt)

## 1. Objectif

Ajouter une nouvelle page publique **`/calendrier/`** (au même niveau que `/`, `/recherche/`, etc.) affichant un diagramme de Gantt de la saisonnalité des ingrédients du site.

**Utilisateurs cibles :** visiteurs du site (moi + partage). Cas d'usage principal : « qu'est-ce qui est de saison ce mois-ci, et quelles recettes cuisiner ? ».

## 2. Modèle de données

### 2.1 Nouveau fichier `_data/seasonality.yml`

Fichier séparé de `_data/recipe_tags.yml`, découplé du registre de tags. Contient **uniquement les ingrédients à saisonnalité marquée** (ceux disponibles toute l'année n'y figurent pas — leur absence signifie « année entière »).

**Granularité :** quinzaine (24 créneaux par an : `jan-1`, `jan-2`, `feb-1`, …, `dec-2`).

**Intensité :** 3 niveaux traduits en opacité sur les barres du Gantt :
- `start` (début de saison — opacité ~0.4)
- `peak` (pleine saison — opacité 1.0)
- `end` (fin de saison — opacité ~0.4)

**Format retenu (compact, facilement éditable à la main) :**

```yaml
- id: fraise               # canonical id from _data/recipe_tags.yml
  category: fruit          # fruit | legume | viande | poisson | fromage | herbe | champignon | autre
  season: "may-1:start, may-2:peak, jun-1:peak, jun-2:peak, jul-1:peak, jul-2:end"

- id: huitre
  category: coquillage
  season: "sep-1:start, sep-2:start, oct-1:peak, oct-2:peak, nov-1:peak, nov-2:peak, dec-1:peak, dec-2:peak, jan-1:peak, jan-2:peak, feb-1:peak, feb-2:peak, mar-1:peak, mar-2:end, apr-1:end"

- id: gibier
  category: viande
  season: "oct-1:start, oct-2:peak, nov-1:peak, nov-2:peak, dec-1:peak, dec-2:peak, jan-1:end, jan-2:end"
```

**Règles :**
- `id` = référence exacte à une entrée `ingredient: true` de `_data/recipe_tags.yml`.
- Créneaux implicites = hors-saison (barre absente).
- Une "saison" peut chevaucher deux années civiles (ex. huîtres) — l'UI doit gérer le wrap sept→avr.
- Ordre des créneaux dans `season:` sans importance (parseur trie).

### 2.2 Catégories (dimension secondaire)

Utilisées pour filtrer/regrouper visuellement le Gantt. Liste fermée : `fruit`, `legume`, `viande`, `poisson`, `coquillage`, `fromage`, `herbe`, `champignon`, `autre`.

### 2.3 Pré-remplissage

Je génère `_data/seasonality.yml` en une passe automatique :
1. Lire tous les tags `ingredient: true` de `_data/recipe_tags.yml`.
2. Pour chaque ingrédient, appliquer un mapping saisonnalité issu d'une seed FR (calendrier fruits/légumes/viandes de saison métropole).
3. Écrire le fichier au format ci-dessus, trié par `category` puis `id`.
4. Ingrédients non-saisonniers (sel, farine, sucre, huile, épices sèches, laitages non-fermiers…) : omis du fichier.

Tu ajusteras manuellement ensuite. Le format compact permet des edits mono-ligne.

### 2.4 Évolution future (hors scope MVP)

La skill `format-pasted-recipe` (ou son équivalent qui gère les tags) sera étendue plus tard pour :
- proposer d'ajouter une entrée `seasonality.yml` quand un nouvel ingrédient est créé,
- prompter l'utilisateur pour la saison si l'ingrédient semble saisonnier.

Noter dans SPEC comme **TODO post-MVP**, ne pas l'implémenter maintenant.

## 3. Page `/calendrier/`

### 3.1 Structure

- Fichier `calendrier.md` à la racine (comme `recherche.html`, `home_categories.md`) avec `permalink: /calendrier/`.
- Lien dans la nav principale (`assets/js/nav.js` ou template layout — vérifier où sont définis les liens repository/home/search).
- Layout Jekyll standard, inclusion d'un module JS dédié `assets/js/calendrier.js`.

### 3.2 Visualisation Gantt (D3)

**Rendu :**
- Axe X : 12 mois × 2 quinzaines = 24 colonnes. Étiquettes mois centrées.
- Axe Y : lignes d'ingrédients, groupées par catégorie (sections repliables), triées alpha dans chaque groupe.
- Barres : rectangles colorés par catégorie, opacité selon intensité (`start`/`end` = 0.4, `peak` = 1.0).
- Colonne du **mois courant** surlignée (fond léger).
- Barres "wrap" (ex. huîtres sept→avr) rendues en deux segments visuels avec continuité de couleur.
- Responsive : sur mobile, colonnes plus étroites, catégories repliables par défaut.

**Interactions :**
- **Hover barre** → tooltip : nom ingrédient, période exacte (`sept.` → `avr.`), nombre de recettes qui l'utilisent.
- **Clic barre ou nom ingrédient** → panneau latéral (ou modal) listant toutes les recettes du site utilisant cet ingrédient, avec vignettes (réutiliser le rendu carte existant).
- **Filtres en tête de page** :
  - Multi-select catégorie.
  - Toggle « Seulement de saison maintenant » (masque les lignes dont la quinzaine courante est vide).
  - Toggle « Vue mois courant / année entière » (zoom axe X).
- **Vue inverse** (bouton bascule) : « Que cuisiner en [mois courant] ? » → liste d'ingrédients au pic + recettes dont tous les ingrédients-saisonniers sont actuellement de saison. Cette vue peut être un mode alternatif de la même page ou une section en dessous du Gantt.

### 3.3 Interaction avec les recettes

- Charger une seule fois côté client un index `{ ingredient_id: [recipe_slug, ...] }` généré à la build (nouveau `_data/ingredient_index.yml` ou fichier JSON compilé par un plugin/script). L'index évite de scanner toutes les recettes dans le navigateur.
- Le clic « recettes utilisant X » lit cet index, puis récupère les métadonnées de recette depuis le même JSON déjà utilisé par la recherche avancée (voir `advanced_search.md` en mémoire) — pas de duplication.

### 3.4 Export .ics (« ambitieux »)

Bouton par ingrédient : « Ajouter à mon calendrier » → génère un fichier `.ics` avec un événement récurrent annuel couvrant la saison. Génération 100% client-side, pas de backend.

### 3.5 Intégration future avec la recherche avancée

**Hors MVP mais à prévoir dans l'architecture** : la recherche avancée pourra lire `_data/seasonality.yml` pour bonifier le score des recettes dont les ingrédients sont de saison. Le fichier doit donc rester une source publique versionnée et parsable côté client.

## 4. Livrables MVP

Ordre suggéré :

1. **Data** : script one-shot qui génère `_data/seasonality.yml` à partir d'une seed FR + registre de tags. Vérification manuelle rapide.
2. **Index** : script/plugin qui génère l'index `ingredient → [recipes]` (probablement en Ruby dans `_plugins/` ou Python exécuté par pre-commit).
3. **Page + Gantt de base** : `calendrier.md`, `assets/js/calendrier.js`, rendu D3 statique avec catégories/opacité/mois courant.
4. **Interactions** : hover, clic → recettes, filtres.
5. **Vue inverse** : « que cuisiner ce mois-ci ».
6. **Export .ics**.
7. **Lien dans la nav** + tests responsive.

## 5. Style et conventions

- Français partout dans l'UI (labels, tooltips).
- D3 v7 (aligner avec la recherche avancée existante).
- Modules JS ES avec imports, mêmes conventions que `assets/js/search-page.js`.
- Pas de framework (pas de React/Vue) — cohérence avec le reste du site Jekyll.
- Accessibilité minimale : navigation clavier sur les barres, `aria-label` sur les rectangles Gantt.

## 6. Limites (boundaries)

**Toujours faire :**
- Utiliser les `id` canoniques du registre de tags.
- Garder `_data/seasonality.yml` éditable à la main (format compact ligne par ligne).
- Compatible WebP-only, aucune image nouvelle nécessaire pour cette feature.

**Demander avant :**
- Toute modification du modèle de données `recipe_tags.yml` (le SPEC ne le touche pas).
- Ajout de dépendances JS externes autres que D3.
- Modification de la navigation globale.

**Ne jamais faire :**
- Splitter la saisonnalité entre plusieurs fichiers.
- Dupliquer les métadonnées de recettes déjà exposées par la recherche.
- Committer sans demande explicite.

## 7. TODO post-MVP

- Étendre la skill de gestion des tags pour proposer une entrée `seasonality.yml` à la création d'un ingrédient.
- Bonus de score « de saison » dans la recherche avancée.
- Suggestions « cet ingrédient sort de saison dans N jours » sur la page d'accueil.
