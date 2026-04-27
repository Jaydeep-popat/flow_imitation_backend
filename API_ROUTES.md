# Ayanshi Imitation Jewelry - API Routes Documentation

## Base URL
`http://localhost:3000/api`

## Status
This document reflects the **currently wired scaffolded API routes** in the backend.

## Authentication
Most routes are intended to be protected via bearer token middleware in implementation phase.

---

## Module 1: Authentication
Base: `/api/auth`

- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user
- `GET /auth/me` - Get current user profile
- `POST /auth/change-password` - Change current user password

---

## Module 2: Users
Base: `/api/users`

- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create user
- `PATCH /users/:id` - Update user
- `PATCH /users/:id/deactivate` - Deactivate user

---

## Module 3: Raw Materials
Base: `/api/raw-materials`

### Material Types
- `GET /raw-materials/types` - Get all material types
- `POST /raw-materials/types` - Create material type
- `PATCH /raw-materials/types/:id` - Update material type

### Purchases
- `GET /raw-materials/purchases` - Get all purchases
- `GET /raw-materials/purchases/:id` - Get purchase by ID
- `POST /raw-materials/purchases` - Create purchase

### Stock
- `GET /raw-materials/stock` - Get raw material stock summary

---

## Module 4: Supplementary Materials
Base: `/api/supplementary`

- `GET /supplementary` - Get all supplementary material types
- `POST /supplementary` - Create supplementary material type
- `PATCH /supplementary/:id` - Update supplementary material type
- `PATCH /supplementary/:id/stock` - Adjust stock
- `GET /supplementary/issuances` - Get all supplementary issuances

---

## Module 5: Designs
Base: `/api/designs`

### Categories
- `GET /designs/categories` - Get all design categories
- `POST /designs/categories` - Create design category

### Designs
- `GET /designs` - Get all designs
- `GET /designs/:id` - Get design by ID
- `POST /designs` - Create design
- `PATCH /designs/:id` - Update design
- `PATCH /designs/:id/deactivate` - Deactivate design

---

## Module 6: Workers
Base: `/api/workers`

- `GET /workers` - Get all workers
- `GET /workers/:id/summary` - Get worker summary
- `GET /workers/:id` - Get worker by ID
- `POST /workers` - Create worker
- `PATCH /workers/:id` - Update worker
- `PATCH /workers/:id/deactivate` - Deactivate worker

---

## Module 7: Assignments
Base: `/api/assignments`

- `GET /assignments` - Get all assignments
- `GET /assignments/:id` - Get assignment by ID
- `POST /assignments` - Create assignment
- `PATCH /assignments/:id/status` - Update assignment status
- `PATCH /assignments/:id/close` - Close assignment
- `POST /assignments/:id/returns` - Record goods return
- `GET /assignments/:id/returns` - Get assignment returns

---

## Module 8: Inventory
Base: `/api/inventory`

- `GET /inventory` - Get all inventory rows
- `POST /inventory/package` - Create packaging batch
- `GET /inventory/packaging-history` - Get packaging history
- `GET /inventory/:designId` - Get inventory by design ID
- `PATCH /inventory/:designId/alert` - Set low stock alert

---

## Module 9: Parties
Base: `/api/parties`

- `GET /parties` - Get all parties
- `GET /parties/dealers` - Get all dealers
- `GET /parties/suppliers` - Get all suppliers
- `GET /parties/:id` - Get party by ID
- `POST /parties` - Create party
- `PATCH /parties/:id` - Update party
- `PATCH /parties/:id/deactivate` - Deactivate party
- `GET /parties/:id/ledger` - Get party ledger
- `GET /parties/:id/outstanding` - Get party outstanding summary
- `POST /parties/:id/dealer-prices` - Set dealer-specific price
- `GET /parties/:id/dealer-prices` - Get dealer-specific prices

---

## Module 10: Orders
Base: `/api/orders`

- `GET /orders/overdue` - Get overdue orders
- `GET /orders` - Get all orders
- `GET /orders/:id` - Get order by ID
- `POST /orders` - Create order
- `PATCH /orders/:id/confirm` - Confirm order
- `PATCH /orders/:id/pack` - Mark order packed
- `PATCH /orders/:id/dispatch` - Dispatch order
- `PATCH /orders/:id/cancel` - Cancel order

---

## Module 11: Payments
Base: `/api/payments`

- `GET /payments` - Get all payments
- `GET /payments/outstanding` - Get outstanding report
- `GET /payments/cashflow` - Get daily cashflow
- `GET /payments/:id` - Get payment by ID
- `POST /payments/dealer` - Record dealer payment
- `POST /payments/supplier` - Record supplier payment
- `POST /payments/worker` - Record worker payment

---

## Module 12: Reports
Base: `/api/reports`

- `GET /reports/sales` - Get sales report
- `GET /reports/stock` - Get stock report
- `GET /reports/workers` - Get worker report
- `GET /reports/purchases` - Get purchase report
- `GET /reports/profit-overview` - Get profit overview
- `GET /reports/dashboard` - Get dashboard summary

---

## Success Response Shape
```json
{
  "success": true,
  "data": {}
}
```

## Error Response Shape
```json
{
  "success": false,
  "message": "Something went wrong"
}
```

---

**Current wired endpoints:** 71
