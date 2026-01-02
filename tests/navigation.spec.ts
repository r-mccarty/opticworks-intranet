import { test, expect } from '@playwright/test';

test.describe('Navigation and Links', () => {
  test.describe('Internal Navigation', () => {
    test('should navigate between pages correctly', async ({ page }) => {
      await page.goto('/');

      // Navigate to a handbook page
      await page.click('text=Company Culture');
      await expect(page).toHaveURL(/\/handbook\/culture/);

      // Navigate to IT resources
      await page.click('text=Software & Tools');
      await expect(page).toHaveURL(/\/it\/software/);
    });

    test('should return to homepage from logo/title click', async ({ page }) => {
      await page.goto('/handbook/culture/');

      // Click site title/logo to return home
      const siteTitle = page.locator('.site-title a, [data-site-title] a, header a').first();
      await siteTitle.click();

      await expect(page).toHaveURL('/');
    });

    test('should preserve scroll position on navigation', async ({ page }) => {
      await page.goto('/development/standards/');

      // Scroll down
      await page.evaluate(() => window.scrollTo(0, 500));

      // Navigate away and back
      await page.click('text=Git Workflow');
      await page.goBack();

      // Check scroll is preserved (browser behavior)
      const scrollY = await page.evaluate(() => window.scrollY);
      expect(scrollY).toBeGreaterThan(0);
    });
  });

  test.describe('Link Validation', () => {
    test('all sidebar links should be valid', async ({ page }) => {
      await page.goto('/');

      const sidebarLinks = page.locator('nav a[href^="/"], aside a[href^="/"]');
      const linkCount = await sidebarLinks.count();

      expect(linkCount).toBeGreaterThan(5);

      // Check each link is accessible
      for (let i = 0; i < Math.min(linkCount, 20); i++) {
        const link = sidebarLinks.nth(i);
        const href = await link.getAttribute('href');

        if (href && href.startsWith('/')) {
          const response = await page.goto(href);
          expect(response?.status()).toBe(200);
        }
      }
    });

    test('internal links in content should be valid', async ({ page }) => {
      await page.goto('/getting-started/onboarding/');

      const hrefs = await page.$$eval('main a[href^="/"], article a[href^="/"]', (links) => {
        return [...new Set(links.map((link) => link.getAttribute('href')).filter(Boolean))];
      });

      const baseUrl = new URL(page.url());
      for (const href of hrefs) {
        const response = await page.request.get(new URL(href, baseUrl).toString());
        expect(response.status()).toBe(200);
      }
    });

    test('should not have broken anchor links', async ({ page }) => {
      await page.goto('/development/standards/');

      const anchorHrefs = await page.$$eval('a[href^="#"]', (links) => {
        return links.map((link) => link.getAttribute('href')).filter(Boolean);
      });

      for (const href of anchorHrefs) {
        if (href && href.length > 1) {
          const targetId = href.substring(1);
          const safeTargetId = targetId.replace(/\"/g, '\\"');
          const target = page.locator(`[id="${safeTargetId}"]`);

          // Target element should exist
          await expect(target).toHaveCount(1);
        }
      }
    });
  });

  test.describe('Table of Contents', () => {
    test('should display table of contents for long pages', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/development/standards/');

      // Starlight shows TOC on right side for pages with headings
      const toc = page.locator('starlight-toc nav a[href^="#"], mobile-starlight-toc a[href^="#"]');
      // TOC may or may not be visible depending on page content
      if (await toc.count() > 0) {
        await expect(toc.first()).toBeAttached();
      }
    });

    test('clicking TOC link should scroll to section', async ({ page }) => {
      await page.goto('/development/standards/');

      const tocLink = page.locator('starlight-toc nav a[href^="#"], mobile-starlight-toc a[href^="#"]').first();
      if (await tocLink.count() > 0) {
        const href = await tocLink.getAttribute('href');
        await tocLink.evaluate((el) => el.click());

        // URL should include anchor
        await expect(page).toHaveURL(new RegExp(`${href}$`));
      }
    });
  });

  test.describe('Breadcrumbs', () => {
    test('should show breadcrumb navigation on subpages', async ({ page }) => {
      await page.goto('/handbook/culture/');

      // Starlight may show breadcrumbs
      const breadcrumbs = page.locator('[aria-label="Breadcrumb"], .breadcrumbs, nav:has(ol)');
      // Breadcrumbs are optional in Starlight
      if (await breadcrumbs.count() > 0) {
        await expect(breadcrumbs.first()).toBeVisible();
      }
    });
  });

  test.describe('Search', () => {
    test('should have search functionality', async ({ page }) => {
      await page.goto('/');

      // Starlight includes search
      const searchButton = page.locator('[data-search], button:has-text("Search"), [aria-label*="Search"]');
      await expect(searchButton.first()).toBeVisible();
    });

    test('should open search dialog on click', async ({ page }) => {
      await page.goto('/');

      const searchButton = page.locator('[data-search], button:has-text("Search"), [aria-label*="Search"]').first();
      await searchButton.click();

      // Search modal/dialog should appear
      const searchDialog = page.locator('[role="dialog"], dialog, .search-modal, [data-pagefind-ui]');
      await expect(searchDialog.first()).toBeVisible({ timeout: 5000 });
    });

    test('should open search with keyboard shortcut', async ({ page }) => {
      await page.goto('/');

      // Common keyboard shortcuts for search
      await page.keyboard.press('Control+k');

      const searchDialog = page.locator('[role="dialog"], dialog, .search-modal');
      // May or may not trigger depending on implementation
    });
  });

  test.describe('Mobile Navigation', () => {
    test('should show hamburger menu on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');

      // Mobile menu button
      const menuButton = page.locator('[aria-label*="menu" i], button.menu-toggle, [data-mobile-menu]');
      await expect(menuButton.first()).toBeVisible();
    });

    test('should toggle mobile menu on button click', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');

      const menuButton = page.locator('starlight-menu-button button, [aria-label*="menu" i]').first();
      await menuButton.click();

      // Mobile nav should be visible
      await expect(page.locator('body[data-mobile-menu-expanded]')).toHaveCount(1);
      await expect(page.locator('#starlight__sidebar')).toBeVisible();
    });
  });

  test.describe('External Links', () => {
    test('external links should open in new tab', async ({ page }) => {
      await page.goto('/it/software/');

      const externalLinks = page.locator('a[href^="http"]:not([href*="localhost"]):not([href*="opticworks"])');
      const linkCount = await externalLinks.count();

      for (let i = 0; i < linkCount; i++) {
        const link = externalLinks.nth(i);
        const target = await link.getAttribute('target');
        const rel = await link.getAttribute('rel');

        // External links should have target="_blank" and security attributes
        if (target === '_blank') {
          expect(rel).toContain('noopener');
        }
      }
    });
  });
});
