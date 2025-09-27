import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'remote',
      filename: 'remoteEntry.js',
      exposes: {
        './RemoteApp': './src/App.tsx',
      },
      shared: ['react', 'react-dom'],
    }),
  ],
  preview: { port: 5001, strictPort: true },
});
