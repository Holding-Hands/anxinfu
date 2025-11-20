import { request } from '@/utils/request'

// 抽奖积分查询参数
export interface PointLogParams {
  page: number
  limit: number
  sys_type?: number | string // 模式
  name?: string // 姓名
  create_time?: string // 创建时间
  type?: number | string // 类型
}

// 抽奖积分列表项
export interface PointLogItem {
  id: number
  sys_type: number
  sys_type_name?: string
  name: string
  mobile?: string
  type: number
  type_name?: string
  point_num?: number // 积分数量
  before_point?: number // 变动前积分
  after_point?: number // 变动后积分
  remark?: string // 备注
  create_time: string
}

// 抽奖积分列表响应
export interface PointLogResponse {
  code: number
  msg: string
  count: number
  data: PointLogItem[]
}

// 获取抽奖积分列表
export const getPointLogListApi = (params: PointLogParams) => {
  return request.get<PointLogResponse>('/index/point_log/getlist.html', { params })
}
