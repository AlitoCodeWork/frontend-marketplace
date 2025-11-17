<template>
  <div class="fixed inset-0 bg-gray-500 bg-opacity-50 z-50 flex">
    <div class="bg-white min-h-screen w-full sm:w-[600px] md:w-[500px] lg:w-[400px] xl:w-[500px] rounded-lg p-6 overflow-y-auto">
      <!-- Header con flecha -->
      <div class="flex items-center justify-between mt-4">
        <button @click="close" class="text-gray-600 hover:text-gray-800">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-8 h-8">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5l-7 7 7 7" />
          </svg>
        </button>
        <h2 class="text-xl font-semibold">Editar Publicación</h2>
        <div class="w-8"></div> <!-- Spacer for centering -->
      </div>

      <!-- Loading state -->
      <div v-if="isLoading" class="flex justify-center items-center mt-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#204347]"></div>
        <span class="ml-3 text-gray-600">Cargando datos...</span>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="mt-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        {{ error }}
        <button 
          @click="retry" 
          class="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>

      <!-- Form content -->
      <div v-else>
        <!-- Selector de imágenes -->
        <div class="flex justify-center mt-8">
          <label for="product-image" class="cursor-pointer">
            <div class="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#204347] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-12 h-12 text-gray-400">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span class="text-sm text-gray-600 mt-2">Cambiar imágenes</span>
              <span class="text-xs text-gray-500">Máximo 5 imágenes</span>
            </div>
            <input
              type="file"
              id="product-image"
              class="hidden"
              @change="handleImageChange"
              accept="image/*"
              multiple
            />
          </label>
        </div>

        <!-- Preview de imágenes -->
        <div v-if="previewUrls.length > 0" class="mt-4">
          <h3 class="text-sm font-medium text-gray-700 mb-2">Imágenes seleccionadas:</h3>
          <div class="grid grid-cols-2 gap-2">
            <div v-for="(url, index) in previewUrls" :key="index" class="relative">
              <img :src="url" :alt="`Preview ${index + 1}`" class="w-full h-24 object-cover rounded-lg">
              <button 
                @click="removeImage(index)"
                class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
              >
                ×
              </button>
            </div>
          </div>
        </div>

        <!-- Formulario -->
        <form @submit.prevent="submitForm" class="mt-6">
          <!-- Nombre -->
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700">Nombre *</label>
            <input
              v-model="form.titulo"
              type="text"
              class="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#204347] focus:border-transparent"
              required
              placeholder="Nombre del producto"
            />
          </div>

          <!-- Descripción -->
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700">Descripción *</label>
            <textarea
              v-model="form.descripcion"
              class="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#204347] focus:border-transparent"
              rows="3"
              required
              placeholder="Describe tu producto..."
            />
          </div>

          <!-- Precio -->
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700">Precio *</label>
            <input
              v-model="form.precio"
              type="number"
              step="0.01"
              min="0"
              class="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#204347] focus:border-transparent"
              required
              placeholder="0.00"
            />
          </div>

          <!-- Categorías (selección múltiple) -->
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Categorías *</label>
            <div class="border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto">
              <div v-for="category in categories" :key="category.id" class="mb-2">
                <label class="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    :value="category.id"
                    v-model="form.categoria_ids"
                    @change="filterSubcategories"
                    class="mr-2 rounded text-[#204347] focus:ring-[#204347]"
                  />
                  <span class="text-sm text-gray-700">{{ category.name }}</span>
                </label>
              </div>
            </div>
            <div v-if="form.categoria_ids.length > 0" class="mt-2">
              <p class="text-xs text-gray-500">
                Seleccionadas: {{ getSelectedCategoriesNames() }}
              </p>
            </div>
          </div>

          <!-- Subcategorías (selección múltiple) -->
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Subcategorías *</label>
            <div 
              v-if="filteredSubcategories.length > 0"
              class="border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto"
            >
              <div v-for="subcategory in filteredSubcategories" :key="subcategory.id" class="mb-2">
                <label class="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    :value="subcategory.name"
                    v-model="form.subcategorias"
                    class="mr-2 rounded text-[#204347] focus:ring-[#204347]"
                  />
                  <span class="text-sm text-gray-700">{{ subcategory.name }}</span>
                </label>
              </div>
            </div>
            <div v-else class="border border-gray-300 rounded-lg p-3 bg-gray-50">
              <p class="text-sm text-gray-500 text-center">
                {{ form.categoria_ids.length === 0 ? 'Seleccione al menos una categoría primero' : 'No hay subcategorías disponibles' }}
              </p>
            </div>
            <div v-if="form.subcategorias.length > 0" class="mt-2">
              <p class="text-xs text-gray-500">
                Seleccionadas: {{ form.subcategorias.join(', ') }}
              </p>
            </div>
          </div>

          <!-- Oferta & Descuento -->
          <div class="mt-4 flex items-center space-x-4">
            <label class="flex items-center cursor-pointer">
              <input type="checkbox" v-model="form.esoferta" class="mr-2 rounded text-[#204347] focus:ring-[#204347]" />
              <span class="text-sm text-gray-700">Oferta</span>
            </label>
            <label class="flex items-center cursor-pointer">
              <input type="checkbox" v-model="form.esta_en_descuento" class="mr-2 rounded text-[#204347] focus:ring-[#204347]" />
              <span class="text-sm text-gray-700">Descuento</span>
            </label>
          </div>

          <!-- Contacto correo -->
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700">Correo Electrónico *</label>
            <input
              v-model="form.contacto_correo"
              type="email"
              class="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#204347] focus:border-transparent"
              required
              placeholder="tu@email.com"
            />
          </div>

          <!-- Contacto teléfono -->
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700">Teléfono *</label>
            <input
              v-model="form.contacto_telefono"
              type="text"
              class="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#204347] focus:border-transparent"
              required
              placeholder="Número de teléfono"
            />
          </div>

          <!-- Botones -->
          <div class="mt-8 flex space-x-4">
            <button
              type="button"
              @click="close"
              class="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="flex-1 bg-[#204347] text-white py-3 px-4 rounded-lg hover:bg-[#2a5357] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {{ isSubmitting ? 'Guardando...' : 'Guardar cambios' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useNuxtApp } from '#app'

// Props para recibir el ID externamente
const props = defineProps({
  publicacionId: {
    type: [String, Number],
    required: true
  }
})

// Emits para comunicar con el componente padre
const emit = defineEmits(['close', 'updated'])

const router = useRouter()
const { $axios } = useNuxtApp()

// Estados de carga y error
const isLoading = ref(true)
const error = ref(null)
const isSubmitting = ref(false)

// Form state con arrays para categorías y subcategorías
const form = ref({
  titulo: '',
  descripcion: '',
  precio: '',
  categoria_ids: [], // Array de IDs de categorías
  subcategorias: [], // Array de nombres de subcategorías
  esoferta: false,
  esta_en_descuento: false,
  contacto_correo: '',
  contacto_telefono: ''
})

// Imágenes y preview
const files = ref([])
const previewUrls = ref([])
const originalImages = ref([])

// Categorías y subcategorías
const categories = ref([])
const allSubcats = ref([])
const filteredSubcategories = ref([])

// Función para obtener el token
const getToken = () => {
  if (process.client) {
    return localStorage.getItem('token')
  }
  return null
}

// Función para validar el token
const validateToken = () => {
  const token = getToken()
  if (!token) {
    error.value = 'Debe iniciar sesión para editar publicaciones'
    setTimeout(() => {
      router.push('/login')
    }, 2000)
    return false
  }
  return token
}

// Función para obtener nombres de categorías seleccionadas
const getSelectedCategoriesNames = () => {
  return categories.value
    .filter(cat => form.value.categoria_ids.includes(cat.id))
    .map(cat => cat.name)
    .join(', ')
}

// Función para cargar datos iniciales
const loadInitialData = async () => {
  try {
    console.log('Cargando categorías y subcategorías...')
    
    const [catsRes, subsRes] = await Promise.all([
      $axios.get('/public/categorias'),
      $axios.get('/public/subcategorias')
    ])
    
    console.log('Respuesta categorías:', catsRes.data)
    console.log('Respuesta subcategorías:', subsRes.data)
    
    // Mapear categorías correctamente
    categories.value = catsRes.data.categorias.map(c => {
      if (typeof c === 'object' && c !== null) {
        return { 
          id: c.id, 
          name: c.nombre || c.name || 'Sin nombre'
        }
      }
      return { 
        id: c, 
        name: c 
      }
    })
    
    // Mapear subcategorías correctamente
    allSubcats.value = subsRes.data.subcategorias.map(s => {
      if (typeof s === 'object' && s !== null) {
        return {
          id: s.id,
          name: s.nombre || s.name || 'Sin nombre',
          categoriaId: s.categoria_id
        }
      }
      return {
        id: s,
        name: s,
        categoriaId: null
      }
    })
    
    console.log('Categorías procesadas:', categories.value)
    console.log('Subcategorías procesadas:', allSubcats.value)
    
  } catch (err) {
    console.error('Error cargando categorías:', err)
    throw new Error('Error al cargar categorías y subcategorías')
  }
}

// Función para cargar datos de la publicación
const loadPublicacionData = async (id, token) => {
  try {
    console.log('Cargando publicación ID:', id)
    
    const { data } = await $axios.get(`/vendedor/publicaciones/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    
    const pub = data.publicacion
    console.log('Publicación cargada:', pub)
    
    // Asegurar que categoria_ids y subcategorias sean arrays
    const categoriaIds = Array.isArray(pub.categoria_ids) ? pub.categoria_ids : 
                        pub.categoria_ids ? [pub.categoria_ids] : []
    
    const subcategorias = Array.isArray(pub.subcategorias) ? pub.subcategorias : 
                         pub.subcategorias ? [pub.subcategorias] : []
    
    form.value = {
      titulo: pub.titulo || '',
      descripcion: pub.descripcion || '',
      precio: pub.precio || '',
      categoria_ids: categoriaIds,
      subcategorias: subcategorias,
      esoferta: pub.esoferta || false,
      esta_en_descuento: pub.esta_en_descuento || false,
      contacto_correo: pub.contacto_correo || '',
      contacto_telefono: pub.contacto_telefono || ''
    }
    
    // Mantener las imágenes originales
    originalImages.value = pub.multimedia || []
    previewUrls.value = [...originalImages.value]
    
    // Filtrar subcategorías después de cargar los datos
    filterSubcategories()
    
  } catch (err) {
    console.error('Error cargando publicación:', err)
    throw new Error(err.response?.data?.mensaje || 'Error al cargar los datos de la publicación')
  }
}

// Función para reintentar la carga
const retry = async () => {
  isLoading.value = true
  error.value = null
  await loadData()
}

// Función principal de carga
const loadData = async () => {
  try {
    console.log('Iniciando carga de datos...')
    
    // 1. Validar ID
    const id = props.publicacionId
    if (!id) {
      throw new Error('ID de publicación no encontrado')
    }
    
    // 2. Validar token
    const token = validateToken()
    if (!token) {
      return
    }
    
    // 3. Cargar datos iniciales
    await loadInitialData()
    
    // 4. Cargar datos de la publicación
    await loadPublicacionData(id, token)
    
  } catch (err) {
    console.error('Error en loadData:', err)
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadData()
})

// Filtrar subcategorías basadas en categorías seleccionadas
function filterSubcategories() {
  if (form.value.categoria_ids.length === 0) {
    filteredSubcategories.value = []
    form.value.subcategorias = []
    return
  }
  
  // Filtrar subcategorías que pertenecen a las categorías seleccionadas
  filteredSubcategories.value = allSubcats.value.filter(
    s => form.value.categoria_ids.includes(s.categoriaId)
  )
  
  // Limpiar subcategorías que ya no están disponibles
  form.value.subcategorias = form.value.subcategorias.filter(
    subcat => filteredSubcategories.value.find(s => s.name === subcat)
  )
}

// Manejo de archivos
function handleImageChange(e) {
  const selectedFiles = Array.from(e.target.files)
  
  if (selectedFiles.length > 5) {
    alert('Máximo 5 imágenes permitidas')
    return
  }
  
  files.value = selectedFiles
  previewUrls.value = selectedFiles.map(f => URL.createObjectURL(f))
}

// Remover imagen del preview
function removeImage(index) {
  if (files.value.length > 0) {
    URL.revokeObjectURL(previewUrls.value[index])
    files.value.splice(index, 1)
    previewUrls.value = files.value.map(f => URL.createObjectURL(f))
  } else {
    previewUrls.value.splice(index, 1)
  }
}

// Enviar formulario
async function submitForm() {
  if (isSubmitting.value) return
  
  const token = getToken()
  if (!token) {
    error.value = 'Token de autenticación no válido'
    return
  }
  
  // Validar campos requeridos
  if (!form.value.titulo || !form.value.descripcion || !form.value.precio || 
      form.value.categoria_ids.length === 0 || form.value.subcategorias.length === 0 || 
      !form.value.contacto_correo || !form.value.contacto_telefono) {
    alert('Por favor complete todos los campos obligatorios')
    return
  }
  
  isSubmitting.value = true
  
  try {
    const fd = new FormData()
    
    // Campos del formulario
    fd.append('titulo', form.value.titulo)
    fd.append('descripcion', form.value.descripcion)
    fd.append('precio', form.value.precio)
    
    // Enviar arrays como JSON strings o múltiples valores
    form.value.categoria_ids.forEach(id => {
      fd.append('categoria_ids[]', id)
    })
    
    form.value.subcategorias.forEach(subcat => {
      fd.append('subcategorias[]', subcat)
    })
    
    fd.append('esoferta', form.value.esoferta)
    fd.append('esta_en_descuento', form.value.esta_en_descuento)
    fd.append('contacto_correo', form.value.contacto_correo)
    fd.append('contacto_telefono', form.value.contacto_telefono)
    
    // Agregar archivos si hay archivos nuevos
    if (files.value.length > 0) {
      files.value.forEach(f => fd.append('multimedia', f))
    }

    console.log('Enviando actualización para publicación ID:', props.publicacionId)
    console.log('Categorías seleccionadas:', form.value.categoria_ids)
    console.log('Subcategorías seleccionadas:', form.value.subcategorias)
    
    await $axios.put(`/vendedor/publicaciones/${props.publicacionId}`, fd, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    })
    
    console.log('Publicación actualizada con éxito')
    
    // Notificar al componente padre
    emit('updated')
    emit('close')
    
  } catch (err) {
    console.error('Error actualizando publicación:', err)
    const errorMsg = err.response?.data?.mensaje || 'No se pudo actualizar la publicación'
    alert(errorMsg)
  } finally {
    isSubmitting.value = false
  }
}

function close() {
  emit('close')
}

// Limpiar URLs de objetos al desmontar
onBeforeUnmount(() => {
  previewUrls.value.forEach(url => {
    if (url.startsWith('blob:')) {
      URL.revokeObjectURL(url)
    }
  })
})
</script>

<style scoped>
@keyframes spin {
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

.fixed {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.bg-gray-500 {
  background-color: rgba(107, 114, 128, 0.5);
}

/* Mejorar la apariencia de los inputs */
input:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: #204347;
  box-shadow: 0 0 0 3px rgba(32, 67, 71, 0.1);
}

/* Hover effects */
button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Disabled state */
button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .bg-white {
    width: 100%;
    margin: 0;
    border-radius: 0;
  }
}

/* Estilos para las listas de checkboxes */
.max-h-48 {
  max-height: 12rem;
}

.overflow-y-auto {
  overflow-y: auto;
}

/* Estilo para scroll personalizado */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
</style>