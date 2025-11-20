import { request } from '@/utils/request'

// 积分订单查询参数
export interface CoinOrderParams {
  page: number
  limit: number
  sq_mobile?: string // 申请人手机
  dh_mobile?: string // 被申请人手机
  status?: number | string // 订单状态
  ship_status?: number | string // 发货状态
  create_time?: string // 创建时间
}

// 积分订单列表项
export interface CoinOrderItem {
  id: number
  sq_mobile: string
  dh_mobile: string
  status: number
  ship_status: number
  create_time: string
  sq_user_name?: string // 申请人姓名
  dh_user_name?: string // 被申请人姓名
  goods_name?: string // 商品名称
  coin_num?: number // 积分数量
  order_code?: string // 订单号
  express_company?: string // 快递公司
  express_code?: string // 快递单号
  update_time?: string // 更新时间
  remark?: string // 备注
}

// 积分订单列表响应
export interface CoinOrderResponse {
  code: number
  msg: string
  count: number
  data: CoinOrderItem[]
}

// 获取积分订单列表
export const getCoinOrderListApi = (params: CoinOrderParams) => {
  return request.get<CoinOrderResponse>('/index/coin_order/getlist.html', { params })
}
