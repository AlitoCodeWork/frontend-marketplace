<template>
  <div class="w-full">
    <!-- Header con título y botón eliminar -->
    <div class="flex items-center justify-between mb-6">
      <h2 v-if="selectedItems.length === 0" class="text-xl font-semibold text-gray-800">{{ titulo }}</h2>
      <button 
        v-if="selectedItems.length > 0"
        @click="$emit('eliminar-seleccionados', selectedItems)"
        class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
        </svg>
        Eliminar Seleccionadas ({{ selectedItems.length }})
      </button>
    </div>

    <!-- Tabla -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50 border-b">
          <tr>
            <!-- Checkbox para seleccionar todo -->
            <th class="w-12 p-4">
              <input 
                type="checkbox"
                :checked="isAllSelected"
                @change="toggleSelectAll"
                class="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
              />
            </th>
            
            <!-- Columnas dinámicas -->
            <th 
              v-for="columna in columnas" 
              :key="columna.key"
              class="text-left p-4 font-semibold text-gray-700"
              :class="columna.class"
            >
              {{ columna.label }}
            </th>
            
            <!-- Columna de operaciones -->
            <th class="text-center p-4 font-semibold text-gray-700">
              <div class="flex items-center justify-center">
                <span class="mr-2">Operaciones</span>
                <button 
                  v-if="mostrarBotonAgregar"
                  @click="$emit('agregar')"
                  class="bg-teal-600 hover:bg-teal-700 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold transition-colors duration-200"
                >
                  +
                </button>
              </div>
            </th>
          </tr>
        </thead>
        
        <tbody>
          <tr 
            v-for="item in itemsPaginados" 
            :key="item.id"
            class="border-b hover:bg-gray-50 transition-colors"
          >
            <!-- Checkbox de selección -->
            <td class="p-4">
              <input 
                type="checkbox"
                :checked="selectedItems.includes(item.id)"
                @change="toggleSelectItem(item.id)"
                class="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
              />
            </td>
            
            <!-- Datos dinámicos -->
            <td 
              v-for="columna in columnas" 
              :key="columna.key"
              class="p-4 text-gray-900"
              :class="columna.class"
            >
              <slot 
                :name="columna.key" 
                :item="item" 
                :value="getNestedValue(item, columna.key)"
              >
                {{ getNestedValue(item, columna.key) }}
              </slot>
            </td>
            
            <!-- Botones de operaciones -->
            <td class="p-4">
              <div class="flex items-center justify-center space-x-2">
                <button 
                  v-if="mostrarEditar"
                  @click="$emit('editar', item)"
                  class="bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center transition-colors duration-200"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                  Editar
                </button>
                
                <button 
                  v-if="mostrarEliminar"
                  @click="$emit('eliminar', item)"
                  class="hover:bg-gray-100 p-2 rounded transition-colors duration-200"
                >
                  <svg class="w-4 h-4" fill="none" stroke="black" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
                
                <!-- Slot para acciones personalizadas -->
                <slot name="acciones" :item="item"></slot>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      
      <!-- Mensaje cuando no hay datos -->
      <div v-if="items.length === 0" class="text-center py-12 text-gray-500">
        <slot name="empty">
          <p>No hay datos disponibles</p>
        </slot>
      </div>
    </div>

    <!-- Paginación -->
    <div v-if="totalPaginas > 1" class="flex items-center justify-center space-x-2 mt-6">
      <!-- Botón anterior -->
      <button 
        @click="paginaActual = paginaActual - 1"
        :disabled="paginaActual <= 1"
        class="px-3 py-1 rounded text-sm border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
      >
        ← Anterior
      </button>
      
      <!-- Números de página -->
      <template v-for="page in paginasVisibles" :key="page">
        <button 
          v-if="page !== '...'"
          @click="paginaActual = page"
          :class="[
            'px-3 py-1 rounded text-sm border',
            page === paginaActual 
              ? 'bg-teal-800 text-white border-teal-800' 
              : 'hover:bg-gray-100'
          ]"
        >
          {{ page }}
        </button>
        <span v-else class="px-2">...</span>
      </template>
      
      <!-- Botón siguiente -->
      <button 
        @click="paginaActual = paginaActual + 1"
        :disabled="paginaActual >= totalPaginas"
        class="px-3 py-1 rounded text-sm border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
      >
        Siguiente →
      </button>
    </div>

    <!-- Información de paginación -->
    <div v-if="items.length > 0" class="text-center mt-4 text-sm text-gray-600">
      Mostrando {{ inicioRegistro }} a {{ finRegistro }} de {{ items.length }} registros
    </div>
  </div>
</template>

<script>
export default {
  name: 'Tabla',
  props: {
    titulo: {
      type: String,
      default: 'Gestión de Datos'
    },
    items: {
      type: Array,
      required: true
    },
    columnas: {
      type: Array,
      required: true
      // Formato: [{ key: 'nombre', label: 'Nombre', class: 'w-1/3' }]
    },
    itemsPorPagina: {
      type: Number,
      default: 10
    },
    mostrarEditar: {
      type: Boolean,
      default: true
    },
    mostrarEliminar: {
      type: Boolean,
      default: true
    },
    mostrarBotonAgregar: {
      type: Boolean,
      default: true
    }
  },
  emits: [
    'editar', 
    'eliminar', 
    'agregar',
    'eliminar-seleccionados',
    'seleccion-cambiada'
  ],
  data() {
    return {
      selectedItems: [],
      paginaActual: 1
    }
  },
  computed: {
    totalPaginas() {
      return Math.ceil(this.items.length / this.itemsPorPagina);
    },
    
    itemsPaginados() {
      const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
      const fin = inicio + this.itemsPorPagina;
      return this.items.slice(inicio, fin);
    },
    
    inicioRegistro() {
      return (this.paginaActual - 1) * this.itemsPorPagina + 1;
    },
    
    finRegistro() {
      const fin = this.paginaActual * this.itemsPorPagina;
      return Math.min(fin, this.items.length);
    },
    
    isAllSelected() {
      return this.itemsPaginados.length > 0 && 
             this.itemsPaginados.every(item => this.selectedItems.includes(item.id));
    },
    
    paginasVisibles() {
      if (this.totalPaginas <= 1) return [];
      
      const current = this.paginaActual;
      const total = this.totalPaginas;
      const delta = 2;
      
      const range = [];
      const rangeWithDots = [];
      
      // Calcular el rango de páginas a mostrar
      for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
        range.push(i);
      }
      
      // Agregar primera página
      if (current - delta > 2) {
        rangeWithDots.push(1, '...');
      } else {
        rangeWithDots.push(1);
      }
      
      // Agregar páginas del rango
      rangeWithDots.push(...range);
      
      // Agregar última página
      if (current + delta < total - 1) {
        rangeWithDots.push('...', total);
      } else if (total > 1) {
        rangeWithDots.push(total);
      }
      
      return rangeWithDots;
    }
  },
  methods: {
    toggleSelectAll() {
      if (this.isAllSelected) {
        // Deseleccionar todos los items de la página actual
        this.itemsPaginados.forEach(item => {
          const index = this.selectedItems.indexOf(item.id);
          if (index > -1) {
            this.selectedItems.splice(index, 1);
          }
        });
      } else {
        // Seleccionar todos los items de la página actual
        this.itemsPaginados.forEach(item => {
          if (!this.selectedItems.includes(item.id)) {
            this.selectedItems.push(item.id);
          }
        });
      }
      this.$emit('seleccion-cambiada', this.selectedItems);
    },
    
    toggleSelectItem(id) {
      const index = this.selectedItems.indexOf(id);
      if (index > -1) {
        this.selectedItems.splice(index, 1);
      } else {
        this.selectedItems.push(id);
      }
      this.$emit('seleccion-cambiada', this.selectedItems);
    },
    
    getNestedValue(obj, path) {
      return path.split('.').reduce((current, key) => current?.[key], obj);
    }
  },
  watch: {
    items: {
      handler(newItems) {
        // Limpiar selección cuando cambian los items
        this.selectedItems = [];
        // Resetear a la primera página
        this.paginaActual = 1;
        this.$emit('seleccion-cambiada', this.selectedItems);
      },
      immediate: true
    }
  }
};
</script>

<style scoped>
/* Estilos adicionales si se necesitan */
</style>