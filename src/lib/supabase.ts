import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? ''
export const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  ''
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

async function fetchWithRetry(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const method = (init?.method ?? 'GET').toUpperCase()
  const retryable = method === 'GET' || method === 'PUT' || method === 'PATCH' || method === 'DELETE'
  const attempts = retryable ? 3 : 1
  let lastError: unknown
  for (let index = 0; index < attempts; index += 1) {
    try {
      const response = await fetch(input, init)
      if (response.ok || response.status < 500 || index === attempts - 1) return response
    } catch (error) {
      lastError = error
      if (index === attempts - 1) throw error
    }
    await new Promise((resolve) => setTimeout(resolve, 280 * (index + 1)))
  }
  throw lastError instanceof Error ? lastError : new Error('网络异常，请检查网络后重试')
}

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
      global: {
        fetch: fetchWithRetry,
      },
    })
  : null

export function requireSupabase(): SupabaseClient {
  if (!supabase) {
    throw new Error('云端尚未配置，请先设置 Supabase')
  }
  return supabase
}
