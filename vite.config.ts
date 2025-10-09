import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic'
    }),
    tailwindcss()
  ],
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
  build: {
    // Enable source maps for production debugging (optional)
    sourcemap: false,
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          'query-vendor': ['@tanstack/react-query'],
          'ui-vendor': ['lucide-react', '@radix-ui/react-label', '@radix-ui/react-slot', '@radix-ui/react-tabs'],
          'socket-vendor': ['socket.io-client'],
          'utils-vendor': ['axios', 'clsx', 'tailwind-merge', 'class-variance-authority'],
          // App chunks
          'onboarding': [
            './src/pages/onboarding/index.tsx',
            './src/components/Onboarding/splash-screen-1.tsx',
            './src/components/Onboarding/splash-screen-2.tsx',
            './src/components/Onboarding/splash-screen-3.tsx'
          ],
          'events': [
            './src/pages/events/index.tsx',
            './src/components/Events/booking-confirmation.tsx',
            './src/components/Events/city-selection.tsx'
          ]
        },
        // Optimize file names for caching
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    minify: true
  },
  define: {
    // Ensure proper environment detection
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  }
})
