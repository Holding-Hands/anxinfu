# Element Plus 主题变量完整指南

当前主题系统已设置的变量：

## 1. 主色系（Primary Color）

```css
--el-color-primary              /* 主色 */
--el-color-primary-light-1      /* 10% 浅色 */
--el-color-primary-light-2      /* 20% 浅色 */
--el-color-primary-light-3      /* 30% 浅色（hover 常用） */
--el-color-primary-light-4      /* 40% 浅色 */
--el-color-primary-light-5      /* 50% 浅色（边框常用） */
--el-color-primary-light-6      /* 60% 浅色 */
--el-color-primary-light-7      /* 70% 浅色 */
--el-color-primary-light-8      /* 80% 浅色 */
--el-color-primary-light-9      /* 90% 浅色（背景常用） */
--el-color-primary-dark-1       /* 10% 深色 */
--el-color-primary-dark-2       /* 20% 深色（active 常用） */
```

## 2. 链接颜色（Link Color）

```css
--el-color-link                 /* 链接主色 */
--el-color-link-light-3         /* 链接 hover */
--el-color-link-light-5         /* 链接辅助 */
--el-color-link-light-7         /* 链接禁用 */
--el-color-link-light-9         /* 链接背景 */
--el-color-link-dark-2          /* 链接 active */
```

## 3. 边框颜色（Border）

```css
--el-border-color-hover         /* hover 状态边框 */
```

## 4. 阴影（Box Shadow）

```css
--el-box-shadow-light           /* 轻阴影 */
--el-box-shadow                 /* 标准阴影 */
--el-box-shadow-dark            /* 深阴影 */
```

## 5. 填充色（Fill）

```css
--el-fill-color-light           /* 浅填充色（选中背景等） */
```

## 6. 自定义变量

```css
--primary-color                 /* 项目主色 */
--primary-light                 /* 项目浅色 */
```

---

## 可扩展的其他变量

### 文字颜色

```css
--el-text-color-primary         /* 主要文字 */
--el-text-color-regular         /* 常规文字 */
--el-text-color-secondary       /* 次要文字 */
--el-text-color-placeholder     /* 占位文字 */
--el-text-color-disabled        /* 禁用文字 */
```

### 背景颜色

```css
--el-bg-color                   /* 基础背景 */
--el-bg-color-page              /* 页面背景 */
--el-bg-color-overlay           /* 遮罩背景 */
```

### 填充色系列

```css
--el-fill-color                 /* 基础填充 */
--el-fill-color-light           /* 浅填充 */
--el-fill-color-lighter         /* 更浅填充 */
--el-fill-color-extra-light     /* 极浅填充 */
--el-fill-color-dark            /* 深填充 */
--el-fill-color-darker          /* 更深填充 */
--el-fill-color-blank           /* 空白填充 */
```

### 边框

```css
--el-border-color               /* 基础边框 */
--el-border-color-light         /* 浅边框 */
--el-border-color-lighter       /* 更浅边框 */
--el-border-color-extra-light   /* 极浅边框 */
--el-border-color-dark          /* 深边框 */
--el-border-color-darker        /* 更深边框 */
--el-border-width               /* 边框宽度 */
--el-border-style               /* 边框样式 */
--el-border-radius-base         /* 基础圆角 */
--el-border-radius-small        /* 小圆角 */
--el-border-radius-round        /* 圆形圆角 */
--el-border-radius-circle       /* 圆圈 */
```

### 其他状态色

```css
--el-color-success              /* 成功色 */
--el-color-warning              /* 警告色 */
--el-color-danger               /* 危险色 */
--el-color-error                /* 错误色 */
--el-color-info                 /* 信息色 */
```

### 遮罩

```css
--el-overlay-color              /* 遮罩颜色 */
--el-overlay-color-light        /* 浅遮罩 */
--el-overlay-color-lighter      /* 更浅遮罩 */
```

### 组件尺寸

```css
--el-component-size-large       /* 大尺寸 */
--el-component-size             /* 默认尺寸 */
--el-component-size-small       /* 小尺寸 */
```

### 字体

```css
--el-font-size-extra-large      /* 特大字号 */
--el-font-size-large            /* 大字号 */
--el-font-size-medium           /* 中字号 */
--el-font-size-base             /* 基础字号 */
--el-font-size-small            /* 小字号 */
--el-font-size-extra-small      /* 特小字号 */
--el-font-family                /* 字体家族 */
--el-font-weight-primary        /* 主要字重 */
--el-font-line-height-primary   /* 主要行高 */
```

### 禁用状态

```css
--el-disabled-bg-color          /* 禁用背景 */
--el-disabled-text-color        /* 禁用文字 */
--el-disabled-border-color      /* 禁用边框 */
```

### 过渡动画

```css
--el-transition-duration        /* 过渡时长 */
--el-transition-duration-fast   /* 快速过渡 */
--el-transition-function        /* 过渡函数 */
```

### z-index 层级

```css
--el-index-normal               /* 普通层级 */
--el-index-top                  /* 顶层 */
--el-index-popper               /* 弹出层 */
```

---

## 使用建议

1. **核心变量优先**：主色、链接色、边框、阴影是最影响视觉的变量
2. **保持一致性**：同一类型的变量使用相同的生成逻辑
3. **测试暗黑模式**：确保所有自定义变量在暗黑模式下也能正常显示
4. **性能考虑**：只设置必要的变量，避免过度定制

## 当前实现状态

✅ 已实现：

- 主色系完整变体
- 链接颜色系列
- 边框 hover 色
- 带主色调的阴影
- 选中状态背景色

⏳ 可扩展：

- 文字颜色系列（如需要不同主题有不同文字色调）
- 圆角大小（如需要不同主题有不同圆角风格）
- 字体配置（如需要特定主题使用特定字体）
- 状态色定制（如需要每个主题有独特的成功/警告色）
