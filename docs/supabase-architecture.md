# Supabase Architecture

## Objectif

Le projet peut maintenant fonctionner avec deux providers de donnees :

- `memory` pour le developpement rapide et les tests
- `supabase` pour une persistence reelle basee sur PostgreSQL

## Strategie retenue

Le backend conserve la logique metier et Swagger, tandis que Supabase sert de socle de donnees.

- `backend/src/data/repositories/memory-repository.js`
- `backend/src/data/repositories/supabase-repository.js`
- `backend/src/data/repositories/index.js`

Le provider actif est choisi via `DATA_PROVIDER`.

## Variables d'environnement

```env
DATA_PROVIDER=supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
SUPABASE_SCHEMA=public
```

## Tables MVP

- `app_users`
- `app_sessions`
- `categories`
- `products`
- `carts`
- `cart_items`
- `custom_cake_requests`
- `orders`
- `payments`
- `delivery_zones`
- `delivery_slots`

## Flux applicatif

### Authentification

Pour le MVP actuel, l'inscription et la connexion utilisent les tables `app_users` et `app_sessions`.

Remarque :
la logique n'utilise pas encore `Supabase Auth`. C'est une etape suivante recommandee si on veut une authentification plus robuste, les liens magiques, la gestion des mots de passe et les policies natives.

### Catalogue

Le catalogue est lu via l'API REST PostgREST exposee par Supabase.

### Panier

Le panier est stocke dans `carts` et `cart_items`.

### Devis sur mesure

Les demandes sont stockees dans `custom_cake_requests`.

## Migration initiale

Le schema SQL de depart est disponible ici :

- `backend/supabase/migrations/001_initial_schema.sql`

## Recommandation suivante

Apres cette base, les prochaines etapes utiles sont :

1. basculer les mots de passe vers un hash
2. migrer l'auth vers `Supabase Auth`
3. ajouter `Storage` pour les images d'inspiration
4. ajouter `orders`, `payments`, `delivery_slots` et `admin_users`
