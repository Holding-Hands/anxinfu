import { request } from '@/utils/request'

// 交易流水列表参数
export interface TradeListParams {
  page: number
  limit: number
  platform_id?: string
  product_id?: string
  sys_type?: string
  user_mobile?: string
  sn?: string
  jiaoyi_time?: string
  create_time?: string
}

// 交易流水项
export interface TradeItem {
  id: number
  order_no: string
  user_id: number
  stock_id: number
  money: string
  sxf: string
  sj_sxf: string
  sn: string
  merchant_name: string
  merchant_code: string
  jiaoyi_time: string
  jiaoyi_month: number
  jiaoyi_day: number
  create_time: string
  card_type: string
  total_pay: string
  product_id: number
  sys_type: number
  sys_type_name: string
  user_name: string
  user_code: string
  yidai_name: string
  erdai_name: string
  productName: string
}

// 交易流水列表响应
export interface TradeListResponse {
  code: number
  msg: string
  count: number
  data: (TradeItem | { money: string })[]
}

// 获取交易流水列表
export const getTradeListApi = (params: TradeListParams) => {
  return request.get<TradeListResponse>('/index/trade/getlist.html', { params })
}

// 分润明细参数
export interface ProfitListParams {
  id: number
  page: number
  limit: number
}

// 分润明细项
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
  wallet: number
  product_id: number
  month: number
  day: number
  trade_id: number
  stars: number
  from_user_id: number
  create_time: string
  update_time: string | null
  username: string
  user: {
    id: number
    name: string
    mobile: string
    headimg: string
    [key: string]: any
  }
}

// 分润明细响应
export interface ProfitListResponse {
  code: number
  msg: string
  count: number
  data: ProfitItem[]
}

// 获取分润明细列表
export const getProfitListApi = (params: ProfitListParams) => {
  return request.get<ProfitListResponse>('/index/trade/getprofitlist.html', { params })
}
