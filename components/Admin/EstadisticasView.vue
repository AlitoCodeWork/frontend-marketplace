<template>
  <div>
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- Stats Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <!-- Total de negocios registrados -->
      <div class="bg-white rounded-lg shadow-sm border p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-3 h-3 bg-red-500 rounded-full"></div>
          </div>
          <div class="ml-4 flex-1">
            <p class="text-sm font-medium text-gray-600">Total de negocios registrados</p>
            <p class="text-3xl font-bold text-gray-900">{{ stats.totalNegocios }}</p>
            <button @click="$emit('navigate', 'perfiles')" class="text-xs text-blue-600 hover:text-blue-800 mt-1">
              Ver perfiles
            </button>
          </div>
        </div>
      </div>

      <!-- Total de perfiles visitados -->
      <div class="bg-white rounded-lg shadow-sm border p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
          </div>
          <div class="ml-4 flex-1">
            <p class="text-sm font-medium text-gray-600">Total de perfiles visitados</p>
            <p class="text-3xl font-bold text-gray-900">{{ stats.totalPerfilesVisitados }}</p>
            <button @click="$emit('navigate', 'perfiles')" class="text-xs text-blue-600 hover:text-blue-800 mt-1">
              Ver perfiles
            </button>
          </div>
        </div>
      </div>

      <!-- Total de categorías -->
      <div class="bg-white rounded-lg shadow-sm border p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-3 h-3 bg-purple-500 rounded-full"></div>
          </div>
          <div class="ml-4 flex-1">
            <p class="text-sm font-medium text-gray-600">Total de categorías</p>
            <p class="text-3xl font-bold text-gray-900">{{ stats.totalCategorias }}</p>
            <button @click="$emit('navigate', 'categorias')" class="text-xs text-blue-600 hover:text-blue-800 mt-1">
              Ver categorías
            </button>
          </div>
        </div>
      </div>

      <!-- Total de subcategorías -->
      <div class="bg-white rounded-lg shadow-sm border p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
          </div>
          <div class="ml-4 flex-1">
            <p class="text-sm font-medium text-gray-600">Total de subcategorías</p>
            <p class="text-3xl font-bold text-gray-900">{{ stats.totalSubcategorias }}</p>
            <button @click="$emit('navigate', 'subcategorias')" class="text-xs text-blue-600 hover:text-blue-800 mt-1">
              Ver subcategorías
            </button>
          </div>
        </div>
      </div>

      <!-- Total de publicaciones visitadas de perfiles registrados -->
      <div class="bg-white rounded-lg shadow-sm border p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-3 h-3 bg-amber-600 rounded-full"></div>
          </div>
          <div class="ml-4 flex-1">
            <p class="text-sm font-medium text-gray-600">Total de publicaciones visitadas de perfiles registrados</p>
            <p class="text-3xl font-bold text-gray-900">{{ stats.totalPublicacionesRegistrados }}</p>
            <button @click="$emit('navigate', 'perfiles')" class="text-xs text-blue-600 hover:text-blue-800 mt-1">
              Ver perfiles
            </button>
          </div>
        </div>
      </div>

      <!-- Total de publicaciones visitadas de perfiles no registrados -->
      <div class="bg-white rounded-lg shadow-sm border p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div class="ml-4 flex-1">
            <p class="text-sm font-medium text-gray-600">Total de publicaciones visitadas de perfiles no registrados</p>
            <p class="text-3xl font-bold text-gray-900">{{ stats.totalPublicacionesNoRegistrados }}</p>
            
          </div>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Error al cargar los datos</h3>
          <p class="text-sm text-red-700 mt-1">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Refresh Button -->
    <div class="flex justify-end mb-6">
      <button @click="refreshData" 
              :disabled="loading"
              class="bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center transition-colors duration-200">
        <svg class="w-4 h-4 mr-2" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
        </svg>
        {{ loading ? 'Actualizando...' : 'Actualizar' }}
      </button>
    </div>

    <!-- Map Section -->
    <div class="bg-white rounded-lg shadow-sm border">
      <div class="p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Mapa de Negocios</h3>
        <div class="relative h-96 bg-gray-200 rounded-lg overflow-hidden">
          <!-- Simulated Map -->
          <div class="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100">
            <!-- Streets -->
            <div class="absolute top-1/4 left-0 w-full h-4 bg-gray-300 opacity-60"></div>
            <div class="absolute top-1/2 left-0 w-full h-6 bg-gray-400 opacity-70"></div>
            <div class="absolute top-3/4 left-0 w-full h-4 bg-gray-300 opacity-60"></div>
            <div class="absolute left-1/4 top-0 w-4 h-full bg-gray-300 opacity-60"></div>
            <div class="absolute left-1/2 top-0 w-6 h-full bg-gray-400 opacity-70"></div>
            <div class="absolute left-3/4 top-0 w-4 h-full bg-gray-300 opacity-60"></div>
            
            <!-- Buildings -->
            <div class="absolute top-1/3 left-1/3 w-16 h-12 bg-gray-400 opacity-80 rounded-sm"></div>
            <div class="absolute top-1/2 left-1/5 w-20 h-16 bg-gray-500 opacity-80 rounded-sm"></div>
            <div class="absolute top-1/4 right-1/4 w-24 h-20 bg-gray-400 opacity-80 rounded-sm"></div>
            
            <!-- Trees -->
            <div class="absolute top-1/6 left-1/6 w-3 h-3 bg-green-400 rounded-full"></div>
            <div class="absolute top-1/3 left-1/2 w-3 h-3 bg-green-400 rounded-full"></div>
            <div class="absolute top-2/3 right-1/3 w-3 h-3 bg-green-400 rounded-full"></div>
            <div class="absolute bottom-1/4 left-1/4 w-3 h-3 bg-green-400 rounded-full"></div>
            
            <!-- Business Markers -->
            <div class="absolute top-1/4 left-1/6 flex items-center">
              <div class="bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-medium shadow-lg">
                <div class="flex items-center">
                  <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
                  </svg>
                  Restaurante
                </div>
              </div>
            </div>
            
            <!-- Location Marker -->
            <div class="absolute bottom-1/3 left-1/3 flex items-center">
              <div class="bg-orange-500 text-white px-3 py-1 rounded-lg text-sm font-medium shadow-lg">
                <div class="flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
                  </svg>
                  Los Nardos
                </div>
              </div>
            </div>
            
            <!-- Additional business markers -->
            <div class="absolute top-1/3 right-1/3 flex items-center">
              <div class="bg-purple-500 text-white px-2 py-1 rounded-lg text-xs font-medium shadow-lg">
                <div class="flex items-center">
                  <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
                  </svg>
                  Tienda
                </div>
              </div>
            </div>
            
            <!-- National Capitol Label -->
            <div class="absolute top-1/4 right-1/6 text-gray-600 text-sm font-medium">
              National Capitol
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// Emits
const emit = defineEmits(['navigate'])

// Reactive data
const stats = ref({
  totalNegocios: 0,
  totalPerfilesVisitados: 0,
  totalCategorias: 0,
  totalSubcategorias: 0,
  totalPublicacionesRegistrados: 0,
  totalPublicacionesNoRegistrados: 0
})

const loading = ref(false)
const error = ref('')

// Base URL del backend
const baseUrl = 'http://localhost:4000'

// API endpoints
const endpoints = {
  perfilesTotal: '/admin/stats/perfilesTotal',
  visitasPerfiles: '/admin/stats/visitas-perfiles',
  categoriasTotal: '/admin/stats/categoriasTotal',
  subcategoriasTotal: '/admin/stats/subcategoriasTotal',
  visitasPublicReg: '/admin/stats/visitas-public-reg',
  visitasPublicAnon: '/admin/stats/visitas-public-anon'
}

// Obtener token de autenticación
const getAuthToken = () => {
  // Intenta obtener el token del localStorage, sessionStorage o cookies
  return localStorage.getItem('authToken') || 
         localStorage.getItem('token') || 
         sessionStorage.getItem('authToken') || 
         sessionStorage.getItem('token')
}

// Configurar headers con token
const getAuthHeaders = () => {
  const token = getAuthToken()
  return token ? {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  } : {
    'Content-Type': 'application/json'
  }
}

// Fetch data from API
const fetchData = async () => {
  loading.value = true
  error.value = ''

  try {
    const headers = getAuthHeaders()
    
    // Verificar si hay token
    if (!getAuthToken()) {
      throw new Error('Token de autenticación no encontrado')
    }

    // Hacer todas las peticiones en paralelo
    const [
      perfilesResponse,
      visitasPerfilesResponse,
      categoriasResponse,
      subcategoriasResponse,
      visitasRegResponse,
      visitasAnonResponse
    ] = await Promise.all([
      axios.get(`${baseUrl}${endpoints.perfilesTotal}`, { headers }),
      axios.get(`${baseUrl}${endpoints.visitasPerfiles}`, { headers }),
      axios.get(`${baseUrl}${endpoints.categoriasTotal}`, { headers }),
      axios.get(`${baseUrl}${endpoints.subcategoriasTotal}`, { headers }),
      axios.get(`${baseUrl}${endpoints.visitasPublicReg}`, { headers }),
      axios.get(`${baseUrl}${endpoints.visitasPublicAnon}`, { headers })
    ])

    // Procesar los resultados - extraer solo el valor del campo 'total'
    stats.value = {
      totalNegocios: perfilesResponse.data?.total || 0,
      totalPerfilesVisitados: visitasPerfilesResponse.data?.total || 0,
      totalCategorias: categoriasResponse.data?.total || 0,
      totalSubcategorias: subcategoriasResponse.data?.total || 0,
      totalPublicacionesRegistrados: visitasRegResponse.data?.total || 0,
      totalPublicacionesNoRegistrados: visitasAnonResponse.data?.total || 0
    }

  } catch (err) {
    console.error('Error fetching dashboard data:', err)
    
    if (err.response) {
      // Error de respuesta del servidor
      if (err.response.status === 401) {
        error.value = 'Token de autenticación inválido o expirado'
      } else {
        error.value = `Error ${err.response.status}: ${err.response.data?.mensaje || err.response.data?.message || 'Error del servidor'}`
      }
    } else if (err.request) {
      // Error de red
      error.value = 'Error de conexión con el servidor'
    } else {
      // Otro tipo de error
      error.value = err.message || 'Error al cargar los datos del dashboard'
    }
  } finally {
    loading.value = false
  }
}

// Refresh data function
const refreshData = async () => {
  await fetchData()
}

// Load data on component mount
onMounted(() => {
  fetchData()
})
</script>

<style scoped>
/* Additional custom styles if needed */
</style>