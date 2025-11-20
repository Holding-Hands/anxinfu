import { request } from '@/utils/request'

// 未激活扣款查询参数
export interface WeijihuoKouKuan2Params {
  page: number
  limit: number
  platform_id?: number | string
  product_id?: number | string
  sys_type?: number | string
  sn?: string
  status?: number | string
  create_time?: string
}

// 未激活扣款列表项
export interface WeijihuoKouKuan2Item {
  id: number
  platform_id: number
  product_id: number
  sys_type: number
  sn: string
  status: number
  create_time: string
  platform_name?: string
  product_name?: string
  sys_type_name?: string
  username?: string
  mobile?: string
  merchant_time?: string
  kouKuan_time?: string
  kouKuan_money?: string
  yajin_money?: string
  sim_money?: string
}

// 未激活扣款列表响应
export interface WeijihuoKouKuan2Response {
  code: number
  msg: string
  count: number
  data: WeijihuoKouKuan2Item[]
}

// 获取未激活扣款列表
export const getWeijihuoKouKuan2ListApi = (params: WeijihuoKouKuan2Params) => {
  return request.get<WeijihuoKouKuan2Response>('/index/stock/jhkklist.html', { params })
}
