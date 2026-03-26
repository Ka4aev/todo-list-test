<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores'

const authStore = useAuthStore()

if (import.meta.client) {
  onMounted(() => {
    authStore.initAuth()
  })
}
</script>
