/* eslint-disable no-console, security/detect-non-literal-fs-filename */
import { chromium } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const SCREENSHOTS_DIR = path.join(process.cwd(), 'docs', 'screenshots');

(async () => {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  // Navigate to the local preview server (use domcontentloaded — networkidle
  // times out because the hero video streams from the CDN indefinitely)
  await page.goto('http://localhost:4173', { waitUntil: 'domcontentloaded' });

  // Wait for Motion (framer-motion) entrance animations to complete
  await page.waitForTimeout(3000);

  // 1. Hero section — top of the page (full viewport)
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, 'hero.png'),
    clip: { x: 0, y: 0, width: 1440, height: 900 },
  });
  console.log('Captured: hero.png');

  // 2. Portfolio section — scroll into view, capture visible viewport
  const portfolio = page.locator('#portfolio');
  await portfolio.scrollIntoViewIfNeeded();
  await page.waitForTimeout(2000);
  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, 'portfolio.png'),
  });
  console.log('Captured: portfolio.png');

  // 3. Contact section — scroll into view, capture visible viewport
  const contact = page.locator('#contact');
  await contact.scrollIntoViewIfNeeded();
  await page.waitForTimeout(2000);
  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, 'contact.png'),
  });
  console.log('Captured: contact.png');

  await browser.close();
  console.log('All screenshots captured in docs/screenshots/');
})();
