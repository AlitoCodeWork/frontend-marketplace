<template>
  <div class="fixed inset-0 bg-gray-500 bg-opacity-50 z-50 flex justify-center items-center">
    <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
      <div class="flex items-center mb-4">
        <ExclamationTriangleIcon class="w-6 h-6 text-red-500 mr-2" />
        <h3 class="text-lg font-semibold text-gray-900">Confirmar eliminación</h3>
      </div>
      
      <p class="text-gray-600 mb-6">
        ¿Estás seguro de que quieres eliminar esta publicación? Esta acción no se puede deshacer.
      </p>
      
      <div class="flex justify-end space-x-3">
        <button
          @click="$emit('cancel')"
          class="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
          :disabled="loading"
        >
          Cancelar
        </button>
        <button
          @click="$emit('confirm')"
          :disabled="loading"
          class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          <span v-if="loading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
          {{ loading ? 'Eliminando...' : 'Eliminar' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline';

interface Props {
  loading?: boolean;
}

defineProps<Props>();
defineEmits<{
  cancel: [];
  confirm: [];
}>();
</script>