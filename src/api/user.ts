import { request } from '@/utils/request'
import type { UserInfo, LoginForm } from '@/types'

// 登录
export const loginApi = (data: LoginForm) => {
  return request.post<{ token: string; userInfo: UserInfo }>('/user/login', data)
}

// 获取用户信息
export const getUserInfoApi = () => {
  return request.get<UserInfo>('/user/info')
}

// 登出
export const logoutApi = () => {
  return request.post('/user/logout')
}

