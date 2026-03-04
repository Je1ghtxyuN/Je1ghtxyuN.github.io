import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // 将React相关库拆分为单独的chunk
          'react-vendor': ['react', 'react-dom', 'react-markdown'],
          // 将Firebase拆分为单独的chunk
          'firebase-vendor': ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/analytics'],
          // 将UI库拆分为单独的chunk
          'ui-vendor': ['lucide-react'],
        },
        // 优化chunk命名
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    // 启用代码压缩
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // 生产环境移除console
        drop_debugger: true,
      },
    },
    // 启用sourcemap（开发环境）
    sourcemap: process.env.NODE_ENV !== 'production', // eslint-disable-line no-undef
    // 设置chunk大小警告限制
    chunkSizeWarningLimit: 1000,
  },
  // 优化依赖预构建
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-markdown', 'firebase/app', 'firebase/auth', 'firebase/firestore'],
  },
  // 开发服务器配置
  server: {
    port: 5173,
    host: true,
    open: true,
  },
})
