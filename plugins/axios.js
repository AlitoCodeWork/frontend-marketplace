// plugins/axios.js
import axios from 'axios'

export default defineNuxtPlugin(nuxtApp => {
  const config = useRuntimeConfig()

  const axiosInstance = axios.create({
    baseURL: config.public.apiBase, // <-- nombre correcto
    headers: {
      'Content-Type': 'application/json',
    }
  })

  nuxtApp.provide('axios', axiosInstance)
})
