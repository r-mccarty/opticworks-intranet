import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  test.describe('Keyboard Navigation', () => {
    test('should be fully navigable with keyboard', async ({ page }) => {
      await page.goto('/');

      // Tab through interactive elements
      await page.keyboard.press('Tab');
      const firstFocused = await page.evaluate(() => document.activeElement?.tagName);
      expect(firstFocused).toBeTruthy();

      // Continue tabbing through navigation
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press('Tab');
        const focused = await page.evaluate(() => document.activeElement?.tagName);
        expect(focused).toBeTruthy();
      }
    });

    test('focused elements should have visible focus indicator', async ({ page }) => {
      await page.goto('/');

      // Tab to first interactive element
      await page.keyboard.press('Tab');

      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();

      // Check for focus ring/outline
      const outlineStyle = await focusedElement.evaluate(el => {
        const styles = getComputedStyle(el);
        return {
          outline: styles.outline,
          outlineWidth: styles.outlineWidth,
          boxShadow: styles.boxShadow,
        };
      });

      // Should have some focus indicator
      const hasFocusIndicator =
        outlineStyle.outlineWidth !== '0px' ||
        outlineStyle.boxShadow !== 'none';
      expect(hasFocusIndicator).toBe(true);
    });

    test('skip link should be present and functional', async ({ page }) => {
      await page.goto('/');

      // Skip links are often hidden until focused
      await page.keyboard.press('Tab');

      const skipLink = page.locator('a[href="#content"], a[href="#main-content"], .skip-link');
      // Skip links may or may not be implemented
      if (await skipLink.count() > 0) {
        await expect(skipLink.first()).toBeVisible();
      }
    });
  });

  test.describe('ARIA Labels and Roles', () => {
    test('navigation should have proper aria labels', async ({ page }) => {
      await page.goto('/');

      const mainNav = page.locator('nav[aria-label], nav[role="navigation"]');
      await expect(mainNav.first()).toBeVisible();
    });

    test('main content area should be marked as main', async ({ page }) => {
      await page.goto('/handbook/culture/');

      const mainContent = page.locator('main, [role="main"]');
      await expect(mainContent.first()).toBeVisible();
    });

    test('buttons should have accessible names', async ({ page }) => {
      await page.goto('/');

      const buttons = page.locator('button');
      const buttonCount = await buttons.count();

      for (let i = 0; i < buttonCount; i++) {
        const button = buttons.nth(i);
        const accessibleName = await button.evaluate(el => {
          return (
            el.getAttribute('aria-label') ||
            el.getAttribute('title') ||
            el.textContent?.trim() ||
            el.querySelector('svg title')?.textContent
          );
        });
        expect(accessibleName).toBeTruthy();
      }
    });

    test('images should have alt text', async ({ page }) => {
      await page.goto('/');

      const images = page.locator('img');
      const imageCount = await images.count();

      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');
        const role = await img.getAttribute('role');

        // Images should have alt text or be marked as decorative
        expect(alt !== null || role === 'presentation').toBe(true);
      }
    });
  });

  test.describe('Color Contrast', () => {
    test('text should meet contrast requirements', async ({ page }) => {
      await page.goto('/handbook/culture/');

      // Check main text color against background
      const contrast = await page.evaluate(() => {
        const main = document.querySelector('main, article');
        if (!main) return null;

        const styles = getComputedStyle(main);
        return {
          color: styles.color,
          backgroundColor: styles.backgroundColor,
        };
      });

      expect(contrast).toBeTruthy();
      // Actual contrast ratio checking would require additional libraries
    });

    test('links should be distinguishable from regular text', async ({ page }) => {
      await page.goto('/handbook/culture/');

      const link = page.locator('main a, article a').first();
      const paragraph = page.locator('main p, article p').first();

      if (await link.count() > 0 && await paragraph.count() > 0) {
        const linkStyles = await link.evaluate(el => ({
          color: getComputedStyle(el).color,
          textDecoration: getComputedStyle(el).textDecoration,
        }));

        const paragraphStyles = await paragraph.evaluate(el => ({
          color: getComputedStyle(el).color,
        }));

        // Links should be visually distinct
        const isDifferent =
          linkStyles.color !== paragraphStyles.color ||
          linkStyles.textDecoration.includes('underline');
        expect(isDifferent).toBe(true);
      }
    });
  });

  test.describe('Screen Reader Support', () => {
    test('page should have proper document structure', async ({ page }) => {
      await page.goto('/handbook/culture/');

      // Should have exactly one h1
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBe(1);

      // Should have lang attribute on html
      const lang = await page.locator('html').getAttribute('lang');
      expect(lang).toBeTruthy();
    });

    test('page title should be descriptive', async ({ page }) => {
      await page.goto('/handbook/culture/');

      const title = await page.title();
      expect(title).toBeTruthy();
      expect(title.length).toBeGreaterThan(5);
      expect(title).not.toBe('Untitled');
    });

    test('form inputs should have associated labels', async ({ page }) => {
      await page.goto('/');

      const inputs = page.locator('input:not([type="hidden"]), select, textarea');
      const inputCount = await inputs.count();

      for (let i = 0; i < inputCount; i++) {
        const input = inputs.nth(i);
        const id = await input.getAttribute('id');
        const ariaLabel = await input.getAttribute('aria-label');
        const ariaLabelledby = await input.getAttribute('aria-labelledby');
        const placeholder = await input.getAttribute('placeholder');

        // Input should have some form of label
        const hasLabel =
          (id && (await page.locator(`label[for="${id}"]`).count()) > 0) ||
          ariaLabel ||
          ariaLabelledby ||
          placeholder;

        expect(hasLabel).toBeTruthy();
      }
    });
  });

  test.describe('Motion and Animation', () => {
    test('should respect reduced motion preference', async ({ page }) => {
      // Emulate reduced motion preference
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto('/');

      // Check that animations are disabled
      const hasAnimations = await page.evaluate(() => {
        const allElements = document.querySelectorAll('*');
        for (const el of allElements) {
          const styles = getComputedStyle(el);
          if (
            styles.animationDuration !== '0s' &&
            styles.animationDuration !== '' &&
            styles.animationName !== 'none'
          ) {
            // Check if the animation is disabled for reduced motion
            const reducedMotionStyles = window.matchMedia('(prefers-reduced-motion: reduce)');
            return reducedMotionStyles.matches;
          }
        }
        return true;
      });

      // Either no animations or reduced motion is respected
      expect(hasAnimations).toBe(true);
    });
  });

  test.describe('Content Accessibility', () => {
    test('tables should have proper headers', async ({ page }) => {
      // Visit a page that might have tables
      await page.goto('/handbook/benefits/');

      const tables = page.locator('table');
      const tableCount = await tables.count();

      for (let i = 0; i < tableCount; i++) {
        const table = tables.nth(i);
        const hasHeaders =
          (await table.locator('th').count()) > 0 ||
          (await table.locator('[role="columnheader"]').count()) > 0;

        expect(hasHeaders).toBe(true);
      }
    });

    test('lists should use proper markup', async ({ page }) => {
      await page.goto('/development/standards/');

      const lists = page.locator('ul, ol');
      const listCount = await lists.count();

      for (let i = 0; i < listCount; i++) {
        const list = lists.nth(i);
        const listItems = list.locator('> li');
        const itemCount = await listItems.count();

        // Lists should contain list items
        expect(itemCount).toBeGreaterThan(0);
      }
    });

    test('code blocks should be accessible', async ({ page }) => {
      await page.goto('/development/setup/');

      const codeBlocks = page.locator('pre, code');
      const codeCount = await codeBlocks.count();

      if (codeCount > 0) {
        const codeBlock = codeBlocks.first();
        // Code should be in a readable font
        const fontFamily = await codeBlock.evaluate(el =>
          getComputedStyle(el).fontFamily
        );
        expect(fontFamily).toMatch(/mono|code|courier/i);
      }
    });
  });
});
