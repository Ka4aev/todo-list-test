import type { User, LoginRequest } from '~/types'

export const useAuth = () => {
  const user = useState<User | null>('user', () => null)
  const isAuthenticated = computed(() => !!user.value)

  const login = async (credentials: LoginRequest) => {
    const { $api } = useNuxtApp()
    try {
      const { data } = await $api.post('/auth/login', credentials)
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

  const logout = () => {
    user.value = null
    if (import.meta.client) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
    }
  }

  const initAuth = () => {
    if (import.meta.client) {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        try {
          user.value = JSON.parse(storedUser)
        } catch {
          logout()
        }
      }
    }
  }

  return {
    user,
    isAuthenticated,
    login,
    logout,
    initAuth,
  }
}
