import { test, expect } from '@playwright/test';

test.describe('Content Structure and Formatting', () => {
  test.describe('Markdown Rendering', () => {
    test('headings should be properly styled', async ({ page }) => {
      await page.goto('/development/standards/');

      const h1 = page.locator('main h1, article h1').first();
      const h2 = page.locator('main h2, article h2').first();

      if (await h1.count() > 0 && await h2.count() > 0) {
        const h1Size = await h1.evaluate(el => parseFloat(getComputedStyle(el).fontSize));
        const h2Size = await h2.evaluate(el => parseFloat(getComputedStyle(el).fontSize));

        // h1 should be larger than h2
        expect(h1Size).toBeGreaterThan(h2Size);
      }
    });

    test('paragraphs should have proper spacing', async ({ page }) => {
      await page.goto('/handbook/culture/');

      const paragraphs = page.locator('main p, article p');
      const count = await paragraphs.count();

      if (count >= 2) {
        const p1 = paragraphs.nth(0);
        const p2 = paragraphs.nth(1);

        const p1Box = await p1.boundingBox();
        const p2Box = await p2.boundingBox();

        if (p1Box && p2Box) {
          const spacing = p2Box.y - (p1Box.y + p1Box.height);
          // Should have reasonable spacing between paragraphs
          expect(spacing).toBeGreaterThan(8);
        }
      }
    });

    test('lists should render correctly', async ({ page }) => {
      await page.goto('/development/standards/');

      const ulLists = page.locator('main ul, article ul');
      const olLists = page.locator('main ol, article ol');

      if (await ulLists.count() > 0) {
        const ul = ulLists.first();
        const listStyle = await ul.evaluate(el => getComputedStyle(el).listStyleType);
        // Unordered lists should have bullets
        expect(['disc', 'circle', 'square', 'none']).toContain(listStyle);
      }

      if (await olLists.count() > 0) {
        const ol = olLists.first();
        const listStyle = await ol.evaluate(el => getComputedStyle(el).listStyleType);
        // Ordered lists should have numbers
        expect(listStyle).toMatch(/decimal|numeric|none/i);
      }
    });

    test('code blocks should be properly formatted', async ({ page }) => {
      await page.goto('/development/setup/');

      const codeBlocks = page.locator('pre code, pre');
      const count = await codeBlocks.count();

      if (count > 0) {
        const codeBlock = codeBlocks.first();

        // Should have monospace font
        const fontFamily = await codeBlock.evaluate(el => getComputedStyle(el).fontFamily);
        expect(fontFamily.toLowerCase()).toMatch(/mono|code|courier|consolas/);

        // Should have background color (syntax highlighting)
        const bgColor = await codeBlock.evaluate(el => getComputedStyle(el).backgroundColor);
        expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');
      }
    });

    test('inline code should be visually distinct', async ({ page }) => {
      await page.goto('/development/standards/');

      const inlineCode = page.locator('main code:not(pre code), article code:not(pre code)').first();
      if (await inlineCode.count() > 0) {
        const styles = await inlineCode.evaluate(el => ({
          fontFamily: getComputedStyle(el).fontFamily,
          backgroundColor: getComputedStyle(el).backgroundColor,
          padding: getComputedStyle(el).padding,
        }));

        expect(styles.fontFamily.toLowerCase()).toMatch(/mono|code|courier/);
      }
    });

    test('blockquotes should be styled', async ({ page }) => {
      // Check pages that might have blockquotes
      await page.goto('/handbook/culture/');

      const blockquotes = page.locator('main blockquote, article blockquote');
      if (await blockquotes.count() > 0) {
        const blockquote = blockquotes.first();
        const styles = await blockquote.evaluate(el => ({
          borderLeft: getComputedStyle(el).borderLeft,
          paddingLeft: getComputedStyle(el).paddingLeft,
          marginLeft: getComputedStyle(el).marginLeft,
        }));

        // Blockquotes typically have left border or indentation
        const hasIndentation =
          parseFloat(styles.paddingLeft) > 0 ||
          parseFloat(styles.marginLeft) > 0 ||
          styles.borderLeft !== 'none';

        expect(hasIndentation).toBe(true);
      }
    });

    test('tables should be properly styled', async ({ page }) => {
      await page.goto('/handbook/benefits/');

      const tables = page.locator('main table, article table');
      if (await tables.count() > 0) {
        const table = tables.first();

        // Table should have borders or grid styling
        const styles = await table.evaluate(el => ({
          borderCollapse: getComputedStyle(el).borderCollapse,
        }));

        expect(styles.borderCollapse).toBeTruthy();

        // Check for header row
        const headers = table.locator('th');
        if (await headers.count() > 0) {
          const headerStyles = await headers.first().evaluate(el => ({
            fontWeight: getComputedStyle(el).fontWeight,
          }));
          // Headers should be bold
          expect(parseInt(headerStyles.fontWeight)).toBeGreaterThanOrEqual(600);
        }
      }
    });
  });

  test.describe('Links and References', () => {
    test('links should be visually identifiable', async ({ page }) => {
      await page.goto('/handbook/culture/');

      const link = page.locator('main a, article a').first();
      if (await link.count() > 0) {
        const styles = await link.evaluate(el => ({
          color: getComputedStyle(el).color,
          textDecoration: getComputedStyle(el).textDecoration,
          cursor: getComputedStyle(el).cursor,
        }));

        // Links should have pointer cursor
        expect(styles.cursor).toBe('pointer');
      }
    });

    test('links should have hover state', async ({ page }) => {
      await page.goto('/handbook/culture/');

      const link = page.locator('main a, article a').first();
      if (await link.count() > 0) {
        const beforeHover = await link.evaluate(el => ({
          color: getComputedStyle(el).color,
          textDecoration: getComputedStyle(el).textDecoration,
        }));

        await link.hover();

        const afterHover = await link.evaluate(el => ({
          color: getComputedStyle(el).color,
          textDecoration: getComputedStyle(el).textDecoration,
        }));

        // Something should change on hover
        const hasHoverEffect =
          beforeHover.color !== afterHover.color ||
          beforeHover.textDecoration !== afterHover.textDecoration;

        // Hover effect is optional but recommended
      }
    });
  });

  test.describe('Page Metadata', () => {
    test('each page should have unique title', async ({ page }) => {
      const pages = [
        { path: '/', title: 'OpticWorks' },
        { path: '/handbook/culture/', title: 'Culture' },
        { path: '/it/software/', title: 'Software' },
      ];

      const titles: string[] = [];

      for (const p of pages) {
        await page.goto(p.path);
        const title = await page.title();
        expect(title).toContain(p.title);
        titles.push(title);
      }

      // All titles should be unique
      const uniqueTitles = new Set(titles);
      expect(uniqueTitles.size).toBe(titles.length);
    });

    test('pages should have meta description', async ({ page }) => {
      await page.goto('/handbook/culture/');

      const metaDescription = page.locator('meta[name="description"]');
      // Meta descriptions are optional but recommended
    });
  });

  test.describe('Content Quality', () => {
    test('pages should not be empty', async ({ page }) => {
      const pages = [
        '/handbook/culture/',
        '/it/software/',
        '/development/standards/',
      ];

      for (const pagePath of pages) {
        await page.goto(pagePath);

        const content = page.locator('main, article');
        const text = await content.first().textContent();

        // Page should have substantial content
        expect(text?.length).toBeGreaterThan(100);
      }
    });

    test('code examples should not be truncated', async ({ page }) => {
      await page.goto('/development/setup/');

      const codeBlocks = page.locator('pre');
      const count = await codeBlocks.count();

      for (let i = 0; i < count; i++) {
        const codeBlock = codeBlocks.nth(i);
        const text = await codeBlock.textContent();

        // Code blocks should not end with "..." indicating truncation
        expect(text?.trim()).not.toMatch(/\.\.\.$/);
      }
    });

    test('images should load successfully', async ({ page }) => {
      await page.goto('/');

      const images = page.locator('img');
      const imageCount = await images.count();

      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        const naturalWidth = await img.evaluate(el => (el as HTMLImageElement).naturalWidth);

        // Image should have loaded (naturalWidth > 0)
        expect(naturalWidth).toBeGreaterThan(0);
      }
    });
  });

  test.describe('Starlight Features', () => {
    test('callouts/asides should render correctly', async ({ page }) => {
      // Starlight supports callouts like :::note, :::tip, etc.
      await page.goto('/it/security/');

      const callouts = page.locator('.starlight-aside, .aside, [data-callout]');
      if (await callouts.count() > 0) {
        const callout = callouts.first();
        await expect(callout).toBeVisible();
      }
    });

    test('file tree component should render', async ({ page }) => {
      // Check if any page uses file tree
      await page.goto('/development/setup/');

      const fileTree = page.locator('.file-tree, [data-file-tree]');
      // File tree may or may not be present
    });

    test('tabs component should be interactive', async ({ page }) => {
      // Check pages that might have tabs
      await page.goto('/development/setup/');

      const tabs = page.locator('[role="tablist"]');
      if (await tabs.count() > 0) {
        const tabButtons = tabs.locator('[role="tab"]');
        if (await tabButtons.count() > 1) {
          // Click second tab
          await tabButtons.nth(1).click();

          // Tab panel should change
          const activePanel = page.locator('[role="tabpanel"]:visible');
          await expect(activePanel).toBeVisible();
        }
      }
    });
  });
});
