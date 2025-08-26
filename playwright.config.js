// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    
    /* Take screenshot on failure */
    screenshot: 'only-on-failure',
    
    /* Enhanced Video Recording Configuration */
    video: {
      mode: process.env.PLAYWRIGHT_VIDEO_MODE === 'off' ? 'off' :
            process.env.PLAYWRIGHT_VIDEO_MODE === 'on' ? 'on' :
            process.env.PLAYWRIGHT_VIDEO_MODE === 'high' ? 'on' :
            process.env.PLAYWRIGHT_VIDEO_MODE === 'retry-only' ? 'on-first-retry' :
            'retain-on-failure',  // Default: only keep videos of failed tests
      
      size: process.env.PLAYWRIGHT_VIDEO_MODE === 'high' ? 
            { width: 1920, height: 1080 } :  // High quality for detailed analysis
            { width: 1280, height: 720 }     // Standard quality for regular use
    },
    
    /* Video directory with organized structure */
    outputDir: './test-results',
    
    /* Additional debugging options when video is enabled */
    ...(process.env.PLAYWRIGHT_VIDEO_MODE === 'on' && {
      actionTimeout: 10000,      // More time for actions when recording
      navigationTimeout: 30000   // More time for navigation when recording
    }),
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});