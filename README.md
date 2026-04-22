# Vehicle Lead Acquisition App

A full-stack web application for acquiring vehicle seller leads. Features a public-facing landing page with a lead capture form, an admin dashboard for managing leads, automatic confirmation emails, and a vehicle value estimator.

## Features

- **Landing page** — Mobile-first form capturing seller contact info, vehicle details, condition, and an optional photo
- **Admin dashboard** — View, filter, sort, update, and export all leads; inline notes editing
- **Auto-response email** — Sellers receive a confirmation email within seconds of submitting
- **Vehicle value estimate** — After submission, sellers see a rough market value range
- **CSV export** — Export all or filtered leads to a spreadsheet

## Tech Stack

- **Next.js 14** (App Router, TypeScript)
- **Prisma** + **SQLite** (switch to PostgreSQL for production)
- **Tailwind CSS**
- **Resend** for transactional email

---

## Quick Start

### 1. Clone and install

```bash
git clone <your-repo-url>
cd vehicle-leads
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL="file:./dev.db"
ADMIN_PASSWORD="your-secure-password"
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxx"
RESEND_FROM_EMAIL="noreply@yourdomain.com"
BUSINESS_NAME="AutoCash Buyers"
REPLY_TO_EMAIL="offers@yourdomain.com"
```

**Getting a Resend API key:**
1. Sign up free at [resend.com](https://resend.com)
2. Add and verify your sending domain
3. Create an API key and add it to `.env`

> **Email dev tip:** During local development, Resend's free tier lets you send to any address. If you don't have a Resend key yet, email sending will silently fail but leads will still save to the database.

### 3. Set up the database

```bash
npm run db:push
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the landing page.  
Admin dashboard: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | Prisma database connection string |
| `ADMIN_PASSWORD` | ✅ | Password to access `/admin` |
| `RESEND_API_KEY` | ✅ | Resend API key for sending emails |
| `RESEND_FROM_EMAIL` | ✅ | Verified sender email address |
| `BUSINESS_NAME` | — | Your business name (shown in emails) |
| `REPLY_TO_EMAIL` | — | Reply-to address in confirmation emails |

---

## Deploying to Vercel

1. Push your repo to GitHub
2. Import in [vercel.com](https://vercel.com)
3. Add all environment variables in the Vercel dashboard
4. For the database, switch to **PostgreSQL** (e.g. Vercel Postgres or Neon):
   - Update `prisma/schema.prisma` provider to `postgresql`
   - Set `DATABASE_URL` to your Postgres connection string
   - Run `prisma db push` or use migrations

## Deploying to Railway

1. Create a new project at [railway.app](https://railway.app)
2. Add a PostgreSQL service
3. Deploy from GitHub
4. Set env vars in Railway settings
5. The `npm run build` script auto-runs `prisma generate`

---

## Switching to PostgreSQL

In `prisma/schema.prisma`, change:

```prisma
datasource db {
  provider = "postgresql"   // was "sqlite"
  url      = env("DATABASE_URL")
}
```

Then run:

```bash
npm run db:push
```

---

## Photo Uploads

Photos are stored as base64 strings in SQLite/PostgreSQL. This works well for moderate traffic (up to a few hundred submissions per day). For high volume:

- Use **Vercel Blob**, **AWS S3**, or **Cloudflare R2**
- Store the URL in the `photoData` field instead of the base64 string

---

## Project Structure

```
vehicle-leads/
├── app/
│   ├── page.tsx              # Public landing page
│   ├── thank-you/page.tsx    # Post-submission page with estimate
│   ├── admin/
│   │   ├── page.tsx          # Admin dashboard
│   │   └── login/page.tsx    # Admin login
│   └── api/
│       ├── leads/route.ts    # GET all leads, POST new lead
│       ├── leads/[id]/route.ts  # PATCH update, DELETE
│       ├── leads/export/route.ts # CSV export
│       └── auth/route.ts     # Login / logout
├── components/
│   ├── LeadForm.tsx          # Public seller form
│   └── AdminDashboard.tsx    # Admin table + filters
├── lib/
│   ├── db.ts                 # Prisma client singleton
│   ├── email.ts              # Resend email sender
│   └── estimate.ts           # Vehicle value estimator
├── middleware.ts             # Admin route protection
└── prisma/
    └── schema.prisma         # Database schema
```

---

## Customization

### Business name / branding
- Update `BUSINESS_NAME` in `.env`
- Edit the hero headline and footer in `app/page.tsx`
- Swap the logo text in `app/layout.tsx`

### Adding car makes / years
- Edit the `MAKES` array in `components/LeadForm.tsx`
- The year range auto-calculates from 1990 to the current year

### Estimate formula
- Edit `lib/estimate.ts` — adjust `makeBaseValues`, depreciation rates, or condition multipliers
