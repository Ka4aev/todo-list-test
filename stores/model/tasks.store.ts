import { defineStore } from 'pinia'
import type { CreateTaskRequest, Task, UpdateTaskRequest } from '~/types'
import {
  createTaskRequest,
  deleteTaskRequest,
  fetchTasksRequest,
  updateTaskRequest,
} from '~/stores/api/api'

export type FilterType = 'all' | 'active' | 'completed' | 'overdue'
export type SortType = 'dueDate' | 'createdAt' | 'status'

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filter = ref<FilterType>('all')
  const sortBy = ref<SortType>('dueDate')

  const filteredAndSortedTasks = computed(() => {
    let result = [...tasks.value]
    const now = new Date().toISOString().split('T')[0]

    switch (filter.value) {
      case 'active':
        result = result.filter(t => !t.isCompleted)
        break
      case 'completed':
        result = result.filter(t => t.isCompleted)
        break
      case 'overdue':
        result = result.filter(t => !t.isCompleted && t.dueDate && t.dueDate < now)
        break
    }

    switch (sortBy.value) {
      case 'dueDate':
        result.sort((a, b) => {
          if (!a.dueDate) return 1
          if (!b.dueDate) return -1
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        })
        break
      case 'createdAt':
        result.sort((a, b) => b.id.localeCompare(a.id))
        break
      case 'status':
        result.sort((a, b) => Number(a.isCompleted) - Number(b.isCompleted))
        break
    }

    return result
  })

  const stats = computed(() => {
    const total = tasks.value.length
    const completed = tasks.value.filter(t => t.isCompleted).length
    const active = total - completed
    const overdue = tasks.value.filter(
      t => !t.isCompleted && t.dueDate && t.dueDate < new Date().toISOString().split('T')[0]
    ).length

    return { total, completed, active, overdue }
  })

  const taskById = computed(() => {
    return (id: string) => tasks.value.find(t => t.id === id)
  })

  function setFilter(newFilter: FilterType) {
    filter.value = newFilter
  }

  function setSortBy(newSortBy: SortType) {
    sortBy.value = newSortBy
  }

  async function fetchTasks(): Promise<void> {
    loading.value = true
    error.value = null

    try {
      const { data } = await fetchTasksRequest()
      tasks.value = data.data || []
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to fetch tasks'
    } finally {
      loading.value = false
    }
  }

  async function createTask(task: CreateTaskRequest): Promise<{ success: boolean; message?: string }> {
    loading.value = true
    error.value = null

    try {
      const { data } = await createTaskRequest(task)
      tasks.value.push(data)
      return { success: true }
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to create task'
      return { success: false, message: error.value ?? undefined }
    } finally {
      loading.value = false
    }
  }

  async function updateTask(
    id: string,
    updates: UpdateTaskRequest
  ): Promise<{ success: boolean; message?: string }> {
    loading.value = true
    error.value = null

    try {
      const { data } = await updateTaskRequest(id, updates)
      const index = tasks.value.findIndex(t => t.id === id)
      if (index !== -1) {
        tasks.value[index] = data
      }
      return { success: true }
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to update task'
      return { success: false, message: error.value ?? undefined }
    } finally {
      loading.value = false
    }
  }

  async function deleteTask(id: string): Promise<{ success: boolean; message?: string }> {
    loading.value = true
    error.value = null

    try {
      await deleteTaskRequest(id)
      tasks.value = tasks.value.filter(t => t.id !== id)
      return { success: true }
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Failed to delete task'
      return { success: false, message: error.value ?? undefined }
    } finally {
      loading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    tasks,
    loading,
    error,
    filter,
    sortBy,
    filteredAndSortedTasks,
    stats,
    taskById,
    setFilter,
    setSortBy,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    clearError,
  }
})
