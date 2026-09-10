import type { Theme, User } from '../types'
import { useTodos } from '../hooks/useTodos'
import { FilterBar } from './FilterBar'
import { Header } from './Header'
import { TodoInput } from './TodoInput'
import { TodoList } from './TodoList'
import { TodoSkeleton } from './TodoSkeleton'

type TodoAppProps = {
  user: User
  theme: Theme
  onToggleTheme: () => void
  onLogout: () => void
}

export function TodoApp({ user, theme, onToggleTheme, onLogout }: TodoAppProps) {
  const {
    visibleTodos,
    filter,
    setFilter,
    activeCount,
    completedCount,
    loading,
    error,
    live,
    refresh,
    addTodo,
    toggleTodo,
    updateTodo,
    removeTodo,
    clearCompleted,
    reorder,
  } = useTodos(user.id)

  return (
    <main className="mx-auto w-full max-w-[480px] px-5 pb-16 pt-12 sm:pt-16">
      <div className="animate-rise-in">
        <Header
          theme={theme}
          onToggleTheme={onToggleTheme}
          activeCount={activeCount}
          userName={user.name}
          live={live}
          onLogout={onLogout}
        />
        <div className="flex flex-col gap-4">
          <TodoInput onAdd={addTodo} />
          {error ? (
            <button
              type="button"
              onClick={() => void refresh()}
              className="px-1 text-center text-[13px] font-medium text-[#FF3B30]"
            >
              {error}，点此重试
            </button>
          ) : null}
          {loading ? (
            <TodoSkeleton />
          ) : (
            <TodoList
              todos={visibleTodos}
              filter={filter}
              onToggle={toggleTodo}
              onUpdate={updateTodo}
              onRemove={removeTodo}
              onReorder={reorder}
            />
          )}
          <FilterBar
            filter={filter}
            onFilterChange={setFilter}
            completedCount={completedCount}
            onClearCompleted={clearCompleted}
          />
        </div>
      </div>
    </main>
  )
}
