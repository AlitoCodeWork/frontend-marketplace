<template>
  <div class="flex space-x-6 p-6 justify-end">
    <button 
      @click="crearPublicacion" 
      class="py-2 px-4 border rounded-lg hover:bg-gray-200"
    >
      Nueva Publicación
    </button>
    
    <button 
      @click="logout" 
      class="flex items-center py-2 px-4 text-lg font-semibold"
    >
      <!-- SVG de salir -->
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15 12H3m0 0l4-4m-4 4l4 4M21 5a2 2 0 00-2-2h-5a2 2 0 00-2 2v14a2 2 0 002 2h5a2 2 0 002-2V5z"/>
      </svg>
      Cerrar Sesión
    </button>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue'

// Definir los eventos que se van a emitir
const emit = defineEmits(['crear-publicacion', 'logout'])

// Función para crear publicación
const crearPublicacion = () => {
  emit('crear-publicacion')
}

// Función para logout
const logout = () => {
  emit('logout')
}
</script>