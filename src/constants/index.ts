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

// 订单状态选项
export const ORDER_STATUS_OPTIONS = [
  { label: '全部', value: 0 },
  { label: '待支付', value: 1 },
  { label: '待发货', value: 2 },
  { label: '待收货', value: 3 },
  { label: '已完成', value: 4 }
]

// 订单支付方式选项
export const ORDER_PAY_TYPE_OPTIONS = [
  { label: '全部', value: 0 },
  { label: '支付宝', value: 1 },
  { label: '微信', value: 3 },
  { label: '现金', value: 5 }
]

// 快递公司选项
export const EXPRESS_COMPANY_OPTIONS = [
  { label: '上门自提', value: '1_上门自提' },
  { label: '圆通速递', value: 'yuantong_圆通速递' },
  { label: '韵达快递', value: 'yunda_韵达快递' },
  { label: '中通快递', value: 'zhongtong_中通快递' },
  { label: '邮政快递包裹', value: 'youzhengguonei_邮政快递包裹' },
  { label: '顺丰速运', value: 'shunfeng_顺丰速运' },
  { label: '百世快递', value: 'huitongkuaidi_百世快递' },
  { label: '申通快递', value: 'shentong_申通快递' },
  { label: '京东物流', value: 'jd_京东物流' },
  { label: 'EMS', value: 'ems_EMS' },
  { label: '极兔速递', value: 'jtexpress_极兔速递' },
  { label: '天天快递', value: 'tiantian_天天快递' },
  { label: '邮政标准快递', value: 'youzhengbk_邮政标准快递' },
  { label: '德邦', value: 'debangwuliu_德邦' },
  { label: '德邦快递', value: 'debangkuaidi_德邦快递' },
  { label: '宅急送', value: 'zhaijisong_宅急送' },
  { label: '众邮快递', value: 'zhongyoukuaidi_众邮快递' },
  { label: '优速快递', value: 'youshuwuliu_优速快递' },
  { label: '百世快运', value: 'baishiwuliu_百世快运' },
  { label: '圆通快运', value: 'yuantongkuaiyun_圆通快运' },
  { label: '韵达快运', value: 'yundakuaiyun_韵达快运' },
  { label: '中通快运', value: 'zhongtongkuaiyun_中通快运' },
  { label: '安能快运', value: 'annengwuliu_安能快运' },
  { label: 'wedepot物流', value: 'wedepot_wedepot物流' }
]

// 下载记录类型选项
export const DOWNLOAD_TYPE_OPTIONS = [
  { label: '全部', value: '' },
  { label: '交易数据', value: 1 },
  { label: '收益明细', value: 2 },
  { label: '提现记录', value: 3 },
  { label: '商户记录', value: 4 },
  { label: '机具记录', value: 5 },
  { label: '积分兑换订单', value: 6 },
  { label: '划拨记录', value: 7 },
  { label: '盟友列表', value: 8 },
  { label: '积分明细', value: 9 },
  { label: '分红明细', value: 10 },
  { label: '结算价', value: 11 }
]

// 下载记录类型映射
export const DOWNLOAD_TYPE_MAP: Record<number | string, string> = {
  0: '全部',
  1: '交易数据',
  2: '收益明细',
  3: '提现记录',
  4: '商户记录',
  5: '机具记录',
  6: '积分兑换订单',
  7: '划拨记录',
  8: '盟友列表',
  9: '积分明细',
  10: '分红明细',
  11: '结算价'
}
