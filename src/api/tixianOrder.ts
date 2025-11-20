import { request } from '@/utils/request'

// 用户信息
export interface TixianUserInfo {
  id: number
  mobile: string
  name: string
  alipay: string
  aliypayName: string
  wallet1: string
  wallet2: string
  wallet3: string
  // ... 其他字段
}

// 提现审核查询参数
export interface TixianOrderParams {
  page: number
  limit: number
  name?: string // 用户名
  mobile?: string // 手机号
  create_time?: string // 申请时间
  wallet?: number | string // 资金类型
}

// 提现审核列表项
export interface TixianOrderItem {
  id: number
  m_id: number
  sys_type: number
  batch_no: string
  oid: string // 订单号
  plat_order_no: string
  user_id: number
  amount: string // 申请金额
  money: string // 提现金额
  rate: string
  type: string // 资金类型
  status: number // 状态
  remark: string // 备注
  create_time: string // 申请时间
  update_time: string
  name: string // 用户
  alipayMobile: string // 手机号
  pay_type: string // 提现类型
  bank_type: number
  bank_name: string
  bank_mobile: string
  bank_code: string
  alipay_msg: string // 反馈信息
  fail_reason: string
  wallet: string // 余额
  bank_type_name: string // 渠道
  user_name: string // 用户名
  status_name: string // 状态名称
  user?: TixianUserInfo
}

// 提现审核列表响应
export interface TixianOrderResponse {
  code: number
  msg: string
  count: number
  data: TixianOrderItem[]
}

// 获取提现审核列表
export const getTixianOrderListApi = (params: TixianOrderParams) => {
  return request.get<TixianOrderResponse>('/index/tixian_order/getlist.html', { params })
}

// 审核参数
export interface AuditParams {
  id: number
  status: number // 2:通过, 3:不通过, 4:强制通过
  remark?: string
}

// 审核响应
export interface AuditResponse {
  code: number
  msg: string
  data: string
  url: string
  wait: number
}

// 提现审核
export const auditTixianOrderApi = (data: AuditParams) => {
  return request.post<AuditResponse>('/index/tixian_order/shenhe.html', data)
}
