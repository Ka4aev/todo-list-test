import { defineStore } from 'pinia'
import type { LoginRequest, User } from '~/types'
import { loginRequest } from '~/stores/api/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value)
  const userEmail = computed(() => user.value?.email)
  const userRole = computed(() => user.value?.role)
  const isAdmin = computed(() => user.value?.role === 'admin')

  function initAuth() {
    if (import.meta.client) {
      const storedToken = localStorage.getItem('auth_token')
      const storedUser = localStorage.getItem('user')

      if (storedToken && storedUser) {
        try {
          token.value = storedToken
          user.value = JSON.parse(storedUser)
        } catch {
          logout()
        }
      }
    }
  }

  async function login(credentials: LoginRequest): Promise<{ success: boolean; message?: string }> {
    try {
      const { data } = await loginRequest(credentials)

      token.value = data.token
      user.value = data.user

      if (import.meta.client) {
        localStorage.setItem('auth_token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
      }

      return { success: true }
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      }
    }
  }

  function logout() {
    user.value = null
    token.value = null

    if (import.meta.client) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    userEmail,
    userRole,
    isAdmin,
    initAuth,
    login,
    logout,
  }
})
