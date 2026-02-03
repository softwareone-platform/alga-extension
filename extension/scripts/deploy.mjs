import { chromium } from 'playwright';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = resolve(__dirname, '..');
const dist = resolve(root, 'dist');

// Configuration
const CONFIG = {
  url: 'https://algapsa.com/msp/settings?tab=extensions',
  username: 'jacek.kruzel@softwareone.com',
  password: 'NineMinds1234!',
  bundlePath: resolve(dist, 'bundle.tar.zst'),
  manifestPath: resolve(root, 'manifest.json'),
};

async function deploy() {
  console.log('[deploy] Starting deployment to AlgaPSA...');

  // Check if bundle exists
  if (!existsSync(CONFIG.bundlePath)) {
    console.error(`[deploy] Bundle not found at ${CONFIG.bundlePath}`);
    console.error('[deploy] Run "npm run build:alga" first to create the bundle.');
    process.exit(1);
  }

  // Read manifest content
  if (!existsSync(CONFIG.manifestPath)) {
    console.error(`[deploy] Manifest not found at ${CONFIG.manifestPath}`);
    process.exit(1);
  }
  const manifestContent = readFileSync(CONFIG.manifestPath, 'utf8');

  console.log('[deploy] Launching browser...');
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to extensions page
    console.log('[deploy] Navigating to extensions page...');
    await page.goto(CONFIG.url, { waitUntil: 'domcontentloaded', timeout: 30000 });

    // Check if we need to login
    await page.waitForTimeout(2000);
    let currentUrl = page.url();

    if (currentUrl.includes('/login') || currentUrl.includes('/auth') || await page.locator('text=MSP Dashboard Login').isVisible()) {
      console.log('[deploy] Login required, authenticating...');

      // Wait for login form
      await page.waitForSelector('input[type="email"], input[name="email"], input[id="email"], input[placeholder*="email"]', { timeout: 10000 });

      // Fill in credentials
      const emailInput = page.locator('input[type="email"], input[name="email"], input[id="email"], input[placeholder*="email"]').first();
      await emailInput.fill(CONFIG.username);

      const passwordInput = page.locator('input[type="password"]').first();
      await passwordInput.fill(CONFIG.password);

      // Click Sign in button
      const submitButton = page.locator('button:has-text("Sign in"), button[type="submit"]').first();
      await submitButton.click();

      // Wait for redirect to MSP dashboard
      console.log('[deploy] Waiting for login to complete...');
      await page.waitForURL(/\/msp\//, { timeout: 60000 });
      await page.waitForTimeout(2000);
      console.log('[deploy] Login successful, current URL:', page.url());
    }

    // Now navigate to extensions page
    currentUrl = page.url();
    if (!currentUrl.includes('tab=extensions')) {
      console.log('[deploy] Navigating to extensions settings...');
      await page.goto(CONFIG.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(2000);
    }

    // Wait for the page to fully load
    console.log('[deploy] Waiting for page to load...');
    await page.waitForSelector('text=Extension Management', { timeout: 30000 });

    // Click on Install tab
    console.log('[deploy] Clicking Install tab...');
    await page.getByRole('tab', { name: 'Install' }).click();
    await page.waitForTimeout(500);

    // Upload the bundle file
    console.log('[deploy] Uploading bundle...');
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(CONFIG.bundlePath);
    await page.waitForTimeout(500);

    // Expand Advanced Options
    console.log('[deploy] Expanding Advanced Options...');
    const advancedButton = page.getByRole('button', { name: /Advanced Options/i });
    await advancedButton.click();
    await page.waitForTimeout(300);

    // Fill in manifest content
    console.log('[deploy] Adding manifest content...');
    const manifestTextarea = page.locator('textarea');
    await manifestTextarea.fill(manifestContent);

    // Click Install button
    console.log('[deploy] Clicking Install...');
    const installButton = page.getByRole('button', { name: 'Install' }).first();
    await installButton.click();

    // Wait for success indication
    console.log('[deploy] Waiting for installation to complete...');

    // Wait for either success message or error
    await Promise.race([
      page.waitForSelector('text=successfully', { timeout: 60000 }),
      page.waitForSelector('text=installed', { timeout: 60000 }),
      page.waitForSelector('[role="alert"]', { timeout: 60000 }),
    ]);

    // Check for success
    const successIndicator = await page.locator('text=successfully, text=installed').first();
    if (await successIndicator.isVisible()) {
      console.log('[deploy] Extension installed successfully!');
    } else {
      // Check for error alert
      const alert = await page.locator('[role="alert"]').first();
      if (await alert.isVisible()) {
        const alertText = await alert.textContent();
        console.log(`[deploy] Installation result: ${alertText}`);
      }
    }

    // Give user time to see the result
    await page.waitForTimeout(3000);

  } catch (error) {
    console.error('[deploy] Error during deployment:', error.message);
    // Take screenshot on error
    await page.screenshot({ path: resolve(dist, 'deploy-error.png') });
    console.error(`[deploy] Screenshot saved to ${resolve(dist, 'deploy-error.png')}`);
    throw error;
  } finally {
    await browser.close();
  }

  console.log('[deploy] Deployment complete!');
}

deploy().catch((error) => {
  console.error('[deploy] Deployment failed:', error);
  process.exit(1);
});
