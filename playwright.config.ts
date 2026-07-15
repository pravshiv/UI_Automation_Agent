import { defineConfig, devices } from '@playwright/test'
import dotenv from 'dotenv'
dotenv.config()

export default defineConfig({
  testDir:   './tests',
  timeout:   60_000,
  retries:   process.env.CI ? 2 : 1,
  workers:   process.env.CI ? 2 : undefined,

  reporter: [
    ['list'],
    ['allure-playwright', { outputFolder: 'allure-results', suiteTitle: false }],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],

  use: {
    baseURL:       process.env.BASE_URL ?? 'http://localhost:3000',
    headless:      process.env.HEADLESS !== 'false',
    screenshot:    'only-on-failure',
    video:         'retain-on-failure',
    trace:         'retain-on-failure',
    // SSO session reuse — generate with: npm run auth:login
    storageState:  process.env.AUTH_STATE_PATH ?? undefined,
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },

  projects: [
    {
      name: 'setup',
      testMatch: '**/auth.setup.ts',
    },
    {
      name:         'chromium',
      use:          { ...devices['Desktop Chrome'] },
      dependencies: process.env.SKIP_AUTH ? [] : ['setup'],
    },
    // Cross-browser is OPT-IN: CI and validation install chromium only, so a
    // firefox project by default guarantees a browserType.launch failure.
    // Enable with: CROSS_BROWSER=1 npx playwright install firefox && npm test
    ...(process.env.CROSS_BROWSER ? [{
      name:         'firefox',
      use:          { ...devices['Desktop Firefox'] },
      dependencies: process.env.SKIP_AUTH ? [] : ['setup'],
    }] : []),
  ],
})
