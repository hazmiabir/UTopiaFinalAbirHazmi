// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * Configuration Playwright pour tests SauceDemo
 * Optimisée pour lancer uniquement sur Chrome
 * 
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Dossier contenant les tests
  testDir: './tests',
  
  // Timeout pour chaque test (30 secondes)
  timeout: 30 * 1000,
  
  // Timeout pour les assertions expect (5 secondes)
  expect: {
    timeout: 5000
  },
  
  /* Run tests in files in parallel */
  fullyParallel: true,
  
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html'],           // Rapport HTML
    ['list'],           // Liste dans le terminal
    ['json', { outputFile: 'test-results/results.json' }]  // JSON pour CI/CD
  ],
  
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'https://www.saucedemo.com',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    
    /* Screenshot on failure */
    screenshot: 'only-on-failure',
    
    /* Video on failure */
    video: 'retain-on-failure',
    
    /* Browser viewport */
    viewport: { width: 1280, height: 720 },
    
    /* Ignore HTTPS errors */
    ignoreHTTPSErrors: true,
    
    /* Action timeout (temps max pour une action) */
    actionTimeout: 10 * 1000,
    
    /* Navigation timeout */
    navigationTimeout: 30 * 1000,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Options spécifiques à Chrome
        channel: 'chrome', // Utilise Google Chrome installé sur le système
        // OU si vous voulez utiliser Chromium de Playwright:
        // Commentez la ligne ci-dessus et décommentez celle-ci:
        // channel: undefined,
        
        // Paramètres additionnels
        launchOptions: {
          // Lancer en mode headed par défaut (décommentez si besoin)
          // headless: false,
          
          // Ralentir les actions (utile pour le debug)
          // slowMo: 100,
          
          // Arguments Chrome supplémentaires
          args: [
            '--start-maximized',  // Démarrer en plein écran
          ],
        },
      },
    },

    // Firefox désactivé
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // WebKit (Safari) désactivé
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports - désactivé */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers - désactivé */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});