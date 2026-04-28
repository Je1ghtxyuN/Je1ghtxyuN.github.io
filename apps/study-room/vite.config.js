import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import siteIdentity from '../../packages/shared-config/site-identity.json'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base:
    command === 'serve'
      ? '/'
      : siteIdentity.routes?.studyRoomAppPath || '/study-app/',
}))
