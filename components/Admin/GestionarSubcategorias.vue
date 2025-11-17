<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    
    <!-- Usar el componente tabla reutilizable -->
    <Tabla
      titulo="Gestionar Subcategorías"
      :items="subcategories"
      :columnas="columnas"
      :items-por-pagina="10"
      :mostrar-editar="true"
      :mostrar-eliminar="true"
      :mostrar-boton-agregar="true"
      @agregar="openCreateModal"
      @editar="openEditModal"
      @eliminar="deleteOne"
      @eliminar-seleccionados="deleteBatch"
      @seleccion-cambiada="onSelectionChanged"
    >
      <!-- Slot personalizado para mostrar la categoría -->
      <template #categoria_nombre="{ value }">
        <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
          {{ value }}
        </span>
      </template>
    </Tabla>

    <!-- Modal Crear Subcategoría -->
    <ModalCrearSubcategoria 
      v-if="showCreate"
      :categorias="categorias"
      @close="showCreate = false"
      @crear="createSub"
    />

    <!-- Modal Editar Subcategoría -->
    <ModalEditarSubcategoria
      v-if="showEdit"
      :subcategoria="subcategoriaToEdit"
      :categorias="categorias"
      @close="showEdit = false"
      @actualizar="updateSub"
    />

    <!-- Modal Eliminar -->
    <ModalEliminar
      v-if="showDeleteModal"
      :elementos="elementosAEliminar"
      :cargando="cargando"
      tipo="subcategoría"
      @close="showDeleteModal = false"
      @confirmar="confirmarEliminacion"
    />

    <!-- Componente Toast Container -->
    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useNuxtApp } from '#app'
import { useToast } from '@/plugins/composables/useToast'
import Tabla from '@/components/Tabla/Tabla.vue'
import ModalCrearSubcategoria from '@/components/modal/ModalCrearSubcategoria.vue'
import ModalEditarSubcategoria from '@/components/modal/ModalEditarSubcategoria.vue'
import ModalEliminar from '@/components/modal/ModalEliminar.vue'
import ToastContainer from '@/components/Toast/ToastContainer.vue'

interface Subcategoria { 
  id: number
  nombre: string
  categoria_id: number
  categoria_nombre: string 
}

interface Categoria { 
  id: number
  nombre: string 
}

const { $axios } = useNuxtApp()
const toast = useToast()

// Datos
const subcategories = ref<Subcategoria[]>([])
const categorias = ref<Categoria[]>([])
const showCreate = ref(false)
const showEdit = ref(false)
const showDeleteModal = ref(false)
const subcategoriaToEdit = ref<Subcategoria | null>(null)
const elementosAEliminar = ref<number[]>([])
const cargando = ref(false)

// Configuración de columnas para la tabla
const columnas = [
  { key: 'nombre', label: 'Subcategoría', class: 'w-1/3' },
  { key: 'categoria_nombre', label: 'Categoría', class: 'w-1/3' }
]

// Función para obtener headers con token
const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    headers: { Authorization: `Bearer ${token}` }
  }
}

// Métodos CRUD
async function fetchList() {
  try {
    cargando.value = true
    const { data } = await $axios.get('http://localhost:4000/admin/subcategorias', getAuthHeaders())
    
    const subcategoriasArray = data.subcategorias || data
    
    if (!Array.isArray(subcategoriasArray)) {
      throw new Error('La respuesta no contiene un array válido de subcategorías')
    }
    
    subcategories.value = subcategoriasArray.map(subcategoria => {
      const categoria = categorias.value.find(cat => cat.id === subcategoria.categoria_id)
      
      return {
        ...subcategoria,
        categoria_nombre: categoria ? categoria.nombre : 'Sin categoría',
        ...(subcategoria.creado_en && {
          creado_en: new Date(subcategoria.creado_en).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })
        })
      }
    })
    
  } catch (error) {
    console.error('Error al cargar subcategorías:', error)
    toast.error('Error al cargar las subcategorías')
    subcategories.value = []
  } finally {
    cargando.value = false
  }
}

async function fetchCategorias() {
  try {
    cargando.value = true
    const { data } = await $axios.get('http://localhost:4000/admin/categorias', getAuthHeaders())
    
    const categoriasArray = data.categorias || data
    
    categorias.value = categoriasArray.map(categoria => ({
      ...categoria,
      ...(categoria.creado_en && {
        creado_en: new Date(categoria.creado_en).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      })
    }))
    
  } catch (error) {
    console.error('Error al cargar categorías:', error)
    toast.error('Error al cargar las categorías')
  } finally {
    cargando.value = false
  }
}

function openCreateModal() {
  showCreate.value = true
}

async function createSub(formData: { nombre: string; categoria_id: number }) {
  try {
    cargando.value = true
    await $axios.post('http://localhost:4000/admin/subcategorias', formData, getAuthHeaders())
    showCreate.value = false
    await fetchList()
    toast.success('Subcategoría creada exitosamente')
  } catch (error) {
    console.error('Error al crear subcategoría:', error)
    toast.error('Error al crear la subcategoría')
  } finally {
    cargando.value = false
  }
}

function openEditModal(subcategoria: Subcategoria) {
  subcategoriaToEdit.value = subcategoria
  showEdit.value = true
}

async function updateSub(formData: { id: number; nombre: string; categoria_id: number }) {
  try {
    cargando.value = true
    await $axios.put(`http://localhost:4000/admin/subcategorias/${formData.id}`, {
      nombre: formData.nombre,
      categoria_id: formData.categoria_id
    }, getAuthHeaders())
    showEdit.value = false
    await fetchList()
    toast.success('Subcategoría actualizada exitosamente')
  } catch (error) {
    console.error('Error al actualizar subcategoría:', error)
    toast.error('Error al actualizar la subcategoría')
  } finally {
    cargando.value = false
  }
}

function deleteOne(subcategoria: Subcategoria) {
  elementosAEliminar.value = [subcategoria.id]
  showDeleteModal.value = true
}

function deleteBatch(selectedIds: number[]) {
  elementosAEliminar.value = selectedIds
  showDeleteModal.value = true
}

async function confirmarEliminacion() {
  if (elementosAEliminar.value.length === 0) return
  
  cargando.value = true
  try {
    if (elementosAEliminar.value.length === 1) {
      await $axios.delete(`http://localhost:4000/admin/subcategorias/${elementosAEliminar.value[0]}`, getAuthHeaders())
    } else {
      await $axios.post('http://localhost:4000/admin/subcategorias/bulk-delete', { 
        ids: elementosAEliminar.value 
      }, getAuthHeaders())
    }
    showDeleteModal.value = false
    await fetchList()
    
    const mensaje = elementosAEliminar.value.length === 1 
      ? 'Subcategoría eliminada exitosamente'
      : `${elementosAEliminar.value.length} subcategorías eliminadas exitosamente`
    
    toast.success(mensaje)
  } catch (error) {
    console.error('Error al eliminar subcategorías:', error)
    toast.error('Error al eliminar las subcategorías')
  } finally {
    cargando.value = false
  }
}

function onSelectionChanged(selectedIds: number[]) {
  console.log('Selección cambiada:', selectedIds)
}

// Cargar datos iniciales
onMounted(async () => {
  toast.info('Cargando datos de subcategorías...', { duration: 2000 })
  
  await fetchCategorias()
  await fetchList()
  
  if (subcategories.value.length > 0) {
    toast.success(`Se cargaron ${subcategories.value.length} subcategorías correctamente`)
  } else {
    toast.warning('No se encontraron subcategorías')
  }
})
</script>