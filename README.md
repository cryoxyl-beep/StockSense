# StockSense

A modern, highly polished, modular inventory management system built for speed and clarity. StockSense handles end-to-end supply chain stock flows: tracking products across warehouses, processing incoming receipts, dispatching deliveries with balance checks, and logging immutable stock ledger movements.

![Tech Stack](https://img.shields.io/badge/Next.js%2016-App%20Router-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React%2019-white?style=flat-square&logo=react&logoColor=%2361DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS%204-white?style=flat-square&logo=tailwindcss&logoColor=%2306B6D4)
![Prisma ORM](https://img.shields.io/badge/Prisma-ORM-white?style=flat-square&logo=prisma&logoColor=%232D3748)
![SQLite/Postgres](https://img.shields.io/badge/Database-SQLite%20%7C%20Postgres-white?style=flat-square&logo=postgresql&logoColor=%234169E1)

## What is it?
StockSense brings clarity to your warehouse operations with real-time stock ledgers and modular inventory control. Features include:
- **Stock Tracking:** Monitor real-time quantities and low-stock alerts.
- **Catalog Management:** Add warehouses and products (SKU, UoM, pricing, reorder points).
- **Orders (Receipts & Deliveries):** Full draft-to-validate workflow ensuring strict stock integrity.
- **Immutable Ledger:** Full audit trail of every single stock movement.
- **Beautiful UI:** Highly polished, interactive, modern SaaS interface.

## Prerequisites
- **Node.js** 20 or higher
- **npm** or **yarn** or **pnpm**
- *(Optional)* Docker Desktop if you prefer running PostgreSQL instead of the default SQLite.

## How to use it locally

By default, StockSense runs instantly using a local **SQLite** database (`prisma/dev.db`), meaning you don't need any complex infrastructure to try it out.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/cryoxyl-beep/StockSense.git
   cd StockSense
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   ```bash
   cp .env.example .env
   ```
   *(Update your `.env` with a secure `SESSION_SECRET` and `RESEND_API_KEY` for password resets if needed).*

4. **Initialize Database:**
   ```bash
   npx prisma migrate dev --name init
   npm run db:seed
   ```

5. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

**Demo Credentials (if you ran the seed script):**
- **Email:** `admin@stocksense.local`
- **Password:** `admin123`

## Deploying to Production (Vercel)

If you plan to deploy StockSense to Vercel or another serverless platform, you **must use a cloud database** (like Vercel Postgres, Supabase, or Neon) since Vercel does not support local SQLite files.
1. Create a cloud Postgres database.
2. Change the `provider` in `prisma/schema.prisma` from `"sqlite"` to `"postgresql"`.
3. Set your `DATABASE_URL` in Vercel to your new cloud database connection string.
4. Deploy!

*(Note: There is no `requirements.txt` file as this is a Node.js/TypeScript project, not Python. All dependencies are managed via `package.json`).*
