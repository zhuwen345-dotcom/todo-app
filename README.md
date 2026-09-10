# 待办

Apple 风格的 React + TypeScript Todo 应用：云端登录、暗黑模式、拖拽排序、多端实时同步。

## 线上地址

推荐（国内可直接打开）：

**https://todo-app-zhuwen345.netlify.app**

手机勾选完成已在 v1.1.1 修复。

备用（部分网络需要代理）：

https://todo-app-pi-one-97.vercel.app

更新记录见 [CHANGELOG.md](./CHANGELOG.md)。

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

## 部署

静态托管即可，模拟逻辑已换成 Supabase 云端。构建时需要：

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`（publishable key 填这里即可）

### Netlify（推荐）

仓库里已有 `netlify.toml`。把站点发布目录设为 `dist`，构建命令为 `node scripts/build.mjs`，并在 Netlify 环境变量中填入上面两项。

当前生产站：https://todo-app-zhuwen345.netlify.app

### Vercel

```bash
npx vercel login
npm run deploy
```

Windows 也可双击 `deploy.cmd`。`*.vercel.app` 在部分网络下可能无法直接访问。

## 技术

Vite、React、TypeScript、Tailwind CSS、@dnd-kit、Supabase（Auth + Postgres + Realtime）。
