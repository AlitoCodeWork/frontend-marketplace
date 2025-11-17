<template>
  <!-- Overlay / modal principal -->
  <transition name="fade">
    <div v-if="visible" class="fixed inset-0 z-60 flex items-start justify-center p-6 overflow-auto" @keydown.esc="onEsc" tabindex="-1">
      <div class="fixed inset-0 bg-black bg-opacity-50" @click="onOverlayClick" aria-hidden="true"></div>

      <div class="relative bg-white rounded-lg shadow-lg max-w-4xl w-full z-10" role="dialog" aria-modal="true" aria-labelledby="rep-title">
        <header class="flex items-center justify-between px-4 py-3 border-b">
          <h2 id="rep-title" class="text-lg font-semibold">Reportes de Vendedores</h2>
          <div class="flex items-center space-x-2">
            <button class="text-sm text-gray-600 hover:text-gray-900" @click="refresh" :disabled="loading">
              Recargar
            </button>
            <button aria-label="Cerrar" class="p-2 rounded hover:bg-gray-100" @click="closeMain">
              <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </header>

        <main class="p-4">
          <div v-if="loading" class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600" aria-hidden="true"></div>
            <p class="mt-3 text-sm text-gray-600">Cargando reportes...</p>
          </div>

          <div v-else>
            <div v-if="reports.length === 0" class="text-center py-8 text-gray-500">
              No hay reportes disponibles.
            </div>

            <div v-else class="space-y-3">
              <div v-for="r in reports" :key="r.id" class="bg-gray-50 p-4 rounded-lg border hover:shadow-md transition-shadow">
                <div class="flex items-start justify-between">
                  <div class="flex-1 pr-4">
                    <!-- Header con información del vendedor -->
                    <div class="flex items-center mb-3">
                      <div class="flex-1">
                        <h3 class="text-base font-semibold text-gray-800">
                          {{ r.nombreVendedor || 'Vendedor sin nombre' }}
                        </h3>
                        <p class="text-sm text-gray-600">
                          ID Vendedor: {{ r.vendedorId }}
                        </p>
                      </div>
                      <div class="text-right">
                        <span class="text-xs text-gray-500">{{ formatFecha(r.fecha) }}</span>
                      </div>
                    </div>

                    <!-- Motivo del reporte -->
                    <div class="mb-3">
                      <span class="text-sm font-medium text-gray-700">Motivo:</span>
                      <p class="text-sm text-gray-800 mt-1">{{ r.motivo || 'Sin motivo especificado' }}</p>
                    </div>

                    <!-- Prueba si existe -->
                    <div v-if="r.pruebaPath" class="mb-3">
                      <span class="text-sm font-medium text-gray-700">Evidencia:</span>
                      <div class="mt-1">
                        <a 
                          :href="getFileUrl(r.pruebaPath)" 
                          target="_blank" 
                          class="text-sm text-blue-600 hover:text-blue-800 underline"
                        >
                          Ver archivo adjunto
                        </a>
                      </div>
                    </div>

                    <!-- Estado del reporte -->
                    <div class="flex items-center">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Pendiente
                      </span>
                    </div>
                  </div>

                  <!-- Botones de acción -->
                  <div class="flex flex-col space-y-2 ml-4">
                    <button 
                      @click="openDetail(r)" 
                      class="px-3 py-1 text-sm bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors"
                    >
                      Ver detalle
                    </button>
                    <button 
                      @click="confirmDeleteInline(r)" 
                      :disabled="deleting[r.id]" 
                      class="px-3 py-1 text-sm border border-red-300 text-red-600 rounded hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      {{ deleting[r.id] ? 'Eliminando...' : 'Eliminar' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <footer class="px-4 py-3 border-t text-right">
          <button @click="closeMain" class="px-4 py-2 bg-gray-100 rounded-md text-sm hover:bg-gray-200 transition-colors">
            Cerrar
          </button>
        </footer>
      </div>
    </div>
  </transition>

  <!-- Modal detalle (interno) -->
  <transition name="scale-fade">
    <div v-if="showDetail" class="fixed inset-0 z-70 flex items-center justify-center p-6">
      <div class="fixed inset-0 bg-black bg-opacity-40" @click="closeDetail" aria-hidden="true"></div>

      <div class="relative bg-white rounded-lg shadow-lg max-w-2xl w-full z-20" role="dialog" aria-modal="true" aria-labelledby="detail-title">
        <header class="flex items-center justify-between px-4 py-3 border-b">
          <h3 id="detail-title" class="text-lg font-semibold">Detalle del Reporte</h3>
          <button aria-label="Cerrar detalle" class="p-2 rounded hover:bg-gray-100" @click="closeDetail">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </header>

        <main class="p-6">
          <div v-if="selectedReport" class="space-y-4">
            <!-- Información del vendedor -->
            <div class="bg-gray-50 p-4 rounded-lg">
              <h4 class="font-semibold text-gray-800 mb-2">Información del Vendedor</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <span class="font-medium text-gray-600">Nombre:</span>
                  <span class="ml-2 text-gray-800">{{ selectedReport.nombreVendedor || 'Sin nombre' }}</span>
                </div>
                <div>
                  <span class="font-medium text-gray-600">ID Vendedor:</span>
                  <span class="ml-2 text-gray-800">{{ selectedReport.vendedorId }}</span>
                </div>
              </div>
            </div>

            <!-- Detalles del reporte -->
            <div>
              <h4 class="font-semibold text-gray-800 mb-2">Detalles del Reporte</h4>
              <div class="space-y-3">
                <div>
                  <span class="font-medium text-gray-600 block">Fecha del reporte:</span>
                  <span class="text-gray-800">{{ formatFechaCompleta(selectedReport.fecha) }}</span>
                </div>
                
                <div>
                  <span class="font-medium text-gray-600 block">Motivo:</span>
                  <p class="text-gray-800 whitespace-pre-wrap mt-1">{{ selectedReport.motivo || 'Sin motivo especificado' }}</p>
                </div>

                <div v-if="selectedReport.pruebaPath">
                  <span class="font-medium text-gray-600 block">Evidencia:</span>
                  <div class="mt-1">
                    <a 
                      :href="getFileUrl(selectedReport.pruebaPath)" 
                      target="_blank" 
                      class="inline-flex items-center text-blue-600 hover:text-blue-800 underline"
                    >
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                      </svg>
                      Ver archivo adjunto
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <footer class="px-4 py-3 border-t flex justify-between">
          <button @click="closeDetail" class="px-4 py-2 bg-gray-100 rounded-md text-sm hover:bg-gray-200 transition-colors">
            Volver
          </button>
          <button 
            @click="deleteReport(selectedReport)" 
            :disabled="deleting[selectedReport?.id]" 
            class="px-4 py-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            {{ deleting[selectedReport?.id] ? 'Eliminando...' : 'Eliminar reporte' }}
          </button>
        </footer>
      </div>
    </div>
  </transition>

  <!-- Toast Container para notificaciones -->
  <ToastContainer />
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import axios from 'axios'
import type { Ref } from 'vue'
import ToastContainer from '@/components/Toast/ToastContainer.vue'
import { useToast } from '@/plugins/composables/useToast'

interface Reporte {
  id: number
  vendedorId: number
  motivo: string
  pruebaPath?: string
  fecha: string
  nombreVendedor?: string
}

const emit = defineEmits<{
  (e: 'close'): void
}>()

const props = defineProps<{
  perfilId?: number | null
}>()

const visible = ref(true)
const loading = ref(false)
const reports: Ref<Reporte[]> = ref([])
const selectedReport = ref<Reporte | null>(null)
const showDetail = ref(false)
const deleting: Record<number, boolean> = ref({})
const { showToast } = useToast()

const api = axios.create({ 
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000', 
  timeout: 15000 
})

api.interceptors.request.use(cfg => {
  cfg.headers = cfg.headers || {}
  const token = localStorage.getItem('token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
}, e => Promise.reject(e))

async function loadReports() {
  loading.value = true
  try {
    const url = props.perfilId ? `/admin/reportes?perfilId=${props.perfilId}` : '/admin/reportes'
    const res = await api.get(url)
    reports.value = Array.isArray(res.data?.reportes) ? res.data.reportes : (Array.isArray(res.data) ? res.data : [])
  } catch (err) {
    console.error('loadReports error:', err)
    reports.value = []
    showToast('Error al cargar los reportes', 'error')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadReports()
  nextTick(() => {
    const el = document.querySelector('[role="dialog"]') as HTMLElement | null
    if (el) el.focus()
  })
})

function formatFecha(fecha: string | null) {
  if (!fecha) return 'Sin fecha'
  const d = new Date(fecha)
  if (isNaN(d.getTime())) return String(fecha)
  return d.toLocaleString('es-ES', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric',
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

function formatFechaCompleta(fecha: string | null) {
  if (!fecha) return 'Sin fecha'
  const d = new Date(fecha)
  if (isNaN(d.getTime())) return String(fecha)
  return d.toLocaleString('es-ES', { 
    weekday: 'long',
    day: '2-digit', 
    month: 'long', 
    year: 'numeric',
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

function getFileUrl(path: string | undefined) {
  if (!path) return '#'
  // Ajusta según tu configuración de archivos
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000'
  return `${baseUrl}/uploads/${path}`
}

/* ---------- Apertura / cierre (padre) ---------- */
function closeMain() {
  visible.value = false
  setTimeout(() => emit('close'), 180)
}

function onOverlayClick(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (target && target.classList.contains('bg-black')) {
    closeMain()
  }
}

function onEsc() {
  closeMain()
}

/* ---------- Detalle (interno) ---------- */
function openDetail(reporte: Reporte) {
  selectedReport.value = reporte
  showDetail.value = true
}

function closeDetail() {
  showDetail.value = false
  selectedReport.value = null
}

/* ---------- Eliminar reportes ---------- */
function confirmDeleteInline(reporte: Reporte) {
  const nombre = reporte.nombreVendedor || `ID: ${reporte.vendedorId}`
  const mensaje = `¿Está seguro de eliminar el reporte contra "${nombre}"?\n\nMotivo: ${reporte.motivo?.slice(0, 50) || 'Sin motivo'}...`
  
  if (!confirm(mensaje)) return
  deleteReport(reporte)
}

async function deleteReport(reporte: Reporte) {
  if (!reporte || !reporte.id) return
  
  deleting.value[reporte.id] = true
  try {
    await api.delete(`/admin/reportes/${reporte.id}`)
    
    // Quitar de la lista
    reports.value = reports.value.filter(r => r.id !== reporte.id)
    
    // Cerrar detalle si estaba abierto en ese reporte
    if (selectedReport.value && selectedReport.value.id === reporte.id) {
      closeDetail()
    }
    
    // Mostrar notificación de éxito
    showToast('Reporte eliminado correctamente', 'success')
    
  } catch (err) {
    console.error('deleteReport error:', err)
    showToast('Error al eliminar el reporte. Inténtelo de nuevo.', 'error')
  } finally {
    delete deleting.value[reporte.id]
  }
}

/* ---------- Utilidades ---------- */
function refresh() {
  loadReports()
  showToast('Reportes actualizados', 'info')
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .18s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.scale-fade-enter-active, .scale-fade-leave-active {
  transition: all .14s ease;
}
.scale-fade-enter-from {
  opacity: 0;
  transform: translateY(8px) scale(.98);
}
.scale-fade-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(.98);
}
</style>