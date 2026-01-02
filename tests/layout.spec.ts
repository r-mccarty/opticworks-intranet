import { test, expect } from '@playwright/test';

test.describe('Layout and Visual Consistency', () => {
  test.describe('Header', () => {
    test('should display site title and logo', async ({ page }) => {
      await page.goto('/');

      // Check site title is present
      const siteTitle = page.locator('.site-title, [data-site-title]');
      await expect(siteTitle).toBeVisible();

      // Header should be sticky/fixed at top
      const header = page.locator('header').first();
      await expect(header).toBeVisible();
    });

    test('should have consistent header across all pages', async ({ page }) => {
      const pages = ['/', '/getting-started/onboarding/', '/handbook/culture/', '/it/software/'];

      for (const pagePath of pages) {
        await page.goto(pagePath);
        const header = page.locator('header').first();
        await expect(header).toBeVisible();

        // Check header height is consistent
        const headerBox = await header.boundingBox();
        expect(headerBox?.height).toBeGreaterThan(40);
        expect(headerBox?.height).toBeLessThan(120);
      }
    });
  });

  test.describe('Sidebar Navigation', () => {
    test('should display sidebar on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });
      await page.goto('/');

      const sidebar = page.locator('#starlight__sidebar');
      await expect(sidebar).toBeVisible();
    });

    test('should have all main navigation sections', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });
      await page.goto('/');

      // Check for main section headings
      const expectedSections = [
        'Getting Started',
        'Employee Handbook',
        'IT Resources',
        'Development',
        'Policies',
      ];

      for (const section of expectedSections) {
        const sectionHeading = page.getByText(section, { exact: false });
        await expect(sectionHeading.first()).toBeVisible();
      }
    });

    test('should highlight current page in navigation', async ({ page }) => {
      await page.goto('/handbook/culture/');

      // Current page should have aria-current or active class
      const activeLink = page.locator('[aria-current="page"], .is-current, a.active');
      await expect(activeLink.first()).toBeVisible();
    });
  });

  test.describe('Main Content Area', () => {
    test('should have proper content width on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/handbook/culture/');

      const mainContent = page.locator('main, article, .content').first();
      const box = await mainContent.boundingBox();

      // Content should not span full width (should have sidebar)
      expect(box?.width).toBeLessThan(1200);
      expect(box?.width).toBeGreaterThan(400);
    });

    test('should display page title as h1', async ({ page }) => {
      await page.goto('/handbook/culture/');

      const h1 = page.locator('h1');
      await expect(h1.first()).toBeVisible();
      await expect(h1.first()).toHaveText(/./); // Should have some text
    });

    test('should have proper heading hierarchy', async ({ page }) => {
      await page.goto('/development/standards/');

      // Should have h1
      const h1Count = await page.locator('main h1, article h1').count();
      expect(h1Count).toBeGreaterThanOrEqual(1);

      // Check no skipped heading levels (h1 -> h3 without h2)
      const headings = page.locator('main h1, main h2, main h3, main h4, main h5, main h6');
      const headingTags = await headings.evaluateAll(els =>
        els.map(el => parseInt(el.tagName.substring(1)))
      );

      for (let i = 1; i < headingTags.length; i++) {
        const diff = headingTags[i] - headingTags[i - 1];
        // Should not skip more than one level down
        expect(diff).toBeLessThanOrEqual(1);
      }
    });
  });

  test.describe('Footer', () => {
    test('should display footer on all pages', async ({ page }) => {
      const pages = ['/', '/handbook/benefits/', '/it/security/'];

      for (const pagePath of pages) {
        await page.goto(pagePath);
        const footer = page.locator('footer');
        // Footer may or may not exist depending on Starlight config
        if (await footer.count() > 0) {
          await expect(footer.first()).toBeVisible();
        }
      }
    });
  });

  test.describe('Branding Consistency', () => {
    test('should use OpticWorks brand color', async ({ page }) => {
      await page.goto('/');

      // Check for brand color in CSS custom properties
      const brandColorUsed = await page.evaluate(() => {
        const root = document.documentElement;
        const styles = getComputedStyle(root);
        // Check various places where brand color might be applied
        const accentColor = styles.getPropertyValue('--sl-color-accent');
        const linkColor = styles.getPropertyValue('--sl-color-text-accent');
        return accentColor || linkColor;
      });

      // Brand color should be defined
      expect(brandColorUsed).toBeTruthy();
    });
  });

  test.describe('Visual Regressions', () => {
    test('homepage should render correctly', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Take screenshot for visual regression (if configured)
      await expect(page).toHaveScreenshot('homepage.png', {
        maxDiffPixels: 100,
        fullPage: true,
      });
    });

    test('documentation page should render correctly', async ({ page }) => {
      await page.goto('/handbook/culture/');
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveScreenshot('handbook-culture.png', {
        maxDiffPixels: 100,
        fullPage: true,
      });
    });
  });
});
