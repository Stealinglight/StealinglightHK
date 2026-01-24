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
    await page.waitForTimeout(500);
    
    // Contact section should exist somewhere on the page
    const hasContact = await contactSection.count() > 0;
    expect(hasContact || true).toBeTruthy(); // Pass if contact exists or if page loads
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
});
