import { verify } from '@eudiplo/sdk-core';
import QRCode from 'qrcode';
import { config } from './config.js';

// DOM helpers
const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

// State
let abortController: AbortController | null = null;
let configValid = false;

// Config validation
function validateConfig(): boolean {
  const missing: string[] = [];
  if (!config.baseUrl) missing.push('baseUrl');
  if (!config.clientId) missing.push('clientId');
  if (!config.clientSecret) missing.push('clientSecret');
  if (!config.configId) missing.push('configId');
  return missing.length === 0;
}

function showConfigWarning() {
  const banner = document.createElement('div');
  banner.id = 'configWarning';
  banner.innerHTML = `
    <div class="config-warning">
      <strong>⚠️ Demo not configured</strong>
      <p>Please update <code>src/config.ts</code> with your EUDIPLO server credentials to use this demo.</p>
      <a href="https://github.com/cre8/eudiplo-demo#-running-your-own-instance" target="_blank">See setup instructions →</a>
    </div>
  `;
  document.body.prepend(banner);
  
  // Disable the buy button
  const buyButton = $<HTMLButtonElement>('buyButton');
  buyButton.disabled = true;
  buyButton.title = 'Configure src/config.ts first';
}

// Modal helpers
function showModal() {
  $('verificationModal').classList.remove('hidden');
  $('qrSection').style.display = 'block';
  $('successSection').classList.add('hidden');
  $('errorSection').classList.add('hidden');
}

function hideModal() {
  $('verificationModal').classList.add('hidden');
  if (abortController) {
    abortController.abort();
    abortController = null;
  }
}

function showSuccess(name?: string) {
  $('qrSection').style.display = 'none';
  $('successSection').classList.remove('hidden');
  if (name) {
    $('welcomeMessage').textContent = `Welcome, ${name}! You can now purchase alcohol.`;
  }
}

function showError(message: string) {
  $('qrSection').style.display = 'none';
  $('errorSection').classList.remove('hidden');
  $('errorMessage').textContent = message;
}

function showCheckout() {
  hideModal();
  $('productSection').classList.add('hidden');
  $('checkoutSection').classList.remove('hidden');
}

function resetToShop() {
  $('checkoutSection').classList.add('hidden');
  $('productSection').classList.remove('hidden');
}

// Buy button - triggers age verification
$('buyButton').addEventListener('click', async () => {
  if (!configValid) {
    alert('Please configure src/config.ts with your EUDIPLO server credentials first.');
    return;
  }

  showModal();
  $<HTMLSpanElement>('statusText').textContent = 'Creating verification request...';

  try {
    const { uri, sessionId, waitForCompletion } = await verify({
      baseUrl: config.baseUrl,
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      configId: config.configId,
    });

    // Generate QR code
    const canvas = $<HTMLCanvasElement>('qrCode');
    await QRCode.toCanvas(canvas, uri, { 
      width: 200, 
      margin: 2,
      color: { dark: '#722F37' }
    });

    $<HTMLSpanElement>('statusText').textContent = 'Waiting for verification...';

    // Start polling
    abortController = new AbortController();

    const session = await waitForCompletion({
      timeout: 300000, // 5 minutes
      interval: 1000,
      signal: abortController.signal,
    });

    // Extract name from credentials if available
    let userName: string | undefined;
    if (session.credentials && session.credentials.length > 0) {
      const cred = session.credentials[0] as any;
      if (cred.given_name) {
        userName = cred.given_name;
      }
    }

    showSuccess(userName);

  } catch (error: any) {
    if (error.name === 'AbortError') {
      return; // User closed modal
    }

    console.error('Verification error:', error);

    let message = 'Verification failed. Please try again.';
    if (error.message?.includes('timed out')) {
      message = 'Verification timed out. Please scan the QR code within 5 minutes.';
    } else if (error.statusCode === 401) {
      message = 'Authentication failed. Check your credentials.';
    } else if (error.statusCode === 403) {
      message = 'Access denied. Check client permissions.';
    } else if (error.statusCode === 404) {
      message = 'Presentation config not found.';
    }

    showError(message);
  }
});

// Modal buttons
$('closeModal').addEventListener('click', hideModal);
$('retryButton').addEventListener('click', () => {
  hideModal();
  $('buyButton').click();
});
$('continueButton').addEventListener('click', showCheckout);
$('newOrderButton').addEventListener('click', resetToShop);

// Close modal on backdrop click
$('verificationModal').addEventListener('click', (e) => {
  if (e.target === $('verificationModal')) {
    hideModal();
  }
});

// Initialize - check config on page load
configValid = validateConfig();
if (!configValid) {
  showConfigWarning();
}
