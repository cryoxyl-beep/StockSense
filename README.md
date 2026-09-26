# StockSense

StockSense is a modular inventory management system for warehouse operations. It tracks stock across warehouses, validates inbound/outbound/transfer documents, and keeps an immutable movement ledger for auditability.

![Tech Stack](https://img.shields.io/badge/Next.js%2016-App%20Router-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React%2019-white?style=flat-square&logo=react&logoColor=%2361DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS%204-white?style=flat-square&logo=tailwindcss&logoColor=%2306B6D4)
![Prisma ORM](https://img.shields.io/badge/Prisma-ORM-white?style=flat-square&logo=prisma&logoColor=%232D3748)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-white?style=flat-square&logo=postgresql&logoColor=%234169E1)

## Features

- **Advanced analytics dashboard**
  - 14-day inbound vs outbound movement trends
  - Top-moving SKUs (30-day velocity)
  - Pending document counters (receipts, deliveries, transfers)
- **Smart low-stock predictions**
  - Velocity-driven stockout window estimates
  - Suggested reorder quantities from reorder threshold + on-hand stock
- **Warehouse transfer workflow**
  - Draft-to-validate transfer documents
  - Source/destination warehouse validation
  - Dual ledger postings (`TRANSFER_OUT` and `TRANSFER_IN`)
- **Core inventory operations**
  - Product + warehouse management
  - Receipts and deliveries with stock integrity checks
  - Immutable stock ledger with searchable movement history

## Architecture (high level)

- **Frontend:** Next.js App Router pages and client components
- **API layer:** Route handlers under `app/api/*`
- **Business logic:** Inventory validation and stock mutation rules in `lib/inventory.ts`
- **Data layer:** Prisma ORM models for products, balances, documents, and ledger
- **Auth:** Cookie-based session flow (`lib/auth.ts`, `middleware.ts`)

## Data model (core entities)

- `Warehouse` — stock locations
- `Product` — SKU master catalog
- `StockBalance` — per-product, per-warehouse on-hand quantity
- `StockDocument` — draft/done receipt, delivery, transfer documents
- `StockDocumentLine` — document line items
- `StockLedger` — immutable movement entries (`RECEIPT`, `DELIVERY`, `TRANSFER_IN`, `TRANSFER_OUT`)

## Workflows

### 1) Receipts
1. Create draft receipt with destination warehouse and lines.
2. Validate receipt.
3. Quantities are incremented in destination warehouse.
4. Ledger records `RECEIPT` entries.

### 2) Deliveries
1. Create draft delivery with source warehouse and lines.
2. Validate delivery.
3. System checks stock sufficiency, then decrements source stock.
4. Ledger records `DELIVERY` entries.

### 3) Transfers
1. Create draft transfer with source + destination warehouses.
2. Validate transfer.
3. System checks source stock, then moves quantities atomically.
4. Ledger records both `TRANSFER_OUT` and `TRANSFER_IN` entries.

## Getting started

### Prerequisites
- Node.js 20+
- npm (or yarn/pnpm)
- PostgreSQL (local/docker/cloud)

### Local setup

```bash
git clone https://github.com/cryoxyl-beep/StockSense.git
cd StockSense
npm install
cp .env.example .env
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

Open: `http://localhost:3000`

### Demo credentials
- Email: `admin@stocksense.local`
- Password: `admin123`

## Environment variables

- `DATABASE_URL` — PostgreSQL connection string
- `SESSION_SECRET` — session signing secret
- `RESEND_API_KEY` — optional (password reset emails)

## Deploying (Vercel)

1. Provision cloud PostgreSQL (Neon, Supabase, Vercel Postgres, etc.).
2. Set `DATABASE_URL` in Vercel project settings.
3. Set `SESSION_SECRET` and optional `RESEND_API_KEY`.
4. Deploy.

## Suggested screenshot sections for product page

If you are preparing a richer product page/portfolio, include:
- Dashboard analytics view (trend + predictions)
- Transfer creation form
- Transfer validation detail page
- Ledger showing transfer in/out rows

## Notes

`requirements.txt` is intentionally a placeholder for tooling compatibility. This project is Node.js/TypeScript and dependency management is handled through `package.json`.
