# StockSense — Modular Inventory Management System

[![Next.js](https://img.shields.io/badge/Next.js-16%20(App%20Router)-000000?logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/ORM-Prisma%206-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org)

Centralized inventory platform: products, warehouses, receipts, deliveries, internal transfers, adjustments, and stock ledger.

**UI mockup:** [Excalidraw — StockSense](https://link.excalidraw.com/l/65VNwvy7c4X/3ENvQFu9o8R)

## Getting started

### Prerequisites

- Node.js 20+
- PostgreSQL 15+

### Install

```bash
git clone https://github.com/cryoxyl-beep/StockSense.git
cd StockSense
npm install
cp .env.example .env
# Edit DATABASE_URL, AUTH_SECRET (openssl rand -base64 32), NEXTAUTH_URL
npx prisma migrate dev
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Seed login:** `admin` / `admin1234`

### Scripts

```bash
npm run dev
npm run build
npm run typecheck
npm run db:migrate
npm run db:seed
npm run db:validate
```

## Architecture

```text
prisma/schema.prisma
src/app/           → UI + Route Handlers
src/services/      → stock mutations, KPIs, operation workflows
src/components/    → layout, forms, tables
src/lib/           → prisma client, validations, auth helpers
```

## Features

- Auth: Login Id + email signup, OTP password reset (dev: OTP logged to console)
- Dashboard KPIs and filters
- Products, stock by location, low-stock flags
- Warehouses, locations, contacts
- Receipts (`WH/IN/001`), deliveries (`WH/OUT/001`), transfers, adjustments
- Move history (list + kanban), print-friendly operation detail

See [docs/smoke-test.md](docs/smoke-test.md) for a quick verification checklist.

## License

MIT
