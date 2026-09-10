export function messageOf(error: unknown, fallback = '请求失败，请稍后重试'): string {
  const raw =
    error && typeof error === 'object' && 'message' in error
      ? String((error as { message: unknown }).message)
      : typeof error === 'string'
        ? error
        : ''
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
  if (text.includes('failed to fetch') || text.includes('network')) return '网络异常，请检查网络后重试'
  if (text.includes('云端尚未配置')) return raw
  if (raw.trim()) return raw
  return fallback
}
