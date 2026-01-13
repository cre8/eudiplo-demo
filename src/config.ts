/**
 * EUDIPLO Demo Configuration
 *
 * ⚠️  UPDATE THESE VALUES to connect to your EUDIPLO server!
 *
 * You need a running EUDIPLO instance with:
 * - A client with `verification:offer` permission
 * - A presentation config (e.g., `age-over-18`)
 *
 * See: https://openwallet-foundation-labs.github.io/eudiplo/latest/
 */
export const config = {
  /** Base URL of your EUDIPLO server (e.g., 'https://your-server.com') */
  baseUrl: '',

  /** Client ID for authentication */
  clientId: '',

  /** Client secret for authentication */
  clientSecret: '',

  /** Presentation configuration ID (defines which credentials to request) */
  configId: 'age-over-18',
};
