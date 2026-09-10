import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { todosApi } from '../api/todos'
import { messageOf } from '../lib/errors'
import { supabase } from '../lib/supabase'
import type { Filter, Todo } from '../types'

function applyReorder(list: Todo[], filter: Filter, activeId: string, overId: string): Todo[] {
  const matches = (todo: Todo) => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  }
  const visible = list.filter(matches)
  const from = visible.findIndex((todo) => todo.id === activeId)
  const to = visible.findIndex((todo) => todo.id === overId)
  if (from < 0 || to < 0 || from === to) return list
  const reorderedVisible = [...visible]
  const [moved] = reorderedVisible.splice(from, 1)
  reorderedVisible.splice(to, 0, moved)
  let index = 0
  return list.map((todo) => (matches(todo) ? reorderedVisible[index++] : todo))
}

export function useTodos(userId: string) {
  const [todos, setTodos] = useState<Todo[]>([])
  const [filter, setFilter] = useState<Filter>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [live, setLive] = useState(false)
  const todosRef = useRef(todos)
  todosRef.current = todos

  const visibleTodos = useMemo(() => {
    if (filter === 'active') return todos.filter((todo) => !todo.completed)
    if (filter === 'completed') return todos.filter((todo) => todo.completed)
    return todos
  }, [todos, filter])

  const activeCount = useMemo(
    () => todos.filter((todo) => !todo.completed).length,
    [todos],
  )
  const completedCount = todos.length - activeCount

  const refresh = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true)
    try {
      const list = await todosApi.list()
      setTodos(list)
      setError(null)
    } catch (err) {
      setError(messageOf(err, '同步失败，请稍后重试'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh(true)
  }, [refresh, userId])

  useEffect(() => {
    if (!supabase) return
    const client = supabase
    let timer: number | undefined

    const channel = client
      .channel(`todos-sync:${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'todos', filter: `user_id=eq.${userId}` },
        () => {
          window.clearTimeout(timer)
          timer = window.setTimeout(() => {
            void refresh(false)
          }, 80)
        },
      )
      .subscribe((status) => {
        setLive(status === 'SUBSCRIBED')
      })

    return () => {
      window.clearTimeout(timer)
      setLive(false)
      void client.removeChannel(channel)
    }
  }, [refresh, userId])

  const addTodo = useCallback(async (title: string) => {
    const trimmed = title.trim()
    if (!trimmed) return true
    const position = (todosRef.current[0]?.position ?? Date.now()) - 1
    try {
      const todo = await todosApi.create(trimmed, position)
      setTodos((current) => [todo, ...current.filter((item) => item.id !== todo.id)])
      setError(null)
      return true
    } catch (err) {
      setError(messageOf(err, '同步失败，请稍后重试'))
      return false
    }
  }, [])

  const toggleTodo = useCallback(async (id: string) => {
    let previous: Todo[] = []
    let nextTodo: Todo | undefined
    setTodos((current) => {
      previous = current
      return current.map((todo) => {
        if (todo.id !== id) return todo
        nextTodo = { ...todo, completed: !todo.completed }
        return nextTodo
      })
    })
    if (!nextTodo) return
    try {
      await todosApi.save(nextTodo)
      setError(null)
    } catch (err) {
      setTodos(previous)
      setError(messageOf(err, '同步失败，请稍后重试'))
    }
  }, [])

  const updateTodo = useCallback(async (id: string, title: string) => {
    const trimmed = title.trim()
    let previous: Todo[] = []
    let nextTodo: Todo | undefined
    setTodos((current) => {
      previous = current
      if (!trimmed) return current.filter((todo) => todo.id !== id)
      return current.map((todo) => {
        if (todo.id !== id) return todo
        nextTodo = { ...todo, title: trimmed }
        return nextTodo
      })
    })
    try {
      if (!trimmed) {
        await todosApi.remove(id)
      } else if (nextTodo) {
        await todosApi.save(nextTodo)
      }
      setError(null)
    } catch (err) {
      setTodos(previous)
      setError(messageOf(err, '同步失败，请稍后重试'))
    }
  }, [])

  const removeTodo = useCallback(async (id: string) => {
    let previous: Todo[] = []
    setTodos((current) => {
      previous = current
      return current.filter((todo) => todo.id !== id)
    })
    try {
      await todosApi.remove(id)
      setError(null)
    } catch (err) {
      setTodos(previous)
      setError(messageOf(err, '同步失败，请稍后重试'))
    }
  }, [])

  const clearCompleted = useCallback(async () => {
    let previous: Todo[] = []
    setTodos((current) => {
      previous = current
      return current.filter((todo) => !todo.completed)
    })
    try {
      await todosApi.clearCompleted()
      setError(null)
    } catch (err) {
      setTodos(previous)
      setError(messageOf(err, '同步失败，请稍后重试'))
    }
  }, [])

  const reorder = useCallback(
    async (activeId: string, overId: string) => {
      let previous: Todo[] = []
      let next: Todo[] = []
      setTodos((current) => {
        previous = current
        next = applyReorder(current, filter, activeId, overId)
        return next
      })
      if (next === previous) return
      try {
        await todosApi.saveOrder(next)
        setTodos(next.map((todo, index) => ({ ...todo, position: (index + 1) * 1000 })))
        setError(null)
      } catch (err) {
        setTodos(previous)
        setError(messageOf(err, '同步失败，请稍后重试'))
      }
    },
    [filter],
  )

  return {
    todos,
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
  }
}
