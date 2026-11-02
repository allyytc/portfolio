import { defineConfig } from '@playwright/test'
import { existsSync } from 'node:fs'

const localChrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
export default defineConfig({
  testDir: './tests',
  workers: 1,
  timeout: 45_000,
  use: {
    baseURL: 'http://127.0.0.1:5173',
    viewport: { width: 1440, height: 1000 },
    launchOptions: { executablePath: existsSync(localChrome) ? localChrome : undefined },
  },
  webServer: [
    { command: 'npm run dev', url: 'http://127.0.0.1:5173', reuseExistingServer: !process.env.CI },
    { command: 'npm run build && node scripts/serve_audit.mjs dist 4174', url: 'http://127.0.0.1:4174', reuseExistingServer: !process.env.CI },
  ],
})
