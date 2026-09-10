import { CheckCircle2 } from 'lucide-react'
import type { Filter } from '../types'

type EmptyStateProps = {
  filter: Filter
}

const copy: Record<Filter, { title: string; hint: string }> = {
  all: { title: '没有待办', hint: '添加一件事后，它会出现在这里' },
  active: { title: '全部完成', hint: '未完成的事项会显示在这里' },
  completed: { title: '还没有完成项', hint: '勾选事项后会出现在这里' },
}

export function EmptyState({ filter }: EmptyStateProps) {
  const { title, hint } = copy[filter]

  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-black/[0.04] text-[#8E8E93] dark:bg-white/[0.06]">
        <CheckCircle2 size={26} strokeWidth={1.5} />
      </div>
      <p className="text-[17px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">{title}</p>
      <p className="mt-1 text-[15px] text-[#86868B]">{hint}</p>
    </div>
  )
}
