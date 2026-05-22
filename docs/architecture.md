# Architecture Cible

## Vue d'ensemble

Le projet est organisé comme un monorepo :

- `frontend` : site vitrine + boutique + espace client
- `backend` : logique métier, commandes, produits, notifications
- `packages/shared` : types partagés, validations, constantes

## Domaines métier

- `catalog`
- `custom-cakes`
- `cart`
- `checkout`
- `orders`
- `customers`
- `delivery`
- `payments`
- `notifications`
- `admin`

## Choix structurants

### Front

- rendu orienté SEO
- composants réutilisables
- design mobile-first
- pages clés : accueil, boutique, produit, personnalisation, panier, checkout, compte

### Back

- API REST modulaire
- validation stricte des entrées
- stockage des commandes et demandes de devis personnalisés
- gestion des créneaux de livraison et délais minimums

### Paiement

- abstraction du fournisseur de paiement
- priorité au marché marocain
- prévoir intégration CMI ou équivalent

### Notifications

- e-mails transactionnels
- messages WhatsApp contextualisés
- journalisation des envois

## Structure initiale

```text
wj-cake-dessert/
  frontend/
    src/
  backend/
    src/
  packages/
    shared/
      src/
  docs/
```

## Priorités de modélisation

- `Product`
- `ProductVariant`
- `CustomCakeRequest`
- `Cart`
- `Order`
- `Customer`
- `DeliverySlot`
- `PaymentTransaction`
