# W.J. Cake & Dessert

Projet e-commerce pour la pâtisserie artisanale et événementielle W.J. Cake & Dessert, basé sur le cahier des charges `CDC-WJCD-2026-V1`.

## Objectif

Construire une plateforme e-commerce qui permet de :

- présenter le catalogue produit
- prendre des commandes standard et personnalisées
- gérer les paiements sécurisés
- centraliser les commandes dans un back-office simple
- soutenir le SEO local sur Casablanca

## Proposition de stack

- `frontend` : front-office
- `backend` : API Node.js
- `packages/shared` : types, schémas, utilitaires communs
- `docs` : cadrage, architecture, roadmap

## MVP prioritaire

Le MVP couvre :

- page d'accueil
- boutique et fiches produit
- panier
- tunnel de commande
- configurateur de gâteau sur mesure
- espace administrateur minimal
- notifications e-mail et WhatsApp

## Ce qui est deja pret

- structure monorepo
- cadrage fonctionnel
- architecture cible
- backlog MVP général
- backlog backend dédié aligné sur le document source
- découpe MVP backend
- brouillon de contrat API
- backend MVP fonctionnel dans `backend`

## Backend disponible

Le back expose deja un premier socle versionne en `api/v1` avec :

- `auth` : inscription et connexion
- `catalog` : categories, liste produits, detail produit
- `cart` : creation et mise a jour de panier
- `custom-cakes` : demande de devis sur mesure

## Donnees

Le backend supporte maintenant deux modes :

- `memory` : mode local et tests
- `supabase` : persistence PostgreSQL via Supabase

Le schema SQL initial est dans `backend/supabase/migrations/001_initial_schema.sql`.
Le guide de branchement est dans `docs/supabase-setup.md`.

## Demarrage

Depuis la racine du projet :

```bash
npm run dev:api
```

## Lancement du projet

Cette base est volontairement légère : elle sert à cadrer et structurer le projet avant le scaffold technique complet du front et du back.
