<template>
  <el-container class="layout-container">
    <el-aside :width="isCollapse ? '64px' : '220px'" class="layout-aside">
      <Sidebar />
    </el-aside>

    <el-container class="main-container">
      <el-header height="60px" class="layout-header">
        <Header />
      </el-header>

      <el-main class="layout-main">
        <router-view v-slot="{ Component }">
          <transition name="fade-transform" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'
import Sidebar from './components/Sidebar.vue'
import Header from './components/Header.vue'

const appStore = useAppStore()
const isCollapse = computed(() => appStore.isCollapse)
</script>

<style scoped lang="scss">
.layout-container {
  width: 100%;
  height: 100vh;
}

.layout-aside {
  background: #ffffff;
  transition: width 0.3s;
  overflow-x: hidden;
  border-right: 1px solid #e8e8e8;
}

.main-container {
  background: #f0f2f5;
}

.layout-header {
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.layout-main {
  padding: 20px;
  overflow-y: auto;
  height: calc(100vh - 60px);
}

// 页面切换动画
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.3s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>

