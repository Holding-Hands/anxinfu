import { request } from '@/utils/request'

// 系统配置响应
export interface ConfigResponse {
  code: number
  msg: string
  data: string // HTML内容
}

// 获取系统配置页面内容
export const getConfigGroupApi = (groupId: number) => {
  return request.get<ConfigResponse>(`/index/config/group/group/${groupId}.html`)
}

// 配置项
export interface ConfigItem {
  id: number
  title: string // 配置标题
  name: string // 配置名称
  value: string // 配置值
  group: number // 分组：1基本，2系统，3开发，4授权
  type: string // 类型
  options: string // 选项
  tip: string // 提示
  create_time: number
  update_time: number
  sort: number // 排序
  status: number // 状态
  m_id: number
}

// 配置列表响应
export interface ConfigListResponse {
  code: number
  msg: string
  count: number
  data: ConfigItem[]
}

// 获取配置列表
export const getConfigListApi = (params: { page: number; limit: number; group: number }) => {
  return request.get<ConfigListResponse>('/index/config/getlist.html', { params })
}

// 通用响应
export interface CommonResponse {
  code: number
  msg: string
  data: string
  url: string
  wait: number
}

// 启用配置
export const setEnableConfigApi = (data: ConfigItem[]) => {
  const formData = new URLSearchParams()
  formData.append('jsonData', JSON.stringify(data))
  return request.post<CommonResponse>('/index/config/setenable.html', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 禁用配置
export const setDisableConfigApi = (data: ConfigItem[]) => {
  const formData = new URLSearchParams()
  formData.append('jsonData', JSON.stringify(data))
  return request.post<CommonResponse>('/index/config/setdisable.html', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
