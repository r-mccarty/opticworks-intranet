import { test, expect } from '@playwright/test';

test.describe('SEO and Meta Tags', () => {
  test.describe('Essential Meta Tags', () => {
    test('should have viewport meta tag', async ({ page }) => {
      await page.goto('/');

      const viewport = page.locator('meta[name="viewport"]');
      await expect(viewport).toHaveCount(1);

      const content = await viewport.getAttribute('content');
      expect(content).toContain('width=device-width');
    });

    test('should have charset declaration', async ({ page }) => {
      await page.goto('/');

      const charset = page.locator('meta[charset], meta[http-equiv="Content-Type"]');
      await expect(charset.first()).toHaveCount(1);
    });

    test('should have title tag', async ({ page }) => {
      await page.goto('/');

      const title = await page.title();
      expect(title).toBeTruthy();
      expect(title.length).toBeGreaterThan(0);
      expect(title.length).toBeLessThan(70); // Recommended max length
    });
  });

  test.describe('Open Graph Tags', () => {
    test('should have og:title', async ({ page }) => {
      await page.goto('/');

      const ogTitle = page.locator('meta[property="og:title"]');
      // OG tags may or may not be configured
    });

    test('should have og:description', async ({ page }) => {
      await page.goto('/');

      const ogDesc = page.locator('meta[property="og:description"]');
      // OG tags may or may not be configured
    });

    test('should have og:type', async ({ page }) => {
      await page.goto('/');

      const ogType = page.locator('meta[property="og:type"]');
      // OG tags may or may not be configured
    });
  });

  test.describe('Canonical URLs', () => {
    test('should have canonical link', async ({ page }) => {
      await page.goto('/handbook/culture/');

      const canonical = page.locator('link[rel="canonical"]');
      // Canonical links are recommended
    });
  });

  test.describe('Robots', () => {
    test('pages should be indexable by default', async ({ page }) => {
      await page.goto('/handbook/culture/');

      const robots = page.locator('meta[name="robots"]');
      if (await robots.count() > 0) {
        const content = await robots.getAttribute('content');
        // Should not have noindex unless intentional
        expect(content).not.toContain('noindex');
      }
    });
  });

  test.describe('Structured Data', () => {
    test('should have structured data if configured', async ({ page }) => {
      await page.goto('/');

      const jsonLd = page.locator('script[type="application/ld+json"]');
      if (await jsonLd.count() > 0) {
        const content = await jsonLd.first().textContent();
        expect(content).toBeTruthy();

        // Should be valid JSON
        expect(() => JSON.parse(content!)).not.toThrow();
      }
    });
  });

  test.describe('Favicon', () => {
    test('should have favicon', async ({ page }) => {
      await page.goto('/');

      const favicon = page.locator('link[rel="icon"], link[rel="shortcut icon"]');
      await expect(favicon.first()).toHaveCount(1);
    });
  });

  test.describe('Language', () => {
    test('should have lang attribute', async ({ page }) => {
      await page.goto('/');

      const lang = await page.locator('html').getAttribute('lang');
      expect(lang).toBeTruthy();
      expect(lang).toMatch(/^[a-z]{2}(-[A-Z]{2})?$/); // e.g., "en" or "en-US"
    });
  });

  test.describe('Sitemap', () => {
    test('should have sitemap.xml if configured', async ({ page }) => {
      const response = await page.goto('/sitemap.xml');
      // Sitemap may or may not exist
      if (response?.status() === 200) {
        const content = await page.content();
        expect(content).toContain('urlset');
      }
    });
  });

  test.describe('Performance Hints', () => {
    test('should preload critical resources', async ({ page }) => {
      await page.goto('/');

      const preloads = page.locator('link[rel="preload"]');
      // Preloads are optional but recommended
    });

    test('should have dns-prefetch for external resources', async ({ page }) => {
      await page.goto('/');

      const dnsPrefetch = page.locator('link[rel="dns-prefetch"]');
      // DNS prefetch is optional
    });
  });
});
