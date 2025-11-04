<template>
  <div class="sidebar-container">
    <div class="logo-container" :class="{ 'is-collapse': isCollapse }">
      <h1 v-if="!isCollapse" class="logo-title">安心付</h1>
      <h1 v-else class="logo-title-mini">安</h1>
    </div>

    <el-scrollbar class="menu-scrollbar">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :unique-opened="true"
        :collapse-transition="false"
        background-color="#ffffff"
        text-color="#333333"
        active-text-color="#409EFF"
        router
      >
        <template v-for="item in menuList" :key="item.path">
          <!-- 无子菜单 -->
          <el-menu-item
            v-if="!item.children || item.children.length === 0"
            :index="item.path"
          >
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

            <el-menu-item
              v-for="child in item.children"
              :key="child.path"
              :index="child.path"
            >
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
  Setting
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
    meta: { title: '代理商管理' },
    children: [
      { path: '/agent/ally-list', meta: { title: '2.0盟友列表' } },
      { path: '/agent/withdraw', meta: { title: '盟友业绩汇总' } },
      { path: '/agent/business', meta: { title: '盟友业绩' } },
      { path: '/agent/daily', meta: { title: '每天业绩' } }
    ]
  },
  {
    path: '/product',
    icon: Goods,
    meta: { title: '产品管理' }
  },
  {
    path: '/mall',
    icon: ShoppingCart,
    meta: { title: '商城系统' }
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
    path: '/team',
    icon: UserFilled,
    meta: { title: '团队管理' }
  },
  {
    path: '/system',
    icon: Setting,
    meta: { title: '系统设置' }
  }
]
</script>

<style scoped lang="scss">
.sidebar-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.logo-container {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  border-bottom: 1px solid #e8e8e8;

  .logo-title {
    font-size: 24px;
    font-weight: bold;
    letter-spacing: 2px;
    margin: 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .logo-title-mini {
    font-size: 24px;
    font-weight: bold;
    margin: 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
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

:deep(.el-menu) {
  border-right: none;

  .el-menu-item,
  .el-sub-menu__title {
    &:hover {
      background-color: #f5f7fa !important;
    }
  }

  .el-menu-item.is-active {
    background-color: #ecf5ff !important;
    color: #409EFF !important;
  }
}
</style>

