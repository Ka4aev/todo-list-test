<template>
  <button :type="type" :disabled="disabled || loading" :class="buttonClass" v-bind="$attrs">
    <span
      v-if="loading"
      :class="[
        'inline-block animate-spin rounded-full border-2 border-white/30 border-t-white',
        size === 'sm' ? 'h-4 w-4' : 'h-5 w-5',
      ]"
    />
    <slot />
  </button>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md'
  loading?: boolean
  disabled?: boolean
  block?: boolean
  type?: 'button' | 'submit' | 'reset'
}>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
  block: false,
  type: 'button',
})

const variantClass: Record<NonNullable<typeof props.variant>, string> = {
  primary: 'text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 border border-transparent',
  secondary: 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 focus:ring-blue-500',
  danger: 'text-red-800 dark:text-red-200 border border-red-300 dark:border-red-700 hover:bg-red-100 dark:hover:bg-red-900/30 focus:ring-red-500',
  ghost: 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700',
}

const sizeClass: Record<NonNullable<typeof props.size>, string> = {
  sm: 'px-3 py-1 text-xs',
  md: 'px-4 py-2 text-sm',
}

const buttonClass = computed(() => [
  'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed',
  variantClass[props.variant],
  props.size === 'sm' ? sizeClass.sm : sizeClass.md,
  props.block ? 'w-full' : '',
])
</script>
