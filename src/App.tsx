import { BootScreen } from './components/BootScreen'
import { LoginPage } from './components/LoginPage'
import { TodoApp } from './components/TodoApp'
import { useAuth } from './hooks/useAuth'
import { useTheme } from './hooks/useTheme'

export default function App() {
  const { theme, toggleTheme } = useTheme()
  const { user, status, error, info, submitting, configured, login, register, logout, clearError } =
    useAuth()

  return (
    <div className="min-h-dvh bg-[#F2F2F7] text-[#1D1D1F] dark:bg-black dark:text-[#F5F5F7]">
      {status === 'loading' ? (
        <BootScreen />
      ) : user ? (
        <TodoApp
          user={user}
          theme={theme}
          onToggleTheme={toggleTheme}
          onLogout={() => void logout()}
        />
      ) : (
        <LoginPage
          theme={theme}
          onToggleTheme={toggleTheme}
          error={error}
          info={info}
          submitting={submitting}
          configured={configured}
          onLogin={login}
          onRegister={register}
          onClearError={clearError}
        />
      )}
    </div>
  )
}
