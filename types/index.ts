export interface User {
  id: string
  email: string
  role: 'admin' | 'user'
}

export interface Task {
  id: string
  title: string
  description: string
  dueDate: string
  isCompleted: boolean
  ownerId: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
}

export interface CreateTaskRequest {
  title: string
  description?: string
  dueDate?: string
}

export interface UpdateTaskRequest {
  title?: string
  description?: string
  dueDate?: string
  isCompleted?: boolean
}

export interface ApiError {
  message: string
  status?: number
}
