import { useAuthStore } from '~/stores'

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()

  if (import.meta.client) {
    const token = localStorage.getItem('auth_token')
    const isAuthPage = to.path === '/login'

    if (!token && !isAuthPage) {
      return navigateTo('/login')
    }

    if (token && isAuthPage) {
      return navigateTo('/')
    }
  }
})
