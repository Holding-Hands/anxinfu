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
      title: '盟友管理',
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
        path: 'list-v1',
        name: 'ListV1',
        component: () => import('@/views/agent/ListV1.vue'),
        meta: {
          title: '1.0盟友结算价'
        }
      },
      {
        path: 'agent-flow-policy',
        name: 'AgentFlowPolicy',
        component: () => import('@/views/agent/AgentFlowPolicy.vue'),
        meta: {
          title: '代理流量费政策'
        }
      },
      {
        path: 'ally-summary',
        name: 'AllySummary',
        component: () => import('@/views/agent/AllySummary.vue'),
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
    ]
  },
  {
    path: '/product',
    component: () => import('@/layout/index.vue'),
    redirect: '/product/platform',
    meta: {
      title: '产品管理',
      icon: 'Goods'
    },
    children: [
      {
        path: 'platform',
        name: 'PlatformManage',
        component: () => import('@/views/product/PlatformManage.vue'),
        meta: {
          title: '平台管理'
        }
      },
      {
        path: 'list',
        name: 'ProductList',
        component: () => import('@/views/product/ProductList.vue'),
        meta: {
          title: '产品列表'
        }
      },
      {
        path: 'deposit-policy',
        name: 'DepositPolicy',
        component: () => import('@/views/product/DepositPolicy.vue'),
        meta: {
          title: '押金政策'
        }
      },
      {
        path: 'traffic-policy',
        name: 'TrafficPolicy',
        component: () => import('@/views/product/TrafficPolicy.vue'),
        meta: {
          title: '流量费政策'
        }
      },
      {
        path: 'settle-rise-price',
        name: 'SettleRisePrice',
        component: () => import('@/views/product/SettleRisePrice.vue'),
        meta: {
          title: '上涨结算价'
        }
      },
      {
        path: 'product-rise-price',
        name: 'ProductRisePrice',
        component: () => import('@/views/product/ProductRisePrice.vue'),
        meta: {
          title: '涨价分成'
        }
      }
    ]
  },
  {
    path: '/mall',
    component: () => import('@/layout/index.vue'),
    redirect: '/mall/goods-category',
    meta: {
      title: '商城系统',
      icon: 'ShoppingCart'
    },
    children: [
      {
        path: 'goods-category',
        name: 'GoodsCategory',
        component: () => import('@/views/mall/GoodsCategory.vue'),
        meta: {
          title: '商品分类'
        }
      },
      {
        path: 'goods-list',
        name: 'GoodsList',
        component: () => import('@/views/mall/GoodsList.vue'),
        meta: {
          title: '商品列表'
        }
      },
      {
        path: 'order-list',
        name: 'OrderList',
        component: () => import('@/views/mall/OrderList.vue'),
        meta: {
          title: '订单列表'
        }
      },
      {
        path: 'proxy-order',
        name: 'ProxyOrder',
        component: () => import('@/views/mall/ProxyOrder.vue'),
        meta: {
          title: '代下订单'
        }
      }
    ]
  },
  {
    path: '/machine',
    component: () => import('@/layout/index.vue'),
    redirect: '/machine/stock-query',
    meta: {
      title: '机具管理',
      icon: 'Printer'
    },
    children: [
      {
        path: 'stock-query',
        name: 'StockQuery',
        component: () => import('@/views/machine/StockQuery.vue'),
        meta: {
          title: '机具查询'
        }
      },
      {
        path: 'ruku-list',
        name: 'RukuList',
        component: () => import('@/views/machine/RukuList.vue'),
        meta: {
          title: '入库/减库'
        }
      },
      {
        path: 'stock-return',
        name: 'StockReturn',
        component: () => import('@/views/machine/StockReturn.vue'),
        meta: {
          title: '机具退货',
          hidden: true
        }
      },
      {
        path: 'transfer-log',
        name: 'TransferLog',
        component: () => import('@/views/machine/TransferLog.vue'),
        meta: {
          title: '划拨记录'
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
    path: '/system',
    component: () => import('@/layout/index.vue'),
    redirect: '/system/permission',
    meta: {
      title: '系统设置',
      icon: 'Setting'
    },
    children: [
      {
        path: 'permission',
        name: 'PermissionManage',
        component: () => import('@/views/system/PermissionManage.vue'),
        meta: {
          title: '权限管理'
        }
      },
      {
        path: 'employee',
        name: 'EmployeeManage',
        component: () => import('@/views/system/EmployeeManage.vue'),
        meta: {
          title: '员工设置'
        }
      },
      {
        path: 'team-info',
        name: 'TeamInfo',
        component: () => import('@/views/system/TeamInfo.vue'),
        meta: {
          title: '团队信息'
        }
      },
      {
        path: 'operation-log',
        name: 'OperationLog',
        component: () => import('@/views/system/OperationLog.vue'),
        meta: {
          title: '操作日志'
        }
      },
      {
        path: 'config',
        name: 'SystemConfig',
        component: () => import('@/views/system/SystemConfig.vue'),
        meta: {
          title: '系统设置'
        }
      },
      {
        path: 'config-manage',
        name: 'ConfigManage',
        component: () => import('@/views/system/ConfigManage.vue'),
        meta: {
          title: '配置管理'
        }
      }
    ]
  },
  {
    path: '/download',
    component: () => import('@/layout/index.vue'),
    redirect: '/download/record',
    meta: {
      title: '下载中心',
      icon: 'Download'
    },
    children: [
      {
        path: 'record',
        name: 'DownloadRecord',
        component: () => import('@/views/DownloadRecord.vue'),
        meta: {
          title: '下载记录'
        }
      }
    ]
  },
  {
    path: '/customer',
    component: () => import('@/layout/index.vue'),
    redirect: '/customer/list',
    meta: {
      title: '客户管理',
      icon: 'UserFilled'
    },
    children: [
      {
        path: 'list',
        name: 'CustomerList',
        component: () => import('@/views/customer/CustomerList.vue'),
        meta: {
          title: '客户列表'
        }
      },
      {
        path: 'fund-details',
        name: 'CustomerFundDetails',
        component: () => import('@/views/customer/CustomerFundDetails.vue'),
        meta: {
          title: '客户资金明细'
        }
      },
      {
        path: 'draw-list',
        name: 'DrawList',
        component: () => import('@/views/customer/DrawList.vue'),
        meta: {
          title: '奖品设置'
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
