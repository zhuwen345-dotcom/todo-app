import { isNetworkError } from '../lib/errors'
import { requireSupabase } from '../lib/supabase'
import type { Todo } from '../types'

type TodoRow = {
  id: string
  title: string
  completed: boolean
  position: number
  created_at: string
}

function fromRow(row: TodoRow): Todo {
  return {
    id: row.id,
    title: row.title,
    completed: row.completed,
    position: row.position,
    createdAt: Date.parse(row.created_at) || Date.now(),
  }
}

function toRow(todo: Todo, userId: string) {
  return {
    id: todo.id,
    user_id: userId,
    title: todo.title,
    completed: todo.completed,
    position: todo.position,
    created_at: new Date(todo.createdAt).toISOString(),
  }
}

async function requireUserId(): Promise<string> {
  const { data, error } = await requireSupabase().auth.getSession()
  if (error || !data.session?.user) throw new Error('请先登录')
  return data.session.user.id
}

async function withRetry<T>(run: () => Promise<T>, attempts = 3): Promise<T> {
  let last: unknown
  for (let index = 0; index < attempts; index += 1) {
    try {
      return await run()
    } catch (error) {
      last = error
      if (!isNetworkError(error) || index === attempts - 1) throw error
      await new Promise((resolve) => setTimeout(resolve, 280 * (index + 1)))
    }
  }
  throw last
}

export const todosApi = {
  async list(): Promise<Todo[]> {
    return withRetry(async () => {
      const { data, error } = await requireSupabase()
        .from('todos')
        .select('id, title, completed, position, created_at')
        .order('position', { ascending: true })
      if (error) throw error
      return (data as TodoRow[]).map(fromRow)
    })
  },

  async create(title: string, position: number): Promise<Todo> {
    const userId = await requireUserId()
    const { data, error } = await requireSupabase()
      .from('todos')
      .insert({ user_id: userId, title, completed: false, position })
      .select('id, title, completed, position, created_at')
      .single()
    if (error) throw error
    return fromRow(data as TodoRow)
  },

  async save(todo: Todo): Promise<Todo> {
    return withRetry(async () => {
      const userId = await requireUserId()
      const { data, error } = await requireSupabase()
        .from('todos')
        .upsert(toRow(todo, userId), { onConflict: 'id' })
        .select('id, title, completed, position, created_at')
        .single()
      if (error) throw error
      return fromRow(data as TodoRow)
    })
  },

  async update(id: string, patch: { title?: string; completed?: boolean }): Promise<Todo | null> {
    if (typeof patch.title === 'string' && !patch.title.trim()) {
      await todosApi.remove(id)
      return null
    }

    return withRetry(async () => {
      const userId = await requireUserId()
      const current = await requireSupabase()
        .from('todos')
        .select('id, title, completed, position, created_at')
        .eq('id', id)
        .maybeSingle()
      if (current.error) throw current.error
      if (!current.data) throw new Error('待办不存在')
      const merged: Todo = {
        ...fromRow(current.data as TodoRow),
        ...(typeof patch.title === 'string' ? { title: patch.title.trim() } : {}),
        ...(typeof patch.completed === 'boolean' ? { completed: patch.completed } : {}),
      }
      const { data, error } = await requireSupabase()
        .from('todos')
        .upsert(toRow(merged, userId), { onConflict: 'id' })
        .select('id, title, completed, position, created_at')
        .single()
      if (error) throw error
      return fromRow(data as TodoRow)
    })
  },

  async remove(id: string): Promise<void> {
    await withRetry(async () => {
      const rpc = await requireSupabase().rpc('delete_todo', { p_id: id })
      if (!rpc.error) return
      const { error } = await requireSupabase().from('todos').delete().eq('id', id)
      if (error) throw error
    })
  },

  async saveOrder(todos: Todo[]): Promise<void> {
    await withRetry(async () => {
      const userId = await requireUserId()
      if (todos.length === 0) return
      const rows = todos.map((todo, index) =>
        toRow({ ...todo, position: (index + 1) * 1000 }, userId),
      )
      const { error } = await requireSupabase().from('todos').upsert(rows, { onConflict: 'id' })
      if (error) throw error
    })
  },

  async clearCompleted(): Promise<void> {
    await withRetry(async () => {
      const rpc = await requireSupabase().rpc('clear_completed_todos')
      if (!rpc.error) return
      const userId = await requireUserId()
      const { error } = await requireSupabase()
        .from('todos')
        .delete()
        .eq('user_id', userId)
        .eq('completed', true)
      if (error) throw error
    })
  },
}
