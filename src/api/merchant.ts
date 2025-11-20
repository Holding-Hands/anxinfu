import { request } from '@/utils/request'

// 商户列表接口参数
export interface MerchantListParams {
  page: number
  limit: number
  platform_id?: string
  product_id?: string
  sys_type?: string
  user_name?: string
  merchant_code?: string
  merchant_name?: string
  sn?: string
  status?: string
  mer_time?: string
}

// 商户数据项
export interface MerchantItem {
  id: number
  sys_type: number
  name: string
  mobile: string
  merchant_code: string
  merchant_name: string
  sn: string
  mer_time: string
  product_id: string
  status: number
  platform_id: string
  last_jiaoyi_time: string
  m_type: number
  user_name: string
  user_mobile: string
  m_type_name: string
  sys_type_name: string
  status_name: string
  cm_days: number | string
}

// 商户列表响应
export interface MerchantListResponse {
  code: number
  msg: string
  count: number
  data: MerchantItem[]
}

// 获取商户列表
export const getMerchantListApi = (params: MerchantListParams) => {
  return request.get<MerchantListResponse>('/index/merchant/getlist.html', { params })
}

// 获取盟友列表（用于商户转移）
export interface TransferUserListParams {
  page: number
  limit: number
  name?: string
  mobile?: string
}

export interface TransferUserItem {
  id: number
  mobile: string
  name: string
  headimg: string
  user_code: string
  level: number
  wallet1: string
  wallet2: string
  wallet3: string
}

export interface TransferUserListResponse {
  code: number
  msg: string
  count: number
  data: TransferUserItem[]
}

export const getTransferUserListApi = (params: TransferUserListParams) => {
  return request.get<TransferUserListResponse>('/index/merchant/getuserlist.html', { params })
}

// 商户转移
export interface TransferMerchantParams {
  id: number // 商户ID
  user_id: number // 转移到的盟友ID
}

export interface TransferMerchantResponse {
  code: number
  msg: string
  data: string
  url: string
  wait: number
}

export const transferMerchantApi = (params: TransferMerchantParams) => {
  return request.post<TransferMerchantResponse>('/index/merchant/change_merchant.html', params)
}

// 商户解绑
export interface UnbindMerchantParams {
  id: number // 商户ID
}

export interface UnbindMerchantResponse {
  code: number
  msg: string
  data: string
  url: string
  wait: number
}

export const unbindMerchantApi = (params: UnbindMerchantParams) => {
  return request.post<UnbindMerchantResponse>('/index/merchant/unbind.html', params)
}
