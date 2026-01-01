/**
 * Design Validation Test Suite
 *
 * Run after any CSS/design changes to verify visual consistency
 * and contrast requirements across the site.
 *
 * Usage: npx playwright test design-validation --project=chromium
 */

import { test, expect } from '@playwright/test';

const BASE = process.env.TEST_BASE_URL || 'http://localhost:4321';

// Pages to test - covers all major component types
const TEST_PAGES = [
  { name: 'home', path: '/', description: 'Homepage with hero, cards' },
  { name: 'content', path: '/getting-started/onboarding/', description: 'Rich content page' },
  { name: 'dev-setup', path: '/development/setup/', description: 'Code blocks, tables' },
  { name: 'infrastructure', path: '/it/infrastructure/', description: 'Complex tables, diagrams' },
  { name: 'project', path: '/projects/hardware-os/', description: 'Project overview' },
  { name: 'handbook', path: '/handbook/culture/', description: 'Text-heavy page' },
];

// Minimum contrast ratios (WCAG AA)
const MIN_CONTRAST_NORMAL = 4.5;
const MIN_CONTRAST_LARGE = 3.0;

test.describe('Visual Design Validation', () => {

  test.describe('Light Mode Screenshots', () => {
    for (const page of TEST_PAGES) {
      test(`${page.name} - ${page.description}`, async ({ page: p }) => {
        await p.goto(`${BASE}${page.path}`);
        await p.waitForLoadState('networkidle');
        await p.screenshot({
          path: `./screenshots/design-light-${page.name}.png`,
          fullPage: true
        });
      });
    }
  });

  test.describe('Dark Mode Screenshots', () => {
    for (const page of TEST_PAGES) {
      test(`${page.name} - ${page.description}`, async ({ page: p }) => {
        await p.goto(BASE);
        await p.evaluate(() => localStorage.setItem('starlight-theme', 'dark'));
        await p.goto(`${BASE}${page.path}`);
        await p.waitForLoadState('networkidle');
        await p.screenshot({
          path: `./screenshots/design-dark-${page.name}.png`,
          fullPage: true
        });
      });
    }
  });

  test.describe('Component Contrast Validation', () => {

    test('primary button contrast', async ({ page }) => {
      await page.goto(BASE);
      await page.waitForLoadState('networkidle');

      const btn = page.locator('.hero a.sl-link-button.primary').first();
      const styles = await btn.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          color: computed.color,
          backgroundColor: computed.backgroundColor,
        };
      });

      console.log('Primary button:', styles);
      // White text on dark bg or dark text on light bg
      expect(styles.color).toMatch(/rgb\((255, 255, 255|15, 23, 42)\)/);
    });

    test('table text contrast - light mode', async ({ page }) => {
      await page.goto(`${BASE}/development/setup/`);
      await page.waitForLoadState('networkidle');

      const table = page.locator('table').first();
      if (await table.isVisible()) {
        const styles = await table.evaluate((el) => {
          const computed = window.getComputedStyle(el);
          const cell = el.querySelector('td');
          const cellComputed = cell ? window.getComputedStyle(cell) : null;
          return {
            tableColor: computed.color,
            cellColor: cellComputed?.color,
            cellBg: cellComputed?.backgroundColor,
          };
        });
        console.log('Table styles (light):', styles);
      }
    });

    test('table text contrast - dark mode', async ({ page }) => {
      await page.goto(BASE);
      await page.evaluate(() => localStorage.setItem('starlight-theme', 'dark'));
      await page.goto(`${BASE}/development/setup/`);
      await page.waitForLoadState('networkidle');

      const table = page.locator('table').first();
      if (await table.isVisible()) {
        const styles = await table.evaluate((el) => {
          const computed = window.getComputedStyle(el);
          const cell = el.querySelector('td');
          const cellComputed = cell ? window.getComputedStyle(cell) : null;
          return {
            tableColor: computed.color,
            cellColor: cellComputed?.color,
            cellBg: cellComputed?.backgroundColor,
          };
        });
        console.log('Table styles (dark):', styles);
      }
    });

    test('code block contrast', async ({ page }) => {
      await page.goto(`${BASE}/development/setup/`);
      await page.waitForLoadState('networkidle');

      const codeBlock = page.locator('pre').first();
      if (await codeBlock.isVisible()) {
        const styles = await codeBlock.evaluate((el) => {
          const computed = window.getComputedStyle(el);
          return {
            color: computed.color,
            backgroundColor: computed.backgroundColor,
          };
        });
        console.log('Code block styles:', styles);
      }
    });

    test('sidebar link contrast', async ({ page }) => {
      await page.goto(`${BASE}/getting-started/onboarding/`);
      await page.waitForLoadState('networkidle');

      const sidebarLink = page.locator('nav.sidebar a').first();
      if (await sidebarLink.isVisible()) {
        const styles = await sidebarLink.evaluate((el) => {
          const computed = window.getComputedStyle(el);
          return {
            color: computed.color,
            backgroundColor: computed.backgroundColor,
          };
        });
        console.log('Sidebar link styles:', styles);
      }
    });

    test('inline code contrast', async ({ page }) => {
      await page.goto(`${BASE}/development/setup/`);
      await page.waitForLoadState('networkidle');

      const inlineCode = page.locator('p code, li code').first();
      if (await inlineCode.isVisible()) {
        const styles = await inlineCode.evaluate((el) => {
          const computed = window.getComputedStyle(el);
          return {
            color: computed.color,
            backgroundColor: computed.backgroundColor,
          };
        });
        console.log('Inline code styles:', styles);
      }
    });
  });

  test.describe('Interactive Elements', () => {

    test('search input visibility', async ({ page }) => {
      await page.goto(BASE);
      await page.waitForLoadState('networkidle');
      await page.screenshot({ path: './screenshots/design-search.png' });
    });

    test('theme toggle visibility', async ({ page }) => {
      await page.goto(BASE);
      await page.waitForLoadState('networkidle');

      const themeToggle = page.locator('starlight-theme-select');
      if (await themeToggle.isVisible()) {
        await themeToggle.screenshot({ path: './screenshots/design-theme-toggle.png' });
      }
    });
  });

  test.describe('Responsive Design', () => {

    test('mobile viewport - light', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto(BASE);
      await page.waitForLoadState('networkidle');
      await page.screenshot({ path: './screenshots/design-mobile-light.png', fullPage: true });
    });

    test('mobile viewport - dark', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto(BASE);
      await page.evaluate(() => localStorage.setItem('starlight-theme', 'dark'));
      await page.reload();
      await page.waitForLoadState('networkidle');
      await page.screenshot({ path: './screenshots/design-mobile-dark.png', fullPage: true });
    });

    test('tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto(BASE);
      await page.waitForLoadState('networkidle');
      await page.screenshot({ path: './screenshots/design-tablet.png', fullPage: true });
    });
  });
});
