/**
 * EUDIPLO SDK Demo - Configuration
 *
 * ⚠️ UPDATE THESE VALUES to connect to your EUDIPLO server!
 *
 * You need:
 * - A running EUDIPLO instance
 * - A client with `verification:offer` permission
 * - A presentation config ID
 *
 * Docs: https://openwallet-foundation-labs.github.io/eudiplo/latest/
 */
export const config = {
  // Your EUDIPLO server URL
  baseUrl: '',

  // Client credentials
  clientId: '',
  clientSecret: '',

  // Presentation config (what credentials to request)
  configId: 'age-over-18',
};
