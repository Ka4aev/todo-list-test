import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  modules: [
    '@pinia/nuxt',
  ],

  components: [
    '~/components',
    {
      path: '~/shared/ui',
      pathPrefix: false,
    },
  ],

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      apiBase: '/api',
      apiURL: 'http://localhost:3001',
    },
  },

  typescript: {
    strict: true,
  },

  ssr: false,
  ignore: ['server/**'],
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ['server'],
    },
  },

  app: {
    head: {
      title: 'Todo List',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Todo List Application' },
      ],
    },
  },
})
