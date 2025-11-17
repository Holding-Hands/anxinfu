import { request } from '@/utils/request'

// 下载记录查询参数
export interface DownloadRecordParams {
  page: number
  limit: number
  type?: number | string // 类型 ''-全部 1-交易数据 2-收益明细 等
}

// 下载记录数据项
export interface DownloadRecordItem {
  id: number
  m_id: number
  type: number
  typeName: string
  file_name: string
  file_path: string
  down_url: string
  size: string
  status: number
  map_str: string
  create_time: string
  update_time: string | null
}

// 下载记录响应
export interface DownloadRecordResponse {
  code: number
  msg: string
  count: number
  data: DownloadRecordItem[]
}

// 获取下载记录列表
export const getDownloadRecordListApi = (params: DownloadRecordParams) => {
  return request.get<DownloadRecordResponse>('/index/downloads/getlist.html', { params })
}

// 删除下载记录
export const deleteDownloadRecordApi = (ids: number | string) => {
  const formData = new URLSearchParams()
  formData.append('ids', String(ids))

  return request.post<{ code: number; msg: string; data: string; url: string; wait: number }>(
    '/index/downloads/del.html',
    formData,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  )
}
