import { request } from '@/utils/request'

// 账单分期查询参数
export interface ArrearsParams {
  page: number
  limit: number
  status?: number | string
  qkr_user_mobile?: string
  skr_user_mobile?: string
  create_time?: string
}

// 账单分期列表项（根据其他页面推断）
export interface ArrearsItem {
  id: number
  order_no: string
  qkr_user_name: string
  qkr_user_mobile: string
  skr_user_name: string
  skr_user_mobile: string
  total_amount: string
  paid_amount: string
  unpaid_amount: string
  periods: number
  current_period: number
  status: number
  remark: string
  create_time: string
}

// 账单分期列表响应
export interface ArrearsResponse {
  code: number
  msg: string
  count: number
  data: ArrearsItem[]
}

// 获取账单分期列表
export const getArrearsListApi = (params: ArrearsParams) => {
  return request.get<ArrearsResponse>('/index/arrears/getlist.html', {
    params
  })
}
