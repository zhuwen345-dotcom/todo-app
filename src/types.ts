export type Todo = {
  id: string
  title: string
  completed: boolean
  createdAt: number
  position: number
}

export type User = {
  id: string
  name: string
  email: string
}

export type Filter = 'all' | 'active' | 'completed'

export type Theme = 'light' | 'dark'
