import type { CreateTaskRequest, LoginRequest, LoginResponse, Task, UpdateTaskRequest } from '~/types'

const getApi = () => useNuxtApp().$api

export async function loginRequest(credentials: LoginRequest) {
  return getApi().post<LoginResponse>('/auth/login', credentials)
}

export async function fetchTasksRequest() {
  return getApi().get<{ data: Task[] }>('/tasks')
}

export async function createTaskRequest(task: CreateTaskRequest) {
  return getApi().post<Task>('/tasks', task)
}

export async function updateTaskRequest(id: string, updates: UpdateTaskRequest) {
  return getApi().put<Task>(`/tasks/${id}`, updates)
}

export async function deleteTaskRequest(id: string) {
  return getApi().delete(`/tasks/${id}`)
}
