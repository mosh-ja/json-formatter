import { defineConfig } from 'vite';

export default defineConfig({
  base: '/json-formatter/',
  root: 'src',
  build: {
    outDir: '../dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      external: [
        'fsevents',
        'fs',
        'path',
        'os',
        'crypto',
        'util',
        'events',
        'stream',
        'http',
        'https',
        'net',
        'tls',
        'child_process',
        'worker_threads',
        'assert',
        'buffer',
        'querystring',
        'url',
        'zlib',
        'tty',
        'module',
        'perf_hooks',
        'dns',
        'readline',
        'http2'
      ],
      output: {
        manualChunks: undefined
      }
    }
  },
  server: {
    port: 3000,
    open: true
  },
  optimizeDeps: {
    include: []
  }
});
