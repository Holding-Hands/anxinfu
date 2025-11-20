import { request } from '@/utils/request'

// 积分明细查询参数
export interface CoinLogParams {
  page: number
  limit: number
  sys_type?: number | string
  name?: string
  create_time?: string
  type?: number
}

// 积分明细列表项（根据其他页面推断）
export interface CoinLogItem {
  id: number
  sys_type: number
  sys_type_name: string
  user_name: string
  coin_before: string
  coin_change: string
  coin_after: string
  type: number
  remark: string
  create_time: string
}

// 积分明细列表响应
export interface CoinLogResponse {
  code: number
  msg: string
  count: number
  data: CoinLogItem[]
}

// 获取积分明细列表
export const getCoinLogListApi = (params: CoinLogParams) => {
  return request.get<CoinLogResponse>('/index/coin_log/getlist.html', {
    params
  })
}
