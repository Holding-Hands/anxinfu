import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { loadTheme, resetTheme } from '@/utils/themeLoader'

export type ThemeType =
  | 'default'
  | 'dark'
  | 'sky-blue'
  | 'cyan'
  | 'deep-blue'
  | 'teal'
  | 'purple'
  | 'orange'
  | 'red'
  | 'emerald'
  | 'pink'
  | 'light-green'
  | 'light-blue'
  | 'ink-blue'
  | 'tech-silver'

export const useAppStore = defineStore('app', () => {
  // 侧边栏是否折叠
  const isCollapse = ref(false)

  // 切换侧边栏折叠状态
  const toggleCollapse = () => {
    isCollapse.value = !isCollapse.value
  }

  // 设置侧边栏折叠状态
  const setCollapse = (value: boolean) => {
    isCollapse.value = value
  }

  // 设备类型
  const device = ref<'desktop' | 'mobile'>('desktop')

  // 设置设备类型
  const setDevice = (value: 'desktop' | 'mobile') => {
    device.value = value
  }

  // 主题设置
  const theme = ref<ThemeType>((localStorage.getItem('theme') as ThemeType) || 'default')

  // 设置主题
  const setTheme = (value: ThemeType) => {
    theme.value = value
    localStorage.setItem('theme', value)
    applyTheme(value)
  }

  // 应用主题到 DOM
  const applyTheme = (themeValue: ThemeType) => {
    document.documentElement.setAttribute('data-theme', themeValue)
    // 如果是默认主题或暗黑模式，重置自定义样式
    if (themeValue === 'default' || themeValue === 'dark') {
      resetTheme()
    } else {
      // 否则加载主题颜色
      loadTheme(themeValue)
    }
  }

  // 初始化主题
  applyTheme(theme.value)

  // 监听主题变化
  watch(theme, (newTheme) => {
    applyTheme(newTheme)
  })

  return {
    isCollapse,
    toggleCollapse,
    setCollapse,
    device,
    setDevice,
    theme,
    setTheme
  }
})
