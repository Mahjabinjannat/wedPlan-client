<div align="center">

# 💍 WedPlan — Wedding Planning Platform

**Discover trusted wedding vendors, request bookings, and manage your big day — all in one place.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-components-000000)](https://ui.shadcn.com)
[![Better Auth](https://img.shields.io/badge/Better_Auth-1.7-8c2338)](https://www.better-auth.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com)

[🌐 Live Website](#-live-links) · [🖥️ Server Repository](#-live-links) · [🚀 Run Locally](#-run-locally)

</div>

---

## 📖 About

**WedPlan** is a role-based wedding marketplace.

- 💑 **Couples (Customers)** browse curated wedding services, send booking requests for their event date and track the vendor's response.
- 🏪 **Vendors** publish services, manage booking requests and can upgrade to **Premium** (Stripe) for unlimited listings and a Premium Vendor badge.
- 🛡️ **Admins** review services before they go public, manage users and monitor payments.

This repository contains the **Next.js client**. The REST API lives in a separate **Express.js server** repository.

---

## 🔗 Live Links

| | Link |
|---|---|
| 🌐 **Live Website** | _https://your-client-url.vercel.app_ |
| 💻 **Client Repository** | https://github.com/Mahjabinjannat/wedPlan-client |
| 🖥️ **Server Repository** | https://github.com/Mahjabinjannat/wedPlan-server |

> 🔐 Admin login credentials for evaluation are provided with the assignment submission.

---

## 📑 Table of Contents

- [About](#-about)
- [Live Links](#-live-links)
- [Key Features](#-key-features)
- [User Roles](#-user-roles)
- [Technology Stack](#-technology-stack)
- [Screens & Routes](#-screens--routes)
- [Run Locally](#-run-locally)
- [Environment Variables](#-environment-variables)
- [Testing Payments](#-testing-payments-stripe-test-mode)
- [Project Structure](#-project-structure)
- [Security Highlights](#-security-highlights)

---

## ✨ Key Features

### 🏠 Public
- **Wedding-themed home page** — hero banner, featured services, 6 categories, *Why Choose WedPlan*, *How It Works* — with smooth **Motion** animations
- **Browse Services** — search across name, description, category, location and vendor; filter by **category** and **location**; sort by **price (low ↔ high)**
- Loading skeletons, empty states and friendly error pages (404, access denied, account blocked)

### 🔐 Authentication
- Email & password sign up / sign in with **Better Auth**
- **Google** sign-in
- Choose **Customer** or **Vendor** during sign up
- Optional **profile photo upload** to ImgBB
- Password rules: at least 6 characters, one uppercase and one lowercase letter
- Admin accounts can **never** be created through public sign up

### 💑 Customer
- View full service details (multiple images, price, location, vendor)
- Send a **booking request** with event date, location and a message
- Duplicate active requests for the same service and date are blocked
- Track every request (**Pending / Accepted / Rejected / Cancelled**) and cancel pending ones
- Edit profile name and photo

### 🏪 Vendor
- Dashboard with service, booking and subscription statistics
- **Add, edit, delete** services with multiple images (ImgBB)
- Show or hide a service (availability) and see its **approval status**
- **Accept or reject** booking requests
- **Free plan:** up to 3 active services · **Premium:** unlimited services + **Premium Vendor badge**
- Upgrade with **Stripe Checkout** (test mode)

### 🛡️ Admin
- Platform overview: users, vendors, customers, services, pending services, transactions
- **Manage Users** — search by name/email, filter by role, view details, **block / unblock**
- **Manage Services** — search, filter by status, **approve / reject / move to pending / delete**
- **Transactions** — read-only list of vendor payments

---

## 👥 User Roles

| Role | How to get it | Dashboard pages |
|---|---|---|
| 💑 **Customer** | Sign up as *Customer* (or with Google) | Overview · My Bookings · Profile Settings |
| 🏪 **Vendor** | Sign up as *Vendor* | Overview · My Services · Add Service · Booking Requests · Subscription · Profile Settings |
| 🛡️ **Admin** | Assigned securely on the server (see server README) | Overview · Manage Users · Manage Services · Transactions |

Each role can only open its own dashboard pages — typing another role's URL shows **Access Denied**. Blocked users are redirected to an **Account Blocked** page.

---

## 🛠️ Technology Stack

| Area | Technology |
|---|---|
| Framework | **Next.js 16** (App Router, Cache Components) · **React 19** |
| Language | **TypeScript** |
| Styling & UI | **Tailwind CSS 4** · **shadcn/ui** (Base UI) · **Lucide** icons |
| Animation | **Motion** (Framer Motion) |
| Authentication | **Better Auth** (email/password, Google, JWT plugin) |
| Database | **MongoDB** (Better Auth adapter + server components) |
| Payments | **Stripe Checkout** (via the Express server) |
| Images | **ImgBB** image hosting |
| Feedback | **Sonner** toast notifications |
| Validation | **Zod** |

---

## 🗺️ Screens & Routes

| Route | Access | Description |
|---|---|---|
| `/` | Public | Home page |
| `/services` | Public | Browse, search, filter and sort services |
| `/services/[id]` | Signed in | Service details & booking form |
| `/login` · `/register` | Public | Sign in / Sign up |
| `/dashboard` | Signed in | Role-based overview |
| `/dashboard/bookings` | Customer, Vendor | My Bookings / Booking Requests |
| `/dashboard/services` · `/add-service` | Vendor | Manage services |
| `/dashboard/subscription` | Vendor | Plans & Upgrade to Premium |
| `/dashboard/profile` | Customer, Vendor | Profile settings |
| `/dashboard/admin/*` | Admin | Users, Services, Transactions |
| `/payment/success` · `/payment/cancel` | Vendor | Stripe result pages |

---

## 🚀 Run Locally

### Prerequisites
- **Node.js 20+** and npm
- A **MongoDB** connection string (e.g. MongoDB Atlas)
- The **WedPlan server** running locally (see the server repository)
- Optional: Google OAuth credentials and an ImgBB API key

### 1. Clone and install

```bash
git clone https://github.com/Mahjabinjannat/wedPlan-client.git
cd wedPlan-client
npm install
```

### 2. Add environment variables

```bash
cp .env.example .env
```

Fill in the values — see [Environment Variables](#-environment-variables).

### 3. Start the server first

In the **server** project: `npm run dev` → runs on `http://localhost:8000`.

### 4. Start the client

```bash
npm run dev
```

Open **http://localhost:3000** 🎉

### Production build

```bash
npm run build
npm start
```

---

## 🔑 Environment Variables

Create a `.env` file in the project root (never commit it):

| Variable | Description | Example |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | URL of the Express server | `http://localhost:8000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `DB_NAME` | Database name | `wedplanDB` |
| `BETTER_AUTH_URL` | URL of this client app | `http://localhost:3000` |
| `BETTER_AUTH_SECRET` | Long random secret for Better Auth | `openssl rand -base64 32` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | — |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | — |
| `IMGBB_API_KEY` | ImgBB API key for image uploads | — |

> ⚠️ `NEXT_PUBLIC_API_URL` is built into the app — after changing it on your hosting provider, **redeploy** the client.
>
> For Google sign-in, add `<BETTER_AUTH_URL>/api/auth/callback/google` as an authorized redirect URI in Google Cloud Console.

---

## 💳 Testing Payments (Stripe Test Mode)

1. Sign in as a **vendor** → **Dashboard → Subscription → Upgrade to Premium**
2. On the Stripe page, use the test card:

| Field | Value |
|---|---|
| Card number | `4242 4242 4242 4242` |
| Expiry | Any future date, e.g. `12/34` |
| CVC | Any 3 digits, e.g. `123` |

3. You return to **Payment Successful**. Premium is activated by the server **only after Stripe's verified webhook** — the vendor then sees **Premium** on the Subscription page and a **Premium Vendor** badge on their services.

No real money is charged in test mode.

---

## 📁 Project Structure

```
src/
├── app/                      # Routes (Next.js App Router)
│   ├── api/                  # Auth, bookings, image upload, vendor activation
│   ├── dashboard/            # Role-based dashboard pages (+ loading.tsx per page)
│   ├── services/             # Browse & service details
│   ├── payment/              # Stripe success / cancel pages
│   └── login, register, ...  # Auth & status pages
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── home/                 # Home page sections
│   ├── services/             # Cards, filters, service form, vendor table
│   ├── bookings/             # Booking form & list
│   ├── admin/                # Admin tables
│   └── layout/               # Navbar & footer
├── lib/                      # Auth, MongoDB, API helpers (secureFetch), utilities
└── types/                    # Shared TypeScript types
```

---

## 🛡️ Security Highlights

- 🔒 Every dashboard page checks the user's **role on the server** — hiding links is not the only protection
- 🔑 Requests to the Express API carry a **JWT** signed by Better Auth and verified on the server
- 🚫 Blocked users lose access immediately
- 🙅 Users cannot change their own role or subscription through profile updates
- 💳 Premium is activated **only** by verified Stripe webhooks — never by the success page
- 🤫 All secrets live in environment variables; `.env` files are git-ignored

---

<div align="center">

Made with ❤️ for couples planning their perfect day.

</div>
