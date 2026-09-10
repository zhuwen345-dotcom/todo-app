import type { Filter } from '../types'

type FilterBarProps = {
  filter: Filter
  onFilterChange: (filter: Filter) => void
  completedCount: number
  onClearCompleted: () => void
}

const options: { id: Filter; label: string }[] = [
  { id: 'all', label: '全部' },
  { id: 'active', label: '未完成' },
  { id: 'completed', label: '已完成' },
]

export function FilterBar({
  filter,
  onFilterChange,
  completedCount,
  onClearCompleted,
}: FilterBarProps) {
  return (
    <div className="flex flex-col items-center gap-4 pt-2">
      <div
        role="tablist"
        aria-label="筛选待办"
        className="grid w-full grid-cols-3 rounded-[12px] bg-black/[0.05] p-1 dark:bg-white/[0.08]"
      >
        {options.map((option) => {
          const selected = filter === option.id
          return (
            <button
              key={option.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => onFilterChange(option.id)}
              className={`rounded-[9px] py-1.5 text-[13px] font-medium transition-all ${
                selected
                  ? 'bg-white text-[#1D1D1F] shadow-[0_1px_2px_rgba(0,0,0,0.08),0_3px_8px_rgba(0,0,0,0.04)] dark:bg-[#2C2C2E] dark:text-white dark:shadow-[0_1px_0_rgba(255,255,255,0.06)_inset]'
                  : 'text-[#6E6E73] dark:text-[#A1A1A6]'
              }`}
            >
              {option.label}
            </button>
          )
        })}
      </div>
      {completedCount > 0 ? (
        <button
          type="button"
          onClick={onClearCompleted}
          className="text-[15px] font-medium text-[#FF3B30] transition-opacity active:opacity-60"
        >
          清除已完成
        </button>
      ) : null}
    </div>
  )
}
