<template>
  <UiCard :class="task.isCompleted ? 'opacity-75' : ''" :hoverable="!task.isCompleted">
    <div class="flex items-start justify-between gap-4">
      <div class="flex min-w-0 flex-1 items-start gap-3">
        <input
          type="checkbox"
          :checked="task.isCompleted"
          @change="handleToggle"
          class="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
        />

        <div class="min-w-0 flex-1">
          <h3
            :class="[
              'text-lg font-medium break-words',
              task.isCompleted ? 'text-gray-500 line-through dark:text-gray-500' : 'text-gray-900 dark:text-white',
            ]"
          >
            {{ task.title }}
          </h3>

          <p
            v-if="task.description"
            :class="[
              'mt-1 wrap-break-word text-sm',
              task.isCompleted ? 'text-gray-400 dark:text-gray-600' : 'text-gray-600 dark:text-gray-400',
            ]"
          >
            {{ task.description }}
          </p>

          <div class="mt-2 flex flex-wrap items-center gap-3">
            <UiBadge :variant="isOverdue ? 'danger' : 'neutral'">
              <Icon name="heroicons:calendar-days" class="h-3 w-3" />
              {{ formatDate(task.dueDate) }}
            </UiBadge>

            <UiBadge :variant="task.isCompleted ? 'success' : 'info'">
              <Icon :name="task.isCompleted ? 'heroicons:check-circle' : 'heroicons:clock'" class="h-3 w-3" />
              {{ task.isCompleted ? 'Completed' : 'Active' }}
            </UiBadge>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <UiButton
          variant="ghost"
          size="sm"
          :disabled="!canEdit"
          @click="$emit('edit', task)"
          class="p-1!"
        >
          <Icon name="heroicons:pencil-square" class="h-5 w-5" />
        </UiButton>

        <UiButton
          variant="ghost"
          size="sm"
          :disabled="!canEdit"
          @click="handleDelete"
          class="p-1! text-red-500 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300"
        >
          <Icon name="heroicons:trash" class="h-5 w-5" />
        </UiButton>
      </div>
    </div>
  </UiCard>
</template>

<script setup lang="ts">
import type { Task } from '~/types'
import { useAuthStore } from '~/stores'

const props = defineProps<{ task: Task }>()

const emit = defineEmits<{
  toggle: [id: string, isCompleted: boolean]
  edit: [task: Task]
  delete: [id: string]
}>()

const authStore = useAuthStore()

const isOverdue = computed(() => {
  if (!props.task.dueDate || props.task.isCompleted) return false
  const today = new Date().toISOString().split('T')[0]
  return props.task.dueDate < today
})

const canEdit = computed(() => {
  if (!authStore.user) return false
  return authStore.user.role === 'admin' || props.task.ownerId === authStore.user.id
})

const formatDate = (dateStr?: string) => {
  if (!dateStr) return 'No due date'
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const handleToggle = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('toggle', props.task.id, target.checked)
}

const handleDelete = () => {
  if (confirm('Are you sure you want to delete this task?')) {
    emit('delete', props.task.id)
  }
}
</script>
