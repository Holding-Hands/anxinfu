import { request } from '@/utils/request'

// 首页统计数据
export interface DashboardData {
  // 统计卡片数据
  order_count: number // 订单总数
  pending_count: number // 待付款订单
  user_count: number // 盟友总数
  user_month_add: number // 本月增加人数
  admin_count: number // 后台管理员

  // 图表数据
  chart_data: {
    dates: string[] // 日期
    active_counts: number[] // 激活量
    amounts: string[] // 交易量
  }
}

// 获取首页控制台 HTML
export const getDashboardHtmlApi = () => {
  return request.get('/index/index/index2.html', {
    responseType: 'text',
    transformResponse: [(data) => data]
  })
}

// 解析 HTML 提取数据
export const parseDashboardData = (html: string): DashboardData => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  // 提取统计卡片数据
  const cards = doc.querySelectorAll('.layui-card')
  const order_count = parseInt(
    cards[0]?.querySelector('.layuiadmin-big-font a')?.textContent || '0'
  )
  const pending_count = parseInt(
    cards[1]?.querySelector('.layuiadmin-big-font a')?.textContent || '0'
  )
  const user_count = parseInt(cards[2]?.querySelector('.layuiadmin-big-font a')?.textContent || '0')
  const admin_count = parseInt(
    cards[3]?.querySelector('.layuiadmin-big-font a')?.textContent || '0'
  )

  // 提取本月增加人数
  const monthAddText = cards[2]?.querySelector('.layuiadmin-span-color')?.textContent || '0人'
  const user_month_add = parseInt(monthAddText.replace('人', ''))

  // 提取图表数据 - 从 script 标签中解析
  const scripts = doc.querySelectorAll('script')
  let dates: string[] = []
  let active_counts: number[] = []
  let amounts: string[] = []

  scripts.forEach((script) => {
    const content = script.textContent || ''

    // 提取日期数据
    const datesMatch = content.match(/data:\s*\[(.*?)]\s*}/s)
    if (datesMatch && content.includes("type: 'category'")) {
      const datesStr = datesMatch[1]
      dates = datesStr.match(/"([^"]+)"/g)?.map((d) => d.replace(/"/g, '')) || []
    }

    // 提取激活量数据
    const activeMatch = content.match(/name:\s*'激活量'[\s\S]*?data:\s*\[([\d,\s]+)]/)
    if (activeMatch) {
      active_counts = activeMatch[1].split(',').map((n) => parseInt(n.trim()))
    }

    // 提取交易量数据
    const amountMatch = content.match(/name:\s*'交易量'[\s\S]*?data:\s*\[(.*?)]/)
    if (amountMatch) {
      amounts = amountMatch[1].match(/"([^"]+)"/g)?.map((a) => a.replace(/"/g, '')) || []
    }
  })

  return {
    order_count,
    pending_count,
    user_count,
    user_month_add,
    admin_count,
    chart_data: {
      dates,
      active_counts,
      amounts
    }
  }
}
