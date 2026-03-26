<template>
  <div :class="cardClass">
    <slot />
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  padded?: boolean
  hoverable?: boolean
}>(), {
  padded: true,
  hoverable: false,
})

const cardClass = computed(() => [
  'rounded-lg bg-white shadow dark:bg-gray-800',
  props.padded ? 'p-4' : '',
  props.hoverable ? 'transition-all duration-200 hover:shadow-md' : '',
])
</script>
