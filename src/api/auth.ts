import { requireSupabase } from '../lib/supabase'
import type { User } from '../types'
import type { User as AuthUser } from '@supabase/supabase-js'

export function toAppUser(user: AuthUser): User {
  const metadata = user.user_metadata as Record<string, unknown>
  const nameFromMeta = typeof metadata.name === 'string' ? metadata.name.trim() : ''
  return {
    id: user.id,
    email: user.email ?? '',
    name: nameFromMeta || (user.email ? user.email.split('@')[0] : '用户'),
  }
}

export const authApi = {
  async login(email: string, password: string): Promise<User> {
    const { data, error } = await requireSupabase().auth.signInWithPassword({ email, password })
    if (error) throw error
    if (!data.user) throw new Error('登录失败')
    return toAppUser(data.user)
  },

  async register(name: string, email: string, password: string): Promise<{ user: User | null; needsConfirm: boolean }> {
    const { data, error } = await requireSupabase().auth.signUp({
      email,
      password,
      options: { data: { name } },
    })
    if (error) throw error
    if (!data.session || !data.user) {
      return { user: null, needsConfirm: true }
    }
    return { user: toAppUser(data.user), needsConfirm: false }
  },

  async logout(): Promise<void> {
    const { error } = await requireSupabase().auth.signOut()
    if (error) throw error
  },

  async currentUser(): Promise<User | null> {
    const { data, error } = await requireSupabase().auth.getUser()
    if (error || !data.user) return null
    return toAppUser(data.user)
  },
}
