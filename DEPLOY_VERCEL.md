# 部署到 Vercel 指南

本项目使用 Vercel 部署以解决跨域问题并支持 Cookie 认证。

## 🚀 部署步骤

### 方式一：通过 Vercel CLI（推荐）

1. **安装 Vercel CLI**
```bash
npm i -g vercel
```

2. **登录 Vercel**
```bash
vercel login
```

3. **部署项目**
```bash
# 第一次部署
vercel

# 生产环境部署
vercel --prod
```

### 方式二：通过 Vercel 网站（更简单）

1. 访问 [vercel.com](https://vercel.com)
2. 使用 GitHub 账号登录
3. 点击 "Import Project"
4. 选择你的 GitHub 仓库
5. Vercel 会自动检测项目配置并部署

## 📝 工作原理

### Vercel Rewrites 代理配置

在 `vercel.json` 中配置了反向代理：

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

### 请求流程

1. 前端发起请求：`/api/index/login/login.html`
2. Vercel 收到请求，通过 rewrites 规则代理到：`https://axf.anxinfupp.com/index/login/login.html`
3. 后端响应，Vercel 将响应返回给前端
4. **Cookie 在同域下正常工作**，无跨域问题

### 为什么这样可以解决问题？

- ✅ 前端和 API 在同一个域名下（都是你的 Vercel 域名）
- ✅ 不存在跨域问题
- ✅ Cookie 可以正常发送和接收
- ✅ 不需要修改后端 CORS 配置

## 🔧 本地开发

本地开发仍然使用 Vite 的代理配置：

```bash
pnpm dev
```

Vite 会将 `/admin` 和 `/index` 请求代理到 `https://axf.anxinfupp.com`

## 🌐 访问地址

部署成功后，Vercel 会提供：
- 预览地址：`https://your-project-xxx.vercel.app`
- 生产地址：`https://your-project.vercel.app`

你也可以绑定自定义域名。

## ⚠️ 注意事项

1. 确保 `vercel.json` 文件在项目根目录
2. 不需要再部署到 GitHub Pages
3. 每次 push 到 main 分支，Vercel 会自动重新部署
4. 可以在 Vercel 控制台查看部署日志和状态

## 🎯 优势

相比 GitHub Pages：
- ✅ 支持反向代理，解决跨域问题
- ✅ 支持 Cookie 和凭据
- ✅ 自动 HTTPS
- ✅ 全球 CDN 加速
- ✅ 自动部署（push 即部署）
- ✅ 支持环境变量
- ✅ 更好的性能

## 📚 更多资源

- [Vercel 官方文档](https://vercel.com/docs)
- [Vercel Rewrites 文档](https://vercel.com/docs/concepts/projects/project-configuration#rewrites)

