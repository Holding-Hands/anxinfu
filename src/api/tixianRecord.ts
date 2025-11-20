import { request } from '@/utils/request'

// 提现记录查询参数
export interface TixianRecordParams {
  page: number
  limit: number
  name?: string
  mobile?: string
  create_time?: string
  wallet?: number | string
}

// 提现记录列表项
export interface TixianRecordItem {
  id: number
  m_id: number
  sys_type: number
  batch_no: string
  oid: string
  plat_order_no: string
  user_id: number
  amount: string
  money: string
  rate: string
  type: string
  status: number
  remark: string
  create_time: string
  update_time: string
  name: string
  alipayMobile: string
  pay_type: string
  bank_type: number
  bank_name: string
  bank_mobile: string
  bank_code: string
  alipay_msg: string | null
  fail_reason: string
  wallet: string
  user_name: string
  status_name: string
  user: {
    id: number
    mobile: string
    name: string
    idcard_address: string
    [key: string]: any
  } | null
}

// 提现记录列表响应
export interface TixianRecordResponse {
  code: number
  msg: string
  count: number
  data: TixianRecordItem[]
}

// 获取提现记录列表
export const getTixianRecordListApi = (params: TixianRecordParams) => {
  return request.get<TixianRecordResponse>('/index/tixian_order/getyishenhelist.html', {
    params
  })
}
