import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "events": "events",
      "stream": "stream-browserify",
      "util": "util-inspect",
      "buffer": "buffer",
      "process": "process/browser",
    },
  },
  define: {
    'process.env': {},
    'process.platform': JSON.stringify(process.platform),
    'process.version': JSON.stringify(process.version),
  },
  optimizeDeps: {
    include: [
      'events',
      'stream-browserify',
      'util-inspect',
      'buffer',
      'process'
    ],
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-tabs', '@radix-ui/react-toast'],
        },
      },
    },
  },
  server: {
    port: 3001,
    strictPort: true,
    host: true,
    hmr: {
      overlay: false
    }
  },
});
