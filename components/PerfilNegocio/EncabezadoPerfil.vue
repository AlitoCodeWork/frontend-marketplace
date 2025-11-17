<template>
  <div class="flex flex-col items-center p-4 border-b-2 border-gray-200">
    <div class="flex justify-between items-center w-full mb-3">
      <div class="flex items-center space-x-1">
        <!-- Flecha apuntando a la izquierda para navegar -->
        <ArrowLeftIcon 
          @click="navigateToDashboard" 
          class="w-6 h-6 text-teal-800 cursor-pointer hover:text-teal-600"
        />
        <h1 class="text-lg font-semibold text-teal-800">{{ perfil.nombre_negocio }}</h1>
      </div>
      <div v-if="showActions" class="flex space-x-4">
        <BellIcon class="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800" />
        <CogIcon 
          @click="editarPerfil" 
          class="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800" 
        />
      </div>
    </div>

    <!-- Contenedor de la imagen cuadrada -->
    <div class="flex justify-center items-center w-20 h-20 rounded-md overflow-hidden mb-3">
      <img
        :src="perfil.imagen || '/placeholder.jpg'"
        alt="Imagen de la tienda"
        class="w-full h-full object-cover"
      />
    </div>

    <span class="ml-1 text-xs text-gray-600">
      {{ (perfil.valoracion ?? 0).toFixed(1) }}
    </span>
    
    <!-- Contenedor de estrellas alineadas horizontalmente -->
    <div class="flex space-x-1">
      <StarIcon
        v-for="n in 5"
        :key="n"
        class="w-4 h-4 inline-block"
        :class="n <= Math.round(perfil.valoracion ?? 0)
          ? 'text-yellow-500'
          : 'text-gray-300'"
      />
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { BellIcon, CogIcon, ArrowLeftIcon, StarIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
 perfil: {
     type: Object,
     required: true,
     default: () => ({ nombre_negocio: '', imagen: '', valoracion: 0 })
   },
   showActions: {
     type: Boolean,
     default: true
   }
})

// Definir los eventos que se van a emitir
const emit = defineEmits(['editar', 'navigate-to-dashboard'])

// Función para navegar al dashboard
const navigateToDashboard = () => {
  emit('navigate-to-dashboard')
}

// Función para editar perfil
const editarPerfil = () => {
  emit('editar')
}
</script>