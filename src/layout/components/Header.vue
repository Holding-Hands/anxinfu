<template>
  <div class="header-container">
    <div class="left-menu">
      <el-icon class="menu-icon" @click="toggleCollapse">
        <Fold v-if="!isCollapse" />
        <Expand v-else />
      </el-icon>
      
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item v-if="currentRoute">{{ currentRoute }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    
    <div class="right-menu">
      <el-tooltip content="全屏" placement="bottom">
        <el-icon class="action-icon" @click="toggleFullscreen">
          <FullScreen />
        </el-icon>
      </el-tooltip>
      
      <el-dropdown @command="handleCommand">
        <div class="user-info">
          <el-avatar :size="36" :src="userInfo?.avatar" />
          <span class="username">{{ userInfo?.nickname }}</span>
          <el-icon><CaretBottom /></el-icon>
        </div>
        
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">
              <el-icon><User /></el-icon>
              个人中心
            </el-dropdown-item>
            <el-dropdown-item command="settings">
              <el-icon><Setting /></el-icon>
              系统设置
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">
              <el-icon><SwitchButton /></el-icon>
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import {
  Fold,
  Expand,
  FullScreen,
  CaretBottom,
  User,
  Setting,
  SwitchButton
} from '@element-plus/icons-vue'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()
const userStore = useUserStore()

const isCollapse = computed(() => appStore.isCollapse)
const userInfo = computed(() => userStore.userInfo)
const currentRoute = computed(() => route.meta.title as string)

// 切换侧边栏折叠
const toggleCollapse = () => {
  appStore.toggleCollapse()
}

// 全屏切换
const isFullscreen = ref(false)
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
    isFullscreen.value = true
  } else {
    document.exitFullscreen()
    isFullscreen.value = false
  }
}

// 下拉菜单命令处理
const handleCommand = (command: string) => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'settings':
      router.push('/system')
      break
    case 'logout':
      handleLogout()
      break
  }
}

// 退出登录
const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    userStore.logout()
    ElMessage.success('退出成功')
    router.push('/login')
  }).catch(() => {
    // 取消退出
  })
}
</script>

<style scoped lang="scss">
.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
}

.left-menu {
  display: flex;
  align-items: center;
  gap: 20px;
  
  .menu-icon {
    font-size: 20px;
    cursor: pointer;
    transition: all 0.3s;
    
    &:hover {
      color: #1890ff;
    }
  }
}

.right-menu {
  display: flex;
  align-items: center;
  gap: 20px;
  
  .action-icon {
    font-size: 20px;
    cursor: pointer;
    transition: all 0.3s;
    
    &:hover {
      color: #1890ff;
    }
  }
  
  .user-info {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    padding: 5px 10px;
    border-radius: 4px;
    transition: all 0.3s;
    
    &:hover {
      background-color: #f5f5f5;
    }
    
    .username {
      font-size: 14px;
      color: #333;
    }
  }
}

:deep(.el-breadcrumb) {
  font-size: 14px;
}
</style>

