<!-- ========================================= -->
<!-- COMPONENTE MODAL ELIMINAR REUTILIZABLE -->
<!-- ========================================= -->

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="$emit('close')">
    <div class="bg-white rounded-lg w-full max-w-sm" @click.stop>
      <!-- Header -->
      <div class="p-5 border-b border-gray-200 flex justify-between items-center">
        <h3 class="text-lg font-semibold text-gray-800">
          <svg class="w-6 h-6 inline-block mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
          </svg>
          Confirmar Eliminación
        </h3>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      
      <!-- Body -->
      <div class="p-5">
        <div class="mb-4">
          <p class="text-gray-700 mb-2">
            ¿Estás seguro de que deseas eliminar {{ mensajeElementos }}?
          </p>
          <p class="text-red-500 text-sm italic">
            Esta acción no se puede deshacer.
          </p>
        </div>
        
        <!-- Lista de elementos a eliminar si hay más de uno -->
        <div v-if="mostrarLista && elementosDetalle.length > 0" class="bg-gray-50 rounded-md p-3 max-h-32 overflow-y-auto">
          <ul class="text-sm text-gray-600 space-y-1">
            <li v-for="elemento in elementosDetalle" :key="elemento.id" class="flex items-center">
              <svg class="w-3 h-3 mr-2 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="3"/>
              </svg>
              {{ elemento.nombre }}
            </li>
          </ul>
        </div>
      </div>
      
      <!-- Footer -->
      <div class="flex justify-end gap-2 p-5 border-t border-gray-200">
        <button 
          @click="$emit('close')" 
          :disabled="cargando"
          class="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          Cancelar
        </button>
        <button 
          @click="$emit('confirmar')" 
          :disabled="cargando" 
          class="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center"
        >
          <svg v-if="cargando" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ cargando ? 'Eliminando...' : 'Eliminar' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModalEliminar',
  props: {
    // Array de IDs de elementos a eliminar
    elementos: {
      type: Array,
      required: true
    },
    // Detalles de los elementos (opcional, para mostrar nombres)
    elementosDetalle: {
      type: Array,
      default: () => []
    },
    // Tipo de elemento (ej: 'categoria', 'subcategoría', 'usuario', 'perfil')
    tipo: {
      type: String,
      default: 'elemento'
    },
    // Estado de carga
    cargando: {
      type: Boolean,
      default: false
    },
    // Mostrar lista detallada de elementos
    mostrarLista: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'confirmar'],
  computed: {
    mensajeElementos() {
      const cantidad = this.elementos.length
      const tipoPlural = this.getTipoPlural()
      
      if (cantidad === 1) {
        return `${this.getTipoSingular()} seleccionado`
      } else {
        return `${tipoPlural} seleccionados (${cantidad})`
      }
    }
  },
  methods: {
    getTipoSingular() {
      const tipos = {
        'categoria': 'esta categoría',
        'subcategoria': 'esta subcategoría',
        'usuario': 'este usuario',
        'producto': 'este producto',
        'perfil': 'este perfil',
        'publicacion': 'esta publicación'
      }
      return tipos[this.tipo] || `este ${this.tipo}`
    },
    
    getTipoPlural() {
      const tipos = {
        'categoria': 'estas categorías',
        'subcategoria': 'estas subcategorías',
        'usuario': 'estos usuarios',
        'producto': 'estos productos',
        'perfil': 'estos perfiles',
        'publicacion': 'estas publicaciones'
      }
      return tipos[this.tipo] || `estos ${this.tipo}s`
    }
  }
}
</script>

<style scoped>
@keyframes spin {
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>