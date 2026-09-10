import { useCallback, useEffect, useState } from 'react'
import { authApi, toAppUser } from '../api/auth'
import { messageOf } from '../lib/errors'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import type { User } from '../types'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready'>('loading')
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setStatus('ready')
      return
    }

    let cancelled = false

    void supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return
      setUser(data.session?.user ? toAppUser(data.session.user) : null)
      setStatus('ready')
    })

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? toAppUser(session.user) : null)
    })

    return () => {
      cancelled = true
      data.subscription.unsubscribe()
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setSubmitting(true)
    setError(null)
    setInfo(null)
    try {
      const next = await authApi.login(email, password)
      setUser(next)
    } catch (err) {
      setError(messageOf(err))
      throw err
    } finally {
      setSubmitting(false)
    }
  }, [])

  const register = useCallback(async (name: string, email: string, password: string) => {
    setSubmitting(true)
    setError(null)
    setInfo(null)
    try {
      const result = await authApi.register(name, email, password)
      if (result.needsConfirm) {
        setInfo('注册成功。请到邮箱点击确认链接后再登录。')
        return
      }
      if (result.user) setUser(result.user)
    } catch (err) {
      setError(messageOf(err))
      throw err
    } finally {
      setSubmitting(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } catch {
      /* still leave locally */
    }
    setUser(null)
  }, [])

  const clearError = useCallback(() => {
    setError(null)
    setInfo(null)
  }, [])

  return {
    user,
    status,
    error,
    info,
    submitting,
    configured: isSupabaseConfigured,
    login,
    register,
    logout,
    clearError,
  }
}
