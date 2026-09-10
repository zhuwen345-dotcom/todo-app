import { Check, Eye, EyeOff, Moon, Sun } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import type { Theme } from '../types'

type LoginPageProps = {
  theme: Theme
  onToggleTheme: () => void
  error: string | null
  info: string | null
  submitting: boolean
  configured: boolean
  onLogin: (email: string, password: string) => Promise<void>
  onRegister: (name: string, email: string, password: string) => Promise<void>
  onClearError: () => void
}

type Mode = 'login' | 'register'

export function LoginPage({
  theme,
  onToggleTheme,
  error,
  info,
  submitting,
  configured,
  onLogin,
  onRegister,
  onClearError,
}: LoginPageProps) {
  const [mode, setMode] = useState<Mode>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  const displayError = localError ?? error
  const isRegister = mode === 'register'

  function switchMode(next: Mode) {
    setMode(next)
    setLocalError(null)
    onClearError()
    setPassword('')
    setConfirm('')
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setLocalError(null)
    onClearError()

    if (!configured) {
      setLocalError('云端尚未配置，请先完成 Supabase 设置')
      return
    }

    if (isRegister) {
      if (!name.trim()) {
        setLocalError('请填写姓名')
        return
      }
      if (password !== confirm) {
        setLocalError('两次输入的密码不一致')
        return
      }
    }

    try {
      if (isRegister) {
        await onRegister(name.trim(), email.trim(), password)
      } else {
        await onLogin(email.trim(), password)
      }
    } catch {
      /* error is shown via props */
    }
  }

  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-[430px] flex-col px-6 pb-10 pt-8">
      <button
        type="button"
        onClick={onToggleTheme}
        aria-label={theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'}
        className="absolute right-6 top-8 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#1D1D1F] shadow-[0_1px_2px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.04)] transition-transform active:scale-95 dark:bg-[#1C1C1E] dark:text-[#F5F5F7]"
      >
        {theme === 'dark' ? <Sun size={18} strokeWidth={1.75} /> : <Moon size={18} strokeWidth={1.75} />}
      </button>

      <div className="animate-rise-in flex flex-1 flex-col justify-center">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-[18px] bg-[#007AFF] shadow-[0_8px_24px_rgba(0,122,255,0.35)]">
            <Check size={32} strokeWidth={2.6} className="text-white" />
          </div>
          <h1 className="text-[34px] font-bold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7]">
            {isRegister ? '创建账号' : '登录'}
          </h1>
          <p className="mt-2 text-[15px] text-[#86868B]">
            {isRegister ? '注册后即可在电脑和手机间同步待办' : '使用同一账号在各设备间实时同步'}
          </p>
        </div>

        {!configured ? (
          <div className="mb-4 rounded-2xl bg-[#FFF6E5] px-4 py-3 text-[13px] leading-5 text-[#8A5A00] dark:bg-[#3A2A10] dark:text-[#F5D9A6]">
            还没有配置云端数据库。请在 Supabase 创建项目，把 URL 和 anon key 写入
            <span className="font-medium"> .env.local </span>
            与 Vercel 环境变量，并执行
            <span className="font-medium"> supabase/schema.sql</span>。
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div
            className={`overflow-hidden rounded-2xl bg-white dark:bg-[#1C1C1E] ${
              displayError ? 'animate-shake' : ''
            }`}
          >
            {isRegister ? (
              <label className="block border-b border-black/[0.06] px-4 py-2.5 dark:border-white/[0.08]">
                <span className="text-[12px] font-medium text-[#86868B]">姓名</span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  autoComplete="name"
                  required
                  placeholder="怎么称呼你"
                  className="mt-0.5 w-full bg-transparent text-[17px] text-[#1D1D1F] outline-none placeholder:text-[#C7C7CC] dark:text-[#F5F5F7] dark:placeholder:text-[#636366]"
                />
              </label>
            ) : null}
            <label className="block border-b border-black/[0.06] px-4 py-2.5 dark:border-white/[0.08]">
              <span className="text-[12px] font-medium text-[#86868B]">邮箱</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
                placeholder="name@example.com"
                className="mt-0.5 w-full bg-transparent text-[17px] text-[#1D1D1F] outline-none placeholder:text-[#C7C7CC] dark:text-[#F5F5F7] dark:placeholder:text-[#636366]"
              />
            </label>
            <label className="block px-4 py-2.5">
              <span className="text-[12px] font-medium text-[#86868B]">密码</span>
              <span className="mt-0.5 flex items-center gap-2">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete={isRegister ? 'new-password' : 'current-password'}
                  required
                  minLength={6}
                  placeholder={isRegister ? '至少 6 位' : '输入密码'}
                  className="w-full bg-transparent text-[17px] text-[#1D1D1F] outline-none placeholder:text-[#C7C7CC] dark:text-[#F5F5F7] dark:placeholder:text-[#636366]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? '隐藏密码' : '显示密码'}
                  className="text-[#8E8E93]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </span>
            </label>
            {isRegister ? (
              <label className="block border-t border-black/[0.06] px-4 py-2.5 dark:border-white/[0.08]">
                <span className="text-[12px] font-medium text-[#86868B]">确认密码</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirm}
                  onChange={(event) => setConfirm(event.target.value)}
                  autoComplete="new-password"
                  required
                  placeholder="再输入一次"
                  className="mt-0.5 w-full bg-transparent text-[17px] text-[#1D1D1F] outline-none placeholder:text-[#C7C7CC] dark:text-[#F5F5F7] dark:placeholder:text-[#636366]"
                />
              </label>
            ) : null}
          </div>

          {displayError ? (
            <p className="px-1 text-center text-[13px] font-medium text-[#FF3B30]">{displayError}</p>
          ) : null}
          {info && !displayError ? (
            <p className="px-1 text-center text-[13px] font-medium text-[#007AFF]">{info}</p>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="flex h-12 items-center justify-center rounded-xl bg-[#007AFF] text-[17px] font-semibold text-white shadow-[0_8px_20px_rgba(0,122,255,0.28)] transition-transform active:scale-[0.99] disabled:opacity-60"
          >
            {submitting ? (
              <span className="apple-spinner apple-spinner-light" />
            ) : isRegister ? (
              '注册并登录'
            ) : (
              '继续'
            )}
          </button>
        </form>

        <button
          type="button"
          onClick={() => switchMode(isRegister ? 'login' : 'register')}
          className="mt-5 text-[15px] font-medium text-[#007AFF]"
        >
          {isRegister ? '已有账号？登录' : '没有账号？注册'}
        </button>

        <p className="mt-8 text-center text-[12px] leading-5 text-[#8E8E93]">
          账号保存在云端。电脑和手机用同一个邮箱登录后，待办会实时同步。
        </p>
      </div>
    </div>
  )
}
