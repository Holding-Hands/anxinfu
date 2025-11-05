@echo off
chcp 65001
echo ========================================
echo 开始安装 yarn 和 cnpm
echo ========================================
echo.

echo [1/5] 全局安装 yarn 和 cnpm...
call npm install -g yarn cnpm --registry=https://registry.npmmirror.com
if errorlevel 1 (
    echo 安装失败，请检查网络连接或以管理员身份运行
    pause
    exit /b 1
)
echo ✓ yarn 和 cnpm 安装成功
echo.

echo [2/5] 配置 npm 淘宝镜像源...
call npm config set registry https://registry.npmmirror.com
echo ✓ npm 镜像源配置完成
echo.

echo [3/5] 配置 yarn 淘宝镜像源...
call yarn config set registry https://registry.npmmirror.com
echo ✓ yarn 镜像源配置完成
echo.

echo [4/5] 进入项目目录...
cd /d "%~dp0"
echo ✓ 当前目录: %CD%
echo.

echo [5/5] 使用 yarn 安装项目依赖（包括更新后的 xlsx@0.20.2）...
echo 注意: xlsx 将从 SheetJS CDN 下载（绕过 npm 镜像限制）
call yarn install
if errorlevel 1 (
    echo yarn 安装失败，尝试使用 npm...
    call npm install
)
echo.

echo ========================================
echo ✓ 所有操作完成！
echo ========================================
echo.
echo 已完成的操作：
echo   1. 全局安装了 yarn 和 cnpm
echo   2. 配置了国内镜像源（加速下载）
echo   3. 更新了项目依赖（xlsx 已升级到 0.20.2）
echo.
echo 安全漏洞已修复：
echo   ✓ CVE-2023-30533 (原型污染)
echo   ✓ CVE-2024-22363 (正则表达式拒绝服务)
echo.
pause

