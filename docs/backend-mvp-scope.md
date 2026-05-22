# Backend MVP Scope

## Objectif

Livrer un backend capable de supporter :

- le catalogue public
- le panier
- le checkout
- les commandes
- le paiement
- la livraison
- les demandes de gâteaux sur mesure
- un back-office minimal

## Tickets prioritaires à couvrir en premier

### Fondation

- `WJCD-2` dépôt et conventions
- `WJCD-4` base de données
- `WJCD-5` contrat d'API et versionnement
- `WJCD-6` documentation d'API
- `WJCD-141` protections applicatives

### Identité client

- `WJCD-11` inscription / connexion e-mail
- `WJCD-12` vérification d'e-mail
- `WJCD-14` réinitialisation du mot de passe
- `WJCD-15` profil et préférences
- `WJCD-16` adresses de livraison

### Vente standard

- endpoints catalogue public
- fiche produit et prix dynamique
- panier persistant
- calcul des frais et créneaux
- création de commande
- intégration paiement et webhooks

### Vente sur mesure

- création de demande de devis
- upload d'inspirations
- suivi de statut de la demande

### Ops minimales

- e-mails transactionnels
- notifications WhatsApp de base
- tableau de bord admin minimal
- journal d'audit minimal

## Proposition d'ordre d'implémentation

1. socle API + base de données + auth
2. catalogue + produits + variantes
3. panier + livraison + commande
4. paiement + webhooks + notifications
5. sur mesure + back-office minimal
