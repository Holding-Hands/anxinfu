import { request } from '@/utils/request'

// 费率记录列表参数
export interface RateListParams {
  page: number
  limit: number
  platform_id?: string
  product_id?: string
  uName?: string
  status?: string
}

// 费率记录项
export interface RateItem {
  id: number
  m_id: number
  user_id: number
  product_id: number
  merchant_id: number
  card_price: string
  code_price: string
  jjk_price: string
  top_fee: string
  t0_money: string
  status: number
  create_time: string
  remark: string
  update_time: string | null
  order_id: string
  status_name: string
  merchant_name: string
  merchant_code: string
  sn: string
  uName: string
  pName: string
}

// 费率记录列表响应
export interface RateListResponse {
  code: number
  msg: string
  count: number
  data: RateItem[]
}

// 获取费率记录列表
export const getRateListApi = (params: RateListParams) => {
  return request.get<RateListResponse>('/index/rate_apply/getlist.html', { params })
}
