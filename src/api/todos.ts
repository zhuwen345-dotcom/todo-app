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

async function requireUserId(): Promise<string> {
  const { data, error } = await requireSupabase().auth.getUser()
  if (error || !data.user) throw new Error('请先登录')
  return data.user.id
}

export const todosApi = {
  async list(): Promise<Todo[]> {
    const { data, error } = await requireSupabase()
      .from('todos')
      .select('id, title, completed, position, created_at')
      .order('position', { ascending: true })
    if (error) throw error
    return (data as TodoRow[]).map(fromRow)
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

  async update(id: string, patch: { title?: string; completed?: boolean }): Promise<Todo | null> {
    if (typeof patch.title === 'string' && !patch.title.trim()) {
      await todosApi.remove(id)
      return null
    }
    const { data, error } = await requireSupabase()
      .from('todos')
      .update(patch)
      .eq('id', id)
      .select('id, title, completed, position, created_at')
      .single()
    if (error) throw error
    return fromRow(data as TodoRow)
  },

  async remove(id: string): Promise<void> {
    const { error } = await requireSupabase().from('todos').delete().eq('id', id)
    if (error) throw error
  },

  async saveOrder(todos: Todo[]): Promise<void> {
    const userId = await requireUserId()
    if (todos.length === 0) return
    const rows = todos.map((todo, index) => ({
      id: todo.id,
      user_id: userId,
      title: todo.title,
      completed: todo.completed,
      position: (index + 1) * 1000,
      created_at: new Date(todo.createdAt).toISOString(),
    }))
    const { error } = await requireSupabase().from('todos').upsert(rows)
    if (error) throw error
  },

  async clearCompleted(): Promise<void> {
    const userId = await requireUserId()
    const { error } = await requireSupabase()
      .from('todos')
      .delete()
      .eq('user_id', userId)
      .eq('completed', true)
    if (error) throw error
  },
}
