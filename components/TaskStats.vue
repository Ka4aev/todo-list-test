<template>
  <div class="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
    <UiCard v-for="item in items" :key="item.label">
      <div :class="['text-2xl font-bold', item.valueClass]">{{ item.value }}</div>
      <div class="text-sm text-gray-600 dark:text-gray-400">{{ item.label }}</div>
    </UiCard>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  stats: {
    total: number
    active: number
    completed: number
    overdue: number
  }
}>()

const items = computed(() => [
  { label: 'Total', value: props.stats.total, valueClass: 'text-gray-900 dark:text-white' },
  { label: 'Active', value: props.stats.active, valueClass: 'text-blue-600' },
  { label: 'Completed', value: props.stats.completed, valueClass: 'text-green-600' },
  { label: 'Overdue', value: props.stats.overdue, valueClass: 'text-red-600' },
])
</script>
