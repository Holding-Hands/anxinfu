import { defineStore } from 'pinia'
import { ref } from 'vue'

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
  
  return {
    isCollapse,
    toggleCollapse,
    setCollapse,
    device,
    setDevice
  }
})

