<template>
  <span :class="badgeClass">
    <slot />
  </span>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  variant?: 'neutral' | 'info' | 'success' | 'danger'
}>(), {
  variant: 'neutral',
})

const variantClass: Record<NonNullable<typeof props.variant>, string> = {
  neutral: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
  info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  success: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  danger: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
}

const badgeClass = computed(() => [
  'inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs',
  variantClass[props.variant],
])
</script>
