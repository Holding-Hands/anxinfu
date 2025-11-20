import { request } from '@/utils/request'

// 划拨记录列表参数
export interface TransferLogParams {
  page: number
  limit: number
  product_id?: number | string
  create_time?: string
  sn_str?: string
}

// 用户信息
export interface UserInfo {
  id: number
  m_id: number
  pid: number
  pid_str: string
  pid_y: number
  pid_str_y: string
  is_tjj: number
  profit_ratio: string
  user_type: string
  mobile: string
  password: string
  name: string
  company: string
  headimg: string
  user_code: string
  is_auth: number
  status: number
  token: string
  expire_time: number
  alipay: string
  aliypayName: string
  wallet1: string
  wallet2: string
  wallet3: string
  leiji_wallet: string
  forz_acc_amt: number
  coin: string
  point: string
  is_tixian: number
  wallet_status: number
  level: number
  level_month: number
  create_time: string | null
  auth_time: number
  update_time: string
  ids_num: string
  ids_term_validity: string | null
  bank_name: string
  bank_code: string
  bank_img: string
  bank_mobile: string
  bestImage: string | null
  positiveImage: string
  oppositeImage: string
  province: string
  city: string
  county: string
  address_code: string
  user_id: string
  is_upload_idcard: number
  is_bind_wallet: number
  is_sign: number
  contracts: string | null
  jgid: string
  open_id: string
  idcard_start_time: string
  idcard_end_time: string
  idcard_address: string
  is_cloudgain: number
  is_first: number
  is_yyzx: number
  is_gd: number
  qbk_percent: string
}

// 划拨记录项
export interface TransferLogItem {
  id: number
  m_id: number
  sys_type: number
  type: number
  from_user_id: number
  to_user_id: number
  receive_user_id: number
  nums: number
  product_id: number
  coin_order_id: number
  order_id: number
  operator: string | null
  operator_id: number
  sn_str: string
  create_time: string
  is_huibo: number
  sys_type_name: string
  product_name: string
  from_user_name: string
  to_user_name: string
  order_code: string
  mname: string
  from: UserInfo | null
}

// 划拨记录列表响应
export interface TransferLogResponse {
  code: number
  msg: string
  count: number
  data: TransferLogItem[]
}

// 获取划拨记录列表
export const getTransferLogListApi = (params: TransferLogParams) => {
  return request.get<TransferLogResponse>('/index/transfer/loglist.html', { params })
}
