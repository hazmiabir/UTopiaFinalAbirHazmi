// @ts-check
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  /* 🔹 Dossier des tests */
  testDir: './tests/specs',

  /* 🔹 Dossier des résultats (screenshots, vidéos, traces) */
  outputDir: 'test-results',

  /* 🔹 Timeout global */
  timeout: 30 * 1000,

  expect: {
    timeout: 5000,
  },

  /* 🔹 Exécution parallèle */
  fullyParallel: true,

  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  /* 🔹 REPORTERS */
  reporter: [
    ['list'],
    ['html', {
      outputFolder: 'playwright-report',
      open: 'never'
    }],
    ['json', {
      outputFile: 'test-results/results.json'
    }]
  ],

  /* 🔹 Options communes */
  use: {
    baseURL: 'https://www.saucedemo.com',

    headless: !!process.env.CI,

    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',

    viewport: { width: 1280, height: 720 },

    ignoreHTTPSErrors: true,

    actionTimeout: 10 * 1000,
    navigationTimeout: 30 * 1000,
  },

  /* 🔹 Projets navigateurs */
  projects: [
    {
      name: 'Chrome',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        launchOptions: {
          args: ['--start-maximized'],
        },
      },
    },
  ],
});
