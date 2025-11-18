import { request } from '@/utils/request'

// 权限管理查询参数
export interface PermissionParams {
  page: number
  limit: number
}

// 角色组数据项
export interface PermissionItem {
  id: number
  m_id: number
  title: string // 角色名称
  menu_auth: string
  create_time: string
  update_time: string
  sort: number
  is_all: number // 1-全部权限 0-部分权限
  status: number // 1-启用 0-禁用
}

// 权限管理响应
export interface PermissionResponse {
  code: number
  msg: string
  count: number
  data: PermissionItem[]
}

// 获取权限管理列表（角色组列表）
export const getPermissionListApi = (params: PermissionParams) => {
  return request.get<PermissionResponse>('/index/team_group/getlist.html', { params })
}

// 角色编辑参数
export interface RoleEditParams {
  id: number
  title: string
  is_all: number // 1-所有权限 0-个性化设置
  sort: number
}

// 编辑角色
export const editRoleApi = (data: RoleEditParams) => {
  const formData = new URLSearchParams()
  formData.append('id', String(data.id))
  formData.append('title', data.title)
  formData.append('is_all', String(data.is_all))
  formData.append('sort', String(data.sort))

  return request.post<{ code: number; msg: string }>('/index/team_group/edit.html', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 新增角色参数
export interface RoleAddParams {
  title: string
  is_all: number
  sort: number
}

// 新增角色
export const addRoleApi = (data: RoleAddParams) => {
  const formData = new URLSearchParams()
  formData.append('title', data.title)
  formData.append('is_all', String(data.is_all))
  formData.append('sort', String(data.sort))

  return request.post<{ code: number; msg: string; data: string; url: string; wait: number }>(
    '/index/team_group/add.html',
    formData,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  )
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
export const setDisableRoleApi = (ids: number | string) => {
  const formData = new URLSearchParams()
  formData.append('ids', String(ids))

  return request.post<CommonResponse>('/index/team_group/setdisable.html', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 设置启用
export const setEnableRoleApi = (ids: number | string) => {
  const formData = new URLSearchParams()
  formData.append('ids', String(ids))

  return request.post<CommonResponse>('/index/team_group/setenable.html', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 删除角色
export const deleteRoleApi = (ids: number | string) => {
  const formData = new URLSearchParams()
  formData.append('ids', String(ids))

  return request.post<CommonResponse>('/index/team_group/del.html', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
