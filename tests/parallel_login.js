const expect = require('chai').expect
const { chromium } = require('playwright');

const cp = require('child_process');
const clientPlaywrightVersion = cp.execSync('npx playwright --version').toString().trim().split(' ')[1];

const main = async (cap) => {
  cap['client.playwrightVersion'] = clientPlaywrightVersion;  // Playwright version being used on your local project needs to be passed in this capability for BrowserStack to be able to map request and responses correctly
  cap['browserstack.username'] = process.env.BROWSERSTACK_USERNAME || 'srisairamtangira_iawPW4';
  cap['browserstack.accessKey'] = process.env.BROWSERSTACK_ACCESS_KEY || 'jH9m9ks8zq9hzRf2QF8S';
  
  console.log("Starting test -->", cap['name']);
  const browser = await chromium.connect({
    wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify(cap))}`,
  });
  const page = await browser.newPage();
  await page.goto('https://www.browserstack.com/users/sign_in');

  // Enter your login credentials
  await page.fill('#user_email_login', 'austenjane567@gmail.com');
  await page.fill('#user_password', 'dummyuser1');

  // Click the login button
  await page.press('#user_password', 'Enter');


  // Wait for the page to load after login
  await page.waitForNavigation();
  const title = await page.title('');

  // Expect a title "to contain" a substring.
  console.log(title);
  try {
    expect(title).to.equal("Dashboard", 'Expected page title is incorrect!');
    // avoid unmarked status
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {status: 'passed',reason: 'Title matched'}})}`);
  } catch {
    await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {status: 'failed',reason: 'Title did not match'}})}`);
  }
  await browser.close();
};

const capabilities = [
{
  'browser': 'chrome',  
  'browser_version': 'latest', 
  'os_version': 'ventura',
  'name': 'Chrome on ventura latest',
  'build': 'playwright-sairam'
},
{
  'browser': 'edge',  
  'browser_version': 'latest-1', 
  'os': 'osx',
  'os_version': 'ventura',
  'name': 'Edge on ventura latest-1',
  'build': 'playwright-sairam'
},
{
  'browser': 'playwright-firefox', 
  'os': 'osx',
  'os_version': 'ventura',
  'name': 'firefox on ventura default',
  'build': 'playwright-sairam'
},
{
  'browser': 'playwright-webkit',  
  'os': 'osx',
  'os_version': 'ventura',
  'name': 'webkit on ventura default',
  'build': 'playwright-sairam'
},
{
  'browser': 'chrome',  
  'os': 'windows',
  'os_version': '10',
  'name': 'Chrome on Win10',
  'build': 'playwright-sairam'
}]

capabilities.forEach(async (cap) => {
  await main(cap);
});
