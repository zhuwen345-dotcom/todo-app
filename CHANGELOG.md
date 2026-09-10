# 更新日志

本文件记录项目的可见变化。

## [1.1.1] - 2026-03-10

### 修复

- **手机无法将待办标为已完成**（提示「请检查网络后重试」）
- 勾选改为可重试的保存，避开部分移动网络对 PATCH 的拦截
- 勾选按钮加大点击区域，避免误触拖拽
- 鉴权改为读取本地会话，勾选时少一次额外网络请求

线上已发布：https://todo-app-zhuwen345.netlify.app

## [1.1.0] - 2026-03-10

### 新增

- 增加 **Netlify** 生产站点，国内网络可直接打开、登录，并同步已有待办  
  https://todo-app-zhuwen345.netlify.app
- 增加 `netlify.toml`（`dist` 发布目录、SPA 回退到 `index.html`）

### 变更

- README 将 Netlify 作为推荐线上地址
- 原 Vercel 地址保留为备用：https://todo-app-pi-one-97.vercel.app  
  （`*.vercel.app` 在部分网络下需要代理）

## [1.0.0] - 2026-03-10

### 新增

- Apple 风格待办：登录 / 注册、暗黑模式、拖拽排序
- 使用 Supabase 做云端账号、数据库和多端实时同步
- 首次发布到 GitHub 与 Vercel
