# Backend Backlog

Backlog backend consolidé à partir du document `Backlog_Backend_WJ_Cake_Dessert.docx`.

## Vue d'ensemble

Le backlog source prévoit :

- `17` epics
- `77` tickets
- un statut initial `A faire` pour tous les tickets

## Epics du backlog source

| Epic | Intitulé | Tickets |
| --- | --- | ---: |
| `WJCD-1` | Socle technique & environnements | 5 |
| `WJCD-10` | Authentification & comptes clients | 8 |
| `WJCD-20` | Catalogue produits | 7 |
| `WJCD-30` | Panier & promotions | 5 |
| `WJCD-40` | Livraison & créneaux | 4 |
| `WJCD-50` | Commandes & tunnel de commande | 5 |
| `WJCD-60` | Paiements en ligne | 6 |
| `WJCD-70` | Personnalisation & devis sur mesure | 5 |
| `WJCD-80` | Facturation | 2 |
| `WJCD-90` | Avis clients | 3 |
| `WJCD-100` | Notifications & communication | 4 |
| `WJCD-110` | Contenu éditorial & CMS | 4 |
| `WJCD-120` | Back-office transverse | 5 |
| `WJCD-130` | SEO technique & intégrations | 3 |
| `WJCD-140` | Sécurité & conformité | 4 |
| `WJCD-150` | Tâches planifiées (jobs) | 3 |
| `WJCD-160` | Recette, documentation & livraison | 4 |

## Synthèse par epic

### `WJCD-1` Socle technique & environnements

- initialiser le dépôt Git et les conventions
- configurer préproduction et production
- modéliser la base de données avec migrations et seed
- définir le contrat d'API versionné
- mettre en place la documentation d'API

### `WJCD-10` Authentification & comptes clients

- inscription et connexion par e-mail
- vérification d'adresse e-mail
- connexion Google OAuth
- réinitialisation de mot de passe
- profil, préférences et mot de passe
- gestion des adresses de livraison
- liste de souhaits
- suppression de compte et export RGPD

### `WJCD-20` Catalogue produits

- gestion des catégories
- gestion des produits, variantes et options
- catalogue public avec filtres, tri, recherche et pagination
- fiche produit avec prix dynamique
- best-sellers et produits liés
- visibilité / publication du catalogue
- données utiles à la navigation et à la conversion

### `WJCD-30` Panier & promotions

- panier invité et panier client
- persistance panier
- ajout / retrait / modification d'articles
- coupons promotionnels
- calcul du total et règles de validité

### `WJCD-40` Livraison & créneaux

- zones de livraison
- frais de livraison
- créneaux de livraison et retrait
- indisponibilités et délais minimums

### `WJCD-50` Commandes & tunnel de commande

- création de commande
- tunnel de commande
- validation des données client
- statuts de commande
- consultation du suivi de commande

### `WJCD-60` Paiements en ligne

- abstraction fournisseur de paiement
- initialisation de paiement
- retour de paiement réussi ou échoué
- webhooks de confirmation
- relances et sécurité autour des transactions
- suivi des statuts de paiement

### `WJCD-70` Personnalisation & devis sur mesure

- demande de devis pour gâteau personnalisé
- sélection des options de personnalisation
- upload d'images d'inspiration
- estimation tarifaire indicative
- traitement des demandes en back-office

### `WJCD-80` Facturation

- génération de facture
- archivage et consultation des documents

### `WJCD-90` Avis clients

- dépôt d'avis après commande
- modération si nécessaire
- agrégats de notes et restitution publique

### `WJCD-100` Notifications & communication

- e-mails transactionnels
- notifications WhatsApp
- confirmation et changement de statut
- centralisation des modèles et des journaux d'envoi

### `WJCD-110` Contenu éditorial & CMS

- contenus statiques pilotables
- FAQ / contenus éditoriaux
- éléments transverses du site
- publication / mise à jour via back-office

### `WJCD-120` Back-office transverse

- tableau de bord et KPI
- gestion clients et opérations RGPD
- paramétrage général, TVA et paiements
- gestion des utilisateurs et rôles
- journal d'audit

### `WJCD-130` SEO technique & intégrations

- sitemap, robots et redirections
- données structurées Schema.org
- GA4, GTM, Search Console et Pixel Meta optionnel

### `WJCD-140` Sécurité & conformité

- protections applicatives OWASP
- pare-feu applicatif et durcissement
- conformité RGPD et loi 09-08
- sauvegardes automatiques et restauration

### `WJCD-150` Tâches planifiées

- rappels et demandes d'avis automatisés
- relances de paiement et purge des paniers expirés
- anonymisation automatique des comptes inactifs

### `WJCD-160` Recette, documentation & livraison

- cahier de recette back-end
- tests de sécurité
- documentation technique et déploiement
- transfert des accès et comptes administrateur

## Découpe MVP recommandée

### Bloc 1 - Fondation

- `WJCD-1`
- parties critiques de `WJCD-140`

### Bloc 2 - Vente standard

- `WJCD-10` sans Google OAuth ni wishlist
- `WJCD-20`
- `WJCD-30`
- `WJCD-40`
- `WJCD-50`
- `WJCD-60`

### Bloc 3 - Différenciation métier

- `WJCD-70`
- `WJCD-100`
- `WJCD-120` minimal

### Bloc 4 - Mise en production propre

- `WJCD-80`
- `WJCD-90`
- `WJCD-130`
- `WJCD-150`
- `WJCD-160`

## Hors MVP conseillé

- Google OAuth
- wishlist
- reporting avancé
- Pixel Meta
- automatisations RGPD complètes
- analytics avancés

## Remarques

- Le document source contient du texte dupliqué lors de l'extraction, mais la structure des epics et plusieurs tickets clés sont suffisamment nets pour fiabiliser ce backlog.
- Ce fichier sert de backlog de travail normalisé pour le projet local.
