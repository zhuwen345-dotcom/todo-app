import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useState } from 'react'
import type { Filter, Todo } from '../types'
import { EmptyState } from './EmptyState'
import { TodoItem, TodoRow } from './TodoItem'

type TodoListProps = {
  todos: Todo[]
  filter: Filter
  onToggle: (id: string) => void
  onUpdate: (id: string, title: string) => void
  onRemove: (id: string) => void
  onReorder: (activeId: string, overId: string) => void
}

export function TodoList({
  todos,
  filter,
  onToggle,
  onUpdate,
  onRemove,
  onReorder,
}: TodoListProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { delay: 180, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const activeTodo = todos.find((todo) => todo.id === activeId) ?? null

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id))
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveId(null)
    if (!over || active.id === over.id) return
    onReorder(String(active.id), String(over.id))
  }

  if (todos.length === 0) {
    return (
      <div className="overflow-hidden rounded-2xl bg-white dark:bg-[#1C1C1E]">
        <EmptyState filter={filter} />
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <SortableContext items={todos.map((todo) => todo.id)} strategy={verticalListSortingStrategy}>
        <ul className="overflow-hidden rounded-2xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.04)] dark:bg-[#1C1C1E] dark:shadow-[0_1px_0_rgba(255,255,255,0.04)_inset]">
          {todos.map((todo, index) => (
            <li key={todo.id} className="relative">
              {index > 0 ? (
                <div className="pointer-events-none absolute inset-x-0 top-0 ml-[46px] h-px bg-black/[0.06] dark:bg-white/[0.08]" />
              ) : null}
              <TodoItem
                todo={todo}
                onToggle={onToggle}
                onUpdate={onUpdate}
                onRemove={onRemove}
              />
            </li>
          ))}
        </ul>
      </SortableContext>
      <DragOverlay>
        {activeTodo ? (
          <TodoRow
            todo={activeTodo}
            onToggle={onToggle}
            onUpdate={onUpdate}
            onRemove={onRemove}
            overlay
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
