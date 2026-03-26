<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
    <div class="w-full max-w-md space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">Sign in to Todo List</h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Test accounts: admin@test.com / user@test.com (password: 123456)
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="space-y-4 rounded-md shadow-sm">
          <div>
            <label for="email" class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
            <input
              id="email"
              v-model="email"
              name="email"
              type="email"
              autocomplete="email"
              required
              placeholder="Enter your email"
              :class="[
                'relative block w-full appearance-none rounded-md border px-3 py-2 focus:border-blue-500 focus:ring-2 focus:outline-none sm:text-sm dark:bg-gray-800 dark:text-white',
                errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500 dark:border-gray-600',
              ]"
            />
            <p v-if="errors.email" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.email }}</p>
          </div>

          <div>
            <label for="password" class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input
              id="password"
              v-model="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              placeholder="Enter your password"
              :class="[
                'relative block w-full appearance-none rounded-md border px-3 py-2 focus:border-blue-500 focus:ring-2 focus:outline-none sm:text-sm dark:bg-gray-800 dark:text-white',
                errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500 dark:border-gray-600',
              ]"
            />
            <p v-if="errors.password" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.password }}</p>
          </div>
        </div>

        <UiButton type="submit" :loading="loading" :block="true">Sign in</UiButton>

        <UiCard v-if="errorMessage" class="bg-red-50 dark:bg-red-900/20">
          <p class="text-sm font-medium text-red-800 dark:text-red-200">{{ errorMessage }}</p>
        </UiCard>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores'


const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')
const errors = ref<{ email?: string; password?: string }>({})

const authStore = useAuthStore()
const router = useRouter()

const validate = () => {
  errors.value = {}

  if (!email.value) {
    errors.value.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.value.email = 'Please enter a valid email'
  }

  if (!password.value) {
    errors.value.password = 'Password is required'
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validate()) return

  loading.value = true
  errorMessage.value = ''
  errors.value = {}

  const result = await authStore.login({ email: email.value, password: password.value })

  loading.value = false

  if (result.success) {
    router.push('/')
  } else {
    errorMessage.value = result.message || 'Login failed'
  }
}
</script>
