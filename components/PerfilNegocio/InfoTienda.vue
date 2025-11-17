<template>
  <div class="p-4 space-y-3">
    <!-- Descripción -->
    <h2 class="text-sm font-semibold text-teal-800">Descripción:</h2>
    <p class="text-gray-700 text-xs">{{ perfil.descripcion }}</p>

    <!-- Contacto -->
    <h3 class="text-sm font-semibold text-teal-800">Contacto:</h3>
    <ul class="space-y-2">
      <li class="flex items-center space-x-2 border-b border-gray-300 pb-2">
        <EnvelopeIcon class="w-4 h-4 text-black" />
        <span class="text-black text-xs">{{ perfil.contacto_correo }}</span>
      </li>
      <li class="flex items-center space-x-2 border-b border-gray-300 pb-2">
        <PhoneIcon class="w-4 h-4 text-black" />
        <span class="text-black text-xs">{{ perfil.contacto_telefono }}</span>
      </li>
      <li class="flex items-center space-x-2 border-b border-gray-300 pb-2">
        <MapPinIcon class="w-4 h-4 text-black" />
        <span class="text-black text-xs">{{ perfil.direccion }}</span>
      </li>
    </ul>

    <!-- Enlace a mapa -->
    <div class="flex items-center space-x-2">
      <MapIcon class="w-4 h-4 text-black" />
      <a
        v-if="perfil.latitude && perfil.longitude"
        :href="`https://www.google.com/maps?q=${perfil.latitude},${perfil.longitude}`"
        target="_blank"
        class="text-xs hover:underline"
      >
        Ver en el mapa
      </a>
    </div>

    <!-- Opiniones / valoraciones -->
    <div class="flex items-center space-x-2 pt-2">
      <StarIcon class="w-4 h-4 text-black" />
      <a href="#reviews" class="text-xs hover:underline">
        Ver Opiniones
      </a>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  MapIcon,
  StarIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  perfil: {
    type: Object,
    required: true,
    default: () => ({
      descripcion: '',
      contacto_correo: '',
      contacto_telefono: '',
      direccion: '',
      latitude: null,
      longitude: null
    })
  }
})
</script>
