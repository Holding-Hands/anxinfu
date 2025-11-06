<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

// 确保在应用挂载时应用主题
onMounted(() => {
  // 主题已在 store 中初始化
})
</script>

<style scoped>
</style>

