---
title: OpticWorks Store Architecture
description: Technical architecture of the OpticWorks e-commerce platform
---

This document covers the technical architecture of the OpticWorks Store, including service design, data flow, and integration patterns.

## System Architecture

### High-Level Overview

```
                           ┌─────────────────┐
                           │   Cloudflare    │
                           │   (CDN + WAF)   │
                           └────────┬────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
              ▼                     ▼                     ▼
       ┌─────────────┐       ┌─────────────┐       ┌─────────────┐
       │ Storefront  │       │   Medusa    │       │   Admin     │
       │ (Workers)   │       │   API       │       │   UI        │
       └──────┬──────┘       └──────┬──────┘       └─────────────┘
              │                     │
              │    ┌────────────────┤
              │    │                │
              ▼    ▼                ▼
       ┌─────────────┐       ┌─────────────┐
       │  Hookdeck   │       │ PostgreSQL  │
       │  (Webhooks) │       │   Redis     │
       └──────┬──────┘       └─────────────┘
              │
    ┌─────────┼─────────┐
    ▼         ▼         ▼
┌───────┐ ┌───────┐ ┌───────┐
│Stripe │ │EasyPost│ │Resend │
└───────┘ └───────┘ └───────┘
```

## Frontend Architecture

### Next.js 15 with App Router

```
storefront/
├── app/
│   ├── (main)/              # Main layout group
│   │   ├── page.tsx         # Homepage
│   │   ├── products/
│   │   │   ├── page.tsx     # Product listing
│   │   │   └── [handle]/
│   │   │       └── page.tsx # Product detail
│   │   ├── cart/
│   │   │   └── page.tsx     # Cart page
│   │   └── checkout/
│   │       └── page.tsx     # Checkout flow
│   ├── api/                 # API routes
│   │   └── webhooks/
│   │       └── stripe/
│   └── layout.tsx           # Root layout
├── components/
│   ├── ui/                  # Shadcn components
│   ├── cart/
│   ├── checkout/
│   └── product/
└── lib/
    ├── medusa/              # Medusa client
    ├── stripe/              # Stripe utilities
    └── utils/
```

### Key Patterns

**Server Components (Default)**
```tsx
// app/products/[handle]/page.tsx
export default async function ProductPage({ params }: Props) {
  const product = await getProduct(params.handle);

  return (
    <div>
      <ProductGallery images={product.images} />
      <ProductInfo product={product} />
      <AddToCartButton productId={product.id} />
    </div>
  );
}
```

**Client Components (Interactive)**
```tsx
'use client';

// components/cart/AddToCartButton.tsx
export function AddToCartButton({ productId }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      await addToCart(productId);
    });
  };

  return (
    <Button onClick={handleClick} disabled={isPending}>
      {isPending ? 'Adding...' : 'Add to Cart'}
    </Button>
  );
}
```

**Server Actions**
```tsx
// lib/actions/cart.ts
'use server';

export async function addToCart(productId: string) {
  const cart = await getOrCreateCart();
  await medusa.carts.lineItems.create(cart.id, {
    variant_id: productId,
    quantity: 1,
  });
  revalidatePath('/cart');
}
```

## Backend Architecture

### Medusa v2 Structure

```
medusa-backend/
├── src/
│   ├── api/
│   │   └── routes/
│   │       └── custom/       # Custom endpoints
│   ├── jobs/
│   │   ├── sync-inventory.ts
│   │   └── send-review-email.ts
│   ├── services/
│   │   ├── easypost.ts
│   │   └── inventory-sync.ts
│   ├── subscribers/
│   │   ├── order-placed.ts
│   │   ├── order-shipped.ts
│   │   └── payment-captured.ts
│   └── workflows/
│       └── fulfillment.ts
├── medusa-config.ts
└── package.json
```

### Service Layer

**Custom EasyPost Service**
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

  async createShipment(order: Order): Promise<Shipment> {
    const shipment = await this.client.Shipment.create({
      from_address: this.getFromAddress(),
      to_address: this.formatAddress(order.shipping_address),
      parcel: this.getParcel(order.items),
    });

    return shipment;
  }

  async buyLabel(shipmentId: string, rateId: string): Promise<Label> {
    const shipment = await this.client.Shipment.retrieve(shipmentId);
    await shipment.buy(rateId);
    return {
      trackingNumber: shipment.tracking_code,
      labelUrl: shipment.postage_label.label_url,
    };
  }
}
```

### Event Subscribers

**Order Placed Handler**
```typescript
// src/subscribers/order-placed.ts
import { SubscriberArgs, SubscriberConfig } from '@medusajs/medusa';

export default async function orderPlacedHandler({
  data,
  container,
}: SubscriberArgs<{ id: string }>) {
  const orderService = container.resolve('orderService');
  const emailService = container.resolve('resendService');

  const order = await orderService.retrieve(data.id, {
    relations: ['items', 'customer', 'shipping_address'],
  });

  // Send confirmation email
  await emailService.sendOrderConfirmation(order);

  // Create fulfillment
  const easyPostService = container.resolve('easyPostService');
  const shipment = await easyPostService.createShipment(order);

  // Store shipment ID
  await orderService.update(order.id, {
    metadata: { easypost_shipment_id: shipment.id },
  });
}

export const config: SubscriberConfig = {
  event: 'order.placed',
};
```

## Database Schema

### Key Tables

```sql
-- Products
CREATE TABLE product (
    id VARCHAR PRIMARY KEY,
    title VARCHAR NOT NULL,
    handle VARCHAR UNIQUE NOT NULL,
    description TEXT,
    status VARCHAR DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Product Variants
CREATE TABLE product_variant (
    id VARCHAR PRIMARY KEY,
    product_id VARCHAR REFERENCES product(id),
    title VARCHAR,
    sku VARCHAR UNIQUE,
    inventory_quantity INTEGER DEFAULT 0,
    price INTEGER NOT NULL  -- in cents
);

-- Orders
CREATE TABLE "order" (
    id VARCHAR PRIMARY KEY,
    customer_id VARCHAR,
    email VARCHAR NOT NULL,
    status VARCHAR DEFAULT 'pending',
    payment_status VARCHAR DEFAULT 'not_paid',
    fulfillment_status VARCHAR DEFAULT 'not_fulfilled',
    total INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Fulfillments
CREATE TABLE fulfillment (
    id VARCHAR PRIMARY KEY,
    order_id VARCHAR REFERENCES "order"(id),
    tracking_number VARCHAR,
    shipped_at TIMESTAMP,
    delivered_at TIMESTAMP
);
```

### Indexes

```sql
-- Performance indexes
CREATE INDEX idx_product_handle ON product(handle);
CREATE INDEX idx_order_customer ON "order"(customer_id);
CREATE INDEX idx_order_status ON "order"(status, fulfillment_status);
CREATE INDEX idx_variant_sku ON product_variant(sku);
```

## Integration Patterns

### Stripe Integration

**Deferred Payment Intent Pattern**

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │     │   Medusa    │     │   Stripe    │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │
       │ Create Cart       │                   │
       │──────────────────▶│                   │
       │                   │                   │
       │ Initialize Payment│                   │
       │──────────────────▶│                   │
       │                   │ Create Intent     │
       │                   │──────────────────▶│
       │                   │                   │
       │                   │◀──────────────────│
       │  Client Secret    │                   │
       │◀──────────────────│                   │
       │                   │                   │
       │ Confirm Payment   │                   │
       │───────────────────────────────────────▶
       │                   │                   │
       │                   │   Webhook         │
       │                   │◀──────────────────│
       │                   │                   │
       │  Order Created    │                   │
       │◀──────────────────│                   │
```

### EasyPost Integration

**Shipping Rate Flow**

```typescript
// Get shipping rates at checkout
async function getShippingRates(cart: Cart): Promise<Rate[]> {
  const shipment = await easypost.Shipment.create({
    from_address: WAREHOUSE_ADDRESS,
    to_address: cart.shipping_address,
    parcel: calculateParcel(cart.items),
  });

  return shipment.rates
    .filter(rate => ALLOWED_CARRIERS.includes(rate.carrier))
    .map(rate => ({
      id: rate.id,
      carrier: rate.carrier,
      service: rate.service,
      price: rate.rate,
      deliveryDays: rate.delivery_days,
    }));
}
```

### Webhook Processing

**Hookdeck Configuration**

```
Hookdeck
├── Connections
│   ├── stripe-to-medusa
│   │   ├── Source: Stripe
│   │   ├── Destination: api.optic.works/webhooks/stripe
│   │   └── Rules: Verify signature, Retry on failure
│   └── easypost-to-medusa
│       ├── Source: EasyPost
│       ├── Destination: api.optic.works/webhooks/easypost
│       └── Rules: Filter by event type
```

## Caching Strategy

### Redis Cache Layers

```
┌─────────────────────────────────────────────────────────┐
│                    Cache Hierarchy                       │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐ │
│  │   Browser   │  │ Cloudflare  │  │     Redis       │ │
│  │   Cache     │  │   Cache     │  │                 │ │
│  └─────────────┘  └─────────────┘  └─────────────────┘ │
│       │                │                   │           │
│     5min           24 hours            Varies          │
│  (stale-while-      (static)                          │
│   revalidate)                                          │
└─────────────────────────────────────────────────────────┘
```

**Cache Keys**

| Key Pattern | TTL | Purpose |
|-------------|-----|---------|
| `products:list` | 5 min | Product listing |
| `product:{handle}` | 5 min | Product detail |
| `cart:{id}` | 24 hours | Cart data |
| `shipping:rates:{hash}` | 15 min | Shipping quotes |

## Security Architecture

### Authentication

- **Customers**: Session-based with secure cookies
- **Admin**: JWT with short expiry + refresh tokens
- **API**: API keys with scope restrictions

### Data Protection

```
┌─────────────────────────────────────────────────────────┐
│                   Security Layers                        │
│                                                         │
│  Cloudflare WAF ─────────────────────────────────────▶ │
│  Rate Limiting  ─────────────────────────────────────▶ │
│  TLS 1.3        ─────────────────────────────────────▶ │
│  CSRF Protection ────────────────────────────────────▶ │
│  Input Validation ───────────────────────────────────▶ │
│  PII Encryption  ────────────────────────────────────▶ │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### PCI Compliance

- **Stripe Elements**: Card data never touches our servers
- **No card storage**: Only Stripe tokens stored
- **Webhook verification**: All webhooks signed and verified

## Performance Targets

| Metric | Target | Actual |
|--------|--------|--------|
| TTFB | <200ms | 150ms |
| LCP | <2.5s | 1.8s |
| FID | <100ms | 45ms |
| CLS | <0.1 | 0.05 |
| API Response | <500ms | 200ms |
