import { request } from '@/utils/request'

// 机具退货列表参数
export interface StockReturnListParams {
  page: number
  limit: number
  product_id?: number | string
  create_time?: string
  sn_begin?: string
  sn_end?: string
}

// 机具退货列表项
export interface StockReturnListItem {
  id: number
  sn: string
  pro_name: string
  create_time: string
  operator: string
  [key: string]: any
}

// 机具退货列表响应
export interface StockReturnListResponse {
  code: number
  msg: string
  count: number
  data: StockReturnListItem[]
}

// 获取机具退货列表
export const getStockReturnListApi = (params: StockReturnListParams) => {
  return request.get<StockReturnListResponse>('/index/ruku/getstocklist', { params })
}
