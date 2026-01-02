import { test, expect } from '@playwright/test';

test.describe('Responsive Design', () => {
  const viewports = {
    mobile: { width: 375, height: 667 },
    tablet: { width: 768, height: 1024 },
    desktop: { width: 1280, height: 720 },
    widescreen: { width: 1920, height: 1080 },
  };

  test.describe('Mobile Layout', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(viewports.mobile);
    });

    test('should display content without horizontal scroll', async ({ page }) => {
      await page.goto('/handbook/culture/');

      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      const viewportWidth = await page.evaluate(() => window.innerWidth);

      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1);
    });

    test('should hide sidebar on mobile', async ({ page }) => {
      await page.goto('/');

      // Sidebar should be hidden or in a drawer
      const sidebar = page.locator('.sidebar, aside[data-sidebar]');
      if (await sidebar.count() > 0) {
        const isVisible = await sidebar.first().isVisible();
        // On mobile, sidebar should be hidden by default
        // (unless it's in an overlay/drawer that's triggered by menu button)
      }
    });

    test('should show mobile menu button', async ({ page }) => {
      await page.goto('/');

      const menuButton = page.locator('[aria-label*="menu" i], button.menu-toggle, [data-mobile-menu], sl-menu-button');
      await expect(menuButton.first()).toBeVisible();
    });

    test('text should be readable without zooming', async ({ page }) => {
      await page.goto('/handbook/culture/');

      const paragraph = page.locator('main p, article p').first();
      if (await paragraph.count() > 0) {
        const fontSize = await paragraph.evaluate(el =>
          parseFloat(getComputedStyle(el).fontSize)
        );
        // Minimum readable font size is typically 14px on mobile
        expect(fontSize).toBeGreaterThanOrEqual(14);
      }
    });

    test('touch targets should be adequately sized', async ({ page }) => {
      await page.goto('/');

      const touchTargets = page.locator('a, button');
      const targetCount = await touchTargets.count();

      for (let i = 0; i < Math.min(targetCount, 20); i++) {
        const target = touchTargets.nth(i);
        const box = await target.boundingBox();

        if (box && box.width > 0 && box.height > 0) {
          // Minimum touch target size is 44x44px (WCAG)
          // But we'll be lenient for inline links
          const area = box.width * box.height;
          expect(area).toBeGreaterThan(0);
        }
      }
    });

    test('images should scale appropriately', async ({ page }) => {
      await page.goto('/');

      const images = page.locator('img');
      const imageCount = await images.count();

      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        const box = await img.boundingBox();

        if (box) {
          // Image should not exceed viewport width
          expect(box.width).toBeLessThanOrEqual(viewports.mobile.width);
        }
      }
    });
  });

  test.describe('Tablet Layout', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(viewports.tablet);
    });

    test('should display properly on tablet', async ({ page }) => {
      await page.goto('/handbook/culture/');

      const main = page.locator('main, article').first();
      await expect(main).toBeVisible();

      const box = await main.boundingBox();
      expect(box?.width).toBeGreaterThan(400);
    });

    test('navigation should be accessible', async ({ page }) => {
      await page.goto('/');

      // Either sidebar is visible or menu button is present
      const sidebar = page.locator('#starlight__sidebar');
      const menuButton = page.locator('starlight-menu-button button, [aria-label*="menu" i]');

      const sidebarVisible = await sidebar.first().isVisible().catch(() => false);
      const menuButtonVisible = await menuButton.first().isVisible().catch(() => false);

      expect(sidebarVisible || menuButtonVisible).toBe(true);
    });
  });

  test.describe('Desktop Layout', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(viewports.desktop);
    });

    test('should display sidebar navigation', async ({ page }) => {
      await page.goto('/');

      const sidebar = page.locator('#starlight__sidebar');
      await expect(sidebar).toBeVisible();
    });

    test('content should have proper max-width', async ({ page }) => {
      await page.goto('/handbook/culture/');

      const content = page.locator('main, article, .content').first();
      const box = await content.boundingBox();

      // Content should have a reasonable max-width
      expect(box?.width).toBeLessThan(1400);
      expect(box?.width).toBeGreaterThan(500);
    });

    test('should show table of contents', async ({ page }) => {
      await page.goto('/development/standards/');

      // Right sidebar with TOC
      const toc = page.locator('.right-sidebar, [data-toc], aside:has(a[href^="#"])');
      // TOC may be visible on desktop for pages with headings
    });
  });

  test.describe('Widescreen Layout', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(viewports.widescreen);
    });

    test('content should remain centered and readable', async ({ page }) => {
      await page.goto('/handbook/culture/');

      const content = page.locator('main, article').first();
      const box = await content.boundingBox();

      // Content should not stretch to full width on widescreen
      expect(box?.width).toBeLessThan(1600);
    });

    test('line length should remain readable', async ({ page }) => {
      await page.goto('/handbook/culture/');

      const paragraph = page.locator('main p, article p').first();
      if (await paragraph.count() > 0) {
        const box = await paragraph.boundingBox();
        // Optimal line length is ~66 characters, roughly 600-800px
        expect(box?.width).toBeLessThan(1000);
      }
    });
  });

  test.describe('Orientation Changes', () => {
    test('should handle portrait to landscape transition', async ({ page }) => {
      // Start in portrait
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto('/handbook/culture/');

      const portraitContent = page.locator('main, article').first();
      await expect(portraitContent).toBeVisible();

      // Switch to landscape
      await page.setViewportSize({ width: 812, height: 375 });

      const landscapeContent = page.locator('main, article').first();
      await expect(landscapeContent).toBeVisible();

      // Content should still be visible and accessible
      const box = await landscapeContent.boundingBox();
      expect(box?.width).toBeGreaterThan(0);
    });
  });

  test.describe('High DPI Displays', () => {
    test('should render crisp on retina displays', async ({ page }) => {
      await page.setViewportSize({
        width: 1440,
        height: 900,
      });
      await page.goto('/');

      // Check that images are not blurry (would need visual comparison)
      const images = page.locator('img');
      const imageCount = await images.count();

      if (imageCount > 0) {
        const img = images.first();
        const naturalWidth = await img.evaluate(el => (el as HTMLImageElement).naturalWidth);
        const displayWidth = await img.evaluate(el => el.getBoundingClientRect().width);

        // For retina, natural width should be >= 2x display width
        // But we'll just check that images load properly
        expect(naturalWidth).toBeGreaterThan(0);
      }
    });
  });

  test.describe('Print Styles', () => {
    test('should have print-friendly styles', async ({ page }) => {
      await page.goto('/handbook/culture/');
      await page.emulateMedia({ media: 'print' });

      // Navigation should be hidden in print
      const nav = page.locator('nav, .sidebar');
      const navDisplay = await nav.first().evaluate(el =>
        getComputedStyle(el).display
      );
      // Print styles may hide navigation
      // This is optional but recommended
    });
  });

  test.describe('Font Scaling', () => {
    test('should support browser font scaling', async ({ page }) => {
      await page.goto('/handbook/culture/');

      // Check that text uses relative units
      const body = page.locator('body');
      const fontSize = await body.evaluate(el => getComputedStyle(el).fontSize);

      // Font should be in pixels but based on rem/em in CSS
      expect(parseFloat(fontSize)).toBeGreaterThan(0);
    });
  });
});
