# 🎯 安鑫付 - 后台管理系统

<div align="center">

一个基于 **Vue 3** + **TypeScript** + **Vite** + **Element Plus** 的现代化后台管理系统

[![Vue](https://img.shields.io/badge/Vue-3.4-brightgreen.svg)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-yellow.svg)](https://vitejs.dev/)
[![Element Plus](https://img.shields.io/badge/Element%20Plus-2.4-409EFF.svg)](https://element-plus.org/)

</div>

---

## ✨ 特性

- 🚀 **最新技术栈**：Vue 3 + TypeScript + Vite 5
- ⚡ **自动导入**：API 和组件无需手动 import
- 🎨 **炫酷登录页**：Three.js 3D 粒子动画
- 📊 **数据可视化**：ECharts 图表集成
- 🔐 **权限管理**：完整的登录认证系统
- 📱 **响应式设计**：支持移动端和桌面端
- 🎯 **代码规范**：ESLint + Prettier + Husky
- 🌈 **现代化 UI**：Element Plus 组件库
- 🔥 **开发体验**：Vite HMR 快速热更新

---

## 📦 快速开始

### 环境要求

- Node.js >= 16.x
- npm >= 8.x 或 pnpm >= 8.x

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

**默认账号：**

- 账号：`admin`
- 密码：`admin123`

---

## 🛠️ 技术栈

### 核心框架

- **Vue 3** - 渐进式 JavaScript 框架
- **TypeScript** - JavaScript 超集
- **Vite** - 新一代前端构建工具

### 状态管理 & 路由

- **Pinia** - Vue 状态管理
- **Vue Router** - 官方路由

### UI 组件库

- **Element Plus** - Vue 3 组件库
- **Element Plus Icons** - 图标库

### 工具库

- **Axios** - HTTP 客户端
- **Three.js** - 3D 图形库
- **ECharts** - 数据可视化
- **SCSS** - CSS 预处理器

### 代码规范

- **ESLint** - 代码检查
- **Prettier** - 代码格式化
- **Husky** - Git Hooks
- **lint-staged** - 暂存区检查

### 自动化工具

- **unplugin-auto-import** - API 自动导入
- **unplugin-vue-components** - 组件自动导入

---

## 📜 可用脚本

```bash
# 开发
npm run dev              # 启动开发服务器

# 构建
npm run build            # 构建生产版本
npm run preview          # 预览构建产物

# 代码检查
npm run lint             # ESLint 检查并自动修复
npm run lint:check       # 仅检查（不修复）

# 代码格式化
npm run format           # Prettier 格式化代码
npm run format:check     # 检查格式（不修复）
```

---

## ⚡ 自动导入功能

### 无需手动 import，直接使用！

**之前的写法：**

```vue
<template>
  <el-button @click="handleClick">{{ count }}</el-button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const count = ref(0)
const router = useRouter()

const handleClick = () => {
  count.value++
  ElMessage.success('成功')
}
</script>
```

**现在的写法：**

```vue
<template>
  <el-button @click="handleClick">{{ count }}</el-button>
</template>

<script setup lang="ts">
// ✅ 无需任何 import，直接使用！

const count = ref(0)
const router = useRouter()

const handleClick = () => {
  count.value++
  ElMessage.success('成功')
}
</script>
```

### 支持自动导入

- ✅ **Vue API**：ref, reactive, computed, watch, onMounted...
- ✅ **Vue Router**：useRouter, useRoute...
- ✅ **Pinia**：defineStore, storeToRefs...
- ✅ **Element Plus**：所有组件（ElButton, ElInput...）
- ✅ **自定义组件**：src/components/ 目录下的组件

### 首次使用

首次运行项目后，需要：

```bash
npm run dev
# 等待自动生成类型文件
# 然后重启 VS Code 或重启 TypeScript Server
# VS Code: Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

---

## 📏 代码规范

### 自动化检查

**保存文件时自动：**

- ✅ ESLint 检查并修复
- ✅ Prettier 格式化

**Git 提交时自动：**

- ✅ 运行 lint-staged
- ✅ 检查暂存的文件
- ✅ 如果有错误，阻止提交

### VS Code 配置

项目已包含 `.vscode/settings.json`，会自动：

- 保存时格式化代码
- 保存时修复 ESLint 错误
- 使用 Prettier 作为默认格式化工具

### 推荐扩展

- Vue Language Features (Volar)
- TypeScript Vue Plugin (Volar)
- ESLint
- Prettier
- SCSS IntelliSense

---

## 🏗️ 构建和部署

### 构建生产版本

```bash
# 构建前检查
npm run lint:check
npm run format:check

# 执行构建
npm run build

# 本地预览
npm run preview
```

### ⚠️ 重要：关于部署

**❌ 错误做法：**

打包后的 `dist` 文件夹**不能**直接双击 `index.html` 运行！

**✅ 正确做法：**

必须通过 **Web 服务器**访问！

---

### 部署方式一：GitHub Pages（免费，已配置）

#### ✅ 已自动配置完成

本项目已配置好 GitHub Pages 自动部署，每次推送代码到 `main` 分支会自动构建和部署。

**访问地址：** https://holding-hands.github.io/anxinfu/

#### 配置步骤

1. **首次部署设置**

```bash
# 1. 进入 GitHub 仓库：https://github.com/Holding-Hands/anxinfu
# 2. 点击 Settings → Pages
# 3. Source 选择：GitHub Actions
# 4. 保存设置
```

2. **推送代码自动部署**

```bash
git add .
git commit -m "feat: 配置 GitHub Pages 部署"
git push
```

3. **查看部署状态**

- 进入 Actions 标签查看部署进度
- 部署成功后访问：https://holding-hands.github.io/anxinfu/

#### 已完成配置

- ✅ `vite.config.ts` - 添加了 `/anxinfu/` 基础路径
- ✅ `src/router/index.ts` - 使用 Hash 路由模式（支持 GitHub Pages）
- ✅ `.github/workflows/deploy.yml` - GitHub Actions 自动部署
- ⚠️ 需要手动创建 `.env.production` 配置后端 API 地址

#### 注意事项

1. **Hash 模式路由**：URL 会包含 `#`，如 `/#/dashboard`
2. **API 地址**：记得在 `.env.production` 中配置正确的后端 API
3. **首次部署**：需要在仓库 Settings 中启用 GitHub Pages

---

### 部署方式二：Nginx（推荐用于生产环境）

#### 1. Nginx 配置

```nginx
server {
    listen 80;
    server_name your-domain.com;  # 改成你的域名
    root /path/to/dist;           # 改成 dist 目录路径
    index index.html;

    # 开启 gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;

    # SPA 路由支持（必须！）
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API 代理（如果需要）
    location /api {
        proxy_pass http://your-backend:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### 2. 重启 Nginx

```bash
sudo nginx -t          # 测试配置
sudo nginx -s reload   # 重启
```

---

### 部署方式三：Vercel（免费）

1. 访问 [https://vercel.com](https://vercel.com)
2. 导入 GitHub 仓库
3. 自动部署完成

**或使用 CLI：**

```bash
npm i -g vercel
vercel
```

---

### 部署方式四：Netlify（免费）

**方式 A：拖拽上传**

1. 访问 [https://www.netlify.com](https://www.netlify.com)
2. 拖拽 `dist` 文件夹
3. 完成部署

**方式 B：GitHub 集成**

创建 `netlify.toml`：

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

### 部署方式五：Docker

#### Dockerfile

```dockerfile
# 构建阶段
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 生产阶段
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### nginx.conf

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
}
```

#### 构建和运行

```bash
docker build -t anxinfu-admin .
docker run -d -p 80:80 anxinfu-admin
```

---

## 📁 项目结构

```
安鑫付/
├── .husky/                  # Git Hooks
├── .vscode/                 # VS Code 配置
├── public/                  # 静态资源
├── src/
│   ├── api/                # API 接口封装
│   │   └── user.ts         # 用户相关接口
│   ├── assets/             # 静态资源文件
│   ├── components/         # 公共组件（自动导入）
│   ├── layout/             # 布局组件
│   │   ├── components/     # Header、Sidebar
│   │   └── index.vue       # 主布局
│   ├── router/             # 路由配置
│   │   └── index.ts        # 路由表
│   ├── stores/             # Pinia 状态管理
│   │   ├── app.ts         # 应用状态
│   │   └── user.ts        # 用户状态
│   ├── styles/             # 全局样式
│   │   └── index.scss     # 主样式
│   ├── types/              # TypeScript 类型
│   │   └── index.ts       # 类型定义
│   ├── utils/              # 工具函数
│   │   └── request.ts     # Axios 封装
│   ├── views/              # 页面组件
│   │   ├── agent/         # 代理商管理
│   │   ├── Login.vue      # 登录页
│   │   ├── Dashboard.vue  # 首页
│   │   └── ...
│   ├── App.vue             # 根组件
│   ├── main.ts             # 入口文件
│   ├── vite-env.d.ts      # 类型声明
│   ├── auto-imports.d.ts  # 自动生成（忽略）
│   └── components.d.ts    # 自动生成（忽略）
├── .eslintrc.cjs           # ESLint 配置
├── .prettierrc             # Prettier 配置
├── .gitignore              # Git 忽略
├── package.json            # 项目配置
├── tsconfig.json           # TS 配置
├── vite.config.ts          # Vite 配置
└── README.md               # 本文件
```

---

## 🎨 功能模块

### 1. 登录系统

- ✅ Three.js 3D 粒子动画背景
- ✅ 表单验证
- ✅ 记住密码
- ✅ Token 管理

### 2. 后台布局

- ✅ 可折叠侧边栏
- ✅ 顶部导航栏
- ✅ 面包屑导航
- ✅ 全屏功能
- ✅ 用户信息下拉菜单

### 3. Dashboard

- ✅ 数据统计卡片
- ✅ ECharts 图表
- ✅ 快捷入口

### 4. 菜单系统

- ✅ 主页
- ✅ 代理商管理（7个子菜单）
- ✅ 产品管理
- ✅ 商城系统
- ✅ 机具管理
- ✅ 财务管理
- ✅ 业务管理
- ✅ 运营管理
- ✅ 团队管理
- ✅ 系统设置

---

## 🔍 常见问题

### Q1: ref、reactive 等提示未定义？

**解决：**

```bash
npm run dev  # 生成类型文件
# 然后重启 VS Code 或 TypeScript Server
```

### Q2: ESLint 报错 "xx is not defined"？

**解决：**

```bash
npm run dev  # 生成 .eslintrc-auto-import.json
# 然后重启 ESLint Server
```

### Q3: 页面刷新后 404 错误？

**原因：** SPA 路由需要服务器配置支持。

**解决：**

- Nginx: 添加 `try_files $uri $uri/ /index.html;`
- Apache: 添加 `.htaccess` 文件
- 云平台: 配置重定向规则

### Q4: 打包后白屏？

**排查步骤：**

1. 打开浏览器控制台查看错误
2. 检查 API 地址配置
3. 确认服务器配置正确
4. 确保 dist 文件完整

### Q5: Git 提交被拒绝？

**原因：** 代码有 ESLint 错误。

**解决：**

```bash
npm run lint  # 自动修复
```

### Q6: 自定义组件没有自动导入？

**检查：**

1. 组件是否在 `src/components/` 目录
2. 组件名是否使用 PascalCase（大驼峰）
3. 是否重启了开发服务器

---

## ⚙️ 环境变量

### 开发环境

创建 `.env.development`：

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### 生产环境

创建 `.env.production`：

```env
VITE_API_BASE_URL=https://api.your-domain.com
```

---

## 🔐 安全建议

### 1. 启用 HTTPS

```bash
# 使用 Let's Encrypt 免费证书
sudo certbot --nginx
```

### 2. 配置安全头

```nginx
add_header X-Frame-Options "SAMEORIGIN";
add_header X-Content-Type-Options "nosniff";
add_header X-XSS-Protection "1; mode=block";
```

### 3. 限制请求

```nginx
# 限制上传大小
client_max_body_size 10M;

# 限制请求速率
limit_req_zone $binary_remote_addr zone=one:10m rate=10r/s;
```

---

## 📊 性能优化

### 已实现

- ✅ 路由懒加载
- ✅ 组件按需导入
- ✅ 代码分割（Vue、Element Plus、ECharts、Three.js）
- ✅ Tree Shaking
- ✅ Gzip 压缩支持

### 优化建议

1. **启用 CDN**：静态资源托管到 CDN
2. **图片优化**：使用 WebP 格式，添加懒加载
3. **缓存策略**：配置合理的缓存时间
4. **监控性能**：使用 Lighthouse 检查

---

## 🔧 开发建议

### Git 提交规范

建议使用以下前缀：

- `feat:` 新功能
- `fix:` 修复 bug
- `docs:` 文档更新
- `style:` 代码格式
- `refactor:` 重构
- `perf:` 性能优化
- `test:` 测试相关
- `chore:` 构建/工具变动

### 代码风格

- 使用 Composition API
- 优先使用 `<script setup>`
- 合理使用 TypeScript 类型
- 组件名使用 PascalCase
- 文件名使用 kebab-case

---

## 📝 待办事项

- [ ] 完善各个业务页面功能
- [ ] 添加更多数据可视化图表
- [ ] 完善权限管理系统
- [ ] 添加单元测试
- [ ] 优化移动端体验
- [ ] 添加主题切换功能
- [ ] 国际化支持

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 🎨 主题换肤功能

### 8 种精美主题

系统现已支持一键切换 8 种主题风格：

| 主题      | 说明           | 特点                     |
| --------- | -------------- | ------------------------ |
| 🔵 默认蓝 | 经典的蓝白配色 | 清新、专业、适合日常使用 |
| 🌙 暗黑夜 | 深色护眼模式   | 适合夜间使用，保护视力   |
| 💜 优雅紫 | 高贵紫色主题   | 优雅大气，彰显品味       |
| 🌿 清新绿 | 自然绿色主题   | 活力清新，舒适自然       |
| 🟠 活力橙 | 充满活力的橙色 | 积极向上，充满能量       |
| 💗 浪漫粉 | 温柔粉色主题   | 温馨浪漫，柔和舒适       |
| 🔷 商务蓝 | 专业深蓝风格   | 正式商务，稳重大气       |
| ❤️ 热情红 | 充满激情的红色 | 热烈奔放，激情四射       |

**使用方式：**

1. **位置**：页面右上角导航栏
2. **按钮**：彩色渐变圆形按钮（会随主题变色）
3. **操作**：点击按钮 → 选择主题 → 立即生效
4. **持久化**：自动保存，下次打开自动应用

**功能特点：**

- ✅ **全局覆盖**：所有页面和组件统一换肤
- ✅ **平滑过渡**：颜色变化带有流畅动画效果
- ✅ **Element Plus 适配**：所有组件完美适配
- ✅ **自动保存**：选择后自动保存到本地
- ✅ **即时生效**：无需刷新页面

---

## 📦 全局常量使用

项目内置了全局常量，避免在各个页面重复定义相同选项。

### 可用常量

- **USER_LEVEL_OPTIONS** - 用户等级选项 (V1-V7)
- **USER_TYPE_OPTIONS** - 用户类别选项 (全部/代理/商户)
- **AUTH_STATUS_OPTIONS** - 实名状态选项 (全部/未认证/已实名)
- **TEAM_OPTIONS** - 所属团队选项
- **LEVEL_TAG_TYPE_MAP** - 等级标签类型映射

### 使用示例

```vue
<template>
  <!-- 下拉选择 -->
  <el-select v-model="level" clearable>
    <el-option
      v-for="item in USER_LEVEL_OPTIONS"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>

  <!-- 显示文本 -->
  <span>{{ USER_LEVEL_MAP[level] }}</span>

  <!-- 标签显示 -->
  <el-tag :type="LEVEL_TAG_TYPE_MAP[level]">{{ level }}</el-tag>
</template>

<script setup lang="ts">
import { USER_LEVEL_OPTIONS, USER_LEVEL_MAP, LEVEL_TAG_TYPE_MAP } from '@/constants'

const level = ref('V1')
</script>
```

---

## 🚀 部署到 Vercel (推荐)

### 为什么选择 Vercel？

- ✅ **完美解决跨域问题** - 通过反向代理，前后端在同一域名下
- ✅ **Cookie 正常工作** - 支持携带凭据，登录状态正常维护
- ✅ **完全免费** - 个人项目免费使用
- ✅ **自动部署** - 推送到 GitHub 自动重新部署
- ✅ **全球 CDN** - 访问速度更快

### 快速部署（5分钟）

1. **访问 Vercel 网站**
   - 打开 https://vercel.com
   - 使用 GitHub 账号登录

2. **导入项目**
   - 点击 "Add New..." → "Project"
   - 选择 `anxinfu` 仓库
   - 点击 "Import"

3. **配置项目（保持默认）**
   - Framework Preset: Vite（自动检测）
   - Build Command: `pnpm build`
   - Output Directory: `dist`
   - 点击 "Deploy"

4. **等待部署完成**
   - 约 1-2 分钟
   - 获得免费域名：`https://your-project.vercel.app`

### 工作原理

通过 `vercel.json` 配置反向代理：

```json
{
  "rewrites": [
    {
      "source": "/api/admin/:path*",
      "destination": "https://axf.anxinfupp.com/admin/:path*"
    },
    {
      "source": "/api/index/:path*",
      "destination": "https://axf.anxinfupp.com/index/:path*"
    }
  ]
}
```

前端请求 `/api/index/login` → Vercel 转发到后端 → Cookie 在同域下正常工作

### 自动部署

每次推送代码到 GitHub，Vercel 会自动构建和部署：

```bash
git add .
git commit -m "更新功能"
git push
```

---

## 🔧 GitHub Pages 部署问题排查

如果使用 GitHub Pages 部署遇到问题（白屏、404等）：

### 问题原因

GitHub Pages 默认部署源代码而非打包文件，且不支持反向代理。

### 解决步骤

1. **配置 GitHub Pages 使用 Actions**
   - 访问：`https://github.com/[你的用户名]/anxinfu/settings/pages`
   - Source 选择：**GitHub Actions**

2. **设置 Actions 权限**
   - 访问：`https://github.com/[你的用户名]/anxinfu/settings/actions`
   - 选择：**Read and write permissions**
   - 勾选：**Allow GitHub Actions to create and approve pull requests**

3. **触发部署**

   ```bash
   git commit --allow-empty -m "chore: 触发 GitHub Pages 部署"
   git push origin main
   ```

4. **查看部署状态**
   - 访问仓库的 Actions 标签
   - 查看部署进度

### 注意事项

- ⚠️ GitHub Pages 使用 Hash 路由模式（URL 会包含 `#`）
- ⚠️ 需要在 `.env.production` 配置后端 API 地址
- ⚠️ 可能仍存在跨域问题，**推荐使用 Vercel 部署**

---

## 📄 License

[MIT](LICENSE)

---

## 🙏 鸣谢

感谢以下开源项目：

- [Vue.js](https://vuejs.org/)
- [Element Plus](https://element-plus.org/)
- [Vite](https://vitejs.dev/)
- [Three.js](https://threejs.org/)
- [ECharts](https://echarts.apache.org/)

---

<div align="center">

**如果这个项目对你有帮助，请给一个 ⭐️ Star！**

Made with ❤️ by 安鑫付团队

</div>
