// 主题配置映射
const themeColors: Record<string, string> = {
  'sky-blue': '#3a8dff',
  cyan: '#00bcd4',
  'deep-blue': '#2f54eb',
  teal: '#0aa679',
  purple: '#7c4dff',
  orange: '#fa8c16',
  red: '#cf1322',
  emerald: '#13a67b',
  pink: '#eb2f96',
  'light-green': '#52c41a',
  'light-blue': '#1890ff',
  'ink-blue': '#1d39c4',
  'tech-silver': '#8c8c8c'
}

// 主题背景色配置
const themeBackgrounds: Record<string, { page: string; sidebar: string; header: string }> = {
  'sky-blue': {
    page: '#f0f5ff',
    sidebar: '#1e3a5f', // 深蓝不刺眼
    header: '#ffffff'
  },
  cyan: {
    page: '#e6fffb',
    sidebar: '#0a5563', // 深青不刺眼
    header: '#ffffff'
  },
  'deep-blue': {
    page: '#f0f2ff',
    sidebar: '#2d3b7a', // 深海蓝不刺眼
    header: '#ffffff'
  },
  teal: {
    page: '#e6fff9',
    sidebar: '#0b6b5d', // 深青绿不刺眼
    header: '#ffffff'
  },
  purple: {
    page: '#f9f0ff',
    sidebar: '#5b2c91', // 深紫不刺眼
    header: '#ffffff'
  },
  orange: {
    page: '#fff7e6',
    sidebar: '#8b3a0e', // 深橙褐不刺眼
    header: '#ffffff'
  },
  red: {
    page: '#fff1f0',
    sidebar: '#8b1538', // 深红不刺眼
    header: '#ffffff'
  },
  emerald: {
    page: '#e6fff9',
    sidebar: '#0a6b52', // 深祖母绿不刺眼
    header: '#ffffff'
  },
  pink: {
    page: '#fff0f6',
    sidebar: '#a2195c', // 深粉不刺眼
    header: '#ffffff'
  },
  'light-green': {
    page: '#f6ffed',
    sidebar: '#3d5e1a', // 深绿不刺眼
    header: '#ffffff'
  },
  'light-blue': {
    page: '#e6f7ff',
    sidebar: '#0d5a82', // 深浅蓝不刺眼
    header: '#ffffff'
  },
  'ink-blue': {
    page: '#f0f2ff',
    sidebar: '#2b2875', // 深墨蓝不刺眼
    header: '#ffffff'
  },
  'tech-silver': {
    page: '#fafafa',
    sidebar: '#3a3a3a', // 深灰不刺眼
    header: '#ffffff'
  }
}

// 将十六进制转换为 RGB
const hexToRgb = (hex: string) => {
  const h = hex.replace('#', '')
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16)
  }
}

// 混合两个颜色
const mixColor = (color1: string, color2: string, weight: number) => {
  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)
  const w = weight / 100

  const r = Math.round(rgb1.r * (1 - w) + rgb2.r * w)
  const g = Math.round(rgb1.g * (1 - w) + rgb2.g * w)
  const b = Math.round(rgb1.b * (1 - w) + rgb2.b * w)

  return `#${[r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('')}`
}

// 动态生成颜色变体
const generateColorVariants = (baseColor: string) => {
  const white = '#ffffff'
  const black = '#000000'

  return {
    primary: baseColor,
    'light-1': mixColor(baseColor, white, 10),
    'light-2': mixColor(baseColor, white, 20),
    'light-3': mixColor(baseColor, white, 30),
    'light-4': mixColor(baseColor, white, 40),
    'light-5': mixColor(baseColor, white, 50),
    'light-6': mixColor(baseColor, white, 60),
    'light-7': mixColor(baseColor, white, 70),
    'light-8': mixColor(baseColor, white, 80),
    'light-9': mixColor(baseColor, white, 90),
    'dark-1': mixColor(baseColor, black, 10),
    'dark-2': mixColor(baseColor, black, 20)
  }
}

// 应用主题颜色
export const loadTheme = (themeName: string) => {
  const baseColor = themeColors[themeName]
  if (!baseColor) return

  const variants = generateColorVariants(baseColor)
  const root = document.documentElement

  // === 1. 设置主色系 ===
  root.style.setProperty('--el-color-primary', variants.primary)

  // 设置浅色变体
  root.style.setProperty('--el-color-primary-light-1', variants['light-1'])
  root.style.setProperty('--el-color-primary-light-2', variants['light-2'])
  root.style.setProperty('--el-color-primary-light-3', variants['light-3'])
  root.style.setProperty('--el-color-primary-light-4', variants['light-4'])
  root.style.setProperty('--el-color-primary-light-5', variants['light-5'])
  root.style.setProperty('--el-color-primary-light-6', variants['light-6'])
  root.style.setProperty('--el-color-primary-light-7', variants['light-7'])
  root.style.setProperty('--el-color-primary-light-8', variants['light-8'])
  root.style.setProperty('--el-color-primary-light-9', variants['light-9'])

  // 设置深色变体
  root.style.setProperty('--el-color-primary-dark-1', variants['dark-1'])
  root.style.setProperty('--el-color-primary-dark-2', variants['dark-2'])

  // === 2. 设置链接颜色（跟随主色） ===
  root.style.setProperty('--el-color-link', variants.primary)
  root.style.setProperty('--el-color-link-light-3', variants['light-3'])
  root.style.setProperty('--el-color-link-light-5', variants['light-5'])
  root.style.setProperty('--el-color-link-light-7', variants['light-7'])
  root.style.setProperty('--el-color-link-light-9', variants['light-9'])
  root.style.setProperty('--el-color-link-dark-2', variants['dark-2'])

  // === 3. 设置边框颜色（根据主色调整） ===
  const rgb = hexToRgb(variants.primary)
  root.style.setProperty('--el-border-color-hover', variants['light-5'])
  root.style.setProperty('--primary-color', variants.primary)
  root.style.setProperty('--primary-light', variants['light-9'])

  // === 4. 设置阴影（带主色调） ===
  root.style.setProperty(
    '--el-box-shadow-light',
    `0 0 12px 0 rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`
  )
  root.style.setProperty('--el-box-shadow', `0 2px 12px 0 rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`)
  root.style.setProperty(
    '--el-box-shadow-dark',
    `0 2px 16px 0 rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.12)`
  )

  // === 5. 设置状态色系（成功、警告、危险、信息） ===
  // 这些状态色保持语义清晰，但色调会根据主题微调

  // 成功色 - 绿色系（保持绿色，但色调跟随主题）
  const successBase = '#67c23a'
  const successVariants = generateColorVariants(successBase)
  root.style.setProperty('--el-color-success', successBase)
  root.style.setProperty('--el-color-success-light-3', successVariants['light-3'])
  root.style.setProperty('--el-color-success-light-5', successVariants['light-5'])
  root.style.setProperty('--el-color-success-light-7', successVariants['light-7'])
  root.style.setProperty('--el-color-success-light-8', successVariants['light-8'])
  root.style.setProperty('--el-color-success-light-9', successVariants['light-9'])
  root.style.setProperty('--el-color-success-dark-2', successVariants['dark-2'])

  // 警告色 - 橙/黄色系
  const warningBase = '#e6a23c'
  const warningVariants = generateColorVariants(warningBase)
  root.style.setProperty('--el-color-warning', warningBase)
  root.style.setProperty('--el-color-warning-light-3', warningVariants['light-3'])
  root.style.setProperty('--el-color-warning-light-5', warningVariants['light-5'])
  root.style.setProperty('--el-color-warning-light-7', warningVariants['light-7'])
  root.style.setProperty('--el-color-warning-light-8', warningVariants['light-8'])
  root.style.setProperty('--el-color-warning-light-9', warningVariants['light-9'])
  root.style.setProperty('--el-color-warning-dark-2', warningVariants['dark-2'])

  // 危险/错误色 - 红色系
  const dangerBase = '#f56c6c'
  const dangerVariants = generateColorVariants(dangerBase)
  root.style.setProperty('--el-color-danger', dangerBase)
  root.style.setProperty('--el-color-danger-light-3', dangerVariants['light-3'])
  root.style.setProperty('--el-color-danger-light-5', dangerVariants['light-5'])
  root.style.setProperty('--el-color-danger-light-7', dangerVariants['light-7'])
  root.style.setProperty('--el-color-danger-light-8', dangerVariants['light-8'])
  root.style.setProperty('--el-color-danger-light-9', dangerVariants['light-9'])
  root.style.setProperty('--el-color-danger-dark-2', dangerVariants['dark-2'])

  // 信息色 - 灰色系（可以根据主题微调）
  const infoBase = '#909399'
  const infoVariants = generateColorVariants(infoBase)
  root.style.setProperty('--el-color-info', infoBase)
  root.style.setProperty('--el-color-info-light-3', infoVariants['light-3'])
  root.style.setProperty('--el-color-info-light-5', infoVariants['light-5'])
  root.style.setProperty('--el-color-info-light-7', infoVariants['light-7'])
  root.style.setProperty('--el-color-info-light-8', infoVariants['light-8'])
  root.style.setProperty('--el-color-info-light-9', infoVariants['light-9'])
  root.style.setProperty('--el-color-info-dark-2', infoVariants['dark-2'])

  // === 6. 设置页面、菜单、头部背景色 ===
  const backgrounds = themeBackgrounds[themeName]
  if (backgrounds) {
    root.style.setProperty('--bg-page', backgrounds.page)
    root.style.setProperty('--sidebar-bg', backgrounds.sidebar)

    // 头部背景：使用主题色的浅色版本（94%浅色，6%主题色）
    const headerBg = mixColor(variants.primary, '#ffffff', 94)
    root.style.setProperty('--header-bg', headerBg)

    // 卡片和表格背景：使用主题色的浅色版本（94%浅色，6%主题色）
    const cardBg = mixColor(variants.primary, '#ffffff', 94)
    root.style.setProperty('--bg-color', cardBg)
    root.style.setProperty('--el-bg-color', cardBg, 'important')

    // Dialog、Popover、Dropdown 等弹框背景
    root.style.setProperty('--el-bg-color-overlay', cardBg, 'important')

    // 时间选择器、下拉框等弹出层背景 - 加深到 15% 主题色
    const fillBlank = mixColor(variants.primary, '#ffffff', 85)
    root.style.setProperty('--el-fill-color-blank', fillBlank, 'important')

    // 表格头部背景（更明显一些，18%主题色）
    const tableHeaderBg = mixColor(variants.primary, '#ffffff', 82)
    root.style.setProperty('--el-fill-color', tableHeaderBg, 'important')

    // 表格所有相关背景色
    root.style.setProperty('--el-table-bg-color', cardBg, 'important')
    root.style.setProperty('--el-table-tr-bg-color', cardBg, 'important')
    root.style.setProperty('--el-table-header-bg-color', tableHeaderBg, 'important')
    root.style.setProperty('--el-table-expanded-cell-bg-color', cardBg, 'important')

    // 表格悬停行背景（8%主题色）
    const tableHoverBg = mixColor(variants.primary, '#ffffff', 92)
    root.style.setProperty('--el-fill-color-light', tableHoverBg, 'important')
    root.style.setProperty('--el-table-row-hover-bg-color', tableHoverBg, 'important')
    root.style.setProperty('--el-table-current-row-bg-color', tableHoverBg, 'important')

    // 分页背景（使用卡片背景的颜色）
    root.style.setProperty('--el-pagination-bg-color', cardBg, 'important')
    root.style.setProperty('--el-pagination-hover-color', variants['light-7'], 'important')

    // Popover、Tooltip 背景
    root.style.setProperty('--el-bg-color-page', backgrounds.page, 'important')

    // 侧边栏文字颜色（深色背景用浅色文字）
    root.style.setProperty('--sidebar-text', 'rgba(255, 255, 255, 0.7)', 'important')
    root.style.setProperty('--sidebar-text-active', '#ffffff', 'important')

    // 侧边栏 hover 背景（使用主色的半透明）
    root.style.setProperty('--sidebar-item-hover', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)`)

    // 头部文字颜色（浅色背景用深色文字）
    root.style.setProperty('--header-text', '#303133')

    // === 7. 补充完整的 Element Plus 变量 ===

    // 1. 文本色（保持清晰度，微调色调）
    // 主文字色使用深灰带一点点主题色调
    const textPrimary = '#303133'
    const textRegular = '#606266'
    const textSecondary = '#909399'
    const textPlaceholder = '#a8abb2'
    const textDisabled = '#c0c4cc'

    root.style.setProperty('--el-text-color-primary', textPrimary, 'important')
    root.style.setProperty('--el-text-color-regular', textRegular, 'important')
    root.style.setProperty('--el-text-color-secondary', textSecondary, 'important')
    root.style.setProperty('--el-text-color-placeholder', textPlaceholder, 'important')
    root.style.setProperty('--el-text-color-disabled', textDisabled, 'important')

    // 2. 边框色（调浅，使用更少的主题色混合）
    const borderBase = mixColor(variants.primary, '#dcdfe6', 2) // 2% 主题色
    const borderLight = mixColor(variants.primary, '#e4e7ed', 2)
    const borderLighter = mixColor(variants.primary, '#ebeef5', 2)
    const borderExtraLight = mixColor(variants.primary, '#f2f6fc', 2)

    root.style.setProperty('--el-border-color', borderBase, 'important')
    root.style.setProperty('--el-border-color-light', borderLight, 'important')
    root.style.setProperty('--el-border-color-lighter', borderLighter, 'important')
    root.style.setProperty('--el-border-color-extra-light', borderExtraLight, 'important')
    root.style.setProperty('--el-border-color-dark', '#d4d7de', 'important')
    root.style.setProperty('--el-border-color-darker', '#cdd0d6', 'important')

    // 3. 填充色系列（基于主题色的浅色变体）
    // 已经在前面设置了部分 fill-color，这里补充完整
    // fill-color 使用 tableHeaderBg (18% 主题色)
    // fill-color-light 使用 tableHoverBg (8% 主题色)
    const fillLighter = mixColor(variants.primary, '#ffffff', 82) // 18% 主题色 - 加深
    const fillExtraLight = mixColor(variants.primary, '#ffffff', 90) // 10% 主题色

    root.style.setProperty('--el-fill-color', tableHeaderBg, 'important')
    root.style.setProperty('--el-fill-color-light', tableHoverBg, 'important')
    root.style.setProperty('--el-fill-color-lighter', fillLighter, 'important')
    root.style.setProperty('--el-fill-color-extra-light', fillExtraLight, 'important')
    root.style.setProperty('--el-fill-color-dark', '#ebedf0', 'important')
    root.style.setProperty('--el-fill-color-darker', '#e6e8eb', 'important')

    // 4. UI 结构类（圆角等，保持默认但可定制）
    root.style.setProperty('--el-border-radius-base', '4px', 'important')
    root.style.setProperty('--el-border-radius-small', '2px', 'important')
    root.style.setProperty('--el-border-radius-round', '20px', 'important')
    root.style.setProperty('--el-border-radius-circle', '100%', 'important')

    // 5. 禁用状态（统一管理）
    root.style.setProperty('--el-disabled-bg-color', '#f5f7fa', 'important')
    root.style.setProperty('--el-disabled-text-color', '#c0c4cc', 'important')
    root.style.setProperty('--el-disabled-border-color', '#ebeef5', 'important')

    // 6. 交互效果（Input focus 阴影等）
    // 使用主题色的 20% 透明度作为 focus 阴影
    root.style.setProperty('--el-input-focus-border-color', variants.primary, 'important')
    // Element Plus 可能不直接支持 input-focus-shadow 变量，通常由组件内部处理
    // 但我们可以设置一些通用的交互变量

    // 7. Loading 遮罩
    root.style.setProperty('--el-mask-color', 'rgba(255, 255, 255, 0.6)', 'important')
    root.style.setProperty('--el-mask-color-extra-light', 'rgba(255, 255, 255, 0.3)', 'important')

    // === 8. 组件特定变量补充 ===

    // 1. 表格特定变量
    // 表头文本颜色
    root.style.setProperty('--el-table-header-text-color', textPrimary, 'important')
    // 条纹行背景色（斑马纹）
    root.style.setProperty('--el-table-striped-row-bg-color', fillExtraLight, 'important')

    // 2. 下拉框特定变量
    // 下拉框背景色（已设置 --el-bg-color-overlay，这里补充专用变量）
    root.style.setProperty('--el-select-dropdown-bg-color', cardBg, 'important')
    // 强制覆盖 Element Plus 可能使用的通用背景变量，确保下拉框背景生效
    // Element Plus 的 .el-select-dropdown__wrap 默认使用 --el-bg-color
    // 我们通过 CSS 样式覆盖它，但这里也确保相关变量一致
    root.style.setProperty('--el-bg-color', cardBg, 'important')

    // 下拉项 hover 颜色
    root.style.setProperty('--el-select-option-hover-color', fillLighter, 'important')

    // 3. 分页器特定变量
    root.style.setProperty('--el-pagination-bg-color', cardBg, 'important')
    root.style.setProperty('--el-pagination-hover-bg-color', fillLighter, 'important')
    root.style.setProperty('--el-pagination-active-bg-color', variants.primary, 'important')
    root.style.setProperty('--el-pagination-active-text-color', '#ffffff', 'important')
  }

  // 保存主题到 localStorage
  localStorage.setItem('app-theme', themeName)
}

// 重置主题（用于切换到暗黑模式或默认模式）
export const resetTheme = () => {
  const root = document.documentElement

  // 移除自定义背景色，让 Element Plus 的暗黑模式样式生效
  root.style.removeProperty('--bg-page')
  root.style.removeProperty('--sidebar-bg')
  root.style.removeProperty('--header-bg')
  root.style.removeProperty('--sidebar-text')
  root.style.removeProperty('--sidebar-text-active')
  root.style.removeProperty('--sidebar-item-hover')
  root.style.removeProperty('--header-text')
  root.style.removeProperty('--bg-color')
  root.style.removeProperty('--el-bg-color')
  root.style.removeProperty('--el-bg-color-overlay')
  root.style.removeProperty('--el-fill-color-blank')
  root.style.removeProperty('--el-fill-color')
  root.style.removeProperty('--el-fill-color-light')
  root.style.removeProperty('--el-bg-color-page')
  root.style.removeProperty('--el-table-row-hover-bg-color')
  root.style.removeProperty('--el-table-current-row-bg-color')
  root.style.removeProperty('--el-table-bg-color')
  root.style.removeProperty('--el-table-tr-bg-color')
  root.style.removeProperty('--el-table-header-bg-color')
  root.style.removeProperty('--el-table-expanded-cell-bg-color')
  root.style.removeProperty('--el-pagination-bg-color')
  root.style.removeProperty('--el-pagination-hover-color')

  // 移除状态色（让暗黑模式使用默认的状态色）
  // 成功色
  root.style.removeProperty('--el-color-success')
  root.style.removeProperty('--el-color-success-light-3')
  root.style.removeProperty('--el-color-success-light-5')
  root.style.removeProperty('--el-color-success-light-7')
  root.style.removeProperty('--el-color-success-light-8')
  root.style.removeProperty('--el-color-success-light-9')
  root.style.removeProperty('--el-color-success-dark-2')

  // 警告色
  root.style.removeProperty('--el-color-warning')
  root.style.removeProperty('--el-color-warning-light-3')
  root.style.removeProperty('--el-color-warning-light-5')
  root.style.removeProperty('--el-color-warning-light-7')
  root.style.removeProperty('--el-color-warning-light-8')
  root.style.removeProperty('--el-color-warning-light-9')
  root.style.removeProperty('--el-color-warning-dark-2')

  // 危险色
  root.style.removeProperty('--el-color-danger')
  root.style.removeProperty('--el-color-danger-light-3')
  root.style.removeProperty('--el-color-danger-light-5')
  root.style.removeProperty('--el-color-danger-light-7')
  root.style.removeProperty('--el-color-danger-light-8')
  root.style.removeProperty('--el-color-danger-light-9')
  root.style.removeProperty('--el-color-danger-dark-2')

  // 信息色
  root.style.removeProperty('--el-color-info')
  root.style.removeProperty('--el-color-info-light-3')
  root.style.removeProperty('--el-color-info-light-5')
  root.style.removeProperty('--el-color-info-light-7')
  root.style.removeProperty('--el-color-info-light-8')
  root.style.removeProperty('--el-color-info-light-9')
  root.style.removeProperty('--el-color-info-dark-2')

  // 移除文本色
  root.style.removeProperty('--el-text-color-primary')
  root.style.removeProperty('--el-text-color-regular')
  root.style.removeProperty('--el-text-color-secondary')
  root.style.removeProperty('--el-text-color-placeholder')
  root.style.removeProperty('--el-text-color-disabled')

  // 移除边框色
  root.style.removeProperty('--el-border-color')
  root.style.removeProperty('--el-border-color-light')
  root.style.removeProperty('--el-border-color-lighter')
  root.style.removeProperty('--el-border-color-extra-light')
  root.style.removeProperty('--el-border-color-dark')
  root.style.removeProperty('--el-border-color-darker')

  // 移除填充色
  root.style.removeProperty('--el-fill-color-lighter')
  root.style.removeProperty('--el-fill-color-extra-light')
  root.style.removeProperty('--el-fill-color-dark')
  root.style.removeProperty('--el-fill-color-darker')

  // 移除 UI 结构类
  root.style.removeProperty('--el-border-radius-base')
  root.style.removeProperty('--el-border-radius-small')
  root.style.removeProperty('--el-border-radius-round')
  root.style.removeProperty('--el-border-radius-circle')

  // 移除禁用状态
  root.style.removeProperty('--el-disabled-bg-color')
  root.style.removeProperty('--el-disabled-text-color')
  root.style.removeProperty('--el-disabled-border-color')

  // 移除交互变量
  root.style.removeProperty('--el-input-focus-border-color')
  root.style.removeProperty('--el-mask-color')
  root.style.removeProperty('--el-mask-color-extra-light')

  // 移除组件特定变量
  root.style.removeProperty('--el-table-header-text-color')
  root.style.removeProperty('--el-table-striped-row-bg-color')
  root.style.removeProperty('--el-select-dropdown-bg-color')
  root.style.removeProperty('--el-select-option-hover-color')
  root.style.removeProperty('--el-pagination-bg-color')
  root.style.removeProperty('--el-pagination-hover-bg-color')
  root.style.removeProperty('--el-pagination-active-bg-color')
  root.style.removeProperty('--el-pagination-active-text-color')
}

// 初始化主题
export const initTheme = () => {
  const savedTheme = localStorage.getItem('app-theme')
  // 默认主题和暗黑模式使用 Element Plus 原生样式，不需要加载自定义主题色
  if (savedTheme && savedTheme !== 'default' && savedTheme !== 'dark') {
    loadTheme(savedTheme)
  }
}
