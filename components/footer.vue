<template>
  <footer class="bg-white  py-2 lg:py-2 mt-6 border-t border-gray-200">
    <div class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between gap-4">
        <!-- Bloque izquierdo (logo y redes sociales) -->
        <div class="flex flex-col items-start ml-4">
          <!-- Logo -->
          <div class="mb-4">
            <ShoppingBagIcon class="w-8 h-8 text-[#204347]" />
          </div>

          <!-- Redes sociales solo en PC -->
          <div class=" lg:flex space-x-4 mb-6">
            <a href="#" class="text-gray-600 hover:text-gray-800">
              <img src="https://cdn.jsdelivr.net/npm/simple-icons@5.1.0/icons/facebook.svg" class="w-6 h-6" alt="Facebook" />
            </a>
            <a href="#" class="text-gray-600 hover:text-gray-800">
              <img src="https://cdn.jsdelivr.net/npm/simple-icons@5.1.0/icons/twitter.svg" class="w-6 h-6" alt="Twitter" />
            </a>
            <a href="#" class="text-gray-600 hover:text-gray-800">
              <img src="https://cdn.jsdelivr.net/npm/simple-icons@5.1.0/icons/instagram.svg" class="w-6 h-6" alt="Instagram" />
            </a>
            <a href="#" class="text-gray-600 hover:text-gray-800">
              <img src="https://cdn.jsdelivr.net/npm/simple-icons@5.1.0/icons/linkedin.svg" class="w-6 h-6" alt="LinkedIn" />
            </a>
          </div>
        </div>

        <!-- Bloque central (Páginas) -->
        <div class="flex flex-col items-start lg:mr-4">
          <h3 class="text-xl font-semibold text-gray-900">Páginas</h3>
          <ul class="mt-4 space-y-2 text-gray-600">
            <li class="flex items-center space-x-2">
              <DocumentTextIcon class="w-5 h-5 text-gray-500" />
              <a href="#" class="hover:text-gray-800">Publicaciones</a>
            </li>
            <li class="flex items-center space-x-2">
              <ClipboardDocumentCheckIcon class="w-5 h-5 text-gray-500" />
              <a href="#" class="hover:text-gray-800">Términos de uso</a>
            </li>
            <li class="flex items-center space-x-2">
              <LockClosedIcon class="w-5 h-5 text-gray-500" />
              <a href="#" class="hover:text-gray-800">Política de privacidad</a>
            </li>
            <li class="flex items-center space-x-2">
              <UserCircleIcon class="w-5 h-5 text-gray-500" />
              <a href="#" class="hover:text-gray-800">Mi Cuenta</a>
            </li>
          </ul>
        </div>

        <!-- Bloque derecho (Categorías) -->
        <div class="flex flex-col items-end mr-4">
          <h3 class="text-xl  mr-4 font-semibold text-gray-900">Categorías</h3>
          <ul class="mt-4 space-y-2 text-gray-600">
            <li v-for="category in categories" :key="category.id">
              <a href="#" class="hover:text-gray-800">{{ category.nombre }}</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useNuxtApp } from '#app'

// Iconos
import {
  DocumentTextIcon,
  ClipboardDocumentCheckIcon,
  LockClosedIcon,
  UserCircleIcon,
  ShoppingBagIcon
} from '@heroicons/vue/24/outline'

const { $axios } = useNuxtApp()
const categories = ref([])

const fetchCategories = async () => {
  try {
    const res = await $axios.get('/public/categorias')
    categories.value = res.data.categorias || []
  } catch (error) {
    console.error('Error al obtener categorías en el footer:', error)
  }
}

onMounted(fetchCategories)
</script>

<style scoped>
/* Puedes agregar estilos aquí si los necesitas */
</style>
