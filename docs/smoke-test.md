# StockSense smoke test

## Setup

1. `cp .env.example .env` and set `DATABASE_URL`, `AUTH_SECRET`, `NEXTAUTH_URL`
2. `npm install`
3. `npx prisma migrate dev`
4. `npm run db:seed`
5. `npm run dev` → http://localhost:3000

## Credentials (seed)

- Login Id: `admin`
- Password: `admin1234`

## Checks

- [ ] Login and land on dashboard
- [ ] Settings: warehouse WH and location STOCK visible
- [ ] Products: Steel Rods with stock
- [ ] Create receipt → validate twice → stock increases
- [ ] Create delivery → validate through waiting/ready → stock decreases
- [ ] Move history shows IN/OUT rows
- [ ] Forgot password: OTP in server console, reset works
