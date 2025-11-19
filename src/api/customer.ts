import { request } from '@/utils/request'

// 客户列表查询参数
export interface CustomerListParams {
  page: number
  limit: number
  mobile?: string // 手机号
  name?: string // 姓名
  ids_num?: string // 身份证号
  sn?: string // SN号
}

// 客户列表数据项
export interface CustomerListItem {
  id: number
  m_id: number
  user_code: string
  user_id: number
  pid: number
  stock_id: number
  mobile: string // 手机号
  name: string // 姓名
  money: string // 余额
  point: string // 积分
  is_auth: number // 实名状态 0-未认证 1-已实名
  status: number // 状态 1-正常 0-禁用
  is_tixian: number // 是否可提现 0-否 1-是
  token: string
  expire_time: number
  password: string
  ids_num: string // 身份证号
  idcard_start_time: string // 身份证开始时间
  idcard_end_time: string // 身份证结束时间
  positiveImage: string // 身份证正面
  oppositeImage: string // 身份证反面
  idcard_address: string // 身份证地址
  auth_time: number // 认证时间
  bank_img: string
  bank_name: string // 银行名称
  bank_code: string // 银行卡号
  bank_mobile: string // 银行预留手机号
  alipay: string // 支付宝账号
  aliypayName: string // 支付宝姓名
  province: string // 省
  city: string // 市
  county: string // 区
  address_code: string // 地址编码
  is_upload_idcard: number
  is_bind_wallet: number
  js_user_id: string
  is_sign: number
  is_cloudgain: number
  contracts: unknown
  create_time: string // 创建时间
  update_time: string // 更新时间
  sn: string // SN号
}

// 客户列表响应
export interface CustomerListResponse {
  code: number
  msg: string
  count: number
  data: CustomerListItem[]
}

// 获取客户列表
export const getCustomerListApi = (params: CustomerListParams) => {
  return request.get<CustomerListResponse>('/index/customer/getlist.html', { params })
}

// 通用API响应接口
export interface ApiResponse {
  code: number
  msg: string
  data: string
  url: string
  wait: number
}

// 启用客户参数
export interface EnableCustomerParams {
  jsonData: string // JSON数组字符串
}

// 启用客户
export const enableCustomerApi = (data: EnableCustomerParams) => {
  const formData = new URLSearchParams()
  formData.append('jsonData', data.jsonData)

  return request.post<ApiResponse>('/index/customer/setenable.html', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 禁用客户
export const disableCustomerApi = (data: EnableCustomerParams) => {
  const formData = new URLSearchParams()
  formData.append('jsonData', data.jsonData)

  return request.post<ApiResponse>('/index/customer/setdisable.html', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 操作钱包余额参数
export interface OperateCustomerWalletParams {
  id: number // 客户ID
  money: number // 操作金额（正数为增加，负数为扣除）
  remark: string // 备注
}

// 操作客户钱包余额
export const operateCustomerWalletApi = (data: OperateCustomerWalletParams) => {
  const formData = new URLSearchParams()
  formData.append('id', String(data.id))
  formData.append('money', String(data.money))
  formData.append('remark', data.remark)

  return request.post<ApiResponse>('/index/customer/kou_kuan_wallet.html', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 操作积分参数
export interface OperateCustomerPointParams {
  id: number // 客户ID
  money: number // 操作积分（正数为增加，负数为扣除）
  remark: string // 备注
}

// 操作客户积分
export const operateCustomerPointApi = (data: OperateCustomerPointParams) => {
  const formData = new URLSearchParams()
  formData.append('id', String(data.id))
  formData.append('money', String(data.money))
  formData.append('remark', data.remark)

  return request.post<ApiResponse>('/index/customer/kou_kuan_point.html', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 客户资金明细查询参数
export interface CustomerProfitListParams {
  page: number
  limit: number
  product_id?: number | string
  name?: string
  sn?: string
  type?: number | string
  create_time?: string // 时间范围
}

// 客户资金明细数据项
export interface CustomerProfitListItem {
  id?: number
  m_id?: number
  customer_id?: number
  type?: number
  pre_tax?: string
  profit: string
  remark?: string
  mbefore?: string
  mafter?: string
  sn?: string
  product_id?: number
  month?: number
  day?: number
  trade_id?: number
  create_time?: string
  update_time?: string | null
  product_name?: string
  customer_name?: string
  customer_mobile?: string
  [key: string]: any // 允许其他字段，如合计行
}

// 客户资金明细响应
export interface CustomerProfitListResponse {
  code: number
  msg: string
  count: number
  data: CustomerProfitListItem[]
}

// 获取客户资金明细列表
export const getCustomerProfitListApi = (params: CustomerProfitListParams) => {
  return request.get<CustomerProfitListResponse>('/index/customer_profit/getlist.html', { params })
}
