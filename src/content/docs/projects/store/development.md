---
title: OpticWorks Store Development Guide
description: Setting up your development environment for the OpticWorks Store
---

This guide covers setting up your local development environment for both the Next.js storefront and Medusa backend.

## Prerequisites

- **Node.js**: 20.x or later
- **pnpm**: 8.x or later
- **Docker**: For local PostgreSQL and Redis
- **Stripe CLI**: For webhook testing
- **Git**: Version control

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/r-mccarty/opticworks-store.git
cd opticworks-store
```

### 2. Install Dependencies

```bash
# Install pnpm if needed
npm install -g pnpm

# Install all dependencies
pnpm install
```

### 3. Start Infrastructure

```bash
# Start PostgreSQL and Redis
docker compose up -d

# Verify services are running
docker compose ps
```

### 4. Configure Environment

```bash
# Copy environment templates
cp apps/storefront/.env.example apps/storefront/.env.local
cp packages/medusa-backend/.env.example packages/medusa-backend/.env

# Edit with your local values
```

### 5. Initialize Database

```bash
# Run migrations
cd packages/medusa-backend
pnpm medusa migrations run

# Seed with sample data
pnpm seed
```

### 6. Start Development Servers

```bash
# From root directory
pnpm dev

# Or start individually:
# Terminal 1: Backend
cd packages/medusa-backend && pnpm dev

# Terminal 2: Storefront
cd apps/storefront && pnpm dev
```

### 7. Access the Application

- **Storefront**: http://localhost:3000
- **Medusa Admin**: http://localhost:9000/admin
- **Medusa API**: http://localhost:9000

## Environment Configuration

### Storefront (.env.local)

```bash
# Medusa API
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
MEDUSA_API_KEY=your-api-key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXX
```

### Medusa Backend (.env)

```bash
# Database
DATABASE_URL=postgres://postgres:postgres@localhost:5432/medusa
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-jwt-secret
COOKIE_SECRET=your-cookie-secret

# Stripe
STRIPE_API_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# EasyPost
EASYPOST_API_KEY=EZ...
EASYPOST_WEBHOOK_SECRET=...

# Resend
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@optic.works
```

## Development Workflow

### Project Structure

```
opticworks-store/
├── apps/
│   └── storefront/           # Next.js frontend
│       ├── app/              # App Router pages
│       ├── components/       # React components
│       ├── lib/              # Utilities
│       └── public/           # Static assets
├── packages/
│   └── medusa-backend/       # Medusa customizations
│       ├── src/
│       │   ├── api/          # Custom endpoints
│       │   ├── jobs/         # Background jobs
│       │   ├── services/     # Business logic
│       │   └── subscribers/  # Event handlers
│       └── medusa-config.ts
├── e2e/                      # Playwright tests
├── infra/                    # Deployment configs
├── docker-compose.yml
└── pnpm-workspace.yaml
```

### Common Commands

```bash
# Development
pnpm dev                    # Start all services
pnpm dev:frontend           # Start storefront only
pnpm dev:backend            # Start backend only

# Testing
pnpm test                   # Run all tests
pnpm test:e2e               # Run Playwright tests
pnpm test:unit              # Run unit tests

# Building
pnpm build                  # Build all packages
pnpm build:frontend         # Build storefront
pnpm build:backend          # Build backend

# Linting
pnpm lint                   # Lint all code
pnpm format                 # Format with Prettier

# Database
pnpm db:migrate             # Run migrations
pnpm db:seed                # Seed sample data
pnpm db:reset               # Reset database
```

## Storefront Development

### Creating New Pages

```tsx
// app/products/[handle]/page.tsx
import { getProduct } from '@/lib/medusa';
import { ProductDetail } from '@/components/product/ProductDetail';

interface Props {
  params: { handle: string };
}

export async function generateMetadata({ params }: Props) {
  const product = await getProduct(params.handle);
  return {
    title: product.title,
    description: product.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct(params.handle);

  return <ProductDetail product={product} />;
}
```

### Using Server Actions

```tsx
// lib/actions/cart.ts
'use server';

import { revalidatePath } from 'next/cache';
import { medusa } from '@/lib/medusa/client';
import { getCartId } from '@/lib/cart';

export async function addToCart(variantId: string, quantity = 1) {
  const cartId = await getCartId();

  await medusa.carts.lineItems.create(cartId, {
    variant_id: variantId,
    quantity,
  });

  revalidatePath('/cart');
}

export async function updateQuantity(lineId: string, quantity: number) {
  const cartId = await getCartId();

  if (quantity === 0) {
    await medusa.carts.lineItems.delete(cartId, lineId);
  } else {
    await medusa.carts.lineItems.update(cartId, lineId, { quantity });
  }

  revalidatePath('/cart');
}
```

### Adding Components

```tsx
// components/product/AddToCartButton.tsx
'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { addToCart } from '@/lib/actions/cart';
import { toast } from 'sonner';

interface Props {
  variantId: string;
  available: boolean;
}

export function AddToCartButton({ variantId, available }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      try {
        await addToCart(variantId);
        toast.success('Added to cart');
      } catch (error) {
        toast.error('Failed to add to cart');
      }
    });
  };

  return (
    <Button
      onClick={handleClick}
      disabled={!available || isPending}
      className="w-full"
    >
      {isPending ? 'Adding...' : available ? 'Add to Cart' : 'Out of Stock'}
    </Button>
  );
}
```

## Backend Development

### Creating Custom Endpoints

```typescript
// src/api/routes/custom/shipping-rates.ts
import { MedusaRequest, MedusaResponse } from '@medusajs/medusa';

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { cart_id } = req.query;

  const cartService = req.scope.resolve('cartService');
  const easyPostService = req.scope.resolve('easyPostService');

  const cart = await cartService.retrieve(cart_id, {
    relations: ['shipping_address', 'items'],
  });

  const rates = await easyPostService.getRates(cart);

  res.json({ rates });
}
```

### Creating Services

```typescript
// src/services/easypost.ts
import { TransactionBaseService } from '@medusajs/medusa';
import EasyPost from '@easypost/api';

class EasyPostService extends TransactionBaseService {
  private client: EasyPost;

  constructor(container) {
    super(container);
    this.client = new EasyPost(process.env.EASYPOST_API_KEY);
  }

  async getRates(cart: Cart) {
    const shipment = await this.client.Shipment.create({
      from_address: WAREHOUSE_ADDRESS,
      to_address: this.formatAddress(cart.shipping_address),
      parcel: this.calculateParcel(cart.items),
    });

    return shipment.rates.map(rate => ({
      id: rate.id,
      carrier: rate.carrier,
      service: rate.service,
      price: parseFloat(rate.rate) * 100,
      deliveryDays: rate.delivery_days,
    }));
  }
}

export default EasyPostService;
```

### Creating Event Subscribers

```typescript
// src/subscribers/order-placed.ts
import { SubscriberArgs, SubscriberConfig } from '@medusajs/medusa';

export default async function orderPlacedHandler({
  data,
  container,
}: SubscriberArgs<{ id: string }>) {
  const orderService = container.resolve('orderService');
  const resendService = container.resolve('resendService');

  const order = await orderService.retrieve(data.id, {
    relations: ['items', 'customer', 'shipping_address'],
  });

  await resendService.sendOrderConfirmation(order);
}

export const config: SubscriberConfig = {
  event: 'order.placed',
};
```

## Testing

### Running Tests

```bash
# Unit tests
pnpm test:unit

# E2E tests (requires running services)
pnpm test:e2e

# E2E with UI
pnpm test:e2e:ui
```

### Writing E2E Tests

```typescript
// e2e/checkout.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {
  test('complete purchase', async ({ page }) => {
    // Add product to cart
    await page.goto('/products/rs-1-sensor');
    await page.click('button:has-text("Add to Cart")');

    // Go to checkout
    await page.goto('/checkout');

    // Fill shipping info
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="firstName"]', 'Test');
    await page.fill('[name="lastName"]', 'User');
    await page.fill('[name="address"]', '123 Main St');
    await page.fill('[name="city"]', 'San Francisco');
    await page.fill('[name="postalCode"]', '94102');

    // Select shipping
    await page.click('[data-testid="shipping-option-0"]');

    // Fill payment (Stripe test card)
    const stripeFrame = page.frameLocator('iframe[name^="__privateStripeFrame"]');
    await stripeFrame.locator('[name="cardnumber"]').fill('4242424242424242');
    await stripeFrame.locator('[name="exp-date"]').fill('12/30');
    await stripeFrame.locator('[name="cvc"]').fill('123');

    // Complete order
    await page.click('button:has-text("Place Order")');

    // Verify success
    await expect(page.locator('h1')).toContainText('Thank you');
  });
});
```

## Stripe Webhook Testing

### Install Stripe CLI

```bash
# macOS
brew install stripe/stripe-cli/stripe

# Linux
curl -s https://packages.stripe.dev/api/security/keypair/stripe-cli-gpg/public | gpg --dearmor | sudo tee /usr/share/keyrings/stripe.gpg
echo "deb [signed-by=/usr/share/keyrings/stripe.gpg] https://packages.stripe.dev/stripe-cli-debian-local stable main" | sudo tee -a /etc/apt/sources.list.d/stripe.list
sudo apt update && sudo apt install stripe
```

### Forward Webhooks

```bash
# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:9000/webhooks/stripe

# Note the webhook signing secret (whsec_...)
# Add to .env as STRIPE_WEBHOOK_SECRET
```

### Trigger Test Events

```bash
# Trigger a payment succeeded event
stripe trigger payment_intent.succeeded

# Trigger with specific data
stripe trigger checkout.session.completed \
  --add checkout_session:customer_email=test@example.com
```

## Debugging

### Backend Logging

```typescript
// Enable debug logging
import { Logger } from '@medusajs/medusa';

class MyService {
  private logger: Logger;

  constructor(container) {
    this.logger = container.resolve('logger');
  }

  async doSomething() {
    this.logger.debug('Starting operation', { context: 'data' });
    // ...
  }
}
```

### Frontend Debugging

```tsx
// Use React DevTools and Next.js debug mode
// next.config.js
module.exports = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};
```

## Resources

| Resource | Link |
|----------|------|
| Medusa Docs | https://docs.medusajs.com |
| Next.js Docs | https://nextjs.org/docs |
| Stripe Testing | https://stripe.com/docs/testing |
| Shadcn UI | https://ui.shadcn.com |
