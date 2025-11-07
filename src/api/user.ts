import { request } from '@/utils/request'
import type { UserInfo, LoginForm } from '@/types'

// 登录
export const loginApi = (data: LoginForm) => {
  // 转换为表单格式
  const formData = new URLSearchParams()
  formData.append('username', data.username)
  formData.append('password', data.password)
  if (data.code) {
    formData.append('code', data.code)
  }

  return request.post<{ token: string; userInfo: UserInfo }>(
    '/index/login/login.html?num=',
    formData,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  )
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
  is_tixian: boolean
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
  is_auth?: string // 实名状态（all=全部, 0=未认证, 1=已实名）
  user_type?: number | string // 用户类别（0=全部, 1=代理, 2=商户）
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
  is_tixian: number // 是否可提现 0-否 1-是
  wallet_status: number // 钱包状态
  wallet_status_name: string // 钱包状态名称
  create_time: string // 创建时间
  auth_time: number // 认证时间
  p_user: string // 上级用户/推荐人
  stocks: AllyStock[] // 库存列表
  stock?: string // 机具数量（可能是字符串格式 "6/0"）
  profit_ratio: string // 分润比例
  ids_num?: string // 身份证号
  alipay: string // 支付宝账号
  aliypayName: string // 支付宝姓名
  status: number // 状态 1:正常 0:禁用
  level_month: string // 等级时效（包含HTML）
  jgid?: string // 机构ID（可能是运营中心）
  operation_center?: string // 运营中心
  is_gd?: number // 是否股东 0-否 1-是
  is_yyzx?: number // 是否运营中心 0-否 1-是
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
  return request.post('/index/user/edit_level.html', params)
}

// 修改用户推荐码参数
export interface EditUserCodeParams {
  id: number // 用户ID
  user_code: string // 新推荐码
}

// 修改用户推荐码
export const editUserCodeApi = (params: EditUserCodeParams) => {
  return request.post('/index/user/edit_user_code.html', params)
}

// 设置股东状态参数
export interface SetShareholderParams {
  ids: number // 用户ID
}

// 设置股东状态
export const setShareholderApi = (params: SetShareholderParams) => {
  return request.post('/index/user/setdisgd.html', params)
}

// 设置运营中心状态参数
export interface SetOperationCenterParams {
  ids: number // 用户ID
}

// 设置运营中心状态
export const setOperationCenterApi = (params: SetOperationCenterParams) => {
  return request.post('/index/user/setdisyyzx.html', params)
}

// 修改收益状态参数
export interface ChangeWalletStatusParams {
  id: number // 用户ID
  wallet_status: number // 0:收益关闭 1:发给直属上级 2:收益正常
}

// 修改收益状态
export const changeWalletStatusApi = (params: ChangeWalletStatusParams) => {
  return request.post('/index/user/change_wallet_status.html', params)
}

// 设置提现状态参数
export interface SetWithdrawParams {
  ids: number // 用户ID
}

// 设置提现状态
export const setWithdrawApi = (params: SetWithdrawParams) => {
  return request.post('/index/user/setdistixian.html', params)
}

// 设置用户状态参数
export interface SetUserStatusParams {
  ids: number // 用户ID
}

// 设置用户状态
export const setUserStatusApi = (params: SetUserStatusParams) => {
  return request.post('/index/user/setdisable.html', params)
}

// 修改实名信息参数
export interface EditAuthInfoParams {
  id: number // 用户ID
  name: string // 姓名
  ids_num: string // 身份证号
  alipay: string // 支付宝账号
  aliypayName: string // 支付宝姓名
}

// 修改实名信息
export const editAuthInfoApi = (params: EditAuthInfoParams) => {
  return request.post('/index/user/edit_is_auth.html', params)
}

// 操作钱包余额参数
export interface OperateWalletParams {
  id: number // 用户ID
  money: number // 操作金额（正数为增加，负数为扣除）
  remark: string // 备注
  wallet: string // 钱包类型 wallet1:分润钱包 wallet2:返现钱包 wallet3:流量费钱包
}

// 操作钱包余额
export const operateWalletApi = (params: OperateWalletParams) => {
  return request.post('/index/user/kou_kuan_wallet.html', params)
}

// ==================== 1.0盟友列表接口 ====================

// 获取1.0盟友列表
export const getAllyList10Api = (params: AllyListParams) => {
  return request.get<AllyListResponse>('/index/user/getlisty.html', { params })
}

// 设置1.0用户状态
export const setUserStatus10Api = (params: SetUserStatusParams) => {
  return request.post('/index/user/setenable.html', params)
}

// 操作1.0钱包余额（分润钱包、返现钱包、其它钱包）
export const operateWallet10Api = (params: OperateWalletParams) => {
  return request.post('/index/user/kou_kuan_wallet.html', params)
}

// 设置1.0提现状态
export const setWithdraw10Api = (params: SetWithdrawParams) => {
  return request.post('/index/user/setdistixian.html', params)
}

// ==================== 盟友业绩汇总接口 ====================

// 盟友业绩汇总查询参数
export interface AllySummaryParams {
  page: number
  limit: number
  sys_type?: number | string // 模式 1:1.0模式 2:2.0模式 或空字符串表示全部
  mobile?: string // 手机号
  month?: string // 月份 格式: 2025-11
}

// 盟友业绩汇总数据项
export interface AllySummaryItem {
  id: number
  user_name: string // 所属盟友
  zy_money: string // 直营交易
  td_money: string // 团队交易
  month: string // 月份
}

// 盟友业绩汇总响应
export interface AllySummaryResponse {
  code: number
  msg: string
  count: number
  data: AllySummaryItem[]
  total: number
}

// 获取盟友业绩汇总
export const getAllySummaryApi = (params: AllySummaryParams) => {
  return request.get<AllySummaryResponse>('/index/trade_sum/getlistsum.html', { params })
}

// ==================== 交易汇总列表接口 ====================

// 交易汇总列表查询参数
export interface TradeSumListParams {
  page: number
  limit: number
  sys_type?: number | string // 模式 1:1.0模式 2:2.0模式 或空字符串表示全部
  product_id?: number // 产品 0:全部 1:国通微智能 2:陆POS 3:合利宝 4:拉卡拉电签 5:星驿付真商
  card_type?: string // 交易类型 '':全部 '1':贷记卡 '2':扫码 '3':借记卡 '4':闪付
  mobile?: string // 用户手机号
  month?: string // 月份 格式: 202511
}

// 交易汇总列表数据项
export interface TradeSumListItem {
  id: number
  user_id: number
  user_name: string // 所属盟友
  mobile: string // 手机号
  m_id: number
  sys_type: number // 模式
  sys_type_name: string // 模式名称
  product_id: number // 产品ID
  product_name: string // 产品名称
  platform_id: number
  card_type: string // 交易类型
  zy_money: string // 直营交易
  td_money: string // 团队交易
  month: number // 月份
  create_time: number
  update_time: number
  read_time: number
  is_read: number
}

// 交易汇总列表响应
export interface TradeSumListResponse {
  code: number
  msg: string
  count: number
  data: TradeSumListItem[]
  total: number
  total_zy_money?: number // 总直营交易额
  total_td_money?: number // 总团队交易额
}

// 获取交易汇总列表
export const getTradeSumListApi = (params: TradeSumListParams) => {
  return request.get<TradeSumListResponse>('/index/trade_sum/getlist.html', { params })
}

// ==================== 每天业绩接口 ====================

// 每天业绩查询参数
export interface DayListParams {
  page: number
  limit: number
  sys_type?: number | string // 模式 1:1.0模式 2:2.0模式 或空字符串表示全部
  product_id?: number // 产品 0:全部 1:国通微智能 2:陆POS 3:合利宝 4:拉卡拉电签 5:星驿付真商
  card_type?: string // 交易类型 '':全部 '1':贷记卡 '2':扫码 '3':借记卡 '4':闪付
  mobile?: string // 用户手机号
  day?: string // 日期 格式: YYYY-MM-DD (例如: 2025-11-06)
}

// 每天业绩数据项
export interface DayListItem {
  id: number
  user_id: number
  user_name: string // 所属盟友
  mobile: string // 手机号
  m_id: number
  sys_type: number // 模式
  sys_type_name: string // 模式名称
  product_id: number // 产品ID
  product_name: string // 产品名称
  platform_id: number
  card_type: string // 交易类型
  zy_money: string // 直营交易
  td_money: string // 团队交易
  day: number // 日期
  create_time: number
  update_time: number
  read_time: number
  is_read: number
}

// 每天业绩响应
export interface DayListResponse {
  code: number
  msg: string
  count: number
  data: DayListItem[]
  total: number
  zy_money?: string // 总直营交易额
}

// 获取每天业绩列表
export const getDayListApi = (params: DayListParams) => {
  return request.get<DayListResponse>('/index/trade_sum/daylist.html', { params })
}

// ==================== 1.0盟友结算价接口 ====================

// 1.0盟友结算价查询参数
export interface UserSettleListParams {
  page: number
  limit: number
  platform_id?: number | string // 产品 0:全部
  product_id?: number | string // 产品名称
  name?: string // 姓名
  mobile?: string // 手机号
  tdz_mobile?: string // 团队长手机号
}

// 1.0盟友结算价数据项
export interface UserSettleListItem {
  id: number
  user_id: number // 用户ID
  uName: string // 姓名
  uMobile: string // 电话
  pnums: number // 第N代
  pName: string // 产品名称
  product_id: number // 产品ID
  platform_id: number
  m_id: number
  code_price: string // 扫码结算价
  card_price: string // 刷卡结算价
  rise_price: string // 上流结算价(万)
  rise_price_show: string // 上流结算价显示（含HTML）
  tjfc_percent: number // 调价分成%
  first_money: string // 一次达标
  second_money: string // 二次达标
  third_money: string // 三次达标
  active_money: string // 激活奖
  liu_percent: string // 流量费分成
  single_money: string // 单笔奖励
  jjk_price: string // 借记卡价格
  vip_price: string // VIP价格
  create_time: string // 创建时间
  update_time: string // 更新时间
}

// 1.0盟友结算价响应
export interface UserSettleListResponse {
  code: number
  msg: string
  count: number
  data: UserSettleListItem[]
  total: number
}

// 获取1.0盟友结算价列表
export const getUserSettleListApi = (params: UserSettleListParams) => {
  return request.get<UserSettleListResponse>('/index/usersettle/getlist.html', { params })
}

// 修改上流结算价参数
export interface EditSettlePriceParams {
  id: number // 记录ID
  number: number // 上流结算价
}

// 修改上流结算价响应
export interface EditSettlePriceResponse {
  code: number
  msg: string
  data: string
  url: string
  wait: number
}

// 修改上流结算价
export const editSettlePriceApi = (data: EditSettlePriceParams) => {
  return request.post<EditSettlePriceResponse>('/index/usersettle/editnumber.html', data)
}

// 修改调价分成参数
export interface EditTjfcPercentParams {
  id: number // 记录ID
  number: number // 调价分成%
}

// 修改调价分成响应
export interface EditTjfcPercentResponse {
  code: number
  msg: string
  data: string
  url: string
  wait: number
}

// 修改调价分成
export const editTjfcPercentApi = (data: EditTjfcPercentParams) => {
  return request.post<EditTjfcPercentResponse>('/index/usersettle/tjfc_percent.html', data)
}

// 编辑用户结算价参数
export interface EditUserSettleParams {
  id: number // 记录ID
  code_price: string | number // 扫码结算价
  card_price: string | number // 刷卡结算价
  liu_percent: string | number // 流量费
  first_money: string | number // 一次达标奖
  second_money: string | number // 二次达标奖
  third_money: string | number // 三次达标奖
}

// 编辑用户结算价响应
export interface EditUserSettleResponse {
  code: number
  msg: string
  data: string
  url: string
  wait: number
}

// 编辑用户结算价
export const editUserSettleApi = (data: EditUserSettleParams) => {
  return request.post<EditUserSettleResponse>('/index/usersettle/edit.html', data)
}

// ==================== 获取子产品接口 ====================

// 获取子产品参数
export interface GetChildProductParams {
  pid: number // 父产品ID
}

// 获取子产品响应
export interface GetChildProductResponse {
  code: number
  msg: string
  count: string
  data: Record<string, string> // 键是ID，值是产品名称，例如: {4: "拉卡拉电签"}
}

// 获取子产品
export const getChildProductApi = (params: GetChildProductParams) => {
  return request.get<GetChildProductResponse>('/index/platform/getcp.html', { params })
}

// ==================== 代理流量费政策接口 ====================

// 代理流量费政策查询参数
export interface UserSimListParams {
  page: number
  limit: number
  platform_id?: number | string // 产品 0:全部
  product_id?: number | string // 产品名称
  name?: string // 姓名
  mobile?: string // 手机号
}

// 代理流量费政策数据项
export interface UserSimListItem {
  id: number
  user_id: number // 用户ID
  uName: string // 姓名
  uMobile: string // 电话
  pName: string // 产品名称
  product_id: number // 产品ID
  platform_id: number
  m_id: number
  sim_id: number
  sim_money: string | number // 流量费（档位）
  u_sim_money: string // 首年流量费
  u_sim_money2: string // 次年流量费
  create_time: string // 创建时间
  update_time: string // 更新时间
}

// 代理流量费政策响应
export interface UserSimListResponse {
  code: number
  msg: string
  count: number
  data: UserSimListItem[]
  total: number
}

// 获取代理流量费政策列表
export const getUserSimListApi = (params: UserSimListParams) => {
  return request.get<UserSimListResponse>('/index/user_sim/getlist.html', { params })
}

// 编辑代理流量费政策参数
export interface EditUserSimParams {
  id: number // 记录ID
  uName: string // 姓名
  uMobile: string // 手机号
  pName: string // 产品名称
  p_sim_money: string | number // 流量费档位（对应sim_money）
  sim_money: string | number // 首年流量费（对应u_sim_money）
  sim_money2: string | number // 次年流量费（对应u_sim_money2）
}

// 编辑代理流量费政策响应
export interface EditUserSimResponse {
  code: number
  msg: string
  data: string
  url: string
  wait: number
}

// 编辑代理流量费政策
export const editUserSimApi = (data: EditUserSimParams) => {
  // 转换为表单格式
  const formData = new URLSearchParams()
  formData.append('id', String(data.id))
  formData.append('uName', data.uName)
  formData.append('uMobile', data.uMobile)
  formData.append('pName', data.pName)
  formData.append('p_sim_money', String(data.p_sim_money))
  formData.append('sim_money', String(data.sim_money))
  formData.append('sim_money2', String(data.sim_money2))

  return request.post<EditUserSimResponse>('/index/user_sim/edit.html', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// ==================== 平台管理接口 ====================

// 平台管理列表查询参数
export interface PlatformListParams {
  page: number
  limit: number
  title?: string // 平台名称
}

// 平台管理列表数据项
export interface PlatformListItem {
  id: number
  m_id: number
  title: string // 平台名称
  card_price: string // 刷卡价格
  code_price: string // 扫码价格
  vip_price: string // VIP价格
  sort: number // 排序
  status: string // 状态（已启用/已禁用）
  create_time: string // 创建时间
  update_time: string // 更新时间
  statusValue?: boolean // 用于el-switch的状态值
}

// 平台管理列表响应
export interface PlatformListResponse {
  code: number
  msg: string
  count: number
  data: PlatformListItem[]
  total: number
}

// 获取平台管理列表
export const getPlatformListApi = (params: PlatformListParams) => {
  return request.get<PlatformListResponse>('/index/platform/getlist.html', { params })
}

// 新增平台参数
export interface AddPlatformParams {
  title: string // 平台名称
  sort: number // 排序
}

// 新增平台响应
export interface AddPlatformResponse {
  code: number
  msg: string
  data: string
  url: string
  wait: number
}

// 新增平台
export const addPlatformApi = (data: AddPlatformParams) => {
  // 转换为表单格式
  const formData = new URLSearchParams()
  formData.append('title', data.title)
  formData.append('sort', String(data.sort))

  return request.post<AddPlatformResponse>('/index/platform/add.html', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 编辑平台参数
export interface EditPlatformParams {
  id: number // 平台ID
  title: string // 平台名称
  sort: number // 排序
}

// 编辑平台响应
export interface EditPlatformResponse {
  code: number
  msg: string
  data: string
  url: string
  wait: number
}

// 编辑平台
export const editPlatformApi = (data: EditPlatformParams) => {
  // 转换为表单格式
  const formData = new URLSearchParams()
  formData.append('id', String(data.id))
  formData.append('title', data.title)
  formData.append('sort', String(data.sort))

  return request.post<EditPlatformResponse>('/index/platform/edit.html', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 删除平台参数
export interface DeletePlatformParams {
  ids: number | string // 平台ID，多个用逗号分隔
}

// 删除平台响应
export interface DeletePlatformResponse {
  code: number
  msg: string
  data: string
  url: string
  wait: number
}

// 删除平台
export const deletePlatformApi = (data: DeletePlatformParams) => {
  // 转换为表单格式
  const formData = new URLSearchParams()
  formData.append('ids', String(data.ids))

  return request.post<DeletePlatformResponse>('/index/platform/del.html', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 设置平台启用/禁用参数
export interface SetPlatformEnableParams {
  jsonData: string // JSON数组字符串
}

// 设置平台启用/禁用响应
export interface SetPlatformEnableResponse {
  code: number
  msg: string
  data: string
  url: string
  wait: number
}

// 设置平台启用
export const setPlatformEnableApi = (data: SetPlatformEnableParams) => {
  // 转换为表单格式
  const formData = new URLSearchParams()
  formData.append('jsonData', data.jsonData)

  return request.post<SetPlatformEnableResponse>('/index/platform/setenable.html', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 设置平台禁用
export const setPlatformDisableApi = (data: SetPlatformEnableParams) => {
  // 转换为表单格式
  const formData = new URLSearchParams()
  formData.append('jsonData', data.jsonData)

  return request.post<SetPlatformEnableResponse>('/index/platform/setdisable.html', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
