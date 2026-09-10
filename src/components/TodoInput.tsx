import { Plus } from 'lucide-react'
import { useState, type FormEvent } from 'react'

type TodoInputProps = {
  onAdd: (title: string) => void | Promise<boolean | void>
}

export function TodoInput({ onAdd }: TodoInputProps) {
  const [value, setValue] = useState('')
  const [pending, setPending] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (pending) return
    const next = value.trim()
    if (!next) return
    setPending(true)
    try {
      const ok = await onAdd(next)
      if (ok !== false) setValue('')
    } finally {
      setPending(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-3 rounded-2xl bg-white px-3.5 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.04)] dark:bg-[#1C1C1E] dark:shadow-[0_1px_0_rgba(255,255,255,0.04)_inset]"
    >
      <button
        type="submit"
        aria-label="添加待办"
        disabled={pending}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#007AFF] text-white transition-transform active:scale-90 disabled:opacity-60"
      >
        {pending ? <span className="apple-spinner apple-spinner-light !h-3.5 !w-3.5 !border-[1.5px]" /> : <Plus size={16} strokeWidth={2.5} />}
      </button>
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="新建待办"
        aria-label="新建待办"
        disabled={pending}
        className="w-full bg-transparent text-[17px] text-[#1D1D1F] outline-none placeholder:text-[#C7C7CC] dark:text-[#F5F5F7] dark:placeholder:text-[#636366]"
      />
    </form>
  )
}
