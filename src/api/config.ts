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
