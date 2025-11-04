import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  // GitHub Pages 部署路径配置
  base: process.env.NODE_ENV === 'production' ? '/anxinfu/' : '/',
  plugins: [
    vue(),
    // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'pinia'
      ],
      resolvers: [ElementPlusResolver()],
      dts: 'src/auto-imports.d.ts', // 生成类型声明文件
      eslintrc: {
        enabled: true, // 生成 ESLint 配置
        filepath: './.eslintrc-auto-import.json'
      }
    }),
    // 自动导入组件
    Components({
      resolvers: [ElementPlusResolver()],
      dts: 'src/components.d.ts', // 生成类型声明文件
      dirs: ['src/components'] // 自动导入的组件目录
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 3000,
    open: true
  },
  // 构建配置
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    // 代码分割
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'element-plus': ['element-plus', '@element-plus/icons-vue'],
          'charts': ['echarts'],
          'three': ['three']
        }
      }
    }
  }
})

