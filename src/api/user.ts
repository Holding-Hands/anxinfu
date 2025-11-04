import { request } from '@/utils/request'
import type { UserInfo, LoginForm } from '@/types'

// 登录
export const loginApi = (data: LoginForm) => {
  return request.post<{ token: string; userInfo: UserInfo }>('/index/login/login.html?num=', data)
}

// 获取用户信息
export const getUserInfoApi = () => {
  return request.get<UserInfo>('/user/info')
}

// 登出
export const logoutApi = () => {
  return request.post('/user/logout')
}

// 代理列表查询参数
export interface AgentListParams {
  page: number
  limit: number
  level?: string // 等级 1-7 或空字符串
  mobile?: string // 手机号
  name?: string // 姓名
  user_type?: number // 用户类别 0-全部 1-代理 2-商户
  is_auth?: string // 实名状态 all-全部 0-未认证 1-已实名
  m_id?: number // 所属团队 0-全部 1-安鑫付
}

// 代理列表数据项
export interface AgentListItem {
  id: number
  team: string // 团队
  name: string // 姓名
  promotion_code: string // 推荐码
  mobile: string // 手机号
  level: string // 等级
  recommend_user: string // 推荐人
  real_name_status: string // 实名状态
  pay_rate: string // 支付宝
  wechat_return: string // 微信分润
  alipay_return: string // 支付宝分润
  other_return: string // 其他分润
  frozen_amount: number // 冻结金额
  total_score: number // 积分
  lottery_count: number // 抽奖次数
  machine_count: string // 机具数
  status: boolean // 状态
  提现: boolean
  operation_type: string // 操作类型
  level_name: string // 等级名称
}

// 代理列表响应
export interface AgentListResponse {
  list: AgentListItem[]
  total: number
  total_amount: number // 总本金余额
  total_withdraw: number // 总分润余额
  total_agent_count: number // 总积分余额
}

// 获取代理列表
export const getAgentListApi = (params: AgentListParams) => {
  return request.get<AgentListResponse>('/admin/user/getlist.html', { params })
}

// 盟友列表查询参数
export interface AllyListParams {
  page: number
  limit: number
  mobile?: string // 手机号
  name?: string // 姓名
  is_auth?: string // 实名状态
  user_type?: string // 用户类别
  level?: number // 等级 0 表示全部
}

// 盟友库存信息
export interface AllyStock {
  id: number
  sn: string
  status: number
  user_id: number
  merchant_id: number
  // ... 其他字段
}

// 盟友列表数据项
export interface AllyListItem {
  id: number
  m_id: number
  pid: number
  mobile: string // 手机号
  name: string // 姓名（包含HTML）
  headimg: string // 头像
  user_code: string // 用户编码
  is_auth: string // 实名状态（包含HTML）
  level: string // 等级
  user_type: number // 用户类别
  wallet1: string // 钱包1 - 分润钱包
  wallet2: string // 钱包2 - 返现钱包
  wallet3: string // 钱包3 - 流量费钱包
  leiji_wallet: string // 累计钱包
  forz_acc_amt: number // 冻结金额
  coin: string // 金币
  point: string // 积分
  is_tixian: number // 是否可提现
  wallet_status: number // 钱包状态
  wallet_status_name: string // 钱包状态名称
  create_time: string // 创建时间
  auth_time: number // 认证时间
  p_user: string // 上级用户/推荐人
  stocks: AllyStock[] // 库存列表
  stock?: string // 机具数量（可能是字符串格式 "6/0"）
  profit_ratio: string // 分润比例
  alipay: string // 支付宝账号
  aliypayName: string // 支付宝姓名
  status: number // 状态 1:正常 0:禁用
  level_month: string // 等级时效（包含HTML）
  jgid?: string // 机构ID（可能是运营中心）
  operation_center?: string // 运营中心
  is_gd?: number // 是否股东
  shareholder?: string // 股东信息
}

// 盟友列表响应
export interface AllyListResponse {
  code: number
  msg: string
  count: number
  data: AllyListItem[]
  total: number
  total_amount: number
  total_withdraw: number
  total_agent_count: number
}

// 获取盟友列表
export const getAllyListApi = (params: AllyListParams) => {
  return request.get<AllyListResponse>('/index/user/getlist.html', { params })
}

// 修改用户等级参数
export interface EditLevelParams {
  id: number // 用户ID
  level: number // 等级 1-7
  type: number // 类型 1=永久有效 2=设定到期时间
  level_month?: string // 到期月份 格式: 2025-11
}

// 修改用户等级
export const editLevelApi = (params: EditLevelParams) => {
  return request.get('/index/user/edit_level.html', { params })
}

