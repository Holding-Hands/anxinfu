import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import router from '@/router'

// 创建axios实例
const service: AxiosInstance = axios.create({
  // 开发环境使用代理，生产环境使用 /api 前缀（通过 Vercel rewrites 代理）
  baseURL: import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? '' : '/api'),
  timeout: 15000,
  withCredentials: true, // 始终携带Cookie
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    'X-Requested-With': 'XMLHttpRequest' // 告诉后端这是 Ajax 请求，返回 JSON 而不是 HTML
  }
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 注意：此系统使用 Session Cookie (PHPSESSID) 进行身份验证
    // 不需要添加 Bearer Token，Cookie 会自动携带
    // withCredentials: true 已在 axios 实例中配置
    console.log('请求拦截器 - 请求配置:', config.url)
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
    console.log('响应拦截器 - URL:', response.config.url)
    console.log('响应拦截器 - Content-Type:', response.headers['content-type'])
    console.log('响应拦截器 - 原始响应:', res)

    // 注意：不同接口的成功状态码不同
    // - 列表查询接口：code: 0 表示成功
    // - 新增/编辑/删除接口：code: 1 表示成功，code: 0 表示失败
    // 因此这里不做统一判断，由各个接口自己处理

    // 只处理特殊错误状态码
    if (res && typeof res.code !== 'undefined') {
      // 401: 未授权，token过期
      if (res.code === 401) {
        ElMessage.error('登录状态已失效，请重新登录')
        const userStore = useUserStore()
        userStore.logout()
        router.push('/login')
        return Promise.reject(new Error('未授权'))
      }
    }

    // 检查 data 是否为空字符串，如果是则提示 msg
    if (res && res.data === '' && res.msg) {
      ElMessage.warning(`${res.msg}，请重新登录！`)
      const userStore = useUserStore()
      userStore.logout()
      setTimeout(() => {
        router.push('/login')
      }, 1500) // 延迟1.5秒，让用户看到提示消息
    }

    // 返回原始响应数据，由各接口自己判断 code
    console.log('响应拦截器 - 返回数据:', res)
    return res
  },
  (error) => {
    console.error('Response error:', error)

    let message = '请求失败'
    if (error.response) {
      switch (error.response.status) {
        case 302: {
          message = '请先登录系统'
          const userStore = useUserStore()
          userStore.logout()
          router.push('/login')
          break
        }
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
  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.get(url, config)
  },

  post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return service.post(url, data, config)
  },

  put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return service.put(url, data, config)
  },

  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.delete(url, config)
  }
}

export default service
