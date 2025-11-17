<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="$emit('close')">
    <div class="bg-white rounded-lg w-full max-w-md" @click.stop>
      <!-- Header -->
      <div class="p-5 border-b border-gray-200 flex justify-between items-center">
        <h3 class="text-lg font-semibold text-gray-800">Crear Subcategoría</h3>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Body -->
      <div class="p-5">
        <p class="text-sm text-gray-600 mb-4">Introduzca el nombre de la nueva subcategoría</p>
        
        <div class="space-y-4">
          <!-- Campo Nombre -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la subcategoría
            </label>
            <input
              v-model="form.nombre"
              type="text"
              placeholder="ej: zapatos de niños"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              :class="{ 'border-red-500': errors.nombre }"
            />
            <p v-if="errors.nombre" class="text-red-500 text-sm mt-1">{{ errors.nombre }}</p>
          </div>

          <!-- Campo Categoría -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Categoría
            </label>
            <select
              v-model="form.categoria_id"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              :class="{ 'border-red-500': errors.categoria_id }"
            >
              <option value="" disabled>Escoja la categoría a la que pertenece</option>
              <option v-for="categoria in categorias" :key="categoria.id" :value="categoria.id">
                {{ categoria.nombre }}
              </option>
            </select>
            <p v-if="errors.categoria_id" class="text-red-500 text-sm mt-1">{{ errors.categoria_id }}</p>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex justify-end gap-2 p-5 border-t border-gray-200">
        <button 
          @click="$emit('close')" 
          class="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded cursor-pointer transition-colors"
        >
          Cancelar
        </button>
        <button 
          @click="handleSubmit" 
          :disabled="cargando"
          class="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {{ cargando ? 'Creando...' : 'Crear subcategoría' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModalCrearSubcategoria',
  props: {
    categorias: {
      type: Array,
      required: true
    }
  },
  emits: ['close', 'crear'],
  data() {
    return {
      form: {
        nombre: '',
        categoria_id: ''
      },
      errors: {},
      cargando: false
    }
  },
  methods: {
    validateForm() {
      this.errors = {}
      
      if (!this.form.nombre.trim()) {
        this.errors.nombre = 'El nombre es requerido'
      }
      
      if (!this.form.categoria_id) {
        this.errors.categoria_id = 'Debe seleccionar una categoría'
      }
      
      return Object.keys(this.errors).length === 0
    },
    
    async handleSubmit() {
      if (!this.validateForm()) return
      
      this.cargando = true
      try {
        await this.$emit('crear', {
          nombre: this.form.nombre.trim(),
          categoria_id: parseInt(this.form.categoria_id)
        })
      } finally {
        this.cargando = false
      }
    }
  }
}
</script>