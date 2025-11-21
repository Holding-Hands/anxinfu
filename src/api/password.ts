import { request } from '@/utils/request'

// 修改密码接口参数
export interface ChangePasswordParams {
  oldPassword: string
  password: string
  rePassword: string
}

// 修改密码
export const changePasswordApi = (data: ChangePasswordParams) => {
  return request.post('/index/index/changpas.html', data)
}
