import { request } from '@/utils/request'

// 客户提现查询参数
export interface CustomerTixianParams {
  page: number
  limit: number
  name?: string // 客户姓名
  mobile?: string // 客户手机号
  create_time?: string // 创建时间
}

// 客户提现列表项
export interface CustomerTixianItem {
  id?: number
  batch_no?: string // 批次号
  order_no?: string // 订单号
  customer_name?: string // 客户姓名
  customer_mobile?: string // 客户手机
  payment_method?: string // 提现方式
  channel?: string // 渠道
  apply_amount?: string | number // 申请金额
  arrival_amount?: string | number // 提现金额
  support_doc?: string // 支付凭证
  bank_account?: string // 银行开户行
  bank_card?: string // 银行卡号
  alipay_account?: string // 支付宝账号
  apply_time?: string // 申请时间
  status?: number | string // 状态
  amount?: string // 总计金额（特殊字段，仅在无数据时返回）
}

// 客户提现列表响应
export interface CustomerTixianResponse {
  code: number
  msg: string
  count: number
  data: CustomerTixianItem[]
}

// 获取客户提现列表
export const getCustomerTixianListApi = (params: CustomerTixianParams) => {
  return request.get<CustomerTixianResponse>('/index/customer_tixian/getlist.html', { params })
}
