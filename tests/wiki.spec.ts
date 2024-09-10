import { test, expect } from '@playwright/test';

test('Wiki test', async ({ page }) => {
  await page.goto('https://en.wikipedia.org/');

  await test.step('Fill the searchfield', async () => {
  await page.getByRole('searchbox', { name: 'Search Wikipedia' }).fill('Hanna');
  await expect(page.getByRole('listbox', { name: 'Search results' }).first()).toBeVisible();
  })

  const listItem = page.locator('//li[@role="option" and contains(@title, "Han") and .//a[contains(@href, "Han")]]');

  await test.step('Check count of list items', async () => {
  await expect(listItem).toHaveCount(10);
  })
  
  await test.step('Check that each list item contains "Han" text', async () => {
    async function repeat(n: number, fn: (index: number) => Promise<void>) {
      for (let i = 0; i < n; i++) {
        await fn(i);
      }
    }
  
    await repeat(10, async (index) => {
      const specificListItem = listItem.nth(index);
      await expect(specificListItem).toHaveText(/.*Han.*/);
    });
  });
 
  await test.step('Check the last item in the list', async () => {
  await expect(page.getByRole('option').nth(10)).toHaveText("Search for pages containing Hanna");
  // different approach
  // const lastListItem = page.locator('//li[@role="option"]').nth(10);
  // await expect(lastListItem).toHaveText("Search for pages containing Hanna");
  });
  
  await test.step('Search for the results', async () => {
  // press enter key
  // await page.getByRole('listbox', { name: 'Search results' }).press('Enter');
  await page.getByRole('button', { name: 'Search' }).click();  
  });

  await test.step('Check that opened page URL and Title have "Hanna" text', async () => {
  await expect(page).toHaveTitle(/.*Hanna.*/);
  // different approach  
  // await expect(page).toHaveURL(/.*Hanna.*/);
  await page.waitForURL(/.*Hanna.*/);
  });

  await test.step('Check that opened page has heading "Hanna"', async () => {  
  const locator = page.locator('.firstHeading');
  await expect(locator).toContainText(/.*Hanna.*/);
  });
});
