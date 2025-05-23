import {PrimeVueResolver} from '@primevue/auto-import-resolver';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import {defineConfig} from 'vite';
import path from 'path';
import {readFileSync, existsSync} from 'fs';

const isDev = process.env.NODE_ENV === 'development';
const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));

const httpsOptions = () => {
  const keyPath = path.resolve(__dirname, 'cert/localhost-key.pem');
  const certPath = path.resolve(__dirname, 'cert/localhost.pem');

  return existsSync(keyPath) && existsSync(certPath)
    ? {
      key: readFileSync(keyPath),
      cert: readFileSync(certPath)
    }
    : false;
};

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [PrimeVueResolver()]
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
    __APP_ENV__: JSON.stringify(process.env.NODE_ENV)
  },
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_API_PROXY,
        changeOrigin: true,
        secure: false,
      },
    },
    ...(isDev && {
      https: httpsOptions(),
      host: '127.0.0.1',
      port: 5173
    })
  },
  build: {
    chunkSizeWarningLimit: 1000,
    outDir: 'dist',
    assetsDir: 'assets',
    manifest: true,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  }
});
