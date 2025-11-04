import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { UserInfo } from '@/types'

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
  const login = async (username: string, password: string) => {
    // 模拟登录API调用
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (username === 'admin' && password === 'admin123') {
          const mockToken = 'mock-token-' + Date.now()
          const mockUserInfo: UserInfo = {
            id: '1',
            username: 'admin',
            nickname: '超级管理员',
            avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
            role: 'admin',
            permissions: ['*']
          }
          setToken(mockToken)
          setUserInfo(mockUserInfo)
          resolve()
        } else {
          reject(new Error('账号或密码错误'))
        }
      }, 1000)
    })
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

