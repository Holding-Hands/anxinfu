/**
 * 全局常量配置
 */

// 用户等级选项
export const USER_LEVEL_OPTIONS = [
  { label: '全部', value: '' },
  { label: 'V1', value: '1' },
  { label: 'V2', value: '2' },
  { label: 'V3', value: '3' },
  { label: 'V4', value: '4' },
  { label: 'V5', value: '5' },
  { label: 'V6', value: '6' },
  { label: 'V7', value: '7' }
]

// 用户类别选项
export const USER_TYPE_OPTIONS = [
  { label: '全部', value: '' },
  { label: '代理', value: 1 },
  { label: '商户', value: 2 }
]

// 实名状态选项
export const AUTH_STATUS_OPTIONS = [
  { label: '全部', value: '' },
  { label: '未认证', value: '0' },
  { label: '已实名', value: '1' }
]

// 所属团队选项
export const TEAM_OPTIONS = [
  { label: '全部', value: 0 },
  { label: '安鑫付', value: 1 }
]

// 用户等级映射（用于显示）
export const USER_LEVEL_MAP: Record<string, string> = {
  '1': 'V1',
  '2': 'V2',
  '3': 'V3',
  '4': 'V4',
  '5': 'V5',
  '6': 'V6',
  '7': 'V7'
}

// 用户类别映射
export const USER_TYPE_MAP: Record<string, string> = {
  '': '全部',
  '1': '代理',
  '2': '商户'
}

// 实名状态映射
export const AUTH_STATUS_MAP: Record<string, string> = {
  '': '全部',
  '0': '未认证',
  '1': '已实名'
}

// 团队映射
export const TEAM_MAP: Record<number, string> = {
  0: '全部',
  1: '安鑫付'
}

// 等级标签类型映射（用于 el-tag 的 type 属性）
export const LEVEL_TAG_TYPE_MAP: Record<string, '' | 'success' | 'info' | 'warning' | 'danger'> = {
  V1: 'info',
  V2: '',
  V3: 'success',
  V4: 'warning',
  V5: 'danger',
  V6: 'info',
  V7: 'success'
}


