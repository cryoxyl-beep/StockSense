# StockSense — Modular Inventory Management System

[![Next.js](https://img.shields.io/badge/Next.js-16%20(App%20Router)-000000?logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
<<<<<<< HEAD
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS%20%2B%20CVA-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Prisma](https://img.shields.io/badge/ORM-Prisma%206-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Zod](https://img.shields.io/badge/Validation-Zod-3E67B1)](https://zod.dev)
[![React Hook Form](https://img.shields.io/badge/Forms-React%20Hook%20Form-EC5990)](https://react-hook-form.com)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> **A centralized, real-time inventory platform that replaces manual registers, spreadsheets, and scattered tracking with one place to manage products, warehouses, receipts, deliveries, transfers, and adjustments.**

**UI mockup:** [Excalidraw — StockSense](https://link.excalidraw.com/l/65VNwvy7c4X/3ENvQFu9o8R)

---

## Problem statement

Businesses still rely on paper registers, Excel sheets, and ad-hoc tools to track stock. That leads to stale counts, missed reorders, slow handoffs between warehouse and office staff, and no single audit trail when something goes wrong.

**StockSense** digitizes stock-related operations end to end: every inbound movement, outbound shipment, internal transfer, and physical count adjustment updates inventory automatically and is recorded in a **stock ledger** you can trust.

### Who it is for

| Role | Responsibilities |
| --- | --- |
| **Inventory managers** | Oversee incoming and outgoing stock, reordering, and operational status |
| **Warehouse staff** | Transfers, picking, shelving, cycle counts, and validating documents on the floor |

---

## Highlights

- **Live dashboard** — KPIs and filters for day-to-day operations
- **Product catalog** — SKU, categories, units of measure, and stock by location
- **Operational workflows** — Receipts, deliveries, internal transfers, and adjustments
- **Multi-warehouse** — Locations, racks, and bins with hierarchy
- **Low-stock awareness** — Reorder rules and alerts before you run out
- **Traceability** — Immutable ledger entries for every quantity change

---

## Dashboard

After sign-in, users land on the **inventory dashboard** — a snapshot of what needs attention right now.

### KPIs

- Total products in stock
- Low stock / out-of-stock items
- Pending receipts
- Pending deliveries
- Internal transfers scheduled

### Dynamic filters

| Dimension | Options |
| --- | --- |
| Document type | Receipts, delivery, internal, adjustments |
| Status | Draft, waiting, ready, done, canceled |
| Scope | Warehouse or location |
| Catalog | Product category |

---

## Navigation

| Area | What you can do |
| --- | --- |
| **Products** | Create and update products, categories, per-location availability, reordering rules |
| **Operations → Receipts** | Record vendor inbound stock |
| **Operations → Delivery orders** | Pick, pack, and ship outbound stock |
| **Operations → Inventory adjustment** | Reconcile system vs physical counts |
| **Operations → Move history** | Browse the stock ledger |
| **Dashboard** | Operational overview (default landing) |
| **Settings → Warehouses** | Sites, locations, and hierarchy |
| **Profile (sidebar)** | My profile, logout |

---

## Authentication

- Email (or username) **sign-up and sign-in**
- **OTP-based password reset**
- Post-login redirect to the **inventory dashboard**
- Role-aware access (e.g. admin, inventory manager, warehouse staff)

---

## Core features

### 1. Product management

Create and maintain products with:

- Name
- SKU / code
- Category
- Unit of measure (UOM)
- Optional initial stock

### 2. Receipts (incoming goods)

Used when stock arrives from vendors.

1. Create a receipt
2. Add supplier and line items
3. Enter quantities received
4. **Validate** → on-hand stock **increases** automatically

*Example:* Receive 50 units of **Steel Rods** → stock **+50**.

### 3. Delivery orders (outgoing goods)

Used when stock leaves for customer shipment.

1. Pick items
2. Pack items
3. **Validate** → on-hand stock **decreases** automatically

*Example:* Sales order for 10 chairs → delivery reduces chairs by **10**.

### 4. Internal transfers

Move quantity between locations without changing company-wide totals:

- Main warehouse → production floor
- Rack A → rack B
- Warehouse 1 → warehouse 2

Each movement is written to the **stock ledger**.

### 5. Stock adjustments

Resolve differences between **recorded** and **physically counted** stock:

1. Select product and location
2. Enter counted quantity
3. System updates balances and logs the adjustment

### Additional capabilities

- Low-stock alerts
- Multi-warehouse and multi-location support
- SKU search and smart filters

---

## Example inventory flow

| Step | Action | Effect |
| --- | --- | --- |
| 1 | Receive **100 kg** steel from a vendor | Stock **+100** |
| 2 | Internal transfer: main store → production rack | Total unchanged; **location** updated |
| 3 | Deliver **20** units to a customer | Stock **−20** |
| 4 | **3 kg** damaged — adjustment | Stock **−3** |

Every step appears in the **stock ledger** with reference, operation type, locations, quantity, and user.

Document lifecycle (typical):

```
DRAFT → WAITING → READY → DONE
                    ↘ CANCELED
```

---

## Tech stack

| Layer | Technology | Purpose |
| --- | --- | --- |
| **Frontend framework** | [Next.js 16](https://nextjs.org) (App Router) | Server components, file-based routing, API routes |
| **Language** | [TypeScript](https://www.typescriptlang.org) (strict) | End-to-end type safety |
| **UI** | [Tailwind CSS](https://tailwindcss.com), [CVA](https://cva.style), [Lucide](https://lucide.dev) | Responsive layout, variants, icons |
| **Forms** | [React Hook Form](https://react-hook-form.com) | Performant form state |
| **Validation** | [Zod](https://zod.dev) | API payloads, forms, domain rules |
| **ORM** | [Prisma](https://www.prisma.io) v6 | Schema, migrations, type-safe queries |
| **Database** | [PostgreSQL](https://www.postgresql.org) | Relational data, ACID transactions, indexes |

### Architecture (layered)

```text
┌─────────────────────────────────────────────┐
│  Next.js App Router (UI + Route Handlers)   │
└─────────────────────┬───────────────────────┘
                      │ Zod-validated I/O
┌─────────────────────▼───────────────────────┐
│  Service layer (domain & workflows)         │
└─────────────────────┬───────────────────────┘
                      │
┌─────────────────────▼───────────────────────┐
│  Repository layer (queries & transactions)  │
└─────────────────────┬───────────────────────┘
                      │
┌─────────────────────▼───────────────────────┐
│  Prisma  →  PostgreSQL                      │
└─────────────────────────────────────────────┘
```

Planned application layout:

```text
stocksense/
├── prisma/schema.prisma      # Users, products, warehouses, operations, ledger
├── src/app/                  # Routes (dashboard, products, operations, settings)
├── src/components/           # Layout, UI primitives, shared widgets
├── src/lib/                  # Prisma client, validations, utilities
├── src/repositories/         # Data access
├── src/services/             # Business logic (stock mutations, dashboard KPIs)
└── src/types/                # Domain types and DTOs
```

---

## Getting started

> **Note:** This repository is being bootstrapped. Once the application scaffold lands on `main`, use the steps below.

### Prerequisites

- [Node.js](https://nodejs.org) 20+
- [PostgreSQL](https://www.postgresql.org) 15+
- npm, pnpm, or yarn

### Install and run (upcoming)

```bash
git clone https://github.com/cryoxyl-beep/StockSense.git
cd StockSense
npm install
cp .env.example .env   # set DATABASE_URL, AUTH_SECRET, etc.
npx prisma migrate dev
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the app shell and dashboard.

### Useful scripts (upcoming)

```bash
npx prisma validate
npx prisma generate
npm run build
npx tsc --noEmit
```

---

## Repository topics

For GitHub discovery, suggested topics:

`inventory-management` `warehouse-management` `stock-control` `nextjs` `typescript` `prisma` `postgresql` `tailwindcss` `full-stack` `ims`

---

## Contributing

1. Fork the repository and create a feature branch from `main`.
2. Keep changes focused; match existing TypeScript and folder conventions.
3. Run typecheck and Prisma validation before opening a pull request.

---

## License

MIT — see [LICENSE](LICENSE) when added.

---

## Links

- **Repository:** [github.com/cryoxyl-beep/StockSense](https://github.com/cryoxyl-beep/StockSense)
- **Product brief:** `StockSense.pdf` (problem statement, features, and flows)
- **Mockup:** [Excalidraw](https://link.excalidraw.com/l/65VNwvy7c4X/3ENvQFu9o8R)
=======
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
>>>>>>> fbd9896 (feat: implement StockSense IMS v1.0 (full hackathon scope))
