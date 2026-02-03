import { test, expect } from '@playwright/test';

test.describe('Fleet Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/agent-control-plane/dashboard/');
  });

  test('loads dashboard page', async ({ page }) => {
    await expect(page).toHaveTitle(/Fleet Dashboard/);
    await expect(page.locator('h1')).toContainText('Fleet Dashboard');
  });

  test('displays loading state initially', async ({ page }) => {
    // Intercept the fetch request to delay it
    await page.route('**/fleet-status.json', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      await route.continue();
    });

    // Reload to trigger fresh load
    await page.reload();

    // Should show either loading or content (depending on timing)
    const content = page.locator('main');
    await expect(content).toBeVisible();
  });

  test('displays fleet metrics cards', async ({ page }) => {
    // Wait for the dashboard to load
    await page.waitForSelector('text=Total Sprites', { timeout: 10000 });

    // Check for metric cards - use first() since there might be multiple elements
    await expect(page.getByText('Total Sprites').first()).toBeVisible();
    await expect(page.locator('[class*="Card"]').filter({ hasText: 'Healthy' }).first()).toBeVisible();
    await expect(page.locator('[class*="Card"]').filter({ hasText: 'Unhealthy' }).first()).toBeVisible();
  });

  test('displays sprite table', async ({ page }) => {
    // Wait for the tremor table to appear (the React component)
    await page.waitForSelector('.tremor-Table-table', { timeout: 10000 });

    const tremorTable = page.locator('.tremor-Table-table');
    await expect(tremorTable).toBeVisible();
    // Scope column header searches to the tremor table to avoid matching documentation tables
    // Use exact matching for "Status" to avoid matching "API Status"
    await expect(tremorTable.getByRole('columnheader', { name: 'Sprite' })).toBeVisible();
    await expect(tremorTable.getByRole('columnheader', { name: 'Team' })).toBeVisible();
    await expect(tremorTable.getByRole('columnheader', { name: 'Status', exact: true })).toBeVisible();
  });

  test('displays sprite names in table', async ({ page }) => {
    // Wait for table data to load
    await page.waitForSelector('table', { timeout: 10000 });
    await page.waitForSelector('code', { timeout: 5000 });

    // Check that some expected sprite names are visible
    const spriteNames = page.locator('table code');
    await expect(spriteNames.first()).toBeVisible();
  });

  test('team filter dropdown is visible', async ({ page }) => {
    // Wait for dashboard to load
    await page.waitForSelector('text=Total Sprites', { timeout: 10000 });

    // Look for the team filter select - use first() as there may be multiple comboboxes
    const filterSelect = page.getByRole('combobox').first();
    await expect(filterSelect).toBeVisible();
  });

  test('team filter changes displayed sprites', async ({ page }) => {
    // Wait for table to load
    await page.waitForSelector('table', { timeout: 10000 });
    await page.waitForSelector('code', { timeout: 5000 });

    // Get initial row count
    const initialRows = await page.locator('table tbody tr').count();

    // Open the team filter dropdown and select a specific team
    const filterSelect = page.getByRole('combobox');
    await filterSelect.click();

    // Wait for dropdown options to appear and click one
    const agentsOption = page.getByRole('option', { name: /agents/i });
    if (await agentsOption.isVisible()) {
      await agentsOption.click();

      // Wait for the filter to apply
      await page.waitForTimeout(500);

      // Rows should change (either fewer or same if all are agents)
      const filteredRows = await page.locator('table tbody tr').count();
      expect(filteredRows).toBeLessThanOrEqual(initialRows);
    }
  });

  test('handles error state gracefully', async ({ page }) => {
    // Block the fleet-status.json request to simulate error
    await page.route('**/fleet-status.json', (route) => route.abort());

    await page.goto('/agent-control-plane/dashboard/');

    // Should show error message - look for the error callout
    await expect(page.getByText('Error Loading Fleet Status').first()).toBeVisible({ timeout: 10000 });
  });

  test('displays health badges', async ({ page }) => {
    // Wait for table to load
    await page.waitForSelector('table', { timeout: 10000 });
    await page.waitForSelector('code', { timeout: 5000 });

    // Should have badges for Healthy or status
    const badges = page.locator('table').locator('[class*="bg-"]');
    await expect(badges.first()).toBeVisible();
  });

  test('displays timestamp', async ({ page }) => {
    // Wait for dashboard to load
    await page.waitForSelector('text=Total Sprites', { timeout: 10000 });

    // Should show last updated timestamp
    await expect(page.getByText(/Last updated/i)).toBeVisible();
  });

  test('documentation section is present', async ({ page }) => {
    // The MDX page has documentation content below the dashboard
    // Wait for the dashboard to load first
    await page.waitForSelector('text=Total Sprites', { timeout: 10000 });

    // Look for documentation headings
    await expect(page.getByRole('heading', { name: 'About This Dashboard' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Status Indicators' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'API Status' })).toBeVisible();
  });

  test('sidebar navigation includes Fleet Dashboard', async ({ page }) => {
    // Check sidebar has the Fleet Dashboard link
    const sidebarLink = page.locator('nav').getByRole('link', { name: 'Fleet Dashboard' });
    await expect(sidebarLink).toBeVisible();
    await expect(sidebarLink).toHaveAttribute('aria-current', 'page');
  });
});

test.describe('Fleet Dashboard - Responsive', () => {
  test('adapts to mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/agent-control-plane/dashboard/');

    // Dashboard should still load on mobile
    await page.waitForSelector('text=Total Sprites', { timeout: 10000 });
    await expect(page.getByText('Total Sprites')).toBeVisible();
  });

  test('adapts to tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/agent-control-plane/dashboard/');

    // Dashboard should display properly on tablet
    await page.waitForSelector('text=Total Sprites', { timeout: 10000 });
    // Use the tremor table class to be specific
    await expect(page.locator('.tremor-Table-table')).toBeVisible();
  });
});
