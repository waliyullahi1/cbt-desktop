import tailwindcss from "@tailwindcss/vite";
// tauri
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  devtools: {
    enabled: false
  },
   modules: [
    '@nuxt/icon',

  ],
  ssr: false,

  nitro: {
    preset: 'static'
  },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  app: {
    baseURL: './',
     pageTransition: {
      name: 'page-sheet',
      mode: 'out-in'
    }
  }
})