<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Gestión de Perfiles</h1>
        <p class="text-gray-600">Administra los perfiles de vendedores registrados</p>
      </div>

      <!-- Si estamos viendo detalle mostramos botón "Volver a lista" -->
      <div v-if="selectedProfileForView">
        <button @click="volverALista" class="px-4 py-2 bg-white border rounded shadow hover:bg-gray-50">
          ← Volver a Perfiles
        </button>
      </div>
    </div>

    <!-- Barra de búsqueda -->
    <div class="mb-6 bg-white rounded-lg shadow-sm p-4">
      <div class="flex items-center space-x-4">
        <div class="relative flex-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar por nombre del negocio..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
          <svg class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
        <button @click="cargarPerfiles" :disabled="loadingList" class="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          <span>Actualizar</span>
        </button>
      </div>
    </div>

    <!-- === LISTA: Tabla de perfiles (se muestra cuando no hay perfil seleccionado) === -->
    <div v-if="!selectedProfileForView">
      <div v-if="loadingList" class="bg-white rounded-lg shadow-sm p-8 text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto" aria-hidden="true"></div>
        <p class="mt-4 text-gray-600">Cargando perfiles...</p>
      </div>

      <Tabla
        v-else
        titulo="Perfiles de Vendedores"
        :items="perfilesFiltrados"
        :columnas="columnasTabla"
        :mostrar-agregar="false"
        :mostrar-editar="false"
        :mostrar-eliminar="true"
        @eliminar="onEliminarUno"
        @eliminar-seleccionados="onEliminarVarios"
      >
        <template #acciones="{ item }">
          <button @click="verPerfilInline(item)" class="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded text-sm mr-2">Ver Perfil</button>
          <button @click="abrirNotificacionModal(item)" class="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded text-sm">Notificar</button>
        </template>

        <template #empty>
          <div class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No hay perfiles</h3>
            <p class="mt-1 text-sm text-gray-500">No se encontraron perfiles de vendedores registrados.</p>
          </div>
        </template>
      </Tabla>
    </div>

    <!-- === VISTA INLINE: Detalle del perfil con pestañas (se muestra cuando hay perfil seleccionado) === -->
    <div v-if="selectedProfileForView" class="bg-white rounded-lg p-6 shadow">
      <!-- cabecera del perfil -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center space-x-4">
          <img v-if="selectedProfileForView.imagen" :src="selectedProfileForView.imagen" loading="lazy" class="w-28 h-28 object-cover rounded-lg" alt="imagen perfil">
          <div>
            <h2 class="text-2xl font-semibold text-gray-800">{{ selectedProfileForView.nombre_negocio }}</h2>
            <p class="text-sm text-gray-500">Visitas: {{ selectedProfileForView.visitas ?? 0 }}</p>
            <div class="mt-2">
              <span class="inline-flex items-center px-2 py-1 rounded text-sm font-medium" :class="selectedProfileForView.confirmado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                {{ selectedProfileForView.confirmado ? 'Confirmado' : 'Pendiente' }}
              </span>
            </div>
          </div>
        </div>

        <!-- resumen de rating pequeño -->
        <div class="text-center">
          <div class="flex items-center justify-center">
            <svg class="w-5 h-5 text-yellow-400 mr-1" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.965a1 1 0 00.95.69h4.173c.969 0 1.371 1.24.588 1.81l-3.377 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118L10 14.347l-3.377 2.455c-.784.57-1.84-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.63 9.392c-.783-.57-.38-1.81.588-1.81h4.173a1 1 0 00.95-.69l1.286-3.965z"/></svg>
            <span class="font-semibold">{{ Number(promedioRating || 0).toFixed(1) }}</span>
            <span class="text-sm text-gray-500 ml-2">({{ valoraciones.length }} valoraciones)</span>
          </div>
        </div>
      </div>

      <!-- TABS -->
      <div>
        <nav class="mb-4 border-b" role="tablist" aria-label="Pestañas perfil">
          <button @click="activeTab = 'info'" :class="tabClass('info')" class="px-4 py-2 -mb-px" role="tab" :aria-selected="activeTab === 'info'">Información</button>
          <button @click="activeTab = 'publicaciones'" :class="tabClass('publicaciones')" class="px-4 py-2 -mb-px" role="tab" :aria-selected="activeTab === 'publicaciones'">Publicaciones</button>
          <button @click="activeTab = 'valoraciones'" :class="tabClass('valoraciones')" class="px-4 py-2 -mb-px" role="tab" :aria-selected="activeTab === 'valoraciones'">Valoraciones</button>
        </nav>

        <div>
          <!-- TAB: Información -->
          <div v-if="activeTab === 'info'">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 class="text-lg font-medium mb-2">Descripción</h3>
                <p class="text-gray-700">{{ selectedProfileForView.descripcion || 'Sin descripción' }}</p>
              </div>

              <div>
                <h3 class="text-lg font-medium mb-2">Contacto</h3>
                <ul class="text-gray-700 space-y-2">
                  <li><strong>Email:</strong> {{ selectedProfileForView.contacto_correo || 'No especificado' }}</li>
                  <li><strong>Teléfono:</strong> {{ selectedProfileForView.contacto_telefono || 'No especificado' }}</li>
                  <li><strong>Dirección:</strong> {{ selectedProfileForView.direccion || 'No especificada' }}</li>
                </ul>
              </div>
            </div>

            <div class="mt-6 flex space-x-3">
              <button @click="abrirNotificacionModal(selectedProfileForView)" class="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50">Enviar Notificación</button>
              <button @click="confirmDeleteSingle(selectedProfileForView)" class="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50">Eliminar</button>
            </div>
          </div>

          <!-- TAB: Publicaciones -->
          <div v-if="activeTab === 'publicaciones'">
            <div v-if="loadingPublicaciones" class="text-center py-10">
              <div class="animate-spin h-10 w-10 border-b-2 border-teal-600 mx-auto" aria-hidden="true"></div>
              <p class="mt-4 text-gray-600">Cargando publicaciones...</p>
            </div>

            <div v-else>
              <div v-if="publicaciones.length === 0" class="text-center py-8 text-gray-500">No hay publicaciones</div>

              <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div v-for="pub in publicaciones" :key="pub.id" class="bg-white border rounded-lg p-3">
                  <img v-if="pub.multimedia && pub.multimedia[0]" :src="pub.multimedia[0]" loading="lazy" class="w-full h-40 object-cover rounded" />
                  <div class="mt-3">
                    <h4 class="font-medium text-gray-800 truncate">{{ pub.titulo || 'Sin título' }}</h4>
                    <p class="text-sm text-gray-600 mt-1"> {{ formatoPrecio(pub.precio) }}</p>
                    <div class="mt-2 flex items-center space-x-2 text-gray-500">
                      <button @click="eliminarPublicacion(pub)" title="Eliminar" class="p-1 rounded hover:bg-gray-100">🗑</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB: Valoraciones -->
          <div v-if="activeTab === 'valoraciones'">
            <div v-if="loadingValoraciones" class="text-center py-10">
              <div class="animate-spin h-10 w-10 border-b-2 border-teal-600 mx-auto" aria-hidden="true"></div>
              <p class="mt-4 text-gray-600">Cargando valoraciones...</p>
            </div>

            <div v-else>
              <div class="mb-6">
                <div class="bg-white p-4 rounded-md border">
                  <div class="flex items-center space-x-4">
                    <div class="text-xl font-semibold">Valoraciones: <span class="text-yellow-400">★</span> {{ Number(promedioRating || 0).toFixed(1) }}</div>
                    <div class="text-gray-500">{{ valoraciones.length }} reseñas</div>
                  </div>
                </div>
              </div>

              <div v-if="valoraciones.length === 0" class="text-center py-8 text-gray-500">No hay valoraciones</div>

              <div v-else class="space-y-4">
                <div v-for="v in valoraciones" :key="v.id" class="bg-white p-4 rounded border">
                  <div class="flex items-start space-x-3">
                    <img v-if="v.userAvatar" :src="v.userAvatar" loading="lazy" class="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <div class="flex items-center justify-between">
                        <div class="font-medium">{{ v.userName || 'Usuario' }}</div>
                        <div class="text-sm text-gray-500">{{ formatFecha(v.creado_en) }}</div>
                      </div>
                      <div class="text-yellow-400">★ {{ v.rating }}/5</div>
                      <p class="text-gray-700 mt-2">{{ v.comment }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> <!-- end valoraciones -->
        </div>
      </div>
    </div>

    <!-- Confirm Delete Modal (compartido con la lista) -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4" role="dialog" aria-modal="true" aria-labelledby="delete-title">
        <h3 id="delete-title" class="text-lg font-semibold text-gray-900 mb-4">Confirmar Eliminación</h3>
        <p class="text-gray-600 mb-6">
          {{ deleteMessage }}
        </p>
        <div class="flex justify-end space-x-3">
          <button @click="cancelarEliminacion" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
          <button @click="confirmarEliminacion" :disabled="loadingAction" class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg disabled:opacity-50">
            {{ loadingAction ? 'Eliminando...' : 'Eliminar' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Notification Modal (mejorado: destinatario + asunto + accesibilidad) -->
    <div v-if="showNotifyModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4" role="dialog" aria-modal="true" aria-labelledby="notify-title">
        <h3 id="notify-title" class="text-lg font-semibold mb-3">Enviar notificación</h3>

        <label class="block text-sm mb-1">Destinatario (email)</label>
        <input v-model="notifyDestinatario" type="email" placeholder="destinatario@ejemplo.com" class="w-full border p-2 rounded mb-3" />

        <label class="block text-sm mb-1">Asunto (opcional)</label>
        <input v-model="notifySubject" type="text" placeholder="Asunto..." class="w-full border p-2 rounded mb-3" />

        <label class="block text-sm mb-1">Mensaje</label>
        <textarea v-model="notifyMessage" rows="4" class="w-full border p-2 rounded mb-3" placeholder="Mensaje..."></textarea>

        <div class="flex justify-end space-x-3">
          <button @click="closeNotifyModal" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancelar</button>
          <button @click="confirmSendNotification" :disabled="loadingAction || !notifyMessage || !notifyDestinatario" class="px-4 py-2 bg-teal-600 text-white rounded disabled:opacity-50">
            {{ loadingAction ? 'Enviando...' : 'Enviar' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ToastContainer - reemplaza el toaster simple -->
    <ToastContainer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Tabla from '../Tabla/Tabla.vue'
import ToastContainer from '../Toast/ToastContainer.vue'
import { useToast } from '@/plugins/composables/useToast'
import axios from 'axios'

/* ------------------------
   Usar el composable de toast
   ------------------------ */
const { showToast } = useToast()

/* ------------------------
   axios instance (mover a services/api.js si quieres)
   ------------------------ */
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'
const api = axios.create({ baseURL: API_BASE, timeout: 15000 })
api.interceptors.request.use(cfg => {
  cfg.headers = cfg.headers || {}
  const token = localStorage.getItem('token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
}, e => Promise.reject(e))

/* ------------------------
   Estado principal
   ------------------------ */
const perfiles = ref([])
const loadingList = ref(false)
const loadingAction = ref(false)

const columnasTabla = [{ key: 'nombre_negocio', label: 'Nombre del Perfil', class: 'w-full' }]
const searchQuery = ref('')

/* selectedProfileForView: cuando NO es null mostramos la vista inline de detalle (en lugar de modal) */
const selectedProfileForView = ref(null)

/* publicaciones y valoraciones del perfil seleccionado */
const publicaciones = ref([])
const valoraciones = ref([])
const loadingPublicaciones = ref(false)
const loadingValoraciones = ref(false)
const activeTab = ref('info')

/* eliminar */
const showDeleteConfirm = ref(false)
const profileToDelete = ref(null)
const perfilesToDelete = ref([])
const deleteMessage = computed(() => {
  if (profileToDelete.value) return `¿Eliminar el perfil "${profileToDelete.value.nombre_negocio}"?`
  return `¿Eliminar ${perfilesToDelete.value.length} perfil(es) seleccionado(s)?`
})

/* notificaciones modal */
const showNotifyModal = ref(false)
const notifyTarget = ref(null)
const notifyMessage = ref('')
const notifySubject = ref('')
const notifyDestinatario = ref('') // email a enviar (puede venir del perfil)

/* ------------------------
   Normalizadores
   ------------------------ */
const normalizePerfiles = (raw) => {
  if (!Array.isArray(raw)) return []
  return raw.map(p => ({
    id: p.id ?? p._id ?? null,
    nombre_negocio: p.nombre_negocio ?? p.nombre ?? 'Sin nombre',
    confirmado: !!p.confirmado,
    creado_en: p.creado_en ?? p.createdAt ?? p.created_at,
    contacto_correo: p.contacto_correo ?? p.email,
    contacto_telefono: p.contacto_telefono ?? p.telefono,
    direccion: p.direccion ?? null,
    imagen: p.imagen ?? null,
    descripcion: p.descripcion ?? '',
    visitas: p.visitas ?? 0
  }))
}

const normalizePublicaciones = (raw) => {
  if (!Array.isArray(raw)) return []
  return raw.map(p => ({
    id: p.id ?? p._id ?? null,
    titulo: p.titulo ?? p.title ?? 'Sin título',
    precio: p.precio ?? p.price ?? 0,
    multimedia: p.multimedia ?? p.images ?? []
  }))
}

const normalizeValoraciones = (raw) => {
  if (!Array.isArray(raw)) return []
  return raw.map(v => ({
    id: v.id ?? v._id ?? null,
    rating: v.rating ?? v.puntuacion ?? 0,
    comment: v.comment ?? v.mensaje ?? '',
    userName: v.userName ?? v.nombre ?? 'Usuario',
    userAvatar: v.userAvatar ?? v.avatar ?? null,
    creado_en: v.creado_en ?? v.createdAt ?? v.created_at
  }))
}

/* ------------------------
   Cargas iniciales
   ------------------------ */
async function cargarPerfiles() {
  showToast(`Cargando perfiles`, 'info', { duration: 2000 })
  loadingList.value = true
  try {
    
    const res = await api.get('/admin/perfiles')
    const payload = res.data && res.data.perfiles ? res.data.perfiles : res.data
    perfiles.value = normalizePerfiles(payload)
    showToast(`Cargados ${perfiles.value.length} perfiles`, 'success', { duration: 2000 })
  } catch (err) {
    console.error('Error cargarPerfiles:', err)
    perfiles.value = []
    showToast('Error al cargar perfiles', 'error')
  } finally {
    loadingList.value = false
  }
}

onMounted(() => cargarPerfiles())


/* ------------------------
   Filtrado (client-side)
   ------------------------ */
const perfilesFiltrados = computed(() => {
  if (!searchQuery.value) return perfiles.value
  const q = searchQuery.value.toLowerCase()
  return perfiles.value.filter(p => (p.nombre_negocio || '').toLowerCase().includes(q))
})

/* ------------------------
   Ver perfil INLINE (reemplaza modal)
   ------------------------ */
async function verPerfilInline(perfil) {
  selectedProfileForView.value = perfil
  activeTab.value = 'info'
  // cargar publicaciones y valoraciones en paralelo
  loadPublicaciones(perfil.id)
  loadValoraciones(perfil.id)
}

/* volver a lista */
function volverALista() {
  selectedProfileForView.value = null
  publicaciones.value = []
  valoraciones.value = []
}

// ----------------------
// Cargar publicaciones del perfil (ruta admin montada en /admin)
// ----------------------
async function loadPublicaciones(perfilId) {
  loadingPublicaciones.value = true
  try {
    const res = await api.get(`/admin/perfil/${perfilId}/publicaciones`)
    const payload = res.data && res.data.publicaciones ? res.data.publicaciones : res.data
    publicaciones.value = Array.isArray(payload) ? normalizePublicaciones(payload) : []
  } catch (err) {
    console.error('Error loadPublicaciones:', err?.response?.status, err?.response?.data ?? err.message)
    if (err.response && err.response.status === 404) {
      showToast('No se encontró endpoint de publicaciones (404). Revisa ruta backend.', 'warning', { duration: 4000 })
    } else {
      showToast('Error al cargar publicaciones', 'error')
    }
    publicaciones.value = []
  } finally {
    loadingPublicaciones.value = false
  }
}

// ----------------------
// Cargar valoraciones del perfil (ruta admin montada en /admin)
// ----------------------
async function loadValoraciones(perfilId) {
  loadingValoraciones.value = true
  try {
    const res = await api.get(`/admin/valoraciones/perfiles/${perfilId}`)
    console.debug('loadValoraciones - respuesta cruda:', res.data)
    const payload = res.data && res.data.valoraciones ? res.data.valoraciones : res.data
    valoraciones.value = Array.isArray(payload) ? normalizeValoraciones(payload) : []
  } catch (err) {
    console.error('Error loadValoraciones:', err?.response?.status, err?.response?.data ?? err.message)
    if (err.response && err.response.status === 404) {
      showToast('No se encontró endpoint de valoraciones (404). Revisa ruta backend.', 'warning', { duration: 4000 })
    } else {
      showToast('Error al cargar valoraciones', 'error')
    }
    valoraciones.value = []
  } finally {
    loadingValoraciones.value = false
  }
}

/* promedio de rating */
const promedioRating = computed(() => {
  if (valoraciones.value.length === 0) return 0
  const sum = valoraciones.value.reduce((acc, v) => acc + (v.rating || 0), 0)
  return sum / valoraciones.value.length
})

const tabClass = (tab) => {
  const base = 'px-4 py-2 -mb-px'
  const active = 'border-b-2 border-teal-700 text-teal-700'
  const inactive = 'text-gray-600 hover:text-teal-700'
  return `${base} ${activeTab.value === tab ? active : inactive}`
}

/* ------------------------
   Eliminación (lista y detalle comparten lógica)
   ------------------------ */
function onEliminarUno(item) {
  profileToDelete.value = item
  perfilesToDelete.value = []
  showDeleteConfirm.value = true
}

function onEliminarVarios(ids) {
  profileToDelete.value = null
  perfilesToDelete.value = ids
  showDeleteConfirm.value = true
}

function confirmDeleteSingle(perfil) {
  profileToDelete.value = perfil
  perfilesToDelete.value = []
  showDeleteConfirm.value = true
}

async function confirmarEliminacion() {
  loadingAction.value = true
  try {
    const toDelete = profileToDelete.value ? [profileToDelete.value.id] : [...perfilesToDelete.value]
    const promises = toDelete.map(id => api.delete(`/admin/perfiles/${id}`))
    const results = await Promise.allSettled(promises)

    let successful = 0, failed = 0
    results.forEach(r => r.status === 'fulfilled' ? successful++ : failed++)

    perfiles.value = perfiles.value.filter(p => !toDelete.includes(p.id))
    
    if (failed > 0) {
      showToast(`${successful} eliminado(s). ${failed} fallo(s).`, 'warning')
    } else {
      showToast(`${successful} perfil(es) eliminado(s) correctamente`, 'success')
    }

    if (profileToDelete.value && selectedProfileForView.value && profileToDelete.value.id === selectedProfileForView.value.id) {
      volverALista()
    }

    showDeleteConfirm.value = false
    profileToDelete.value = null
    perfilesToDelete.value = []
  } catch (err) {
    console.error('confirmarEliminacion error:', err)
    showToast('Error al eliminar perfil(es)', 'error')
  } finally {
    loadingAction.value = false
  }
}

function cancelarEliminacion() {
  showDeleteConfirm.value = false
  profileToDelete.value = null
  perfilesToDelete.value = []
}

/* ------------------------
   Notificaciones (modal) - mejoras para enviar correctamente
   ------------------------ */
function abrirNotificacionModal(perfil) {
  notifyTarget.value = perfil
  notifyMessage.value = ''
  notifySubject.value = ''
  // preset destinatario si existe en perfil
  notifyDestinatario.value = getEmailFromPerfil(perfil) || ''
  showNotifyModal.value = true
}

function closeNotifyModal() {
  showNotifyModal.value = false
  notifyTarget.value = null
  notifyMessage.value = ''
  notifySubject.value = ''
  notifyDestinatario.value = ''
}

function getEmailFromPerfil(perfil) {
  if (!perfil || typeof perfil !== 'object') return null
  return perfil.contacto_correo ?? perfil.contactoEmail ?? perfil.email ?? null
}

async function confirmSendNotification() {
  if (!notifyTarget.value) return
  if (!notifyMessage.value) {
    showToast('Escribe un mensaje antes de enviar.', 'warning')
    return
  }
  if (!notifyDestinatario.value) {
    showToast('Indica un email de destinatario válido.', 'warning')
    return
  }

  loadingAction.value = true
  try {
    const payload = {
      perfilId: notifyTarget.value.id,
      destinatario: notifyDestinatario.value,
      asunto: notifySubject.value || null,
      mensaje: notifyMessage.value,
      tipo: 'admin' // opcional, tu backend por defecto 'admin'
    }

    const res = await api.post('/admin/alertas', payload)
    const mensaje = res.data?.mensaje ?? 'Notificación registrada'
    showToast(mensaje, 'success')
    closeNotifyModal()
  } catch (err) {
    console.error('confirmSendNotification error:', err?.response?.data ?? err)
    // intentar obtener mensaje de error
    const serverMsg = err?.response?.data?.mensaje || err?.response?.data?.error || null
    showToast(serverMsg || 'Error al enviar notificación', 'error')
  } finally {
    loadingAction.value = false
  }
}

/* ------------------------
   Publicaciones: acciones rápidas (placeholder)
   ------------------------ */
async function eliminarPublicacion(pub) {
  if (!confirm(`Eliminar publicación "${pub.titulo}"?`)) return
  try {
    loadingAction.value = true
    await api.delete(`/admin/publicaciones/${pub.id}`)
    publicaciones.value = publicaciones.value.filter(p => p.id !== pub.id)
    showToast('Publicación eliminada', 'success', { duration: 2000 })
  } catch (err) {
    console.error('eliminarPublicacion error:', err)
    showToast('Error al eliminar publicación', 'error')
  } finally {
    loadingAction.value = false
  }
}

/* ------------------------
   Utilidades
   ------------------------ */
function formatoPrecio(n) {
  if (n == null) return '$0'
  return `${String(n)}`
}
function formatFecha(f) {
  if (!f) return ''
  const d = new Date(f); if (isNaN(d)) return f
  return d.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>

<style scoped>
/* Estilos muy pequeños para las tabs activas */
button[role="tab"] { }
button[aria-selected="true"] { }
button.active {
  border-bottom: 2px solid #0f766e; /* teal-700 */
  color: #0f766e;
}

/* Estilos personalizados si son necesarios */
</style>