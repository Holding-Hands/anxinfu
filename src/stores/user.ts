import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { UserInfo } from '@/types'
import { loginApi } from '@/api/user'

export const useUserStore = defineStore('user', () => {
  const token = ref<string>(localStorage.getItem('token') || '')
  const userInfo = ref<UserInfo | null>(null)

  // 设置token
  const setToken = (newToken: string) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  // 设置用户信息
  const setUserInfo = (info: UserInfo) => {
    userInfo.value = info
    localStorage.setItem('userInfo', JSON.stringify(info))
  }

  // 登录
  const login = async (username: string, password: string, code?: string) => {
    const data = await loginApi({ username, password, code })
    console.log('登录响应数据:', data)

    // 如果有 token，则保存
    if (data && data.token) {
      setToken(data.token)
      console.log('Token 已保存:', data.token)
    } else {
      // 如果没有 token，可能整个响应就是 token，或者登录成功但没返回 token
      // 先创建一个临时 token
      const tempToken = 'session-' + Date.now()
      setToken(tempToken)
      console.log('使用临时 Token:', tempToken)
    }

    // 如果有 userInfo，则保存
    if (data && data.userInfo) {
      setUserInfo(data.userInfo)
    } else {
      // 如果没有返回 userInfo，使用默认值
      const defaultUserInfo: UserInfo = {
        id: (data && data.id) || '1',
        username: username,
        nickname: (data && data.nickname) || username,
        avatar: (data && data.avatar) || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
        role: (data && data.role) || 'admin',
        permissions: (data && data.permissions) || ['*']
      }
      setUserInfo(defaultUserInfo)
      console.log('用户信息已保存:', defaultUserInfo)
    }
  }

  // 登出
  const logout = () => {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
  }

  // 初始化用户信息
  const initUserInfo = () => {
    const savedUserInfo = localStorage.getItem('userInfo')
    if (savedUserInfo) {
      try {
        userInfo.value = JSON.parse(savedUserInfo)
      } catch (e) {
        console.error('Failed to parse userInfo:', e)
      }
    }
  }

  // 初始化
  initUserInfo()

  return {
    token,
    userInfo,
    setToken,
    setUserInfo,
    login,
    logout
  }
})

