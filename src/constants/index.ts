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

// 系统模式选项
export const SYS_TYPE_OPTIONS = [
  { label: '全部', value: '' },
  { label: '1.0模式', value: 1 },
  { label: '2.0模式', value: 2 }
]

// 系统模式映射
export const SYS_TYPE_MAP: Record<string | number, string> = {
  '': '全部',
  1: '1.0模式',
  2: '2.0模式'
}

// 交易类型选项
export const CARD_TYPE_OPTIONS = [
  { label: '全部', value: '' },
  { label: '贷记卡', value: '1' },
  { label: '扫码', value: '2' },
  { label: '借记卡', value: '3' },
  { label: '闪付', value: '4' }
]

// 交易类型映射
export const CARD_TYPE_MAP: Record<string, string> = {
  '': '全部',
  '1': '贷记卡',
  '2': '扫码',
  '3': '借记卡',
  '4': '闪付'
}

// 产品选项
export const PRODUCT_OPTIONS = [
  { label: '全部', value: 0 },
  { label: '国通微智能', value: 1 },
  { label: '陆POS', value: 2 },
  { label: '合利宝', value: 3 },
  { label: '拉卡拉电签', value: 4 },
  { label: '星驿付真商', value: 5 }
]

// 产品映射
export const PRODUCT_MAP: Record<number, string> = {
  0: '全部',
  1: '国通微智能',
  2: '陆POS',
  3: '合利宝',
  4: '拉卡拉电签',
  5: '星驿付真商'
}

// 商品上架状态选项
export const GOODS_STATUS_OPTIONS = [
  { label: '全部', value: '' },
  { label: '已上架', value: 1 },
  { label: '已下架', value: 0 }
]

// 商品上架状态映射
export const GOODS_STATUS_MAP: Record<string | number, string> = {
  '': '全部',
  0: '已下架',
  1: '已上架'
}

// 热门商品选项
export const GOODS_HOT_OPTIONS = [
  { label: '全部', value: '' },
  { label: '是', value: 1 },
  { label: '否', value: 0 }
]
