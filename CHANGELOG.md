# 更新日志

本文件记录项目的可见变化。

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
