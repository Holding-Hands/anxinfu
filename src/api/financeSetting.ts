import { request } from '@/utils/request'

// 保存财务设置响应
export interface SaveFinanceSettingResponse {
  code: number
  msg: string
  data: string
  url: string
  wait: number
}

// 获取财务设置页面 HTML
export const getFinanceSettingHtmlApi = () => {
  return request.get('/index/tixian_order/set.html', {
    responseType: 'text',
    transformResponse: [(data) => data]
  })
}

// 保存财务设置
export const saveFinanceSettingApi = (data: Record<string, string | number>) => {
  return request.post<SaveFinanceSettingResponse>('/index/tixian_order/set.html', data)
}
