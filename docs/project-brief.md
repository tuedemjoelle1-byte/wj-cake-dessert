# Project Brief

## Client

- Marque : `W.J. Cake & Dessert`
- Activité : pâtisserie artisanale et événementielle
- Zone prioritaire : Casablanca, Maroc

## Problème à résoudre

La marque vend actuellement surtout via Instagram, Facebook et WhatsApp. Le projet doit réduire la prise de commande manuelle et professionnaliser l'expérience d'achat.

## Objectifs métier

- augmenter la crédibilité de la marque
- centraliser les commandes
- encaisser les paiements en amont
- faciliter les demandes sur mesure
- améliorer le référencement local

## Fonctionnalités cœur

- catalogue produits par catégories
- fiches produit détaillées
- panier persistant
- checkout fluide
- configurateur de gâteau personnalisé
- gestion livraison / retrait
- espace client
- back-office admin
- avis clients
- intégration Instagram / WhatsApp

## Contraintes clés

- expérience mobile-first
- performances SEO solides
- images optimisées
- données personnelles protégées
- architecture extensible pour phase 2

## Hypothèse technique retenue

On part sur un monorepo avec séparation claire `web` / `api` / `shared`, afin de garder une bonne maintenabilité et de préparer les futures évolutions comme la PWA, le multi-langue et le programme de fidélité.
