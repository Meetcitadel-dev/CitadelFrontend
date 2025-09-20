import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, './src')
    }
  },
  server: {
    host: '0.0.0.0',  // Bind to all network interfaces
    port: 5173,       // Keep your current port
    hmr: {
      host: 'localhost',  // HMR WebSocket uses localhost
      protocol: 'ws',     // Explicitly specify WebSocket protocol
    }
  },
  define: {
    // Ensure proper environment detection
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  }
})
