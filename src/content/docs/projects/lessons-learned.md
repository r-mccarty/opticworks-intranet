---
title: Lessons Learned
description: Postmortem-driven lessons from opticworks-store.
---

This page summarizes verified lessons from incident postmortems. Each item links back to its source document for full context.

## 2025-12-07: Infinite Loop + Rate Limits

- **Lesson**: React hook dependency loops can trigger runaway API traffic; add edge rate limiting and internal debouncing.
- **Source**: `opticworks-store/docs/postmortems/2025-12-07-infinite-loop-rate-limit.md`

## 2025-12-08: Payment Session 500 Errors

- **Lesson**: Medusa field selectors can trigger 500s; avoid nested selectors on `/store/carts` and reuse existing payment collections.
- **Source**: `opticworks-store/docs/postmortems/2025-12-08-payment-session-500-error.md`

## 2025-12-09: Checkout Form Reset

- **Lesson**: `key={clientSecret}` on Stripe Elements remounts and wipes state; use deferred intent pattern and `elements.update` for amount changes.
- **Source**: `opticworks-store/docs/postmortems/2025-12-09-checkout-form-reset.md`

## 2025-12-09: Shipping Rates NaN

- **Lesson**: Guard against unexpected rate data and normalize edge cases before computing totals.
- **Source**: `opticworks-store/docs/postmortems/2025-12-09-shipping-rates-nan.md`

## 2025-12-09: EasyPost ID Persistence

- **Lesson**: Persist and reuse EasyPost IDs to avoid duplicate object creation and race conditions in fulfillment flows.
- **Source**: `opticworks-store/docs/postmortems/2025-12-09-easypost-id-persistence.md`

## Sources

- `opticworks-store/docs/postmortems/2025-12-07-infinite-loop-rate-limit.md`
- `opticworks-store/docs/postmortems/2025-12-08-payment-session-500-error.md`
- `opticworks-store/docs/postmortems/2025-12-09-checkout-form-reset.md`
- `opticworks-store/docs/postmortems/2025-12-09-shipping-rates-nan.md`
- `opticworks-store/docs/postmortems/2025-12-09-easypost-id-persistence.md`
