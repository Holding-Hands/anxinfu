import { request } from '@/utils/request'

// 抽奖记录查询参数
export interface DrawLogParams {
  page: number
  limit: number
  user_name?: string // 姓名
  create_time?: string // 创建时间
}

// 抽奖记录列表项
export interface DrawLogItem {
  id: number
  user_name: string
  user_mobile?: string
  prize_name: string // 奖品名称
  prize_image?: string // 奖品图片
  status?: number | string // 状态
  remark?: string // 备注
  create_time: string // 创建时间
}

// 抽奖记录列表响应
export interface DrawLogResponse {
  code: number
  msg: string
  count: number
  data: DrawLogItem[]
}

// 获取抽奖记录列表
export const getDrawLogListApi = (params: DrawLogParams) => {
  return request.get<DrawLogResponse>('/index/drawlog/getlist.html', { params })
}
