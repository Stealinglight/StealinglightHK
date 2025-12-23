import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  define: {
    'import.meta.env.VITE_CONTACT_API_URL': JSON.stringify(
      process.env.VITE_CONTACT_API_URL || 'https://api.stealinglight.hk/contact'
    ),
  },
});
