# StockSense

Modular inventory management for hackathon demos: products, warehouses, receipts, deliveries, and stock ledger. Runs fully on your machine.

## Prerequisites

- Node.js 20+
- Docker Desktop (optional, for PostgreSQL)

## Quick start

Default setup uses **SQLite** (`prisma/dev.db`) so you can run without Docker.

```bash
copy .env.example .env
npm install
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

For **PostgreSQL**, start `docker compose up -d`, set `DATABASE_URL` in `.env`, change `provider` in `prisma/schema.prisma` to `postgresql`, and run migrate again.

Open [http://localhost:3000](http://localhost:3000).

### Demo login (after seed)

- **Email:** `admin@stocksense.local`
- **Password:** `admin123`

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server |
| `npm run db:up` | Start Postgres via Docker |
| `npm run db:migrate` | Apply migrations (production-style) |
| `npm run db:seed` | Seed warehouse, products, admin user |

## Flow to demo for judges

1. **Stock** — view quantities (low stock highlighted).
2. **Inventory** — add warehouse / product.
3. **Receipts** — create draft → open → **Validate** → stock increases.
4. **Deliveries** — create draft → **Validate** → stock decreases.
5. **History** — ledger shows Received / Delivered movements.

## Stack

- Next.js (App Router), TypeScript, Tailwind CSS
- PostgreSQL + Prisma ORM
- Session auth (JWT in httpOnly cookie, bcrypt passwords)
