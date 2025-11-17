<template>
  <div 
    v-if="mostrar" 
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" 
    @click="cerrar"
  >
    <div 
      class="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto" 
      @click.stop
    >
      <div class="flex justify-between items-center p-5 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-800">
          {{ modoEdicion ? 'Editar Categoría' : 'Crear Categoría' }}
        </h3>
        <button 
          @click="cerrar" 
          class="text-gray-400 hover:text-gray-600 text-xl"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <form @submit.prevent="guardar" class="p-5">
        <div class="mb-5">
          <label for="nombre" class="block mb-2 font-medium text-gray-700">
            Nombre de la categoría:
          </label>
          <input 
            type="text" 
            id="nombre"
            v-model="form.nombre"
            placeholder="Introduzca el nombre de la nueva categoría"
            required
            :disabled="cargando"
            class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500 disabled:opacity-50"
          />
        </div>
        
        <div class="flex justify-end gap-2 pt-5 border-t border-gray-200">
          <button 
            type="button" 
            @click="cerrar" 
            class="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded cursor-pointer transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            :disabled="cargando" 
            class="bg-teal-800 hover:bg-teal-700 text-white px-5 py-2 rounded cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {{ cargando ? 'Guardando...' : 'Crear Categoría' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModalCategoria',
  props: {
    mostrar: {
      type: Boolean,
      default: false
    },
    categoria: {
      type: Object,
      default: null
    },
    cargando: {
      type: Boolean,
      default: false
    }
  },
  emits: ['cerrar', 'guardar'],
  data() {
    return {
      form: {
        nombre: ''
      }
    }
  },
  computed: {
    modoEdicion() {
      return this.categoria !== null
    }
  },
  watch: {
    categoria: {
      handler(newCategoria) {
        if (newCategoria) {
          this.form.nombre = newCategoria.nombre
        } else {
          this.form.nombre = ''
        }
      },
      immediate: true
    },
    mostrar(newVal) {
      if (!newVal) {
        this.form.nombre = ''
      }
    }
  },
  methods: {
    cerrar() {
      this.$emit('cerrar')
    },
    guardar() {
      if (this.form.nombre.trim()) {
        this.$emit('guardar', {
          id: this.categoria?.id || null,
          nombre: this.form.nombre.trim()
        })
      }
    }
  }
}
</script>

<style scoped>
/* Estilos personalizados si son necesarios */
</style>