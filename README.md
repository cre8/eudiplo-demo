# EUDIPLO SDK Demo

A minimal template to test EUDI wallet credential verification with the `@eudiplo/sdk-core` package.

> ⚠️ **For Development Only** - This demo stores credentials in frontend code. In production, verification requests should be initiated from a secure backend.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/cre8/eudiplo-demo)

## Quick Start

1. **Open in StackBlitz** (click badge above) or clone locally
2. **Configure** `src/config.ts` with your EUDIPLO credentials
3. **Run** `npm run dev`
4. **Click** "Start Verification" and scan with your wallet

## Configuration

Edit `src/config.ts`:

```typescript
export const config = {
  baseUrl: 'https://your-eudiplo-server.com',
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret',
  configId: 'age-over-18', // or your presentation config
};
```

### Prerequisites

You need a running EUDIPLO instance:

```bash
docker run -p 3000:3000 ghcr.io/openwallet-foundation-labs/eudiplo:latest
```

With:

- A client with `verification:offer` permission
- A presentation config matching your `configId`

## Files

```
src/
├── config.ts   # Your EUDIPLO credentials (edit this!)
├── app.ts      # Verification logic
└── styles.css  # Minimal styling
```

## Customizing

This is a starting point! Fork it and:

- Change the UI for your use case (wine shop, car rental, etc.)
- Modify which credentials you request via `configId`
- Handle the verification result differently
- Add your own branding

## SDK Usage

The core verification flow:

```typescript
import { verify } from '@eudiplo/sdk-core';

// 1. Create verification request
const { uri, waitForCompletion } = await verify({
  baseUrl: 'https://your-server.com',
  clientId: 'your-client',
  clientSecret: 'your-secret',
  configId: 'age-over-18',
});

// 2. Show QR code with `uri`

// 3. Wait for wallet response
const session = await waitForCompletion();
console.log('Credentials:', session.credentials);
```

## Learn More

- [EUDIPLO Docs](https://openwallet-foundation-labs.github.io/eudiplo/latest/)
- [SDK Reference](https://www.npmjs.com/package/@eudiplo/sdk-core)
- [GitHub](https://github.com/openwallet-foundation-labs/eudiplo)

## License

Apache 2.0
