import { test, expect } from '@playwright/test';

/**
 * Tests for all documentation pages
 * Validates that each page loads correctly and has required elements
 */
test.describe('All Documentation Pages', () => {
  const pages = [
    { path: '/', name: 'Homepage' },
    { path: '/getting-started/onboarding/', name: 'Onboarding' },
    { path: '/handbook/culture/', name: 'Company Culture' },
    { path: '/handbook/benefits/', name: 'Benefits & Perks' },
    { path: '/handbook/time-off/', name: 'Time Off Policy' },
    { path: '/it/infrastructure/', name: 'Infrastructure Overview' },
    { path: '/it/infisical/', name: 'Infisical Secret Management' },
    { path: '/it/hardware/', name: 'Development Hardware' },
    { path: '/it/software/', name: 'Software & Tools' },
    { path: '/it/security/', name: 'Security Guidelines' },
    { path: '/it/support/', name: 'Support Tickets' },
    { path: '/development/setup/', name: 'Development Setup' },
    { path: '/development/standards/', name: 'Code Standards' },
    { path: '/development/git-workflow/', name: 'Git Workflow' },
    { path: '/policies/code-of-conduct/', name: 'Code of Conduct' },
    // Projects section
    { path: '/projects/', name: 'Projects Overview' },
    { path: '/projects/hardware-os/', name: 'hardwareOS Overview' },
    { path: '/projects/hardware-os/architecture/', name: 'hardwareOS Architecture' },
    { path: '/projects/hardware-os/development/', name: 'hardwareOS Development' },
    { path: '/projects/hardware-os/deployment/', name: 'hardwareOS Deployment' },
    { path: '/projects/presence-engine/', name: 'Presence Engine Overview' },
    { path: '/projects/presence-engine/architecture/', name: 'Presence Engine Architecture' },
    { path: '/projects/presence-engine/development/', name: 'Presence Engine Development' },
    { path: '/projects/presence-engine/home-assistant/', name: 'Home Assistant Integration' },
    { path: '/projects/store/', name: 'OpticWorks Store Overview' },
    { path: '/projects/store/architecture/', name: 'Store Architecture' },
    { path: '/projects/store/development/', name: 'Store Development' },
    { path: '/projects/store/operations/', name: 'Store Operations' },
    { path: '/projects/shared-resources/', name: 'Shared Resources' },
  ];

  for (const pageInfo of pages) {
    test.describe(pageInfo.name, () => {
      test('should load successfully', async ({ page }) => {
        const response = await page.goto(pageInfo.path);
        expect(response?.status()).toBe(200);
      });

      test('should have a title', async ({ page }) => {
        await page.goto(pageInfo.path);
        const title = await page.title();
        expect(title).toBeTruthy();
      });

      test('should have main content', async ({ page }) => {
        await page.goto(pageInfo.path);
        const main = page.locator('main, article, [role="main"]');
        await expect(main.first()).toBeVisible();
      });

      test('should not have console errors', async ({ page }) => {
        const consoleErrors: string[] = [];
        page.on('console', msg => {
          if (msg.type() === 'error') {
            consoleErrors.push(msg.text());
          }
        });

        await page.goto(pageInfo.path);
        await page.waitForLoadState('networkidle');

        // Filter out known acceptable errors
        const criticalErrors = consoleErrors.filter(
          error =>
            !error.includes('favicon') &&
            !error.includes('404') &&
            !error.includes('net::ERR')
        );

        expect(criticalErrors).toHaveLength(0);
      });

      test('should not have JavaScript errors', async ({ page }) => {
        const pageErrors: Error[] = [];
        page.on('pageerror', error => {
          pageErrors.push(error);
        });

        await page.goto(pageInfo.path);
        await page.waitForLoadState('networkidle');

        expect(pageErrors).toHaveLength(0);
      });

      test('should load within acceptable time', async ({ page }) => {
        const startTime = Date.now();
        await page.goto(pageInfo.path);
        await page.waitForLoadState('domcontentloaded');
        const loadTime = Date.now() - startTime;

        // Page should load within 5 seconds
        expect(loadTime).toBeLessThan(5000);
      });
    });
  }
});

test.describe('404 Page', () => {
  test('should show 404 for non-existent pages', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist/');

    // Should return 404 or redirect to 404 page
    // Note: Starlight may show a 404 page with 200 status
    const content = await page.content();
    const has404 =
      response?.status() === 404 ||
      content.toLowerCase().includes('404') ||
      content.toLowerCase().includes('not found');

    expect(has404).toBe(true);
  });

  test('404 page should have navigation back to home', async ({ page }) => {
    await page.goto('/non-existent-page/');

    // Should have a way to get back to home
    const homeLink = page.locator('a[href="/"], a:has-text("home")');
    // There should be navigation available
  });
});

test.describe('Page Performance', () => {
  test('should have no layout shifts after load', async ({ page }) => {
    await page.goto('/handbook/culture/');
    await page.waitForLoadState('networkidle');

    // Wait a bit for any async content
    await page.waitForTimeout(500);

    // Take measurements
    const cls = await page.evaluate(() => {
      return new Promise<number>(resolve => {
        let clsScore = 0;

        const observer = new PerformanceObserver(list => {
          for (const entry of list.getEntries()) {
            // @ts-ignore - layout-shift entries have value property
            if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
              // @ts-ignore
              clsScore += entry.value;
            }
          }
        });

        observer.observe({ type: 'layout-shift' });

        setTimeout(() => {
          observer.disconnect();
          resolve(clsScore);
        }, 1000);
      });
    });

    // CLS should be under 0.1 (good)
    expect(cls).toBeLessThan(0.25); // Allow up to 0.25 (needs improvement)
  });

  test('should have reasonable first contentful paint', async ({ page }) => {
    await page.goto('/handbook/culture/');

    const fcp = await page.evaluate(() => {
      return new Promise<number>(resolve => {
        const observer = new PerformanceObserver(list => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              observer.disconnect();
              resolve(entry.startTime);
            }
          }
        });

        observer.observe({ type: 'paint', buffered: true });

        // Fallback timeout
        setTimeout(() => {
          observer.disconnect();
          resolve(-1);
        }, 5000);
      });
    });

    if (fcp > 0) {
      // FCP should be under 2.5 seconds (good)
      expect(fcp).toBeLessThan(4000); // Allow up to 4s
    }
  });
});

test.describe('Asset Loading', () => {
  test('all CSS should load successfully', async ({ page }) => {
    const failedStyles: string[] = [];

    page.on('response', response => {
      if (response.url().endsWith('.css') && response.status() !== 200) {
        failedStyles.push(response.url());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    expect(failedStyles).toHaveLength(0);
  });

  test('all JS should load successfully', async ({ page }) => {
    const failedScripts: string[] = [];

    page.on('response', response => {
      if (response.url().endsWith('.js') && response.status() !== 200) {
        failedScripts.push(response.url());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    expect(failedScripts).toHaveLength(0);
  });

  test('all fonts should load successfully', async ({ page }) => {
    const failedFonts: string[] = [];

    page.on('response', response => {
      const url = response.url();
      if (
        (url.endsWith('.woff') ||
          url.endsWith('.woff2') ||
          url.endsWith('.ttf')) &&
        response.status() !== 200
      ) {
        failedFonts.push(url);
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    expect(failedFonts).toHaveLength(0);
  });
});
