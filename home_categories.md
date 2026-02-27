---
layout: null
categories:
  - id: "soups"
    label: "Soupes & veloutés"
    description: "Toutes les soupes, potages et veloutés."
    tags:
      - soupe
      - potage
      - veloute

  - id: "winter"
    label: "Hiver"
    description: "Recettes réconfortantes pour les jours froids."
    tags:
      - hiver

  - id: "quick_easy"
    label: "Rapide & facile"
    description: "Recettes rapides ou simples à préparer."
    tags:
      - rapide
      - facile

  - id: "japan"
    label: "Japon"
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

  - id: "desserts"
    label: "Desserts"
    description: "Gâteaux, crèmes, entremets et autres douceurs."
    tags:
      - dessert
      - gateau
      - creme
      - tiramisu

  - id: "bases"
    label: "Bases & composants"
    description: "Bouillons, sauces et préparations de base."
    tags:
      - base
      - composant
      - bouillon
      - sauce

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

