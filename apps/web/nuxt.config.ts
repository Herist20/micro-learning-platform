// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-01-01',

  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxt/image',
    'shadcn-nuxt'
  ],

  // TypeScript Configuration
  typescript: {
    strict: true,
    typeCheck: true,
    shim: false
  },

  // Tailwind CSS Configuration
  tailwindcss: {
    exposeConfig: true,
    viewer: true,
    cssPath: '~/assets/css/tailwind.css'
  },

  // Shadcn-vue Configuration
  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  },

  // Pinia Configuration
  pinia: {
    storesDirs: ['./stores/**']
  },

  // App Configuration
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'Micro-Learning Platform',
      meta: [
        { name: 'description', content: 'Modern Micro-Learning Platform' }
      ]
    }
  },

  // Runtime Config (Environment Variables)
  runtimeConfig: {
    // Private keys (server-side only)
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3001',
      appUrl: process.env.NUXT_PUBLIC_APP_URL || 'http://localhost:3000'
    }
  },

  // Auto-import Configuration
  imports: {
    dirs: ['composables/**', 'utils/**']
  },

  // Components Auto-import
  components: [
    {
      path: '~/components',
      pathPrefix: false
    }
  ],

  // CSS Configuration
  css: ['~/assets/css/tailwind.css'],

  // Vite Configuration
  vite: {
    resolve: {
      alias: {
        '@shared': '../../../packages/shared/src',
        '@ui': '../../../packages/ui/src'
      }
    }
  },

  // Nitro Configuration
  nitro: {
    compressPublicAssets: true
  }
})
