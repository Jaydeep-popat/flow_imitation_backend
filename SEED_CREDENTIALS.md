# Seed Credentials

This project seeds four login users by default through [prisma/seed.ts](/C:/Users/popat/Desktop/Ayanshi_imitation/prisma/seed.ts).

Default password for all seeded users:

`Password@123`

## Seeded Users

| User Type | Role | Phone | Email | Tenant |
| --- | --- | --- | --- | --- |
| Super Admin | `SUPER_ADMIN` | `9999999991` | `superadmin@flowoid.com` | `None` |
| Tenant Owner | `TENANT_OWNER` | `9999999992` | `owner@ayanshiimitation.com` | `Ayanshi Imitation` |
| Tenant Manager | `TENANT_MANAGER` | `9999999993` | `manager@ayanshiimitation.com` | `Ayanshi Imitation` |
| Tenant Viewer | `TENANT_VIEWER` | `9999999994` | `viewer@ayanshiimitation.com` | `Ayanshi Imitation` |

## Seeded Tenant

| Field | Value |
| --- | --- |
| Name | `Ayanshi Imitation` |
| Slug | `ayanshi-imitation` |
| Plan | `BASIC` |
| Status | `ACTIVE` |

## Important Note

These are the default credentials only.

If you run the seed with environment variable overrides such as:

- `SEED_SUPER_ADMIN_PHONE`
- `SEED_SUPER_ADMIN_PASSWORD`
- `SEED_TENANT_OWNER_PHONE`
- `SEED_TENANT_OWNER_PASSWORD`
- `SEED_TENANT_MANAGER_PHONE`
- `SEED_TENANT_MANAGER_PASSWORD`
- `SEED_TENANT_VIEWER_PHONE`
- `SEED_TENANT_VIEWER_PASSWORD`

then the actual seeded credentials will be whatever values you provide at seed time.

## Run Seed

```powershell
npx prisma db seed
```
