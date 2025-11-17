<template>
  <div class="flex flex-col md:flex-row min-h-screen p-6">
    <!-- Perfil de la tienda (EncabezadoPerfil) -->
    <div v-if="perfil" class="lg:w-1/3 w-full p-6 bg-gray-100 flex flex-col">
      <EncabezadoPerfil
        :perfil="perfil"
        :show-actions="!isVisitingFromDetails"
        @editar="openEditProfile"
        @navigate-to-dashboard="navigateToDashboard"
      />
      <!-- Botón Reportar sólo cuando viene de details -->
      <button
        v-if="isVisitingFromDetails"
        @click="reportarPerfil"
        class="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Reportar perfil
      </button>
      <InfoTienda class="lg:block hidden" :perfil="perfil" />
      <BotonesAccion
        v-if="!isVisitingFromDetails"
        class="lg:flex md:space-x-4 lg:block hidden"
        @crear-publicacion="openCreateBusinessPublication"
        @actualizar-ubicacion="actualizarUbicacion"
        @logout="logout"
      />
    </div>

    <!-- Botones debajo del encabezado solo en móvil -->
    <div class="md:hidden flex justify-center space-x-4 mt-4">
      <button
        @click="activeTab = 'publicaciones'"
        :class="{'text-teal-800 border-b-2 border-teal-800': activeTab === 'publicaciones'}"
        class="py-2 px-4 text-sm font-semibold hover:text-teal-800"
      >
        Publicaciones
      </button>
      <button
        @click="activeTab = 'informacion'; showInfoTienda = true"
        :class="{'text-teal-800 border-b-2 border-teal-800': activeTab === 'informacion'}"
        class="py-2 px-4 text-sm font-semibold hover:text-teal-800"
      >
        Información
      </button>
      <button
        @click="activeTab = 'valoraciones'"
        :class="{'text-teal-800 border-b-2 border-teal-800': activeTab === 'valoraciones'}"
        class="py-2 px-4 text-sm font-semibold hover:text-teal-800"
      >
        Valoraciones
      </button>
    </div>

    <!-- Contenido de la tienda (Publicaciones, Información, Valoraciones) -->
    <div class="lg:w-2/3 mt-6 md:mt-0 ml-6 overflow-y-auto" style="max-height: calc(100vh - 100px);">
      <!-- En escritorio, todo el contenido está visible sin necesidad de hacer clic -->
      <div class="hidden lg:block">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          <Card
            v-for="pub in publicaciones"
            :key="pub.id"
            :product="pub"
            @open-detail="mostrarDetalle"
            @editar-publicacion="openEditPublication(pub)"
            @eliminar-publicacion="eliminarPublicacion(pub.id)"
            class="w-[300px] bg-gray-100 p-4 rounded-lg"
            :show-edit-delete="!isVisitingFromDetails"
          />
        </div>
      </div>

      <!-- En móvil, solo se muestra la sección activa -->
      <div v-if="activeTab === 'publicaciones'" class="md:hidden">
        <div class="w-full grid grid-cols-2 sm:grid-cols-2">
          <Card
            v-for="pub in publicaciones"
            :key="pub.id"
            :product="pub"
            @open-detail="mostrarDetalle"
            @editar-publicacion="openEditPublication(pub)"
            @eliminar-publicacion="eliminarPublicacion(pub.id)"
            :show-edit-delete="!isVisitingFromDetails"
          />
        </div>
      </div>

      <div v-if="activeTab === 'informacion'" class="md:hidden">
        <InfoTienda :perfil="perfil" />
        <BotonesAccion 
          v-if="!isVisitingFromDetails"
          class="text-xs px-4 whitespace-nowrap"
          @crear-publicacion="openCreateBusinessPublication"
          @logout="logout"
        />
      </div>

      <div v-if="activeTab === 'valoraciones'" class="md:hidden">
        <h3 class="font-semibold text-teal-800 mb-2">¿Cómo calificas este perfil?</h3>
        <div class="flex space-x-1 mb-4">
          <button
            v-for="n in 5"
            :key="n"
            @click="setRating(n)"
            class="focus:outline-none"
          >
            <StarIcon
              class="w-6 h-6 cursor-pointer"
              :class="n <= userRating ? 'text-yellow-500' : 'text-gray-300'"
            />
          </button>
        </div>
        <p v-if="saving" class="text-sm text-gray-500">Guardando valoración…</p>
        <p v-if="saveError" class="text-sm text-red-600">{{ saveError }}</p>
      </div>
    </div>

    <!-- Modales (solo si no es visita desde detalles) -->
    <CreateBusinessPublication
      v-if="isCreateBusinessPublicationVisible && !isVisitingFromDetails"
      :perfil-id="perfil?.id"
      @close="isCreateBusinessPublicationVisible = false; cargarPublicaciones();"
    />
    <EditPublication
      v-if="isEditPublicationVisible && !isVisitingFromDetails"
      :publicacion="selectedPublication"
      @close="isEditPublicationVisible = false; cargarPublicaciones();"
    />
    <EditPerfilModal
      v-if="isEditProfileVisible && !isVisitingFromDetails"
      :perfil="perfil"
      @close="isEditProfileVisible = false; cargarPerfil();"
    />
    <DetalleProducto
      v-if="mostrarModal"
      :productId="productoSeleccionado"
      :showEditDelete="!isVisitingFromDetails"
      @close="cerrarDetalle"
      @publicationDeleted="handlePublicationDeleted"
      @publicationUpdated="handlePublicationUpdated"
    />
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { ref, onMounted, computed } from 'vue';
import { useNuxtApp } from '#app';
import EncabezadoPerfil from '@/components/PerfilNegocio/EncabezadoPerfil.vue';
import InfoTienda from '@/components/PerfilNegocio/InfoTienda.vue';
import BotonesAccion from '@/components/PerfilNegocio/botonesAccion.vue';
import Card from '@/components/Card.vue';
import CreateBusinessPublication from '@/components/Publicaciones/CreateBusinessPublication.vue';
import EditPublication from '@/components/Publicaciones/EditPublication.vue';
import EditPerfilModal from '@/components/modal/EditPerfilModal.vue';
import DetalleProducto from '@/components/DetalleProducto.vue';
import { StarIcon } from '@heroicons/vue/24/solid';

// Interfaces
interface Perfil {
  id: string;
  nombre: string;
  descripcion?: string;
  latitude?: number;
  longitude?: number;
  rating?: number;
}

interface Publicacion {
  id: string;
  titulo: string;
  descripcion?: string;
  precio?: number;
  multimedia?: string[];
  imageUrl?: string;
}

interface UbicacionParams {
  latitude: number;
  longitude: number;
}

type TabType = 'publicaciones' | 'informacion' | 'valoraciones';

const { $axios } = useNuxtApp();
const router = useRouter();
const route = useRoute();

// Reactive refs with proper typing
const perfil = ref<Perfil | null>(null);
const publicaciones = ref<Publicacion[]>([]);
const activeTab = ref<TabType>('publicaciones');
const showInfoTienda = ref<boolean>(false);

// Estado local
const userRating = ref<number>(0);
const saving = ref<boolean>(false);
const saveError = ref<string>('');

const isCreateBusinessPublicationVisible = ref<boolean>(false);
const isEditPublicationVisible = ref<boolean>(false);
const isEditProfileVisible = ref<boolean>(false);
const selectedPublication = ref<Publicacion | null>(null);
const mostrarModal = ref<boolean>(false);
const productoSeleccionado = ref<string | null>(null);

// Computed properties
const isVisitingFromDetails = computed<boolean>(() =>
  route.query.from === 'details' || Boolean(route.params.id)
);

const perfilId = computed<string | null>(() => {
  const paramId = route.params.id;
  const queryId = route.query.id;
  
  if (typeof paramId === 'string') return paramId;
  if (Array.isArray(paramId) && paramId.length > 0) return paramId[0];
  if (typeof queryId === 'string') return queryId;
  if (Array.isArray(queryId) && queryId.length > 0) return queryId[0];
  
  return null;
});

// Methods
const navigateToDashboard = (): void => {
  router.push('/DashboardPublicaciones');
};

const logout = (): void => {
  localStorage.removeItem('token');
  delete $axios.defaults.headers.common['Authorization'];
  router.push('/DashboardPublicaciones');
};

const mostrarDetalle = (product: Publicacion): void => {
  productoSeleccionado.value = product.id;
  mostrarModal.value = true;
};

const cerrarDetalle = (): void => {
  mostrarModal.value = false;
  productoSeleccionado.value = null;
};

const handlePublicationDeleted = (id: string): void => {
  // Recargar las publicaciones después de eliminar
  cargarPublicaciones();
  cerrarDetalle();
};

const handlePublicationUpdated = (): void => {
  // Recargar las publicaciones después de actualizar
  cargarPublicaciones();
};

const reportarPerfil = (): void => {
  // Implementar lógica de reporte
  console.log('Reportar perfil');
};

// Carga la valoración actual del usuario
const loadRating = async (): Promise<void> => {
  try {
    const currentPerfilId = perfilId.value;
    if (!currentPerfilId) return;
    
    const res = await $axios.get(`/perfiles/${currentPerfilId}`);
    userRating.value = res.data.rating || 0;
  } catch (err) {
    console.error('Error cargando valoración:', err);
  }
};

// Cuando pinchas una estrella
const setRating = async (rating: number): Promise<void> => {
  userRating.value = rating;
  saving.value = true;
  saveError.value = '';
  
  try {
    const currentPerfilId = perfilId.value;
    if (!currentPerfilId) return;
    
    await $axios.put(`/perfiles/${currentPerfilId}`, { rating });
  } catch (err) {
    console.error('Error guardando valoración:', err);
    saveError.value = 'No se pudo guardar tu valoración.';
  } finally {
    saving.value = false;
  }
};

const cargarPerfil = async (): Promise<void> => {
  try {
    let response;
    const currentPerfilId = perfilId.value;
    
    if (currentPerfilId) {
      response = await $axios.get(`/publicaciones/perfil/${currentPerfilId}`);
    } else {
      const token = localStorage.getItem('token');
      response = await $axios.get('/vendedor/perfil', {
        headers: { Authorization: `Bearer ${token}` }
      });
    }
    perfil.value = response.data;
  } catch (err) {
    console.error('Error cargando perfil:', err);
  }
};

const cargarPublicaciones = async (): Promise<void> => {
  try {
    let response;
    const currentPerfilId = perfilId.value;
    
    if (currentPerfilId) {
      response = await $axios.get(`/publicaciones/perfil/${currentPerfilId}/publicaciones`);
    } else {
      const token = localStorage.getItem('token');
      response = await $axios.get('/vendedor/publicaciones', {
        headers: { Authorization: `Bearer ${token}` }
      });
    }

    publicaciones.value = response.data.publicaciones.map((pub: any) => ({
      ...pub,
      imageUrl:
        Array.isArray(pub.multimedia) && pub.multimedia.length
          ? pub.multimedia[0]
          : '/placeholder.jpg'
    }));
  } catch (err) {
    console.error('Error cargando publicaciones:', err);
  }
};

const openCreateBusinessPublication = (): void => {
  if (!isVisitingFromDetails.value) {
    isCreateBusinessPublicationVisible.value = true;
  }
};

const openEditPublication = (pub: Publicacion): void => {
  if (!isVisitingFromDetails.value) {
    selectedPublication.value = pub;
    isEditPublicationVisible.value = true;
  }
};

const openEditProfile = (): void => {
  if (!isVisitingFromDetails.value) {
    isEditProfileVisible.value = true;
  }
};

const eliminarPublicacion = async (id: string): Promise<void> => {
  if (isVisitingFromDetails.value) return;
  
  try {
    const token = localStorage.getItem('token');
    await $axios.delete(`/vendedor/publicaciones/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    await cargarPublicaciones();
  } catch (err) {
    console.error('Error eliminando publicación:', err);
  }
};

const actualizarUbicacion = async (params: UbicacionParams): Promise<void> => {
  if (isVisitingFromDetails.value) return;
  
  const { latitude, longitude } = params;
  
  try {
    const token = localStorage.getItem('token');
    await $axios.put('/vendedor/perfil', { latitude, longitude }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    await cargarPerfil();
  } catch (err) {
    console.error('Error actualizando ubicación:', err);
  }
};

// Lifecycle hooks
onMounted(async () => {
  await Promise.all([cargarPerfil(), cargarPublicaciones(), loadRating()]);
});
</script>

<style scoped>
.sticky {
  position: sticky;
  top: 0;
  z-index: 10;
}
.overflow-y-auto {
  overflow-y: auto;
  max-height: calc(100vh - 100px);
}
</style>