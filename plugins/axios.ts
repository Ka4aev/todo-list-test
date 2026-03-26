import axios, { AxiosError } from 'axios'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const apiBase = import.meta.dev
    ? 'http://localhost:3001/api'
    : (config.public.apiBase || '/api')

  const api = axios.create({
    baseURL: apiBase,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  api.interceptors.request.use(config => {
    if (import.meta.client) {
      const token = localStorage.getItem('auth_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  })

  api.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
      const status = error.response?.status

      if (status === 401) {
        if (import.meta.client) {
          localStorage.removeItem('auth_token')
          localStorage.removeItem('user')
          window.location.href = '/login'
        }
      }

      if (status === 403) {
        console.warn('Forbidden: insufficient permissions')
      }

      if (status === 404) {
        console.warn('Resource not found')
      }

      if (status === 500) {
        console.error('Server error:', error.response?.data)
      }

      return Promise.reject(error)
    }
  )

  return {
    provide: { api },
  }
})
