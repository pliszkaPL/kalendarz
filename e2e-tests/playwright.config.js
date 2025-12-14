import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for Kalendarz MVP
 * 
 * Local development: expects servers to be running (make dev)
 * CI environment: no webServer config (started by GitHub Actions)
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'html',
  
  use: {
    baseURL: process.env.CI ? 'http://localhost' : 'http://127.0.0.1:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // No webServer config - expects external services
  // 
  // Local development:
  //   Backend: http://127.0.0.1:8000
  //   Frontend: http://127.0.0.1:5173 (Vite dev server)
  // 
  // CI environment (GitHub Actions):
  //   Backend: http://127.0.0.1:8000
  //   Frontend: http://localhost (nginx serving built assets)
  // 
  // To run tests locally:
  //   1. Start servers: make dev (in one terminal)
  //   2. Run tests: make test-e2e (in another terminal)
  // 
  // Or use: make test-all (automatically starts backend + frontend)
});
