<template>
  <div class="fixed inset-0 bg-gray-500 bg-opacity-50 z-50 flex">
    <div class="bg-white min-h-screen w-full sm:w-[600px] md:w-[500px] lg:w-[400px] xl:w-[500px] rounded-lg p-6 overflow-y-auto">
      <!-- Header con flecha -->
      <div class="flex items-center justify-center mt-4">
        <button @click="close" class="text-gray-600 hover:text-gray-800">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-8 h-8">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5l-7 7 7 7" />
          </svg>
        </button>
        <h2 class="text-xl font-semibold text-center">Crear Publicación de Negocio</h2>
      </div>

      <!-- Selector de imágenes -->
      <div class="flex justify-center mt-8">
        <label for="business-images" class="cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-12 h-12 text-gray-600">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 10h14l4 4m0 0l4-4m-4 4V3H3v11h14z" />
          </svg>
          <input
            type="file"
            id="business-images"
            class="hidden"
            @change="handleImageChange"
            accept="image/*"
            multiple
          />
        </label>
      </div>

      <!-- Formulario -->
      <form @submit.prevent="submitForm">
        <!-- Nombre -->
        <div class="mt-4">
          <label class="block text-sm font-medium text-gray-700">Nombre del producto o servicio</label>
          <input
            v-model="form.name"
            type="text"
            class="mt-1 p-2 w-full border rounded-lg"
            placeholder="Escribe el nombre"
            required
          />
        </div>

        <!-- Descripción -->
        <div class="mt-4">
          <label class="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea
            v-model="form.description"
            class="mt-1 p-2 w-full border rounded-lg"
            placeholder="Detalles del producto"
            required
          />
        </div>

        <!-- Precio -->
        <div class="mt-4">
          <label class="block text-sm font-medium text-gray-700">Precio</label>
          <input
            v-model="form.price"
            type="number"
            step="0.01"
            class="mt-1 p-2 w-full border rounded-lg"
            placeholder="ej: 100.45"
            required
          />
        </div>

       
        <!-- Categoría -->
        <div class="mt-4">
          <label for="product-category" class="block text-sm font-medium text-gray-700">Categoría</label>
          <select
            id="product-category"
            v-model="form.category"
            class="mt-1 p-2 w-full border rounded-lg"
            required
            @change="filterSubcategories"
          >
            <option value="">Seleccionar categoría</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>

        <!-- Subcategoría -->
        <div class="mt-4">
          <label for="product-subcategory" class="block text-sm font-medium text-gray-700">Subcategoría</label>
          <select
            id="product-subcategory"
            v-model="form.subcategory"
            class="mt-1 p-2 w-full border rounded-lg"
            required
          >
            <option value="">Seleccionar subcategoría</option>
            <option v-for="subcategory in filteredSubcategories" :key="subcategory.id" :value="subcategory.id">
              {{ subcategory.name }}
            </option>
          </select>
        </div>

        <!-- Oferta y Descuento -->
        <div class="mt-4 flex items-center space-x-4">
          <label class="flex items-center">
            <input type="checkbox" v-model="form.oferta" class="mr-2" />
            Oferta
          </label>
          <label class="flex items-center">
            <input type="checkbox" v-model="form.descuento" class="mr-2" />
            Descuento
          </label>
        </div>

        <!-- Contacto correo -->
        <div class="mt-4">
          <label class="block text-sm font-medium text-gray-700">Correo Electrónico</label>
          <input
            v-model="form.email"
            type="email"
            class="mt-1 p-2 w-full border rounded-lg"
            placeholder="ej: usuario@gmail.com"
            required
          />
        </div>

        <!-- Contacto teléfono -->
        <div class="mt-4">
          <label class="block text-sm font-medium text-gray-700">Teléfono</label>
          <input
            v-model="form.phone"
            type="text"
            class="mt-1 p-2 w-full border rounded-lg"
            placeholder="ej: +34 600 123 456"
            required
          />
        </div>

        <!-- Botón -->
        <button
          type="submit"
          class="mt-8 mb-4 bg-[#204347] text-white py-2 px-4 rounded-md w-full flex items-center justify-center space-x-2"
        >
          <span>Publicar</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useNuxtApp } from '#app'
import { useRouter } from 'vue-router'

const { $axios } = useNuxtApp()
const router = useRouter()

// Form state
const form = ref({
  name: '',
  description: '',
  price: '',
  category: null,
  subcategory: '',
  oferta: false,
  descuento: false,
  email: '',
  phone: '',
  images: []   // File[]
})

const categories = ref([])  // Lista de categorías
const subcategories = ref([])  // Lista de subcategorías
const filteredSubcategories = ref([])  // Subcategorías filtradas

// Función para obtener el token de autenticación
const getAuthToken = () => {
  // Opción 1: Usar localStorage directamente
  if (process.client) {
    return localStorage.getItem('auth.token') || 
           localStorage.getItem('auth._token.local') ||
           localStorage.getItem('token') ||
           ''
  }
  
  // Opción 2: Usar cookies si están disponibles
  const cookie = useCookie('auth-token')
  return cookie.value || ''
}

// Función alternativa usando useNuxtApp con manejo de errores
const getAuthTokenSafe = () => {
  try {
    const { $auth } = useNuxtApp()
    if ($auth && typeof $auth.getToken === 'function') {
      return $auth.getToken('local') || ''
    }
  } catch (error) {
    console.warn('Auth plugin not available:', error)
  }
  
  // Fallback a localStorage
  return getAuthToken()
}

// Función para obtener las categorías
const fetchCategories = async () => {
  try {
    const res = await $axios.get('/public/categorias')
    categories.value = res.data.categorias.map(cat => ({
      id: cat.id,
      name: cat.nombre,
    }))
  } catch (err) {
    console.error('Error al obtener categorías:', err)
  }
}

// Función para obtener las subcategorías
const fetchSubcategories = async () => {
  try {
    const res = await $axios.get('/public/subcategorias')
    subcategories.value = res.data.subcategorias.map(sub => ({
      id: sub.id,
      name: sub.nombre,
      categoriaId: sub.categoria_id,
    }))
  } catch (err) {
    console.error('Error al obtener subcategorías:', err)
  }
}

// Filtrar subcategorías según la categoría seleccionada
const filterSubcategories = () => {
  filteredSubcategories.value = subcategories.value.filter(sub => sub.categoriaId === form.value.category)
}

// Llamar a las funciones cuando el componente se monte
onMounted(() => {
  fetchCategories()
  fetchSubcategories()
})

// Handle image file selection
function handleImageChange(e) {
  const files = Array.from(e.target.files)
  form.value.images = files.slice(0, 5) // hasta 5
}

// Submit
async function submitForm() {
  // Basic validation
  if (!form.value.name || !form.value.price || !form.value.category
      || !form.value.subcategory || !form.value.email || !form.value.phone) {
    alert('Completa todos los campos obligatorios')
    return
  }

  // Buscar el nombre de la subcategoría seleccionada
  const subcategoriaSeleccionada = filteredSubcategories.value.find(sub => sub.id === form.value.subcategory)
  const subcategoriaNombre = subcategoriaSeleccionada ? subcategoriaSeleccionada.name : ''

  if (!subcategoriaNombre) {
    alert('Error: No se pudo encontrar la subcategoría seleccionada')
    return
  }

  const fd = new FormData()
  fd.append('titulo', form.value.name)
  fd.append('descripcion', form.value.description)
  fd.append('precio', form.value.price)
  fd.append('categoria_ids[]', form.value.category)
  fd.append('subcategorias[]', subcategoriaNombre) // Enviar el nombre en lugar del ID
  fd.append('esoferta', form.value.oferta)
  fd.append('esta_en_descuento', form.value.descuento)
  fd.append('contacto_correo', form.value.email)
  fd.append('contacto_telefono', form.value.phone)
  form.value.images.forEach(file => fd.append('multimedia', file))

  try {
    // Obtener el token de forma segura
    const token = getAuthTokenSafe()
    
    const headers = {
      'Content-Type': 'multipart/form-data'
    }
    
    // Solo agregar Authorization si tenemos token
    if (token) {
      headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`
    }
    
    await $axios.post('/vendedor/publicaciones', fd, { headers })
    alert('Publicación creada con éxito')
    router.back()
  } catch (err) {
    console.error('Error al crear la publicación:', err)
    
    // Manejar diferentes tipos de errores
    if (err.response?.status === 401) {
      alert('Error de autenticación. Por favor, inicia sesión nuevamente.')
      // Redirigir al login si es necesario
      // router.push('/login')
    } else if (err.response?.status === 422) {
      alert('Error en los datos enviados. Verifica todos los campos.')
    } else {
      alert('Error al crear la publicación. Intenta nuevamente.')
    }
  }
}

// Close modal
function close() {
  router.back()
}
</script>

<style scoped>
input[type="file"] { 
    display: none; 
}
button[type="submit"]:hover { 
    background-color: #16675c; 
}
.fixed {
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
 }
.bg-gray-500 { 
    background-color: rgba(0,0,0,0.5);
 }
.bg-white {
  max-width: 100%;
  margin-left: 0;
  margin-right: 0;
}
</style>