import { useCallback, useEffect, useState } from 'react'
import { loadTheme, saveTheme } from '../lib/storage'
import type { Theme } from '../types'

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  const meta = document.querySelector('meta[name="theme-color"]')
  meta?.setAttribute('content', theme === 'dark' ? '#000000' : '#F2F2F7')
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const initial = loadTheme()
    applyTheme(initial)
    return initial
  })

  useEffect(() => {
    applyTheme(theme)
    saveTheme(theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  }, [])

  return { theme, toggleTheme }
}
