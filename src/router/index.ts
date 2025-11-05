import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

// 路由配置
const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: {
      title: '登录',
      hidden: true
    }
  },
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: {
          title: '控制台',
          icon: 'HomeFilled'
        }
      }
    ]
  },
  {
    path: '/agent',
    component: () => import('@/layout/index.vue'),
    redirect: '/agent/ally-list',
    meta: {
      title: '代理商管理',
      icon: 'User'
    },
    children: [
      {
        path: 'ally-list',
        name: 'AllyList',
        component: () => import('@/views/agent/AllyList.vue'),
        meta: {
          title: '2.0盟友列表'
        }
      },
      {
        path: 'ally-list-10',
        name: 'AllyList10',
        component: () => import('@/views/agent/AllyList10.vue'),
        meta: {
          title: '1.0盟友列表'
        }
      },
      {
        path: 'withdraw',
        name: 'AgentWithdraw',
        component: () => import('@/views/agent/Withdraw.vue'),
        meta: {
          title: '盟友业绩汇总'
        }
      },
      {
        path: 'business',
        name: 'AgentBusiness',
        component: () => import('@/views/agent/Business.vue'),
        meta: {
          title: '盟友业绩'
        }
      },
      {
        path: 'daily',
        name: 'AgentDaily',
        component: () => import('@/views/agent/Daily.vue'),
        meta: {
          title: '每天业绩'
        }
      }
      // {
      //   path: 'level-v2',
      //   name: 'AgentLevelV2',
      //   component: () => import('@/views/agent/LevelV2.vue'),
      //   meta: {
      //     title: '代理等级2.0'
      //   }
      // },
      // {
      //   path: 'level-v1',
      //   name: 'AgentLevelV1',
      //   component: () => import('@/views/agent/LevelV1.vue'),
      //   meta: {
      //     title: '代理结算价1.0'
      //   }
      // }
    ]
  },
  {
    path: '/product',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '',
        name: 'Product',
        component: () => import('@/views/Product.vue'),
        meta: {
          title: '产品管理'
        }
      }
    ]
  },
  {
    path: '/mall',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '',
        name: 'Mall',
        component: () => import('@/views/Mall.vue'),
        meta: {
          title: '商城系统'
        }
      }
    ]
  },
  {
    path: '/machine',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '',
        name: 'Machine',
        component: () => import('@/views/Machine.vue'),
        meta: {
          title: '机具管理'
        }
      }
    ]
  },
  {
    path: '/finance',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '',
        name: 'Finance',
        component: () => import('@/views/Finance.vue'),
        meta: {
          title: '财务管理'
        }
      }
    ]
  },
  {
    path: '/business',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '',
        name: 'Business',
        component: () => import('@/views/Business.vue'),
        meta: {
          title: '业务管理'
        }
      }
    ]
  },
  {
    path: '/operation',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '',
        name: 'Operation',
        component: () => import('@/views/Operation.vue'),
        meta: {
          title: '运营管理'
        }
      }
    ]
  },
  {
    path: '/team',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '',
        name: 'Team',
        component: () => import('@/views/Team.vue'),
        meta: {
          title: '团队管理'
        }
      }
    ]
  },
  {
    path: '/system',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '',
        name: 'System',
        component: () => import('@/views/System.vue'),
        meta: {
          title: '系统设置'
        }
      }
    ]
  },
  {
    path: '/profile',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '',
        name: 'Profile',
        component: () => import('@/views/Profile.vue'),
        meta: {
          title: '个人中心',
          hidden: true
        }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: {
      title: '404',
      hidden: true
    }
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHashHistory(), // 使用 Hash 模式以支持 GitHub Pages
  routes
})

// 路由守卫
router.beforeEach((to, _from, next) => {
  const userStore = useUserStore()
  const token = userStore.token

  // 设置页面标题
  document.title = `${to.meta.title || '页面'} - 安鑫付后台管理系统`

  // 白名单
  const whiteList = ['/login']

  if (token) {
    // 已登录
    if (to.path === '/login') {
      // 已登录，跳转到首页
      next({ path: '/' })
    } else {
      next()
    }
  } else {
    // 未登录
    if (whiteList.includes(to.path)) {
      next()
    } else {
      ElMessage.warning('请先登录')
      next(`/login?redirect=${to.path}`)
    }
  }
})

export default router
