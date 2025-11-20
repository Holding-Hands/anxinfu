import { request } from '@/utils/request'

// 费率申请查询参数
export interface ApplyRateParams {
  page: number
  limit: number
  platform_id?: number | string
  product_id?: number | string
  sys_type?: number | string
  uName?: string
  status?: number | string
}

// 费率申请列表项（根据其他页面推断）
export interface ApplyRateItem {
  id: number
  sys_type: number
  sys_type_name: string
  agent_name: string
  product_name: string
  sn: string
  apply_rate: string
  current_rate: string
  status: number
  remark: string
  apply_time: string
  handle_time: string
  operator: string
}

// 费率申请列表响应
export interface ApplyRateResponse {
  code: number
  msg: string
  count: number
  data: ApplyRateItem[]
}

// 获取费率申请列表
export const getApplyRateListApi = (params: ApplyRateParams) => {
  return request.get<ApplyRateResponse>('/index/applyrate/getlist.html', {
    params
  })
}
