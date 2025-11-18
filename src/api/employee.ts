import { request } from '@/utils/request'

// 员工查询参数
export interface EmployeeParams {
  page: number
  limit: number
  group?: number | string // 角色ID，0表示全部
  username?: string
  mobile?: string
}

// 角色组信息
export interface EmployeeGroup {
  id: number
  m_id: number
  title: string
  menu_auth: string
  create_time: string | null
  update_time: string
  sort: number
  is_all: number // 1-全部权限 0-部分权限
  status: number // 1-启用 0-禁用
  pivot: {
    m_id: number
    group_id: number
    access_id: number
  }
}

// 员工数据项
export interface EmployeeItem {
  id: number
  m_id: number
  username: string
  password: string
  mobile: string
  sort: number
  status: number // 1-启用 0-禁用
  portrait: string
  nickname: string
  is_admin: number // 1-超级管理员 0-普通管理员
  qq: string
  sex: number // 1-男 2-女
  email: string
  remarks: string
  create_time: string | null
  update_time: string
  group_name: string
  groups: EmployeeGroup[]
}

// 员工列表响应
export interface EmployeeResponse {
  code: number
  msg: string
  count: number
  data: EmployeeItem[]
}

// 获取员工列表
export const getEmployeeListApi = (params: EmployeeParams) => {
  return request.get<EmployeeResponse>('/index/team_access/getlist.html', { params })
}

// 通用响应类型
interface CommonResponse {
  code: number
  msg: string
  data: string
  url: string
  wait: number
}

// 设置禁用
export const setDisableEmployeeApi = (ids: number | string) => {
  const formData = new URLSearchParams()
  formData.append('ids', String(ids))

  return request.post<CommonResponse>('/index/team_access/setdisable.html', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 设置启用
export const setEnableEmployeeApi = (ids: number | string) => {
  const formData = new URLSearchParams()
  formData.append('ids', String(ids))

  return request.post<CommonResponse>('/index/team_access/setenable.html', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 新增员工参数
export interface EmployeeAddParams {
  username: string
  password?: string // 可选
  mobile: string
  nickname: string
  qq: string
  email: string
  sex: number // 1-男 2-女
  sort: number
  remarks: string
  group_name?: number[] // 角色ID数组
}

// 编辑员工参数
export interface EmployeeEditParams extends EmployeeAddParams {
  id: number
}

// 新增员工
export const addEmployeeApi = (data: EmployeeAddParams) => {
  const formData = new URLSearchParams()
  formData.append('username', data.username)
  if (data.password) {
    formData.append('password', data.password)
  }
  formData.append('mobile', data.mobile)
  formData.append('nickname', data.nickname)
  formData.append('qq', data.qq)
  formData.append('email', data.email)
  formData.append('sex', String(data.sex))
  formData.append('sort', String(data.sort))
  formData.append('remarks', data.remarks)
  if (data.group_name && data.group_name.length > 0) {
    formData.append('group_name', data.group_name.join(','))
  }

  return request.post<CommonResponse>('/index/team_access/add.html', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 编辑员工
export const editEmployeeApi = (data: EmployeeEditParams) => {
  const formData = new URLSearchParams()
  formData.append('id', String(data.id))
  formData.append('username', data.username)
  if (data.password) {
    formData.append('password', data.password)
  }
  formData.append('mobile', data.mobile)
  formData.append('nickname', data.nickname)
  formData.append('qq', data.qq)
  formData.append('email', data.email)
  formData.append('sex', String(data.sex))
  formData.append('sort', String(data.sort))
  formData.append('remarks', data.remarks)
  if (data.group_name && data.group_name.length > 0) {
    formData.append('group_name', data.group_name.join(','))
  }

  return request.post<CommonResponse>('/index/team_access/edit.html', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
