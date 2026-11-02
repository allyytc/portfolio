import { defineConfig } from 'vite'
import { staticPortfolio } from './scripts/static_portfolio'
import react from '@vitejs/plugin-react'
import { cabinLayoutWriter } from './scripts/cabin_layout_plugin'

export default defineConfig({
  plugins: [react(), staticPortfolio(), cabinLayoutWriter()],
  base: './',
})
