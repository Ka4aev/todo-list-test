<template>
  <UiCard class="mb-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div class="flex flex-wrap gap-2">
        <UiButton
          v-for="item in filters"
          :key="item"
          size="sm"
          :variant="modelFilter === item ? 'primary' : 'secondary'"
          @click="modelFilter = item"
        >
          {{ item.charAt(0).toUpperCase() + item.slice(1) }}
        </UiButton>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
        <select
          v-model="modelSort"
          class="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          <option value="dueDate">Due Date</option>
          <option value="createdAt">Date Created</option>
          <option value="status">Status</option>
        </select>
      </div>
    </div>
  </UiCard>
</template>

<script setup lang="ts">
import type { FilterType, SortType } from '~/stores'

const modelFilter = defineModel<FilterType>('filter', { required: true })
const modelSort = defineModel<SortType>('sortBy', { required: true })

const filters: FilterType[] = ['all', 'active', 'completed', 'overdue']
</script>
