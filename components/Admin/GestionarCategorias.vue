<template>
  <div class="p-5 max-w-6xl mx-auto">
    <!-- Componente tabla reutilizable -->
    <Tabla
      titulo="Gestión de Categorías"
      :items="categorias"
      :columnas="columnas"
      :items-por-pagina="10"
      :mostrar-editar="true"
      :mostrar-eliminar="true"
      :mostrar-boton-agregar="true"
      @agregar="mostrarModalCrear"
      @editar="editarCategoria"
      @eliminar="eliminarCategoria"
      @eliminar-seleccionados="eliminarSeleccionados"
      @seleccion-cambiada="actualizarSeleccion"
    >
      <!-- Slot para el estado vacío -->
      <template #empty>
        <div class="py-12 text-center text-gray-500">
          <i class="fas fa-folder-open text-4xl mb-4"></i>
          <p class="text-lg mb-2">No hay categorías disponibles</p>
          <p class="text-sm">Crea tu primera categoría para comenzar</p>
        </div>
      </template>
    </Tabla>

    <!-- Modal para crear/editar categoría -->
    <ModalCategoria
      :mostrar="mostrarModal"
      :categoria="categoriaSeleccionada"
      :cargando="cargando"
      @cerrar="cerrarModal"
      @guardar="guardarCategoria"
    />

    <!-- Modal de confirmación para eliminar usando el componente reutilizable -->
    <ModalEliminar
      v-if="mostrarModalEliminar"
      :elementos="elementosAEliminar"
      :elementos-detalle="elementosDetalleEliminar"
      tipo="categoria"
      :cargando="cargando"
      :mostrar-lista="elementosAEliminar.length > 1"
      @close="cerrarModalEliminar"
      @confirmar="confirmarEliminacion"
    />

    <!-- ToastContainer - Sistema centralizado de notificaciones -->
    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import Tabla from '@/components/Tabla/Tabla.vue'
import ModalCategoria from '@/components/modal/ModalCategoria.vue'
import ModalEliminar from '@/components/modal/ModalEliminar.vue'
import ToastContainer from '@/components/Toast/ToastContainer.vue'
import { useToast } from '@/plugins/composables/useToast'

interface Categoria {
  id: number
  nombre: string
  creado_en: string
}

// Usar el composable de toast
const { showToast } = useToast()

// Estados reactivos
const categorias = ref<Categoria[]>([])
const cargando = ref<boolean>(false)
const mostrarModal = ref<boolean>(false)
const mostrarModalEliminar = ref<boolean>(false)
const elementosAEliminar = ref<number[]>([])
const categoriasSeleccionadas = ref<number[]>([])
const categoriaSeleccionada = ref<Categoria | null>(null)

// Configuración de columnas para la tabla
const columnas = [
  { 
    key: 'nombre', 
    label: 'Nombre de la Categoría', 
    class: 'w-2/3' 
  },
  { 
    key: 'creado_en', 
    label: 'Fecha de Creación', 
    class: 'w-1/3' 
  }
]

// Computed para obtener los detalles de los elementos a eliminar
const elementosDetalleEliminar = computed(() => {
  return categorias.value
    .filter(categoria => elementosAEliminar.value.includes(categoria.id))
    .map(categoria => ({
      id: categoria.id,
      nombre: categoria.nombre
    }))
})

// Métodos
const cargarCategorias = async (): Promise<void> => {
  
  try {
    showToast(`Cargando categorías`, 'info', { duration: 2000 })
    cargando.value = true
    const token = localStorage.getItem('token')
    const response = await axios.get('http://localhost:4000/admin/categorias', {
      headers: { Authorization: `Bearer ${token}` }
    })
    
    // Verificar la estructura de la respuesta
    console.log('Respuesta completa:', response.data)
    
    // Acceder al array de categorías desde response.data.categorias
    const categoriasArray = response.data.categorias || response.data
    
    // Formatear las fechas para mejor visualización
    categorias.value = categoriasArray.map((categoria: any) => ({
      ...categoria,
      creado_en: new Date(categoria.creado_en).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }))
    
    console.log('Categorías cargadas:', categorias.value)
    
    // Mostrar toast informativo de carga exitosa
    showToast(`Se cargaron ${categorias.value.length} categorías`, 'success', { duration: 2000 })
  } catch (error) {
    console.error('Error al cargar categorías:', error)
    showToast('Error al cargar las categorías. Intenta nuevamente.', 'error')
  } finally {
    cargando.value = false
  }
}

const mostrarModalCrear = (): void => {
  categoriaSeleccionada.value = null
  mostrarModal.value = true
}

const editarCategoria = (categoria: Categoria): void => {
  categoriaSeleccionada.value = categoria
  mostrarModal.value = true
}

const guardarCategoria = async (datosCategoria: { id?: number; nombre: string }): Promise<void> => {
  try {
    cargando.value = true
    const token = localStorage.getItem('token')
    
    if (datosCategoria.id) {
      // Actualizar categoría existente
      await axios.put(`http://localhost:4000/admin/categorias/${datosCategoria.id}`, 
        { nombre: datosCategoria.nombre },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      showToast('Categoría actualizada exitosamente', 'success')
    } else {
      // Crear nueva categoría
      await axios.post('http://localhost:4000/admin/categorias', 
        { nombre: datosCategoria.nombre },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      showToast('Categoría creada exitosamente', 'success')
    }
    
    await cargarCategorias()
    cerrarModal()
  } catch (error: any) {
    console.error('Error al guardar categoría:', error)
    
    // Manejar errores específicos del servidor
    const errorMsg = error?.response?.data?.mensaje || 
                    error?.response?.data?.error || 
                    'Error al guardar la categoría'
    
    if (error?.response?.status === 400) {
      showToast('Datos de categoría inválidos. Revisa la información.', 'warning')
    } else if (error?.response?.status === 409) {
      showToast('Ya existe una categoría con ese nombre', 'warning')
    } else {
      showToast(errorMsg, 'error')
    }
  } finally {
    cargando.value = false
  }
}

const eliminarCategoria = (categoria: Categoria): void => {
  elementosAEliminar.value = [categoria.id]
  mostrarModalEliminar.value = true
}

const eliminarSeleccionados = (seleccionados: number[]): void => {
  if (seleccionados.length === 0) {
    showToast('No hay categorías seleccionadas para eliminar', 'warning')
    return
  }
  elementosAEliminar.value = [...seleccionados]
  mostrarModalEliminar.value = true
}

const confirmarEliminacion = async (): Promise<void> => {
  try {
    cargando.value = true
    const token = localStorage.getItem('token')
    
    // Contar éxitos y fallos
    let exitosos = 0
    let fallidos = 0
    
    // Eliminar cada categoría seleccionada
    for (const id of elementosAEliminar.value) {
      try {
        await axios.delete(`http://localhost:4000/admin/categorias/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        exitosos++
      } catch (error) {
        console.error(`Error al eliminar categoría ${id}:`, error)
        fallidos++
      }
    }
    
    // Actualizar la lista
    await cargarCategorias()
    categoriasSeleccionadas.value = []
    cerrarModalEliminar()
    
    // Mostrar resultado según el resultado de las eliminaciones
    if (fallidos === 0) {
      const mensaje = elementosAEliminar.value.length === 1 
        ? 'Categoría eliminada exitosamente'
        : `${exitosos} categorías eliminadas exitosamente`
      showToast(mensaje, 'success')
    } else if (exitosos === 0) {
      showToast('Error: No se pudo eliminar ninguna categoría', 'error')
    } else {
      showToast(`${exitosos} eliminadas, ${fallidos} con errores`, 'warning')
    }
    
  } catch (error) {
    console.error('Error general al eliminar categorías:', error)
    showToast('Error inesperado al eliminar las categorías', 'error')
  } finally {
    cargando.value = false
  }
}

const cerrarModal = (): void => {
  mostrarModal.value = false
  categoriaSeleccionada.value = null
}

const cerrarModalEliminar = (): void => {
  mostrarModalEliminar.value = false
  elementosAEliminar.value = []
}

const actualizarSeleccion = (seleccionados: number[]): void => {
  categoriasSeleccionadas.value = seleccionados
}

// Cargar datos al montar el componente
onMounted(() => {
  cargarCategorias()
})
</script>

<style scoped>
/* Estilos personalizados si son necesarios */
</style>