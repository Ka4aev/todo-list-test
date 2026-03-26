<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    @click.self="handleCancel"
  >
    <UiCard class="mx-4 w-full max-w-md" :hoverable="false" :padded="false">
      <div class="p-6">
        <h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
          {{ isEdit ? 'Edit Task' : 'Create New Task' }}
        </h2>

        <form class="space-y-4" @submit.prevent="handleSubmit">
          <div>
            <label for="title" class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Title <span class="text-red-500">*</span>
            </label>
            <input
              id="title"
              v-model="formData.title"
              type="text"
              placeholder="Enter task title"
              :disabled="loading"
              :class="[
                'w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none dark:bg-gray-700 dark:text-white',
                errors.title ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500 dark:border-gray-600',
              ]"
              autofocus
            />
            <p v-if="errors.title" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.title }}</p>
          </div>

          <div>
            <label for="description" class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              id="description"
              v-model="formData.description"
              rows="3"
              placeholder="Enter task description"
              :disabled="loading"
              class="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label for="dueDate" class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Due Date
            </label>
            <input
              id="dueDate"
              v-model="formData.dueDate"
              type="date"
              :min="minDate"
              :disabled="loading"
              :class="[
                'w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none dark:bg-gray-700 dark:text-white',
                errors.dueDate ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500 dark:border-gray-600',
              ]"
            />
            <p v-if="errors.dueDate" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.dueDate }}</p>
          </div>

          <div v-if="isEdit" class="flex items-center gap-2">
            <input
              id="completed"
              v-model="formData.isCompleted"
              type="checkbox"
              :disabled="loading"
              class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
            />
            <label for="completed" class="text-sm text-gray-700 dark:text-gray-300">Mark as completed</label>
          </div>

          <div class="flex justify-end gap-3 pt-4">
            <UiButton type="button" variant="secondary" :disabled="loading" @click="handleCancel">Cancel</UiButton>
            <UiButton type="submit" :loading="!!loading">
              {{ isEdit ? 'Save Changes' : 'Create Task' }}
            </UiButton>
          </div>
        </form>
      </div>
    </UiCard>
  </div>
</template>

<script setup lang="ts">
import type { CreateTaskRequest, Task, UpdateTaskRequest } from '~/types'

const props = defineProps<{
  open: boolean
  loading?: boolean
  task?: Task | null
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  submit: [data: CreateTaskRequest | UpdateTaskRequest]
}>()

const open = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value),
})

const isEdit = computed(() => !!props.task)
const minDate = new Date().toISOString().split('T')[0]

const formData = ref<CreateTaskRequest & { isCompleted?: boolean }>({
  title: '',
  description: '',
  dueDate: '',
  isCompleted: false,
})

const errors = ref<{ title?: string; dueDate?: string }>({})

watch(
  () => props.task,
  (task) => {
    if (task) {
      formData.value = {
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        isCompleted: task.isCompleted,
      }
    } else {
      formData.value = {
        title: '',
        description: '',
        dueDate: '',
        isCompleted: false,
      }
    }
    errors.value = {}
  },
  { immediate: true }
)

const validate = () => {
  errors.value = {}

  if (!formData.value.title || formData.value.title.trim() === '') {
    errors.value.title = 'Title is required'
  }

  if (formData.value.dueDate && formData.value.dueDate < minDate) {
    errors.value.dueDate = 'Due date cannot be in the past'
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = () => {
  if (!validate()) return

  const baseData = {
    title: formData.value.title.trim(),
    description: formData.value.description?.trim(),
    dueDate: formData.value.dueDate || undefined,
  }

  emit('submit', isEdit.value ? { ...baseData, isCompleted: formData.value.isCompleted } : baseData)
}

const handleCancel = () => {
  open.value = false
}
</script>
