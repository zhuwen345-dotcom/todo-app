# 待办

Apple 风格的 React + TypeScript Todo 应用：云端登录、暗黑模式、拖拽排序、多端实时同步。

线上地址：https://todo-app-pi-one-97.vercel.app

## 开始

1. 复制环境变量并填入你的 Supabase 项目：

```bash
cp .env.example .env.local
```

2. 在 [Supabase](https://supabase.com) 新建项目，打开 **SQL Editor**，把 `supabase/schema.sql` 整段执行一遍。

3. 建议关闭邮箱确认，否则注册后必须点邮件才能登录：  
   **Authentication → Providers → Email → Confirm email** 关掉。

4. 从 **Settings → API** 复制 `Project URL` 和密钥。新控制台叫 **publishable key**（`sb_publishable_...`），旧控制台叫 **anon public**，是同一个用途，写入 `.env.local`：

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_...
```

5. 安装并启动：

```bash
npm install
npm run dev
```

用同一个邮箱在电脑和手机打开网站并登录，待办会实时同步。

## 功能

- 云端注册 / 登录 / 退出
- 新增、点击文字编辑、删除待办
- 圆形勾选完成；已完成项带删除线
- 右侧手柄拖拽排序
- 浅色 / 深色模式（保存在本机）
- 全部 / 未完成 / 已完成筛选
- 电脑与手机实时同步同一账号的数据

## 部署到 Vercel

在 Vercel 项目里添加环境变量（Production / Preview 都要加）：

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`（publishable key 填这里即可）

然后：

```bash
npx vercel login
npm run deploy
```

Windows 也可双击 `deploy.cmd`，或：

```powershell
.\scripts\deploy.ps1 --prod
```

Vite 会把 `VITE_` 变量打进前端包，anon key 本来就是公开的，真正的权限靠数据库 RLS。

## 技术

Vite、React、TypeScript、Tailwind CSS、@dnd-kit、Supabase（Auth + Postgres + Realtime）。
