<template>
  <div class="sidebar-container">
    <div class="logo-container" :class="{ 'is-collapse': isCollapse }">
      <h1 v-if="!isCollapse" class="logo-title">安鑫付</h1>
      <h1 v-else class="logo-title-mini">安</h1>
    </div>

    <el-scrollbar class="menu-scrollbar">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :unique-opened="true"
        :collapse-transition="false"
        class="sidebar-menu"
        router
      >
        <template v-for="item in menuList" :key="item.path">
          <!-- 无子菜单 -->
          <el-menu-item v-if="!item.children || item.children.length === 0" :index="item.path">
            <el-icon>
              <component :is="item.icon" />
            </el-icon>
            <template #title>{{ item.meta.title }}</template>
          </el-menu-item>

          <!-- 有子菜单 -->
          <el-sub-menu v-else :index="item.path">
            <template #title>
              <el-icon>
                <component :is="item.icon" />
              </el-icon>
              <span>{{ item.meta.title }}</span>
            </template>

            <el-menu-item v-for="child in item.children" :key="child.path" :index="child.path">
              <template #title>{{ child.meta.title }}</template>
            </el-menu-item>
          </el-sub-menu>
        </template>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue'
import { useRoute, useRouter, type RouteRecordRaw } from 'vue-router'
import { useAppStore } from '@/stores/app'
import {
  HomeFilled,
  User,
  Goods,
  ShoppingCart,
  Printer,
  Wallet,
  Management,
  TrendCharts,
  UserFilled,
  Setting,
  Download
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()

const isCollapse = computed(() => appStore.isCollapse)
const activeMenu = computed(() => route.path)

// 图标映射
const iconMap: Record<string, Component> = {
  '/': HomeFilled,
  '/agent': User,
  '/product': Goods,
  '/mall': ShoppingCart,
  '/machine': Printer,
  '/finance': Wallet,
  '/business': Management,
  '/operation': TrendCharts,
  '/system': Setting,
  '/download': Download,
  '/customer': UserFilled
}

// 从路由自动生成菜单
const menuList = computed(() => {
  const routes = router.options.routes
  const menuMap = new Map()

  // 收集所有一级路由
  routes.forEach((r: RouteRecordRaw) => {
    // 特殊处理根路径
    if (r.path === '/') {
      if (r.children && r.children.length > 0) {
        const dashboardChild = r.children.find(
          (child: RouteRecordRaw) => child.path === 'dashboard'
        )
        if (dashboardChild && dashboardChild.meta?.title) {
          menuMap.set('/dashboard', {
            path: '/dashboard',
            meta: dashboardChild.meta,
            icon: iconMap['/'],
            children: []
          })
        }
      }
      return
    }

    // 过滤不需要显示的路由
    if (
      r.path !== '/login' &&
      !r.path.includes(':') && // 过滤动态路由如 /:pathMatch(.*)*
      r.meta?.title &&
      !r.meta?.hidden
    ) {
      const menuItem = {
        path: r.path,
        meta: r.meta,
        icon: iconMap[r.path],
        children: [] as any[]
      }

      // 收集子路由
      if (r.children && r.children.length > 0) {
        const children = r.children
          .filter(
            (child: RouteRecordRaw) => child.meta?.title && !child.meta?.hidden && child.path !== ''
          )
          .map((child: RouteRecordRaw) => ({
            path: child.path.startsWith('/') ? child.path : `${r.path}/${child.path}`,
            meta: child.meta
          }))

        if (children.length > 0) {
          menuItem.children = children
        }
      }

      menuMap.set(r.path, menuItem)
    }
  })

  // 按固定顺序排序
  const order = [
    '/dashboard',
    '/agent',
    '/product',
    '/mall',
    '/machine',
    '/finance',
    '/business',
    '/operation',
    '/system',
    '/download',
    '/customer'
  ]
  return order.map((path) => menuMap.get(path)).filter(Boolean)
})
</script>

<style scoped lang="scss">
.sidebar-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--sidebar-bg);
}

.logo-container {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--sidebar-bg);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  .logo-title {
    font-size: 24px;
    font-weight: bold;
    letter-spacing: 2px;
    margin: 0;
    color: var(--sidebar-text-active);
  }

  .logo-title-mini {
    font-size: 24px;
    font-weight: bold;
    margin: 0;
    color: var(--sidebar-text-active);
  }

  &.is-collapse {
    padding: 0;
  }
}

.menu-scrollbar {
  flex: 1;

  :deep(.el-scrollbar__view) {
    height: 100%;
  }
}

:deep(.el-menu.sidebar-menu) {
  border-right: none;
  background-color: var(--sidebar-bg);

  .el-menu-item,
  .el-sub-menu__title {
    color: var(--sidebar-text);

    &:hover {
      background-color: var(--sidebar-item-hover) !important;
      color: var(--sidebar-text-active);
    }

    .el-icon {
      color: var(--sidebar-text);
    }
  }

  .el-menu-item.is-active {
    background-color: var(--sidebar-item-hover) !important;
    color: var(--sidebar-text-active) !important;

    .el-icon {
      color: var(--sidebar-text-active);
    }
  }

  .el-sub-menu.is-active > .el-sub-menu__title {
    color: var(--sidebar-text-active);
  }

  // 子菜单容器
  .el-sub-menu {
    .el-sub-menu__title {
      &:hover {
        .el-icon {
          color: var(--sidebar-text-active);
        }
      }
    }

    .el-menu {
      background-color: var(--sidebar-bg) !important;
    }

    .el-menu-item {
      min-width: 0;
      background-color: var(--sidebar-bg) !important;
      color: var(--sidebar-text);
      padding-left: 50px !important;

      &:hover {
        background-color: var(--sidebar-item-hover) !important;
        color: var(--sidebar-text-active) !important;
      }

      &.is-active {
        background-color: var(--sidebar-item-hover) !important;
        color: var(--sidebar-text-active) !important;
        font-weight: 500;
      }
    }
  }
}
</style>
