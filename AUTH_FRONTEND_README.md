# Auth Module README

Frontend integration guide for the current authentication and user-creation flow in the Ayanshi Imitation BMS backend.

This document is based on the backend implementation currently present in:

- [src/modules/auth](/C:/Users/popat/Desktop/Ayanshi_imitation/src/modules/auth)
- [src/modules/users](/C:/Users/popat/Desktop/Ayanshi_imitation/src/modules/users)
- [src/middleware/auth.middleware.ts](/C:/Users/popat/Desktop/Ayanshi_imitation/src/middleware/auth.middleware.ts)

## Base URL

Local:

`http://localhost:3000`

Swagger:

`http://localhost:3000/api/docs`

Health check:

`GET /health`

## Seeded Demo Users

These users are available if the seed has been run with default values.

Default password for all seeded users:

`Password@123`

| User Type | Role | Phone | Email | Tenant |
| --- | --- | --- | --- | --- |
| Super Admin | `SUPER_ADMIN` | `9999999991` | `superadmin@flowoid.com` | `null` |
| Tenant Owner | `TENANT_OWNER` | `9999999992` | `owner@ayanshiimitation.com` | `Ayanshi Imitation` |
| Tenant Manager | `TENANT_MANAGER` | `9999999993` | `manager@ayanshiimitation.com` | `Ayanshi Imitation` |
| Tenant Viewer | `TENANT_VIEWER` | `9999999994` | `viewer@ayanshiimitation.com` | `Ayanshi Imitation` |

## Auth Model

The backend uses:

- short-lived access token
- long-lived refresh token
- both stored in HTTP-only cookies
- refresh token rotation

The backend also returns the access token in the JSON response body, but browser clients should rely primarily on cookies.

## Frontend Rules

- Always send requests with credentials enabled.
- Browser `fetch` should use `credentials: 'include'`.
- Axios should use `withCredentials: true`.
- Protected endpoints can work with cookies or Bearer token, but browser apps should prefer cookies.
- If refresh fails with `401`, redirect the user to login.
- If protected routes return tenant suspension `403`, show a subscription-blocked message.

Example:

```ts
fetch('http://localhost:3000/api/auth/me', {
  method: 'GET',
  credentials: 'include',
});
```

## Response Format

Successful responses:

```json
{
  "success": true,
  "data": {}
}
```

Error responses:

```json
{
  "success": false,
  "error": {
    "code": "SOME_ERROR_CODE",
    "message": "Readable error message"
  }
}
```

Common auth error codes:

- `INVALID_CREDENTIALS`
- `MISSING_ACCESS_TOKEN`
- `INVALID_ACCESS_TOKEN`
- `ACCESS_TOKEN_EXPIRED`
- `MISSING_REFRESH_TOKEN`
- `INVALID_REFRESH_TOKEN`
- `REFRESH_TOKEN_EXPIRED`
- `REFRESH_TOKEN_REUSED`
- `TENANT_MEMBERSHIP_NOT_FOUND`
- `TENANT_SUBSCRIPTION_INACTIVE`
- `USER_INACTIVE`

## Auth Endpoints

### 1. Login

Endpoint:

`POST /api/auth/login`

Purpose:

- authenticate user by `phone` and `password`
- set `accessToken` and `refreshToken` cookies
- return user profile with tenant context

Request:

```json
{
  "phone": "9999999992",
  "password": "Password@123"
}
```

Demo request for super admin:

```json
{
  "phone": "9999999991",
  "password": "Password@123"
}
```

Success response for tenant user:

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user-id",
      "name": "Ayanshi Owner",
      "email": "owner@ayanshiimitation.com",
      "phone": "9999999992",
      "role": "TENANT_OWNER",
      "tenant": {
        "id": "tenant-id",
        "name": "Ayanshi Imitation",
        "slug": "ayanshi-imitation",
        "plan": "BASIC",
        "status": "ACTIVE"
      }
    }
  }
}
```

Success response for super admin:

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user-id",
      "name": "Flowoid Super Admin",
      "email": "superadmin@flowoid.com",
      "phone": "9999999991",
      "role": "SUPER_ADMIN",
      "tenant": null
    }
  }
}
```

Failure cases:

- `401` invalid phone/password
- `403` inactive user
- `403` tenant suspended/cancelled
- `403` user exists but has no active tenant membership

### 2. Refresh Session

Endpoint:

`POST /api/auth/refresh`

Purpose:

- validate refresh token cookie
- rotate refresh token
- issue fresh cookies
- return fresh access token and user profile

Request body:

No body required.

Important:

- request must include cookies
- frontend should call this when access token expires or when app boots and session restore is needed

Success response:

```json
{
  "success": true,
  "data": {
    "token": "new-access-token",
    "user": {
      "id": "user-id",
      "name": "Ayanshi Owner",
      "email": "owner@ayanshiimitation.com",
      "phone": "9999999992",
      "role": "TENANT_OWNER",
      "tenant": {
        "id": "tenant-id",
        "name": "Ayanshi Imitation",
        "slug": "ayanshi-imitation",
        "plan": "BASIC",
        "status": "ACTIVE"
      }
    }
  }
}
```

Failure cases:

- `401` missing refresh cookie
- `401` expired refresh token
- `401` reused refresh token
- `403` tenant suspended/cancelled on refresh

### 3. Get Current User

Endpoint:

`GET /api/auth/me`

Purpose:

- return the currently authenticated user
- return tenant context for tenant-scoped users

Authentication:

- valid access cookie or Bearer token

Success response:

```json
{
  "success": true,
  "data": {
    "id": "user-id",
    "name": "Ayanshi Owner",
    "email": "owner@ayanshiimitation.com",
    "phone": "9999999992",
    "role": "TENANT_OWNER",
    "tenant": {
      "id": "tenant-id",
      "name": "Ayanshi Imitation",
      "slug": "ayanshi-imitation",
      "plan": "BASIC",
      "status": "ACTIVE"
    }
  }
}
```

Super admin response:

```json
{
  "success": true,
  "data": {
    "id": "user-id",
    "name": "Flowoid Super Admin",
    "email": "superadmin@flowoid.com",
    "phone": "9999999991",
    "role": "SUPER_ADMIN",
    "tenant": null
  }
}
```

### 4. Logout

Endpoint:

`POST /api/auth/logout`

Purpose:

- clear auth cookies
- revoke matching refresh token when cookie exists

Request body:

No body required.

Success response:

```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```

### 5. Change Password

Endpoint:

`POST /api/auth/change-password`

Purpose:

- change current user password
- revoke all refresh-token sessions for that user
- clear cookies so user must log in again

Request:

```json
{
  "currentPassword": "Password@123",
  "newPassword": "Password@456"
}
```

Success response:

```json
{
  "success": true,
  "data": {
    "message": "Password updated successfully. Please log in again on this device."
  }
}
```

## User Creation Endpoint

### 6. Create User

Endpoint:

`POST /api/users`

Purpose:

- create a new row in `users`
- intended for admin/internal user creation

Current backend behavior:

- `name` is required
- `email` is required in the current controller implementation
- `phone` is required
- `password` is required and must be at least 8 chars
- `role` is optional
- default role is `TENANT_MANAGER`

Request:

```json
{
  "name": "New Staff User",
  "email": "staff@ayanshiimitation.com",
  "phone": "9999999995",
  "password": "Password@123",
  "role": "TENANT_MANAGER"
}
```

Success response:

```json
{
  "success": true,
  "data": {
    "id": "new-user-id",
    "name": "New Staff User",
    "email": "staff@ayanshiimitation.com",
    "phone": "9999999995",
    "role": "TENANT_MANAGER",
    "isActive": true,
    "createdAt": "2026-04-29T00:00:00.000Z",
    "updatedAt": "2026-04-29T00:00:00.000Z"
  }
}
```

Important limitation:

This endpoint currently creates only the `users` row.

It does not create:

- a `tenant_users` membership row
- a tenant
- tenant linkage for `TENANT_OWNER`, `TENANT_MANAGER`, or `TENANT_VIEWER`

That means:

- a user created through `POST /api/users` cannot log in as a tenant user unless a matching `tenant_users` record is also created
- login will fail with:

```json
{
  "success": false,
  "error": {
    "code": "TENANT_MEMBERSHIP_NOT_FOUND",
    "message": "No active tenant membership found for this user"
  }
}
```

## Register Flow Status

There is currently no dedicated public register endpoint such as:

- `POST /api/auth/register`
- `POST /api/tenants/register`

So if frontend is going to build registration, backend support still needs to be implemented for one of these flows:

### Option 1. Tenant User Registration

Needed backend behavior:

- create user
- create `tenant_users` row
- possibly attach to existing tenant

### Option 2. New Tenant Signup

Needed backend behavior:

- create tenant
- create owner user
- create `tenant_users` row with `TENANT_OWNER`
- maybe initialize default tenant data

Right now, the backend supports login, refresh, logout, me, change-password, and raw user creation only.

## Recommended Frontend Flow

### Login flow

1. Submit `phone` and `password` to `POST /api/auth/login`
2. Store returned user in app state
3. Do not manually store cookies in frontend
4. Use `credentials: 'include'` on future requests

### App boot flow

1. Call `GET /api/auth/me`
2. If it fails with `401`, call `POST /api/auth/refresh`
3. If refresh succeeds, retry `GET /api/auth/me`
4. If refresh fails, redirect to login

### Logout flow

1. Call `POST /api/auth/logout`
2. Clear frontend auth state
3. Redirect to login

## Example Frontend Requests

### Login with fetch

```ts
await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    phone: '9999999992',
    password: 'Password@123',
  }),
});
```

### Get current user

```ts
await fetch('http://localhost:3000/api/auth/me', {
  method: 'GET',
  credentials: 'include',
});
```

### Refresh session

```ts
await fetch('http://localhost:3000/api/auth/refresh', {
  method: 'POST',
  credentials: 'include',
});
```

### Create user

```ts
await fetch('http://localhost:3000/api/users', {
  method: 'POST',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'New Staff User',
    email: 'staff@ayanshiimitation.com',
    phone: '9999999995',
    password: 'Password@123',
    role: 'TENANT_MANAGER',
  }),
});
```

## Notes For Frontend Team

- Use the seeded tenant owner account first to integrate auth quickly:
  - phone: `9999999992`
  - password: `Password@123`
- Use the super admin account when testing non-tenant scoped behavior:
  - phone: `9999999991`
  - password: `Password@123`
- Do not assume `POST /api/users` is a complete registration flow
- For tenant user signup, backend still needs membership creation support
- For company signup, backend still needs tenant creation support

## Related Files

- [SEED_CREDENTIALS.md](/C:/Users/popat/Desktop/Ayanshi_imitation/SEED_CREDENTIALS.md)
- [src/modules/auth/auth.routes.ts](/C:/Users/popat/Desktop/Ayanshi_imitation/src/modules/auth/auth.routes.ts)
- [src/modules/users/users.routes.ts](/C:/Users/popat/Desktop/Ayanshi_imitation/src/modules/users/users.routes.ts)
- [src/config/swagger.ts](/C:/Users/popat/Desktop/Ayanshi_imitation/src/config/swagger.ts)
