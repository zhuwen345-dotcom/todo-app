#Requires -Version 5.1
$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

function Need-Command($Name) {
  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    Write-Error "未找到 $Name，请先安装 Node.js：https://nodejs.org/"
    exit 1
  }
}

Need-Command node
Need-Command npm

if (-not (Test-Path (Join-Path $Root "node_modules"))) {
  Write-Host "安装依赖…" -ForegroundColor Cyan
  npm install
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}

Write-Host "开始部署到 Vercel…" -ForegroundColor Cyan
node (Join-Path $Root "scripts\deploy.mjs") @args
exit $LASTEXITCODE
