import { request } from '@/utils/request'

// 机具查询列表参数
export interface StockListParams {
  page: number
  limit: number
  platform_id?: number | string
  product_id?: number | string
  sys_type?: number | string
  sn?: string
  status?: number | string
  dabiao_status?: number | string
  is_jf?: number | string
  create_time?: string
  merchant_time?: string
  huabo_time?: string
  first_time?: string
  end_time?: string
  mobile?: string
  name?: string
  mer_idcard?: string
}

// 机具列表项
export interface StockListItem {
  id: number
  m_id: number
  sys_type: number
  platform_id: number
  product_id: number
  active_id: number
  sim_id: number
  customer_id: number
  yajin_nums: number
  yajin_money: string
  is_bind: number
  name: string
  mobile: string
  kh_manage: string
  is_jf: string
  sn: string
  status: number
  user_id: number
  merchant_id: number
  huabo_time: string
  merchant_time: string
  merchant_month: number
  activation_time: string
  activation_month: number
  first_time: string
  second_time: string
  third_time: number
  dabiao_status: number
  all_money: string
  end_time: string
  is_gq: number
  is_kk: number
  kk_time: number
  is_jhkk: number
  jhkk_time: number
  create_time: string
  update_time: string | null
  apply_rate: string
  is_sim: number
  sim_money_time: number
  cs_rate: string
  cs_sm_rate: string
  new_rate: string
  jb_time: number
  jb_status: number
  mer_idcard: string
  sh_mobile: string
  sh_name: string
  pro_name: string
  sim_money: number
  username: string
  active_yajin_money: string
  sys_type_name: string
}

// 机具列表响应
export interface StockListResponse {
  code: number
  msg: string
  count: number
  data: StockListItem[]
}

// 获取机具列表
export const getStockListApi = (params: StockListParams) => {
  return request.get<StockListResponse>('/index/stock/getlist.html', { params })
}

// 修改到期时间参数
export interface ModifyExpiryParams {
  end_time: string
  stock_ids: number[]
}

// 通用响应
export interface CommonResponse {
  code: number
  msg: string
  data: string
  url: string
  wait: number
}

// 修改到期时间
export const modifyExpiryTimeApi = (data: ModifyExpiryParams) => {
  const formData = new URLSearchParams()
  formData.append('end_time', data.end_time)
  data.stock_ids.forEach((id) => {
    formData.append('stock_ids[]', String(id))
  })

  return request.post<CommonResponse>('/index/stock/end_time.html', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 修改流量费档位参数
export interface UpdateSimParams {
  sim_id: number
  stock_ids: number[]
}

// 修改流量费档位
export const updateSimTierApi = (data: UpdateSimParams) => {
  const formData = new URLSearchParams()
  formData.append('sim_id', String(data.sim_id))
  data.stock_ids.forEach((id) => {
    formData.append('stock_ids[]', String(id))
  })

  return request.post<CommonResponse>('/index/stock/update_sim.html', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
