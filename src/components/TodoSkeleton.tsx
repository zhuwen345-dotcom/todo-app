export function TodoSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl bg-white dark:bg-[#1C1C1E]">
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className={`flex items-center gap-3 px-3.5 py-3.5 ${
            index === 0 ? '' : 'border-t border-black/[0.06] dark:border-white/[0.08]'
          }`}
        >
          <div className="h-[22px] w-[22px] rounded-full bg-black/[0.06] dark:bg-white/[0.08]" />
          <div
            className="h-3 rounded-full bg-black/[0.06] dark:bg-white/[0.08]"
            style={{ width: `${58 - index * 10}%` }}
          />
        </div>
      ))}
    </div>
  )
}
