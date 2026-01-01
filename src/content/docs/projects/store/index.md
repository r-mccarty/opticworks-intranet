---
title: OpticWorks Store Overview
description: E-commerce platform for mmWave presence sensors at optic.works
---

The OpticWorks Store is our production e-commerce platform for selling mmWave presence sensors and accessories. It combines a modern Next.js 15 storefront with a Medusa v2 backend.

## Live URLs

| Environment | URL | Purpose |
|-------------|-----|---------|
| **Production Store** | [optic.works](https://optic.works) | Customer-facing store |
| **Admin Dashboard** | [api.optic.works](https://api.optic.works/admin) | Order management |
| **Staging Store** | [staging.optic.works](https://staging.optic.works) | QA testing |

## What Does the Store Do?

The OpticWorks Store handles the complete customer journey:

1. **Product Discovery** - Browse our mmWave sensor products
2. **Cart Management** - Add items, apply discounts
3. **Checkout** - Secure payment via Stripe
4. **Order Fulfillment** - Automated shipping label generation
5. **Tracking** - Real-time shipment tracking
6. **Email Notifications** - Order confirmation, shipping updates

## Technology Stack

### Frontend (Storefront)

| Technology | Purpose |
|------------|---------|
| **Next.js 15** | React framework with App Router |
| **React 19** | UI components |
| **Tailwind CSS 4** | Styling |
| **Shadcn UI** | Component library |
| **Cloudflare Workers** | Edge deployment |

### Backend (Medusa)

| Technology | Purpose |
|------------|---------|
| **Medusa v2** | E-commerce engine |
| **PostgreSQL 17** | Primary database |
| **Redis 7** | Caching and sessions |
| **Node.js 20** | Runtime |
| **Hetzner Cloud** | Infrastructure |

### Integrations

| Service | Purpose |
|---------|---------|
| **Stripe** | Payment processing |
| **EasyPost** | Shipping rates and labels |
| **Resend** | Transactional emails |
| **Hookdeck** | Webhook management |

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Customer Browser                         │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Cloudflare Workers                           │
│                    (Next.js Storefront)                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │   Product   │  │   Cart      │  │   Checkout              │ │
│  │   Pages     │  │   Logic     │  │   Flow                  │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
└───────────────────────────────┬─────────────────────────────────┘
                                │ API Calls
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Hetzner Cloud                             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Medusa v2                             │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │   │
│  │  │   Orders    │  │  Products   │  │   Fulfillment   │  │   │
│  │  │   Service   │  │  Service    │  │   Service       │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────────┘  │   │
│  └─────────────────────────────────────────────────────────┘   │
│              │                                │                 │
│              ▼                                ▼                 │
│  ┌─────────────────┐              ┌─────────────────────────┐  │
│  │  PostgreSQL 17  │              │        Redis 7          │  │
│  └─────────────────┘              └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                │
              ┌─────────────────┼─────────────────┐
              ▼                 ▼                 ▼
       ┌───────────┐     ┌───────────┐     ┌───────────┐
       │  Stripe   │     │ EasyPost  │     │  Resend   │
       │ Payments  │     │ Shipping  │     │  Emails   │
       └───────────┘     └───────────┘     └───────────┘
```

## Key Features

### Product Catalog
- Multiple product variants (colors, bundles)
- Inventory tracking
- Product images via Cloudflare Images
- SEO-optimized product pages

### Shopping Cart
- Persistent cart across sessions
- Guest checkout support
- Discount code application
- Real-time inventory validation

### Checkout Flow
- Stripe Elements integration
- Deferred payment intent pattern
- Address validation
- Real-time shipping rate calculation

### Order Fulfillment
- Automatic shipping label generation
- EasyPost rate shopping
- Tracking number sync
- Fulfillment status updates

### Email Notifications
- Order confirmation
- Shipping confirmation with tracking
- Delivery notifications
- Review requests

## Repository Structure

```
opticworks-store/
├── apps/
│   └── storefront/          # Next.js frontend
│       ├── app/             # App Router pages
│       ├── components/      # React components
│       └── lib/             # Utilities
├── packages/
│   └── medusa-backend/      # Medusa customizations
│       ├── src/
│       │   ├── api/         # Custom API routes
│       │   ├── jobs/        # Background jobs
│       │   ├── services/    # Custom services
│       │   └── subscribers/ # Event handlers
│       └── medusa-config.ts
├── infra/
│   └── ansible/             # Deployment playbooks
├── e2e/                     # Playwright tests
├── docs/                    # Documentation
└── pnpm-workspace.yaml
```

## Who Works on This

| Role | Responsibility |
|------|----------------|
| **Frontend Engineers** | Next.js storefront, UI/UX |
| **Backend Engineers** | Medusa customizations, integrations |
| **DevOps** | Infrastructure, deployments |
| **Product** | Catalog management, pricing |

## Getting Started

1. Review the [Architecture](/projects/store/architecture/) documentation
2. Set up your [Development Environment](/projects/store/development/)
3. Understand [Deployment & Operations](/projects/store/operations/)

## Resources

- **Repository**: [github.com/r-mccarty/opticworks-store](https://github.com/r-mccarty/opticworks-store)
- **Slack Channel**: `#web-engineering`
- **Admin Access**: Request via IT ticket
- **Stripe Dashboard**: [dashboard.stripe.com](https://dashboard.stripe.com)
