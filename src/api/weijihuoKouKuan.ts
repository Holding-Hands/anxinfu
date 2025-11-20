import { request } from '@/utils/request'

// 伪激活扣款状态查询参数
export interface WeijihuoListParams {
  page: number
  limit: number
  platform_id?: number | string
  product_id?: number | string
  sys_type?: number | string
  sn?: string
  status?: number | string
  create_time?: string
}

// 伪激活扣款状态列表项
export interface WeijihuoListItem {
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
}

// 伪激活扣款状态列表响应
export interface WeijihuoListResponse {
  code: number
  msg: string
  count: number
  data: WeijihuoListItem[]
}

// 获取伪激活扣款状态列表
export const getWeijihuoListApi = (params: WeijihuoListParams) => {
  return request.get<WeijihuoListResponse>('/index/stock/getwlist.html', { params })
}
