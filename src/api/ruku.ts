import { request } from '@/utils/request'

// 入库/减库列表参数
export interface RukuListParams {
  page: number
  limit: number
  platform_id?: number | string
  product_id?: number | string
  create_time?: string
}

// 入库/减库列表项
export interface RukuListItem {
  id: number
  m_id: number
  sys_type: number
  product_id: number
  sn: string
  count: number
  create_time: string
  operator: string
  operator_id: number
  remarks: string
  type: string
  sys_type_name: string
  pro_name: string
}

// 入库/减库列表响应
export interface RukuListResponse {
  code: number
  msg: string
  count: number
  data: RukuListItem[]
}

// 获取入库/减库列表
export const getRukuListApi = (params: RukuListParams) => {
  return request.get<RukuListResponse>('/index/ruku/getlist.html', { params })
}

// Excel入库响应
export interface ExcelRukuResponse {
  code: number
  msg: string
}

// Excel入库
export const excelRukuApi = (file: File) => {
  const formData = new FormData()
  formData.append('file', file)

  return request.post<ExcelRukuResponse>('/index/ruku/excel_ruku.html', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
