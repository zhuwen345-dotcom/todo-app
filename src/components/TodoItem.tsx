import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Check, GripVertical, Trash2 } from 'lucide-react'
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import type { Todo } from '../types'

type TodoItemProps = {
  todo: Todo
  onToggle: (id: string) => void
  onUpdate: (id: string, title: string) => void
  onRemove: (id: string) => void
}

type TodoRowProps = TodoItemProps & {
  dragging?: boolean
  overlay?: boolean
  style?: CSSProperties
  handleProps?: Record<string, unknown>
  innerRef?: (node: HTMLElement | null) => void
}

export function TodoRow({
  todo,
  onToggle,
  onUpdate,
  onRemove,
  dragging = false,
  overlay = false,
  style,
  handleProps,
  innerRef,
}: TodoRowProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(todo.title)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [editing])

  function commit() {
    setEditing(false)
    if (draft.trim() !== todo.title) {
      onUpdate(todo.id, draft)
    } else {
      setDraft(todo.title)
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.currentTarget.blur()
    }
    if (event.key === 'Escape') {
      setDraft(todo.title)
      setEditing(false)
    }
  }

  return (
    <div
      ref={innerRef}
      style={style}
      className={`group flex items-center gap-3 bg-white px-3.5 py-3 dark:bg-[#1C1C1E] ${
        overlay
          ? 'rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.18)] ring-1 ring-black/5 dark:ring-white/10'
          : dragging
            ? 'z-10 opacity-35'
            : ''
      }`}
    >
      <button
        type="button"
        onPointerDown={(event) => event.stopPropagation()}
        onClick={(event) => {
          event.preventDefault()
          event.stopPropagation()
          onToggle(todo.id)
        }}
        aria-label={todo.completed ? '标记为未完成' : '标记为已完成'}
        className="flex h-11 w-11 shrink-0 touch-manipulation items-center justify-center"
      >
        <span
          className={`flex h-[22px] w-[22px] items-center justify-center rounded-full border-[1.5px] transition-colors ${
            todo.completed
              ? 'border-[#007AFF] bg-[#007AFF] text-white'
              : 'border-[#C7C7CC] bg-transparent text-transparent dark:border-[#48484A]'
          }`}
        >
        <Check
          size={13}
          strokeWidth={3}
          className={todo.completed ? 'animate-check-pop' : ''}
        />
        </span>
      </button>

      {editing && !overlay ? (
        <input
          ref={inputRef}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commit}
          onKeyDown={handleKeyDown}
          aria-label="编辑待办"
          className="min-w-0 flex-1 bg-transparent text-[17px] text-[#1D1D1F] outline-none dark:text-[#F5F5F7]"
        />
      ) : (
        <button
          type="button"
          onClick={() => {
            if (!overlay) setEditing(true)
          }}
          className={`min-w-0 flex-1 truncate text-left text-[17px] ${
            todo.completed
              ? 'text-[#86868B] line-through decoration-[#86868B]/80'
              : 'text-[#1D1D1F] dark:text-[#F5F5F7]'
          }`}
        >
          {todo.title}
        </button>
      )}

      <button
        type="button"
        onClick={() => onRemove(todo.id)}
        aria-label="删除待办"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#FF3B30] opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 max-md:opacity-100"
      >
        <Trash2 size={16} strokeWidth={1.75} />
      </button>

      <button
        type="button"
        aria-label="拖拽排序"
        className="flex h-8 w-8 shrink-0 cursor-grab items-center justify-center rounded-full text-[#C7C7CC] touch-none active:cursor-grabbing dark:text-[#636366]"
        {...handleProps}
      >
        <GripVertical size={16} strokeWidth={2} />
      </button>
    </div>
  )
}

export function TodoItem(props: TodoItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: props.todo.id,
  })

  return (
    <TodoRow
      {...props}
      innerRef={setNodeRef}
      dragging={isDragging}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      handleProps={{ ...attributes, ...listeners }}
    />
  )
}
