// Имитация базы данных в памяти
import { v4 as uuidv4 } from 'uuid'

export interface User {
  id: string
  email: string
  password: string
  role: 'admin' | 'user'
  createdAt: string
}

export interface Task {
  id: string
  title: string
  description: string
  dueDate: string
  isCompleted: boolean
  ownerId: string
  createdAt: string
  updatedAt: string
}

// Начальные данные
export const users: User[] = [
  {
    id: uuidv4(),
    email: 'admin@test.com',
    password: '123456',
    role: 'admin',
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    email: 'user@test.com',
    password: '123456',
    role: 'user',
    createdAt: new Date().toISOString(),
  },
]

export const tasks: Task[] = [
  {
    id: uuidv4(),
    title: 'Сделать логин',
    description: 'Форма email/password',
    dueDate: '2026-02-15',
    isCompleted: false,
    ownerId: users[0].id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Список задач',
    description: 'Фильтрация и сортировка',
    dueDate: '2026-02-18',
    isCompleted: true,
    ownerId: users[1].id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Просроченная задача',
    description: 'Для теста фильтра overdue',
    dueDate: '2025-01-01',
    isCompleted: false,
    ownerId: users[1].id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

// Вспомогательные функции
export function generateId(): string {
  return uuidv4()
}

export function getCurrentTimestamp(): string {
  return new Date().toISOString()
}
