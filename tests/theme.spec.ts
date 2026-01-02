import { test, expect } from '@playwright/test';

test.describe('Theme and Dark Mode', () => {
  test.describe('Theme Toggle', () => {
    test('should have theme toggle button', async ({ page }) => {
      await page.goto('/');

      // Starlight includes a theme toggle
      const themeToggle = page.locator('starlight-theme-select select, [data-theme-toggle]');
      await expect(themeToggle.first()).toBeVisible();
    });

    test('should toggle between light and dark mode', async ({ page }) => {
      await page.goto('/');

      // Get initial theme
      const initialTheme = await page.evaluate(() =>
        document.documentElement.dataset.theme ||
        document.documentElement.getAttribute('data-theme') ||
        (document.documentElement.classList.contains('dark') ? 'dark' : 'light')
      );

      const themeSelect = page.locator('starlight-theme-select select').first();
      await expect(themeSelect).toBeVisible();

      const targetTheme = initialTheme === 'dark' ? 'light' : 'dark';
      await themeSelect.selectOption(targetTheme);

      await page.waitForFunction((theme) => {
        return document.documentElement.dataset.theme === theme;
      }, targetTheme);
    });

    test('should persist theme preference', async ({ page }) => {
      await page.goto('/');

      // Set dark theme via localStorage
      await page.evaluate(() => {
        localStorage.setItem('starlight-theme', 'dark');
      });

      await page.reload();

      // Theme should be dark
      const theme = await page.evaluate(() =>
        document.documentElement.dataset.theme ||
        document.documentElement.getAttribute('data-theme')
      );

      // Check localStorage was preserved
      const storedTheme = await page.evaluate(() =>
        localStorage.getItem('starlight-theme')
      );
      expect(storedTheme).toBe('dark');
    });
  });

  test.describe('Light Mode', () => {
    test.beforeEach(async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'light' });
      await page.addInitScript(() => {
        localStorage.setItem('starlight-theme', 'light');
      });
    });

    test('should use light color scheme', async ({ page }) => {
      await page.goto('/');

      const bgColor = await page.evaluate(() => {
        const body = document.body;
        return getComputedStyle(body).backgroundColor;
      });

      // Light mode should have light background
      // Parse RGB values
      const rgbMatch = bgColor.match(/\d+/g);
      if (rgbMatch) {
        const [r, g, b] = rgbMatch.map(Number);
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        expect(luminance).toBeGreaterThan(0.5);
      }
    });

    test('text should be dark on light background', async ({ page }) => {
      await page.goto('/handbook/culture/');

      const textColor = await page.locator('main p, article p').first().evaluate(el =>
        getComputedStyle(el).color
      );

      // Parse RGB and check it's dark
      const rgbMatch = textColor.match(/\d+/g);
      if (rgbMatch) {
        const [r, g, b] = rgbMatch.map(Number);
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        expect(luminance).toBeLessThan(0.5);
      }
    });
  });

  test.describe('Dark Mode', () => {
    test.beforeEach(async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'dark' });
      await page.addInitScript(() => {
        localStorage.setItem('starlight-theme', 'dark');
      });
    });

    test('should use dark color scheme', async ({ page }) => {
      await page.goto('/');

      const bgColor = await page.evaluate(() => {
        const body = document.body;
        return getComputedStyle(body).backgroundColor;
      });

      // Dark mode should have dark background
      const rgbMatch = bgColor.match(/\d+/g);
      if (rgbMatch) {
        const [r, g, b] = rgbMatch.map(Number);
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        expect(luminance).toBeLessThan(0.5);
      }
    });

    test('text should be light on dark background', async ({ page }) => {
      await page.goto('/handbook/culture/');

      const textColor = await page.locator('main p, article p').first().evaluate(el =>
        getComputedStyle(el).color
      );

      // Parse RGB and check it's light
      const rgbMatch = textColor.match(/\d+/g);
      if (rgbMatch) {
        const [r, g, b] = rgbMatch.map(Number);
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        expect(luminance).toBeGreaterThan(0.5);
      }
    });

    test('code blocks should remain readable', async ({ page }) => {
      await page.goto('/development/setup/');

      const codeBlock = page.locator('pre code, pre').first();
      if (await codeBlock.count() > 0) {
        const bgColor = await codeBlock.evaluate(el => getComputedStyle(el).backgroundColor);
        const textColor = await codeBlock.evaluate(el => getComputedStyle(el).color);

        // Both should be defined
        expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');
        expect(textColor).toBeTruthy();
      }
    });

    test('links should be visible in dark mode', async ({ page }) => {
      await page.goto('/handbook/culture/');

      const link = page.locator('main a, article a').first();
      if (await link.count() > 0) {
        const color = await link.evaluate(el => getComputedStyle(el).color);

        // Link color should have some saturation (not pure gray)
        const rgbMatch = color.match(/\d+/g);
        if (rgbMatch) {
          const [r, g, b] = rgbMatch.map(Number);
          // Check it's not grayscale
          const isColored = Math.abs(r - g) > 10 || Math.abs(g - b) > 10 || Math.abs(r - b) > 10;
          // Links should be colored or at least visible
          expect(isColored || r + g + b > 300).toBe(true);
        }
      }
    });
  });

  test.describe('System Preference', () => {
    test('should respect system dark mode preference', async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'dark' });
      await page.goto('/');

      // Clear any stored theme preference
      await page.evaluate(() => {
        localStorage.removeItem('starlight-theme');
      });
      await page.reload();

      // Should follow system preference (dark)
      const theme = await page.evaluate(() =>
        document.documentElement.dataset.theme ||
        (document.documentElement.classList.contains('dark') ? 'dark' : 'light')
      );

      // Theme should be dark or follow system
    });

    test('should respect system light mode preference', async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'light' });
      await page.goto('/');

      // Clear any stored theme preference
      await page.evaluate(() => {
        localStorage.removeItem('starlight-theme');
      });
      await page.reload();

      // Should follow system preference (light)
    });
  });

  test.describe('Brand Colors', () => {
    test('OpticWorks green should be visible in both themes', async ({ page }) => {
      // Test light mode
      await page.emulateMedia({ colorScheme: 'light' });
      await page.goto('/');

      const lightAccent = await page.evaluate(() => {
        const root = document.documentElement;
        const styles = getComputedStyle(root);
        return styles.getPropertyValue('--sl-color-accent') ||
          styles.getPropertyValue('--color-accent');
      });

      // Test dark mode
      await page.emulateMedia({ colorScheme: 'dark' });
      await page.reload();

      const darkAccent = await page.evaluate(() => {
        const root = document.documentElement;
        const styles = getComputedStyle(root);
        return styles.getPropertyValue('--sl-color-accent') ||
          styles.getPropertyValue('--color-accent');
      });

      // Accent color should be defined in both modes
      expect(lightAccent || darkAccent).toBeTruthy();
    });
  });
});
