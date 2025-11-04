import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

// 创建axios实例
const service: AxiosInstance = axios.create({
  // 开发环境使用代理，生产环境使用完整URL
  baseURL: import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? '' : 'https://axf.anxinfupp.com'),
  timeout: 15000,
  withCredentials: true, // 携带Cookie
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    // 添加token
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`
    }
    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data
    console.log('响应拦截器 - 原始响应:', res)

    // 如果响应数据有 code 字段，按照标准 API 响应处理
    if (res && typeof res.code !== 'undefined') {
      // 如果返回的状态码不是200和1和0，则为错误 (兼容不同的成功状态码)
      if (res.code !== 200 && res.code !== 1 && res.code !== 0) {
        ElMessage.error(res.message || res.msg || '请求失败')

        // 401: 未授权，token过期
        if (res.code === 401) {
          const userStore = useUserStore()
          userStore.logout()
          window.location.href = '/login'
        }

        return Promise.reject(new Error(res.message || res.msg || '请求失败'))
      }

      // 返回实际数据
      // const result = res.data !== undefined ? res.data : res
      const result = res
      console.log('响应拦截器 - 处理后数据:', result)
      return result
    }

    // 如果没有 code 字段，直接返回响应数据
    console.log('响应拦截器 - 直接返回:', res)
    return res
  },
  (error) => {
    console.error('Response error:', error)

    let message = '请求失败'
    if (error.response) {
      switch (error.response.status) {
        case 302:
          message = '请先登录系统'
          const userStore = useUserStore()
          userStore.logout()
          window.location.href = '/login'
          break
        case 401:
          message = '未授权，请重新登录'
          break
        case 403:
          message = '拒绝访问'
          break
        case 404:
          message = '请求地址不存在'
          break
        case 500:
          message = '服务器内部错误'
          break
        default:
          message = error.response.data?.message || '请求失败'
      }
    } else if (error.message) {
      if (error.message.includes('timeout')) {
        message = '请求超时'
      } else if (error.message.includes('Network Error')) {
        message = '网络错误'
      }
    }

    ElMessage.error(message)
    return Promise.reject(error)
  }
)

// 封装请求方法
export const request = {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.get(url, config)
  },

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return service.post(url, data, config)
  },

  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return service.put(url, data, config)
  },

  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.delete(url, config)
  }
}

export default service

