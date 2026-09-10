export function BootScreen() {
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <span className="apple-spinner" aria-hidden="true" />
        <p className="text-[15px] text-[#86868B]">正在载入</p>
      </div>
    </div>
  )
}
