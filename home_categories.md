---
layout: null
categories:

  - id: "starters"
    label: "Entrées"
    description: "Recettes d'entrées."
    tags:
      - entree

  - id: "pates"
    label: "Pâtes"
    description: "Recettes de pates."
    tags:
      - pates

  - id: "japan"
    label: "Japon & Asie"
    description: "Recettes japonaises ou inspirées du Japon."
    tags:
      - japon
      - asiatique

  - id: "main_dishes"
    label: "Plats principaux"
    description: "Plats principaux pour le déjeuner ou le dîner."
    tags:
      - plat
      - plat principal
      - repas

  - id: "soups"
    label: "Soupes & veloutés"
    description: "Toutes les soupes, potages et veloutés."
    tags:
      - soupe
      - potage
      - veloute


  - id: "desserts"
    label: "Desserts"
    description: "Gâteaux, crèmes, entremets et autres douceurs."
    tags:
      - dessert
      - gateau
      - tiramisu

  - id: "drinks"
    label: "Boissons"
    description: "Recettes de boissons."
    tags:
      - boisson
      - cocktail
      - apéritif
      - digestif
      - vin

  - id: "bases"
    label: "Bases & composants"
    description: "Bouillons, sauces et préparations de base."
    tags: []

  - id: "others"
    label: "Autres"
    description: "Recettes qui ne rentrent dans aucune catégorie ci-dessus."
    mode: "other"
    tags: []
---

Ce fichier définit les catégories utilisées sur la page d'accueil.

- Modifiez librement l'ordre des entrées dans `categories:` : cet ordre sera
  utilisé tel quel pour l'affichage.
- Ajoutez ou retirez des tags dans chaque catégorie en utilisant uniquement des
  tags canoniques présents dans `_data/recipe_tags.yml`.
- La catégorie avec `id: "others"` et `mode: "other"` sert à regrouper, côté
  interface, les recettes qui n'ont aucun tag présent dans les autres
  catégories ; sa liste `tags:` reste normalement vide.
