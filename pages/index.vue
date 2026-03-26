<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <header class="bg-white shadow dark:bg-gray-800">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">📝 Todo List</h1>
        <div class="flex items-center gap-4">
          <span class="text-sm text-gray-600 dark:text-gray-400">
            {{ authStore.user?.email }} ({{ authStore.user?.role }})
          </span>
          <UiButton variant="secondary" @click="handleLogout">Logout</UiButton>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <TaskStats :stats="tasksStore.stats" />

      <TaskToolbar
        v-model:filter="tasksStore.filter"
        v-model:sort-by="tasksStore.sortBy"
      />

      <div class="mb-6">
        <UiButton @click="showCreateModal = true">
          <Icon name="heroicons:plus" class="mr-2 h-5 w-5" />
          Add Task
        </UiButton>
      </div>

      <div v-if="tasksStore.loading && tasksStore.tasks.length === 0" class="flex justify-center py-12">
        <div class="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600" />
      </div>

      <UiCard
        v-if="tasksStore.error"
        class="mb-6 bg-red-50 dark:bg-red-900/20"
      >
        <div class="flex items-center justify-between gap-3">
          <p class="text-sm font-medium text-red-800 dark:text-red-200">{{ tasksStore.error }}</p>
          <UiButton variant="danger" size="sm" @click="handleRetry">Retry</UiButton>
        </div>
      </UiCard>

      <div v-if="!tasksStore.loading && tasksStore.filteredAndSortedTasks.length === 0" class="py-12 text-center">
        <Icon name="heroicons:clipboard-document-list" class="mx-auto mb-4 h-16 w-16 text-gray-400" />
        <h3 class="mb-2 text-lg font-medium text-gray-900 dark:text-white">No tasks found</h3>
        <p class="mb-4 text-gray-600 dark:text-gray-400">Create your first task to get started!</p>
        <UiButton @click="showCreateModal = true">Create Task</UiButton>
      </div>

      <div v-else class="space-y-3">
        <TaskCard
          v-for="task in tasksStore.filteredAndSortedTasks"
          :key="task.id"
          :task="task"
          @edit="handleEditTask"
          @delete="handleDeleteTask"
          @toggle="handleToggleTask"
        />
      </div>
    </main>

    <TaskModal
      v-model:open="showCreateModal"
      :loading="modalLoading"
      :task="editingTask"
      @submit="handleModalSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import type { CreateTaskRequest, Task, UpdateTaskRequest } from '~/types'
import { useAuthStore } from '~/stores'
import { useTasksStore } from '~/stores'

definePageMeta({ middleware: 'auth' })

if (import.meta.server) {
  definePayloadReducer('skip-payload', () => true)
}

const authStore = useAuthStore()
const tasksStore = useTasksStore()

const showCreateModal = ref(false)
const modalLoading = ref(false)
const editingTask = ref<Task | null>(null)

onMounted(() => {
  tasksStore.fetchTasks()
})

const handleLogout = () => {
  authStore.logout()
  navigateTo('/login')
}

const handleEditTask = (task: Task) => {
  editingTask.value = task
  showCreateModal.value = true
}

const handleModalSubmit = async (data: CreateTaskRequest | UpdateTaskRequest) => {
  modalLoading.value = true

  const result = editingTask.value
    ? await tasksStore.updateTask(editingTask.value.id, data as UpdateTaskRequest)
    : await tasksStore.createTask(data as CreateTaskRequest)

  modalLoading.value = false

  if (result.success) {
    showCreateModal.value = false
    editingTask.value = null
  }
}

const handleDeleteTask = async (id: string) => {
  await tasksStore.deleteTask(id)
}

const handleToggleTask = async (id: string, isCompleted: boolean) => {
  await tasksStore.updateTask(id, { isCompleted })
}

const handleRetry = () => {
  tasksStore.clearError()
  tasksStore.fetchTasks()
}
</script>
