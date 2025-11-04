# 🚀 GitHub Pages 部署排查指南

## 问题现象
访问 https://holding-hands.github.io/anxinfu/ 显示白屏，控制台报错：
```
GET https://holding-hands.github.io/src/main.ts net::ERR_ABORTED 404 (Not Found)
```

## 🔍 问题原因
部署的是源代码而不是打包后的文件。

---

## ✅ 解决方案（按顺序执行）

### 步骤 1：确认文件已推送

```bash
# 检查本地是否有 .github/workflows/deploy.yml
ls -la .github/workflows/deploy.yml

# 如果没有，说明还没推送，执行：
git add .
git commit -m "feat: 添加 GitHub Actions 自动部署配置"
git push origin main
```

### 步骤 2：配置 GitHub Pages 使用 Actions

1. **访问设置页面**
   - 打开：https://github.com/Holding-Hands/anxinfu/settings/pages

2. **修改 Source 设置**
   - 找到 **Build and deployment** 部分
   - 在 **Source** 下拉菜单选择：**GitHub Actions**
   - ⚠️ 不要选择 "Deploy from a branch"

3. **保存设置**
   - 设置会自动保存

### 步骤 3：配置 Actions 权限

1. **访问 Actions 设置**
   - 打开：https://github.com/Holding-Hands/anxinfu/settings/actions

2. **设置工作流权限**
   - 找到 **Workflow permissions** 部分
   - 选择：**Read and write permissions** （读写权限）
   - 勾选：✅ **Allow GitHub Actions to create and approve pull requests**
   - 点击 **Save** 保存

### 步骤 4：手动触发部署

#### 方法 A：重新推送触发

```bash
# 添加一个空提交来触发 Actions
git commit --allow-empty -m "chore: 触发 GitHub Pages 部署"
git push origin main
```

#### 方法 B：在 GitHub 手动运行

1. 访问：https://github.com/Holding-Hands/anxinfu/actions
2. 点击左侧的 **Deploy to GitHub Pages** 工作流
3. 点击右上角 **Run workflow** 按钮
4. 选择 `main` 分支，点击 **Run workflow**

### 步骤 5：查看部署进度

1. 访问：https://github.com/Holding-Hands/anxinfu/actions
2. 点击最新的工作流运行
3. 查看每个步骤的执行状态
4. 等待所有步骤显示 ✅ 绿色对勾

### 步骤 6：验证部署

部署成功后（约 2-3 分钟）：

1. 清除浏览器缓存（Ctrl + Shift + Delete）
2. 访问：https://holding-hands.github.io/anxinfu/
3. 检查控制台是否还有错误

---

## 🎯 检查清单

完成以下所有检查项：

- [ ] `.github/workflows/deploy.yml` 文件已推送到仓库
- [ ] GitHub Pages Source 设置为 **GitHub Actions**
- [ ] Actions 权限设置为 **Read and write permissions**
- [ ] 已触发至少一次工作流运行
- [ ] 工作流所有步骤都显示 ✅ 成功
- [ ] 访问网站不再有 404 错误

---

## ⚠️ 常见错误

### 错误 1：Actions 失败 - "Error: No pnpm version is specified"

**解决：** 在 `.github/workflows/deploy.yml` 中已指定 pnpm 版本为 8

### 错误 2：权限错误 - "Error: HttpError: Resource not accessible by integration"

**解决：** 按步骤 3 设置 Actions 权限为读写

### 错误 3：仍然加载 src/main.ts

**解决：**
1. 清除浏览器缓存
2. 等待 5-10 分钟让 CDN 更新
3. 使用无痕模式访问

---

## 📞 仍然有问题？

检查以下信息：

1. **Actions 日志**
   - 访问失败的工作流
   - 点击失败的步骤查看详细日志
   - 复制错误信息

2. **浏览器控制台**
   - 按 F12 打开开发者工具
   - 查看 Console 和 Network 标签
   - 截图所有红色错误

3. **当前 Pages 设置**
   - 访问 Settings → Pages
   - 截图当前配置



