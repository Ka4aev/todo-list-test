export default defineNuxtRouteMiddleware((to) => {
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
