# EUDIPLO SDK Demo - Wine Shop

A realistic demo showing age verification for alcohol purchases using EUDI wallet credentials.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/openwallet-foundation-labs/eudiplo-sdk-demo)

![Wine Shop Demo](https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&h=400&fit=crop)

## 🍷 What This Demo Shows

A wine shop checkout flow that requires age verification before purchase:

1. Customer clicks "Add to Cart" on an age-restricted product
2. Modal appears with QR code for EUDI wallet verification
3. Customer scans QR with their wallet app
4. Wallet presents age credential (e.g., "over 18")
5. Shop verifies the credential and completes checkout

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Then click ⚙️ to configure your EUDIPLO server credentials.

## Prerequisites

You need a running EUDIPLO instance with:

- A client with `verification:offer` permission
- A presentation config (e.g., `age-over-18`)

```bash
docker run -p 3000:3000 ghcr.io/openwallet-foundation-labs/eudiplo:latest
```

## 🎨 Customizing the Demo

This is a template! Fork it and customize:

- **Change the product** - Edit `index.html` to sell different items
- **Change the branding** - Edit `src/styles.css` colors and fonts
- **Change verification** - Update `configId` for different credentials
- **Add more flows** - Use `issue()` for credential issuance

### Example: Car Rental (Driver's License)

```typescript
const { uri, waitForCompletion } = await verify({
  baseUrl: 'https://your-server.com',
  clientId: 'car-rental-demo',
  clientSecret: 'xxx',
  configId: 'drivers-license', // Your presentation config
});
```

### Example: Bank Account (Identity + Address)

```typescript
const { uri, waitForCompletion } = await verify({
  configId: 'identity-verification', // Requests PID + address proof
  // ...
});
```

## 📦 SDK Usage

The demo uses `@eudiplo/sdk-core` - a simple one-liner:

```typescript
import { verify } from '@eudiplo/sdk-core';

const { uri, waitForCompletion } = await verify({
  baseUrl: 'http://localhost:3000',
  clientId: 'your-client',
  clientSecret: 'your-secret',
  configId: 'age-over-18',
});

// Show QR code with `uri`
displayQRCode(uri);

// Wait for wallet response
const session = await waitForCompletion();
console.log('Verified!', session.credentials);
```

## Learn More

- [EUDIPLO Documentation](https://openwallet-foundation-labs.github.io/eudiplo/latest/)
- [SDK Reference](https://www.npmjs.com/package/@eudiplo/sdk-core)
- [GitHub Repository](https://github.com/openwallet-foundation-labs/eudiplo)

## License

Apache 2.0
