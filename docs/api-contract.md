# API Contract Draft

## Public Routes

- `GET /api/catalog/categories`
- `GET /api/catalog/products`
- `GET /api/catalog/products/:slug`
- `POST /api/custom-cakes/quote-requests`
- `POST /api/cart`
- `PATCH /api/cart/:id`
- `POST /api/checkout/validate`
- `POST /api/orders`
- `GET /api/orders/:number`

## Customer Routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `GET /api/me`
- `GET /api/me/orders`
- `GET /api/me/custom-cakes`

## Admin Routes

- `POST /api/admin/auth/login`
- `GET /api/admin/products`
- `POST /api/admin/products`
- `PATCH /api/admin/products/:id`
- `GET /api/admin/orders`
- `PATCH /api/admin/orders/:id/status`
- `GET /api/admin/custom-cakes`
- `PATCH /api/admin/custom-cakes/:id`
- `GET /api/admin/delivery-slots`
- `PATCH /api/admin/delivery-slots/:id`

## Webhooks

- `POST /api/webhooks/payments`
- `POST /api/webhooks/notifications`
