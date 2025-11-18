import { request } from '@/utils/request'

// 团队信息数据
export interface TeamInfo {
  id: number
  name: string // 商户名称
  code: string // 编号
  logo: string // logo图
  secret: string // 商户密钥
  corporation: string // 商户法人
  phone: string // 手机号
  lishua_merchant_update_url: string // 立刷商户数据更新地址
  lishua_trade_update_url: string // 立刷交易数据更新地址
}

// 团队信息响应
export interface TeamInfoResponse {
  code: number
  msg: string
  data: TeamInfo
}

// 通用响应类型
interface CommonResponse {
  code: number
  msg: string
  data?: string
  url?: string
  wait?: number
}

// 获取团队信息
export const getTeamInfoApi = () => {
  return request.get<TeamInfoResponse>('/merchant/merchant/edit.html')
}

// 编辑团队信息参数
export interface TeamEditParams {
  id: number
  name: string
  logo?: string
  corporation?: string
  phone?: string
}

// 编辑团队信息
export const editTeamInfoApi = (data: TeamEditParams) => {
  const formData = new URLSearchParams()
  formData.append('id', String(data.id))
  formData.append('name', data.name)
  if (data.logo) {
    formData.append('logo', data.logo)
  }
  if (data.corporation) {
    formData.append('corporation', data.corporation)
  }
  if (data.phone) {
    formData.append('phone', data.phone)
  }

  return request.post<CommonResponse>('/merchant/merchant/edit.html', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 上传图片响应
export interface UploadResponse {
  code: number
  msg: string
  data: {
    src: string
  }
}

// 上传图片到七牛云
export const uploadImageApi = (file: File) => {
  const formData = new FormData()
  formData.append('file', file)

  return request.post<UploadResponse>('/index/team/qiniu_upload.html', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
