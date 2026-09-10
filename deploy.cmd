@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo 未找到 Node.js，请先安装：https://nodejs.org/
  pause
  exit /b 1
)
if not exist "node_modules\" (
  echo 安装依赖…
  call npm install
  if errorlevel 1 (
    pause
    exit /b 1
  )
)
echo 开始部署到 Vercel…
call node scripts\deploy.mjs --prod %*
echo.
pause
exit /b %ERRORLEVEL%
