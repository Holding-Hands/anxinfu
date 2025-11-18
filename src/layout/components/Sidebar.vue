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
import { computed } from 'vue'
import { useRoute } from 'vue-router'
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
const appStore = useAppStore()

const isCollapse = computed(() => appStore.isCollapse)
const activeMenu = computed(() => route.path)

// 菜单列表
const menuList = [
  {
    path: '/',
    icon: HomeFilled,
    meta: { title: '主页' }
  },
  {
    path: '/agent',
    icon: User,
    meta: { title: '盟友管理' },
    children: [
      { path: '/agent/ally-list', meta: { title: '2.0盟友列表' } },
      { path: '/agent/ally-list-10', meta: { title: '1.0盟友列表' } },
      { path: '/agent/list-v1', meta: { title: '1.0盟友结算价' } },
      { path: '/agent/agent-flow-policy', meta: { title: '代理流量费政策' } },
      { path: '/agent/ally-summary', meta: { title: '盟友业绩汇总' } },
      { path: '/agent/business', meta: { title: '盟友业绩' } },
      { path: '/agent/daily', meta: { title: '每天业绩' } }
    ]
  },
  {
    path: '/product',
    icon: Goods,
    meta: { title: '产品管理' },
    children: [
      { path: '/product/platform', meta: { title: '平台管理' } },
      { path: '/product/list', meta: { title: '产品列表' } },
      { path: '/product/deposit-policy', meta: { title: '押金政策' } },
      { path: '/product/traffic-policy', meta: { title: '流量费政策' } },
      { path: '/product/settle-rise-price', meta: { title: '上涨结算价' } },
      { path: '/product/product-rise-price', meta: { title: '涨价分成' } }
    ]
  },
  {
    path: '/mall',
    icon: ShoppingCart,
    meta: { title: '商城系统' },
    children: [
      { path: '/mall/goods-category', meta: { title: '商品分类' } },
      { path: '/mall/goods-list', meta: { title: '商品列表' } },
      { path: '/mall/order-list', meta: { title: '订单列表' } },
      { path: '/mall/proxy-order', meta: { title: '代下订单' } }
    ]
  },
  {
    path: '/machine',
    icon: Printer,
    meta: { title: '机具管理' }
  },
  {
    path: '/finance',
    icon: Wallet,
    meta: { title: '财务管理' }
  },
  {
    path: '/business',
    icon: Management,
    meta: { title: '业务管理' }
  },
  {
    path: '/operation',
    icon: TrendCharts,
    meta: { title: '运营管理' }
  },
  {
    path: '/system',
    icon: Setting,
    meta: { title: '系统设置' },
    children: [{ path: '/system/permission', meta: { title: '权限管理' } }]
  },
  {
    path: '/download',
    icon: Download,
    meta: { title: '下载中心' },
    children: [{ path: '/download/record', meta: { title: '下载记录' } }]
  },
  {
    path: '/customer',
    icon: UserFilled,
    meta: { title: '客户管理' }
  }
]
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
