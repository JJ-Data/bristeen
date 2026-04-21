# Bristeen Catering Platform

A premium catering management and inventory system built with Next.js, Prisma, and Tailwind CSS.

## Features

- **Dashboard**: Real-time overview of business metrics and operations.
- **Orders Management**: Track and manage customer orders seamlessly.
- **Inventory System**: Comprehensive tracking of kitchen supplies and stock levels.
- **Catering Events**: Dedicated calendar and management for catering bookings.
- **Invoices**: Automated invoicing and financial tracking.
- **Analytics**: Deep insights into revenue and performance.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/)
- **Database**: [Prisma](https://www.prisma.io/) with SQLite
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **UI Components**: Radix UI / Shadcn UI

## Getting Started

First, install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Database Setup

Initialize the Prisma client and push the schema:

```bash
npx prisma generate
npx prisma db push
```

## Deployment

The easiest way to deploy is using [Vercel](https://vercel.com). Ensure environment variables are set correctly for production databases.
