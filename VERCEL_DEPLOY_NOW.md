# 🚀 立即部署到 Vercel

## 为什么选择 Vercel？

- ✅ **完美解决跨域问题** - 通过反向代理，前后端在同一域名下
- ✅ **Cookie 正常工作** - 支持携带凭据，登录状态正常维护
- ✅ **完全免费** - 个人项目免费使用
- ✅ **自动部署** - 推送到 GitHub 自动重新部署
- ✅ **全球 CDN** - 访问速度更快

## 📝 部署步骤（只需 5 分钟）

### 方式一：通过网站部署（最简单 ⭐推荐）

1. **访问 Vercel 网站**
   - 打开 https://vercel.com

2. **登录**
   - 点击右上角 "Sign Up" 或 "Log In"
   - 选择 "Continue with GitHub"
   - 授权 Vercel 访问你的 GitHub

3. **导入项目**
   - 登录后，点击 "Add New..." → "Project"
   - 在列表中找到 `anxinfu` 仓库
   - 点击 "Import"

4. **配置项目（保持默认即可）**
   - Project Name: `anxinfu`（可以修改）
   - Framework Preset: Vite（自动检测）
   - Root Directory: `./`
   - Build Command: `pnpm build`
   - Output Directory: `dist`
   - 点击 "Deploy"

5. **等待部署完成**
   - 大约 1-2 分钟
   - 部署成功后会显示预览链接

6. **访问你的网站**
   - 点击预览链接或访问：`https://anxinfu.vercel.app`
   - 你会获得一个免费域名

### 方式二：通过命令行部署

```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 登录 Vercel
vercel login

# 3. 部署（第一次）
vercel

# 4. 生产环境部署
vercel --prod
```

## 🔧 工作原理

### 请求流程

```
你的浏览器
    ↓
访问 https://anxinfu.vercel.app
    ↓
前端页面加载
    ↓
发起 API 请求：/api/index/login/login.html
    ↓
Vercel Rewrites 自动代理
    ↓
转发到：https://axf.anxinfupp.com/index/login/login.html
    ↓
后端返回数据 + Set-Cookie
    ↓
Cookie 保存成功（同域！）
    ↓
后续请求自动携带 Cookie
```

### 关键配置文件

**vercel.json** - 反向代理配置

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

这个配置让 Vercel 把所有 `/api/` 开头的请求转发到真实的后端 API。

## 🎯 部署后

### 自动部署

之后每次你推送代码到 GitHub：

```bash
git add .
git commit -m "更新功能"
git push
```

Vercel 会自动：

1. 检测到代码变更
2. 自动构建
3. 自动部署
4. 发送部署成功通知

### 查看部署

- 访问 https://vercel.com/dashboard
- 可以看到所有部署历史
- 每次提交都会生成预览链接

### 环境变量（可选）

如果需要配置环境变量：

1. 进入项目设置
2. 点击 "Environment Variables"
3. 添加变量（如 `VITE_API_BASE_URL`）

## ⚠️ 注意事项

1. **不要再部署到 GitHub Pages**
   - GitHub Pages 不支持反向代理
   - 会继续遇到跨域和 Cookie 问题

2. **保持 vercel.json 文件**
   - 这个文件是反向代理的核心配置
   - 不要删除或修改

3. **首次部署可能需要等待**
   - Vercel 需要构建项目
   - 通常 1-2 分钟完成

## 🆘 遇到问题？

### 问题1：构建失败

- 检查 `package.json` 中的构建命令
- 确保所有依赖都已安装
- 查看 Vercel 的构建日志

### 问题2：部署成功但页面空白

- 检查 `vite.config.ts` 中的 `base` 是否为 `'/'`
- 查看浏览器控制台是否有错误

### 问题3：API 请求失败

- 确保 `vercel.json` 配置正确
- 检查请求 URL 是否以 `/api` 开头
- 查看网络请求是否被正确代理

## 🎉 完成！

部署成功后，你的应用将：

- ✅ 没有跨域问题
- ✅ Cookie 正常工作
- ✅ 登录状态正常
- ✅ 全球 CDN 加速
- ✅ 自动 HTTPS

享受你的应用吧！🚀
