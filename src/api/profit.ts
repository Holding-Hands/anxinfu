import { request } from '@/utils/request'

// 收益明细查询参数
export interface ProfitParams {
  page: number
  limit: number
  sys_type?: number | string
  product_id?: number | string
  name?: string
  sn?: string
  type?: number | string
  create_time?: string
  wallet?: number | string
}

// 收益明细列表项
export interface ProfitItem {
  id: number
  m_id: number
  sys_type: number
  user_id: number
  type: number
  pre_tax: string
  profit: string
  remark: string
  mbefore: string
  mafter: string
  money: string
  sn: string
  wallet: string
  product_id: number
  month: number
  day: number
  trade_id: number
  stars: number
  from_user_id: number
  create_time: string
  update_time: string
  sys_type_name: string
  product_name: string
  username: string
}

// 收益明细列表响应
export interface ProfitResponse {
  code: number
  msg: string
  count: number
  data: ProfitItem[]
}

// 获取收益明细列表
export const getProfitListApi = (params: ProfitParams) => {
  return request.get<ProfitResponse>('/index/profit/getlist.html', {
    params
  })
}
