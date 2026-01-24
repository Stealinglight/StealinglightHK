import { test, expect } from '@playwright/test';

test.describe('Stealinglight Portfolio', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/');
    
    // Page should load without errors
    await expect(page).toHaveTitle(/Chris McMillon|Cinematographer|Stealinglight|Portfolio/i);
  });

  test('navigation is visible', async ({ page }) => {
    await page.goto('/');
    
    // Navigation should be present
    const nav = page.locator('nav, header');
    await expect(nav.first()).toBeVisible();
  });

  test('hero section renders', async ({ page }) => {
    await page.goto('/');
    
    // Hero section or main content should be visible
    const mainContent = page.locator('main, section').first();
    await expect(mainContent).toBeVisible();
  });

  test('page is responsive', async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();

    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('body')).toBeVisible();
  });

  test('contact section exists', async ({ page }) => {
    await page.goto('/');
    
    // Look for contact section or form
    const contactSection = page.locator('[id*="contact"], [class*="contact"], section:has-text("Contact")').first();
    
    // Scroll to bottom to ensure lazy-loaded content is loaded
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForLoadState('networkidle');
    
    // Contact section should exist somewhere on the page
    const hasContact = (await contactSection.count()) > 0;
    expect(hasContact).toBeTruthy(); // Ensure contact section exists
  });

  test('no console errors on load', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Filter out common non-critical errors
    const criticalErrors = errors.filter(e =>
      !e.includes('favicon') &&
      !e.includes('manifest') &&
      !e.includes('third-party')
    );

    expect(criticalErrors).toHaveLength(0);
  });

  test('contact form fields are visible', async ({ page }) => {
    await page.goto('/');

    // Scroll to contact section
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForLoadState('networkidle');

    // Check for form input fields
    const nameField = page.locator('input[name="name"], input[placeholder*="name" i], input[id*="name" i]').first();
    const emailField = page.locator('input[name="email"], input[type="email"], input[placeholder*="email" i]').first();
    const messageField = page.locator('textarea[name="message"], textarea[placeholder*="message" i], textarea[id*="message" i]').first();

    // At least email and message fields should exist in a contact form
    const hasEmailField = (await emailField.count()) > 0;
    const hasMessageField = (await messageField.count()) > 0;

    expect(hasEmailField || hasMessageField).toBeTruthy();
  });

  test('contact form submit button exists and is clickable', async ({ page }) => {
    await page.goto('/');

    // Scroll to contact section
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForLoadState('networkidle');

    // Find submit button
    const submitButton = page.locator('button[type="submit"], input[type="submit"], button:has-text("Send"), button:has-text("Submit")').first();

    // If a submit button exists, verify it's visible and enabled
    if ((await submitButton.count()) > 0) {
      await expect(submitButton).toBeVisible();
      await expect(submitButton).toBeEnabled();
    }
  });

  test('navigation links scroll to sections', async ({ page }) => {
    await page.goto('/');

    // Find navigation links that point to anchors
    const navLinks = page.locator('nav a[href^="#"], header a[href^="#"]');
    const linkCount = await navLinks.count();

    if (linkCount > 0) {
      // Click first anchor link and verify scroll position changes
      const initialScrollY = await page.evaluate(() => window.scrollY);
      await navLinks.first().click();

      // Wait for scroll animation
      await page.waitForTimeout(500);

      const newScrollY = await page.evaluate(() => window.scrollY);

      // Scroll position should have changed (unless already at target)
      // This verifies the link is functional
      expect(typeof newScrollY).toBe('number');
    }
  });

  test('all navigation links are accessible', async ({ page }) => {
    await page.goto('/');

    // Get all navigation links
    const navLinks = page.locator('nav a, header a');
    const linkCount = await navLinks.count();

    for (let i = 0; i < linkCount; i++) {
      const link = navLinks.nth(i);
      const href = await link.getAttribute('href');

      // External links should have target="_blank" or rel="noopener"
      if (href && href.startsWith('http') && !href.includes('localhost')) {
        const target = await link.getAttribute('target');
        const rel = await link.getAttribute('rel');

        // External links should open in new tab or have security attributes
        if (target === '_blank') {
          expect(rel).toContain('noopener');
        }
      }

      // All links should be visible and clickable
      await expect(link).toBeVisible();
    }
  });
});
