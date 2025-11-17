<template> 
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <button @click="goBack" class="mr-4 p-2 rounded-md hover:bg-gray-100">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <h1 class="text-xl font-semibold text-gray-900">{{ currentPageTitle }}</h1>
          </div>
          <div class="flex items-center space-x-4">
            <!-- Botón de notificaciones -->
            <button 
              @click="openNotifications"
              class="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Notificaciones"
            >
              <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM4 19h9a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">!</span>
            </button>
            
            <div class="flex items-center">
              <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <span class="ml-2 text-sm text-gray-700">{{ currentUser.nombre || 'Admin' }}</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        <!-- Sidebar -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-sm border">
            <nav class="p-4 space-y-2">
              <a 
                v-for="item in menuItems" 
                :key="item.key"
                @click="navigateTo(item.key)"
                :class="currentPage === item.key ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'"
                class="flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer"
              >
                <span class="w-5 h-5 mr-3" v-html="item.icon"></span>
                {{ item.label }}
              </a>
            </nav>
          </div>
          
          <!-- Logout Button -->
          <div class="mt-6">
            <button 
              @click="logout" 
              class="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              Cerrar Sesión
            </button>
          </div>
        </div>

        <!-- Main Content -->
        <div class="lg:col-span-3">
          <component :is="currentComponent" 
                     :stats="stats" 
                     :loading="loading"
                     @refresh="loadStats"
                     @navigate="handleNavigate" />
        </div>
      </div>
    </div>

    <!-- Modal de Notificaciones -->
    <NotificacionesView 
      v-if="showNotifications" 
      @close="handleNotificationsClose" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

// Lazy load de componentes
const EstadisticasView = defineAsyncComponent(() => import('./EstadisticasView.vue'))
const GestionarPerfiles = defineAsyncComponent(() => import('./GestionarPerfiles.vue'))
const GestionarCategorias = defineAsyncComponent(() => import('./GestionarCategorias.vue'))
const GestionarSubcategorias = defineAsyncComponent(() => import('./GestionarSubcategorias.vue'))
const NotificacionesView = defineAsyncComponent(() => import('./NotificacionesView.vue'))

// Router
const router = useRouter()

// Props
const props = defineProps({
  currentUser: {
    type: Object,
    default: () => ({})
  }
})

// Estado reactivo
const currentPage = ref('estadisticas')
const loading = ref(false)
const showNotifications = ref(false)

const stats = ref({
  totalNegocios: 0,
  totalPerfilesVisitados: 0,
  totalCategorias: 0,
  totalSubcategorias: 0,
  totalPublicacionesRegistrados: 0,
  totalPublicacionesNoRegistrados: 0
})

// Endpoints centralizados
const adminEndpoints = {
  totalNegocios: '/admin/stats/perfilesTotal',
  totalCategorias: '/admin/stats/categoriasTotal',
  totalSubcategorias: '/admin/stats/subcategoriasTotal',
  totalPublicacionesRegistrados: '/admin/stats/visitas-public-reg',
  totalPublicacionesNoRegistrados: '/admin/stats/visitas-public-anon',
  totalPerfilesVisitados: '/admin/stats/visitas-perfiles'
}

// Menú lateral dinámico
const menuItems = [
  { key: 'estadisticas', label: 'Estadísticas', icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>` },
  { key: 'perfiles', label: 'Gestionar Perfiles', icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>` },
  { key: 'categorias', label: 'Gestionar Categorías', icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>` },
  { key: 'subcategorias', label: 'Gestionar Subcategorías', icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>` },
  { key: 'notificaciones', label: 'Notificaciones', icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM4 19h9a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>` }
]

// Computed properties
const currentComponent = computed(() => {
  const components = {
    estadisticas: EstadisticasView,
    perfiles: GestionarPerfiles,
    categorias: GestionarCategorias,
    subcategorias: GestionarSubcategorias,
    notificaciones: NotificacionesView
  }
  return components[currentPage.value]
})

const currentPageTitle = computed(() => {
  const titles = {
    estadisticas: 'Estadísticas - Administración',
    perfiles: 'Gestionar Perfiles - Administración',
    categorias: 'Gestionar Categorías - Administración',
    subcategorias: 'Gestionar Subcategorías - Administración',
    notificaciones: 'Notificaciones - Administración'
  }
  return titles[currentPage.value] || 'Administración'
})

// Métodos
const openNotifications = () => {
  showNotifications.value = true
  currentPage.value = 'notificaciones'
}

const handleNotificationsClose = () => {
  // Cerrar modal y regresar a vista general
  showNotifications.value = false
  currentPage.value = 'estadisticas'
  // opcional: recargar estadísticas
  loadStats()
}

const navigateTo = (page: string) => {
  // Si el usuario selecciona la sección notificaciones desde el sidebar
  if (page === 'notificaciones') {
    openNotifications()
    return
  }

  currentPage.value = page
  if (page === 'estadisticas') loadStats()
}

const handleNavigate = (page: string) => navigateTo(page)

const logout = () => {
  localStorage.clear()
  sessionStorage.clear()
  router.push('/DashboardPublicaciones')
}

const goBack = () => {
  if (currentPage.value !== 'estadisticas') {
    currentPage.value = 'estadisticas'
  } else {
    router.push('/DashboardPublicaciones')
  }
}

// Cargar estadísticas usando axios
const loadStats = async () => {
  loading.value = true
  try {
    const token = localStorage.getItem('token')
    const headers = { Authorization: `Bearer ${token}` }

    const promises = Object.entries(adminEndpoints).map(async ([key, url]) => {
      try {
        const { data } = await axios.get(url, { headers })
        return { key, value: data.count ?? data.total ?? data.length ?? 0 }
      } catch (e) {
        console.error(`Error loading ${key}:`, e.message)
        return { key, value: 0 }
      }
    })

    const results = await Promise.all(promises)
    results.forEach(({ key, value }) => stats.value[key] = value)
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => loadStats())
</script>

<style scoped>
/* Custom styles si necesitas */
</style>
