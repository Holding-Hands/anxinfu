import { request } from '@/utils/request'

// 奖品列表查询参数
export interface DrawListParams {
  page: number
  limit: number
}

// 奖品列表数据项
export interface DrawItem {
  id: number
  m_id: number
  name: string // 奖项名称
  award: string // 奖品名称
  img: string // 图片HTML字符串
  prob: number // 中奖概率
  money: string // 金额
  sort: number // 排序
  status: number // 状态 1-正常
  create_time: string
  update_time: string
}

// 奖品列表响应
export interface DrawListResponse {
  code: number
  msg: string
  count: number
  data: DrawItem[]
}

// 通用API响应接口
export interface ApiResponse {
  code: number
  msg: string
  data: string
  url: string
  wait: number
}

// 删除奖品参数
export interface DeleteDrawParams {
  jsonData: string // JSON数组字符串
}

// 获取奖品列表
export const getDrawListApi = (params: DrawListParams) => {
  return request.get<DrawListResponse>('/index/draw/getlist.html', { params })
}

// 删除奖品
export const deleteDrawApi = (data: DeleteDrawParams) => {
  const formData = new URLSearchParams()
  formData.append('jsonData', data.jsonData)

  return request.post<ApiResponse>('/index/draw/del.html', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 启用/禁用奖品参数
export interface DrawStatusParams {
  ids: number | string
}

// 启用奖品
export const enableDrawApi = (data: DrawStatusParams) => {
  const formData = new URLSearchParams()
  formData.append('ids', String(data.ids))

  return request.post<ApiResponse>('/index/draw/setenable.html', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 禁用奖品
export const disableDrawApi = (data: DrawStatusParams) => {
  const formData = new URLSearchParams()
  formData.append('ids', String(data.ids))

  return request.post<ApiResponse>('/index/draw/setdisable.html', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
