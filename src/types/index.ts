// 用户信息类型
export interface UserInfo {
  id: string
  username: string
  nickname: string
  avatar?: string
  role: string
  permissions: string[]
}

// 登录表单类型
export interface LoginForm {
  username: string
  password: string
  code?: string
  remember?: boolean
}

// API响应类型
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

// 菜单项类型
export interface MenuItem {
  id: string
  name: string
  path: string
  icon?: string
  children?: MenuItem[]
  meta?: {
    title: string
    hidden?: boolean
    keepAlive?: boolean
  }
}

// 统计数据类型
export interface StatisticsData {
  订单总数: number
  待付款订单: number
  盟友总数: number
  后台管理员: number
  本月增加: number
}

