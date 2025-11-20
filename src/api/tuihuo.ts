import { request } from '@/utils/request'

// 回调记录列表参数
export interface TuihuoLogParams {
  page: number
  limit: number
  platform_id?: number | string
  sn_str?: string
  create_time?: string
  name?: string
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
  user_type: number
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
  level_month: number | null
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

// 回调记录项
export interface TuihuoLogItem {
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
  operator: string
  operator_id: number
  sn_str: string
  create_time: string
  is_huibo: number
  sys_type_name: string
  product_name: string
  user_name: string
  recevie_user: string
  order_code: string
  from: UserInfo
}

// 回调记录列表响应
export interface TuihuoLogResponse {
  code: number
  msg: string
  count: number
  data: TuihuoLogItem[]
}

// 获取回调记录列表
export const getTuihuoLogListApi = (params: TuihuoLogParams) => {
  return request.get<TuihuoLogResponse>('/index/tuihuo/loglist.html', { params })
}
