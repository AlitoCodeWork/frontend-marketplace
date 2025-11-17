// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',

  css: ['font-awesome/css/font-awesome.css'],

  plugins: [
    { src: '~/plugins/fontawesome.js', mode: 'client' },
    '~/plugins/axios.js',
  ],

  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
  ],


  vite: {
    server: {
      fs: {
        strict: false
      }
    }
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:4000' 
    }
  }

});