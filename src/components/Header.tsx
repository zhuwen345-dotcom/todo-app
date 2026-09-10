import { LogOut, Moon, Sun } from 'lucide-react'
import type { Theme } from '../types'

type HeaderProps = {
  theme: Theme
  onToggleTheme: () => void
  activeCount: number
  userName: string
  live: boolean
  onLogout: () => void
}

export function Header({
  theme,
  onToggleTheme,
  activeCount,
  userName,
  live,
  onLogout,
}: HeaderProps) {
  const subtitle =
    activeCount === 0 ? '全部完成' : `${activeCount} 项未完成`

  return (
    <header className="flex items-end justify-between gap-4 px-1 pb-5">
      <div className="min-w-0">
        <h1 className="text-[34px] font-bold leading-none tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7]">
          待办
        </h1>
        <p className="mt-2 flex items-center gap-2 truncate text-[15px] text-[#86868B]">
          <span className="truncate">
            {userName} · {subtitle}
          </span>
          <span
            className={`inline-flex shrink-0 items-center gap-1 text-[12px] ${
              live ? 'text-[#34C759]' : 'text-[#C7C7CC]'
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${live ? 'bg-[#34C759]' : 'bg-[#C7C7CC]'}`} />
            {live ? '已同步' : '连接中'}
          </span>
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#1D1D1F] shadow-[0_1px_2px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.04)] transition-transform active:scale-95 dark:bg-[#1C1C1E] dark:text-[#F5F5F7] dark:shadow-[0_1px_0_rgba(255,255,255,0.06)_inset]"
        >
          {theme === 'dark' ? <Sun size={18} strokeWidth={1.75} /> : <Moon size={18} strokeWidth={1.75} />}
        </button>
        <button
          type="button"
          onClick={onLogout}
          aria-label="退出登录"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#FF3B30] shadow-[0_1px_2px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.04)] transition-transform active:scale-95 dark:bg-[#1C1C1E] dark:shadow-[0_1px_0_rgba(255,255,255,0.06)_inset]"
        >
          <LogOut size={18} strokeWidth={1.75} />
        </button>
      </div>
    </header>
  )
}
