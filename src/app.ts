import { verify } from '@eudiplo/sdk-core';
import QRCode from 'qrcode';
import { config } from './config.js';

// ============================================================================
// EUDIPLO SDK Demo - Minimal Example
// ============================================================================
//
// This is a simple example showing how to use the EUDIPLO SDK to verify
// credentials from a EUDI wallet. Customize this for your own use case!
//
// Steps:
// 1. Update src/config.ts with your EUDIPLO server credentials
// 2. Modify the HTML/CSS for your scenario (wine shop, car rental, etc.)
// 3. Adjust the verification logic below as needed
// ============================================================================

// DOM helpers
const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

// State
let abortController: AbortController | null = null;

// ============================================================================
// Config Validation
// ============================================================================

function isConfigured(): boolean {
  return !!(config.baseUrl && config.clientId && config.clientSecret && config.configId);
}

function showConfigWarning() {
  const banner = document.createElement('div');
  banner.className = 'config-warning';
  banner.innerHTML = `
    <strong>⚠️ Configuration Required</strong>
    <p>Update <code>src/config.ts</code> with your EUDIPLO server credentials.</p>
    <a href="https://github.com/cre8/eudiplo-demo#configuration" target="_blank">Setup guide →</a>
  `;
  document.body.prepend(banner);

  $<HTMLButtonElement>('verifyBtn').disabled = true;
}

// ============================================================================
// Verification Flow
// ============================================================================

async function startVerification() {
  const qrContainer = $('qrContainer');
  const status = $('status');
  const result = $('result');

  // Reset UI
  qrContainer.innerHTML = '';
  result.className = 'result';
  result.textContent = '';
  status.textContent = 'Creating verification request...';

  try {
    // 1. Create verification request
    const { uri, waitForCompletion } = await verify({
      baseUrl: config.baseUrl,
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      configId: config.configId,
    });

    // 2. Display QR code
    const canvas = document.createElement('canvas');
    qrContainer.appendChild(canvas);
    await QRCode.toCanvas(canvas, uri, {
      width: 200,
      margin: 2,
    });

    status.textContent = 'Scan QR code with your EUDI wallet...';

    // 3. Wait for wallet response
    abortController = new AbortController();
    const session = await waitForCompletion({
      timeout: 300000, // 5 minutes
      interval: 1000,
      signal: abortController.signal,
    });

    // 4. Success!
    console.log('Verification successful:', session);
    status.textContent = '';
    result.className = 'result success';
    result.innerHTML = `
      <strong>✅ Verified!</strong>
      <pre>${JSON.stringify(session.credentials, null, 2)}</pre>
    `;

  } catch (error: any) {
    if (error.name === 'AbortError') return;

    console.error('Verification failed:', error);
    status.textContent = '';
    result.className = 'result error';
    result.textContent = `❌ Error: ${error.message || 'Verification failed'}`;
  }
}

function cancelVerification() {
  if (abortController) {
    abortController.abort();
    abortController = null;
  }
  $('status').textContent = 'Cancelled';
}

// ============================================================================
// Event Listeners
// ============================================================================

$('verifyBtn').addEventListener('click', startVerification);
$('cancelBtn').addEventListener('click', cancelVerification);

// ============================================================================
// Initialize
// ============================================================================

if (!isConfigured()) {
  showConfigWarning();
}
