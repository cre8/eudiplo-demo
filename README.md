# EUDIPLO SDK Demo - Wine Shop

A realistic demo showing age verification for alcohol purchases using EUDI wallet credentials.

> ⚠️ **Demo Only** - This project is for demonstration and testing purposes only. **Do not use in production!** Client credentials are stored in frontend code, which is not secure. In production, verification requests should be initiated from a secure backend server.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/cre8/eudiplo-demo)

## 🍷 What This Demo Shows

A wine shop checkout flow that requires age verification before purchase:

1. Customer clicks "Add to Cart" on an age-restricted product
2. Modal appears with QR code for EUDI wallet verification
3. Customer scans QR with their wallet app
4. Wallet presents age credential (e.g., "over 18")
5. Shop verifies the credential and completes checkout

## 🚀 Quick Start

First, configure your EUDIPLO server credentials in [`src/config.ts`](src/config.ts), then:

```bash
npm install
npm run dev
```

Click "Add to Cart" and scan the QR code with your EUDI wallet.

## 🔧 Running Your Own Instance

To run with your own EUDIPLO server, update the credentials in [`src/config.ts`](src/config.ts):

```typescript
export const config = {
  baseUrl: 'https://your-server.com',
  clientId: 'your-client',
  clientSecret: 'your-secret',
  configId: 'age-over-18',
};
```

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
- [EUDIPLO Repository](https://github.com/openwallet-foundation-labs/eudiplo)
- [This Demo on GitHub](https://github.com/cre8/eudiplo-demo)

## License

Apache 2.0
