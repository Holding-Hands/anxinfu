import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'
import './styles/index.scss'

// 初始化暗黑模式
const themeMode = localStorage.getItem('theme-mode')
if (themeMode === 'dark') {
  document.documentElement.classList.add('dark')
}

const app = createApp(App)
const pinia = createPinia()

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(pinia)
app.use(router)
app.use(ElementPlus, {
  locale: zhCn
})

// 全局配置 loading 颜色
const style = document.createElement('style')
style.textContent = `
  .el-loading-spinner svg {
    color: var(--el-color-primary) !important;
  }
  .el-loading-spinner svg circle {
    stroke: var(--el-color-primary) !important;
  }
  .el-loading-spinner .path {
    stroke: var(--el-color-primary) !important;
  }
`
document.head.appendChild(style)

app.mount('#app')
