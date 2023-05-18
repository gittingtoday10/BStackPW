// @ts-check
const { test, expect } = require('@playwright/test');

test('has title', async ({ page }) => {
  await page.goto('https://www.browserstack.com/users/sign_in');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle('BrowserStack Login | Sign Into The Best Mobile & Browser Testing Tool');
});


test('login and click plans & pricing', async ({ page }) => {
  await page.goto('https://www.browserstack.com/users/sign_in');

  // Enter your login credentials
  await page.fill('#user_email_login', 'austenjane567@gmail.com');
  await page.fill('#user_password', 'dummyuser1');

  // Click the login button
  await page.press('#user_password', 'Enter');


  // Wait for the page to load after login
  await page.waitForNavigation();

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle('Dashboard');
  
  // Click the "Plans & Pricing" button
  await page.click('a[title="Pricing"]');

  //await page.waitForNavigation();
  await page.waitForTimeout(10000);

  await expect(page).toHaveTitle('BrowserStack Subscription Plans');

  await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {status: 'passed',reason: 'Found Title!'}})}`);
  await page.close();


});