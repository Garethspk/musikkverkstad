const {defineConfig} = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/browser',
  fullyParallel: true,
  forbidOnly: true,
  retries: 0,
  workers: process.env.CI ? 2 : 4,
  timeout: 30000,
  expect: {timeout: 5000},
  reporter: [['list'], ['html', {open: 'never'}], ['json', {outputFile: '.quality/browser.json'}]],
  use: {
    baseURL: 'http://127.0.0.1:8765',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
      ? {executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH} : {},
  },
  projects: [
    {name: 'chromium-desktop', use: {browserName: 'chromium', viewport: {width: 1280, height: 800}}},
    {name: 'chromium-mobile', use: {browserName: 'chromium', viewport: {width: 390, height: 844}, isMobile: true, hasTouch: true}},
  ],
  webServer: {
    command: `${process.env.PYTHON || 'python3'} -m http.server 8765 --bind 127.0.0.1 --directory dist`,
    url: 'http://127.0.0.1:8765',
    reuseExistingServer: false,
    timeout: 15000,
  },
});
