function rawMessage(error: unknown): string {
  if (!error) return ''
  if (typeof error === 'string') return error
  if (typeof error === 'object' && 'message' in error) {
    return String((error as { message: unknown }).message)
  }
  return ''
}

export function isNetworkError(error: unknown): boolean {
  const text = rawMessage(error).toLowerCase()
  const name =
    error && typeof error === 'object' && 'name' in error
      ? String((error as { name: unknown }).name).toLowerCase()
      : ''
  return (
    (name === 'typeerror' && text.includes('fetch')) ||
    text.includes('failed to fetch') ||
    text.includes('networkerror') ||
    text.includes('load failed') ||
    text.includes('network request failed') ||
    text.includes('fetch is aborted') ||
    name === 'aborterror'
  )
}

export function messageOf(error: unknown, fallback = '请求失败，请稍后重试'): string {
  const raw = rawMessage(error)
  const text = raw.toLowerCase()

  if (text.includes('invalid login credentials')) return '邮箱或密码不正确'
  if (text.includes('user already registered') || text.includes('already been registered')) {
    return '该邮箱已注册'
  }
  if (text.includes('password should be at least') || text.includes('password is known to be weak')) {
    return '密码至少 6 位'
  }
  if (text.includes('email not confirmed')) return '请先到邮箱点击确认链接后再登录'
  if (text.includes('rate limit') || text.includes('too many requests')) return '尝试过于频繁，请稍后再试'
  if (isNetworkError(error)) return '网络异常，请检查网络后重试'
  if (text.includes('云端尚未配置')) return raw
  if (raw.trim()) return raw
  return fallback
}
