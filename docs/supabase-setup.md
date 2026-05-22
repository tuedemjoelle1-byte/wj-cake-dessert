# Supabase Setup

## Fichiers utiles

- modele d'environnement : `backend/.env.supabase.example`
- schema SQL initial : `backend/supabase/migrations/001_initial_schema.sql`
- architecture : `docs/supabase-architecture.md`

## Etapes

### 1. Creer le projet Supabase

Creer un projet Supabase puis recuperer :

- `Project URL`
- `anon public key`
- `service_role key`

### 2. Creer le fichier d'environnement local

Dans `backend`, dupliquer `backend/.env.supabase.example` en `.env`.

Renseigner ensuite :

```env
DATA_PROVIDER=supabase
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
SUPABASE_SCHEMA=public
```

### 3. Executer le schema SQL

Dans le dashboard Supabase :

1. ouvrir `SQL Editor`
2. coller le contenu de `backend/supabase/migrations/001_initial_schema.sql`
3. executer la requete

### 4. Lancer le backend

Depuis la racine du projet :

```bash
npm run dev
```

### 5. Verifier

Verifier au minimum :

- `http://localhost:4000/health`
- `http://localhost:4000/api/v1`
- `http://localhost:4000/swagger`

## Verification rapide attendue

Si la connexion est correcte :

- le backend demarre sans erreur
- `GET /api/v1/catalog/categories` renvoie les categories seedees
- `GET /api/v1/catalog/products` renvoie les produits seeds

## Attention

- ne jamais exposer `SUPABASE_SERVICE_ROLE_KEY` dans le frontend
- cette cle doit rester uniquement dans le backend
- l'auth actuelle utilise encore les tables `app_users` et `app_sessions`, pas encore `Supabase Auth`
