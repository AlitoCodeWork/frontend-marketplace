<template>
  <div
    v-if="loading || product || error"
    class="fixed inset-0 bg-gray-500 bg-opacity-50 z-50 flex justify-start items-start"
    @click.self="closeDetail"
  >
    <div class="bg-white w-full sm:w-[600px] md:w-[500px] lg:w-[400px] h-full rounded-lg p-6 overflow-y-auto">
      <!-- Loading state -->
      <div v-if="loading" class="flex items-center justify-center h-full">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#204347] mx-auto"></div>
          <p class="mt-4 text-gray-600">Cargando producto...</p>
        </div>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="flex items-center justify-center h-full">
        <div class="text-center">
          <p class="text-red-600 mb-4">{{ error }}</p>
          <button
            @click="fetchProduct"
            class="px-4 py-2 bg-[#204347] text-white rounded hover:bg-[#2a5357]"
          >
            Reintentar
          </button>
        </div>
      </div>

      <!-- Product content -->
      <div v-else-if="product">
        <!-- Encabezado -->
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center">
            <button @click="closeDetail" class="text-gray-600 hover:text-gray-800">
              <ChevronLeftIcon class="w-6 h-6" />
            </button>
            <h2 class="text-xl font-semibold ml-2">Detalle del Producto</h2>
          </div>
          
          <!-- Botones de editar y eliminar (solo si es el propietario) -->
          <div v-if="canEditDelete" class="flex space-x-2">
            <button
              @click="handleEdit"
              class="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
              title="Editar publicación"
            >
              <PencilIcon class="w-5 h-5" />
            </button>
            <button
              @click="handleDelete"
              class="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
              title="Eliminar publicación"
            >
              <TrashIcon class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Imagen -->
        <img
          :src="product.multimedia?.[0] || product.imageUrl || '/placeholder.jpg'"
          alt="Imagen del producto"
          class="w-full object-contain"
        />

        <!-- Metadata -->
        <div class="mt-4 text-sm text-gray-500">
          Publicado hace <span class="font-semibold">{{ daysAgo }}</span> día(s)
          <div class="mt-2 flex justify-between items-center">
            <div>
              <span class="font-bold">{{ primaryCategory }}</span>
              <span class="ml-2">{{ primarySubcategory }}</span>
            </div>
            <div class="flex items-center text-yellow-500">
              <StarIcon class="w-5 h-5" />
              <span class="ml-1 text-gray-600">{{ product.rating ?? '—' }}/5</span>
            </div>
          </div>
        </div>

        <!-- Título -->
        <h3 class="mt-4 text-lg font-semibold">{{ title }}</h3>

        <!-- Tienda -->
        <div class="mt-4 flex items-center text-sm text-gray-600">
          <span class="font-semibold">Visitar:</span>
          <span class="ml-1">
            <template
              v-if="
                product.perfil_negocio_id &&
                product.seller &&
                product.seller.toLowerCase() !== 'particular'
              "
            >
              <button
                @click="navegarAPerfilNegocio"
                class="text-[#204347] hover:text-[#2a5357] underline font-medium"
              >
                {{ product.seller }}
                <span v-if="isOwner" class="ml-1 text-xs text-gray-500">(Tu perfil)</span>
              </button>
            </template>

            <template v-else-if="product.seller && product.seller !== '—'">
              <span>{{ product.seller }}</span>
            </template>

            <template v-else>
              Sin perfil de negocio registrado
            </template>
          </span>
        </div>

        <!-- Descripción -->
        <div class="mt-4">
          <h4 class="font-semibold">Descripción</h4>
          <p class="text-gray-600 mt-2">{{ description }}</p>
        </div>

        <hr class="my-4" />

        <!-- Precio y Contacto -->
        <div class="text-gray-800">
          <div>Precio: <span class="font-semibold">{{ price }}</span></div>
          <div class="mt-4 space-y-2">
            <div class="flex items-center">
              <EnvelopeIcon class="w-5 h-5 mr-2" />
              <a
                :href="`mailto:${contactEmail}`"
                class="underline break-all"
              >
                {{ contactEmail }}
              </a>
            </div>
            <div class="flex items-center">
              <PhoneIcon class="w-5 h-5 mr-2" />
              <span>{{ contactPhone }}</span>
            </div>
          </div>
        </div>

        <!-- Botón Contactar (solo si no es el propietario) -->
        <button
          v-if="!isOwner"
          class="mt-6 w-full py-2 bg-[#204347] text-white rounded flex items-center justify-center hover:bg-[#2a5357]"
          @click="handleContact"
        >
          Contactar
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            class="w-5 h-5 ml-2"
            fill="currentColor"
          >
            <path d="M380.9 97.1C339.4 55.6 283.1 32 224 32 100.3 32 0 132.3 0 256c0 45.2 12.3 89.5 35.7 128.4L0 480l99.7-33.1c37.2 20.5 79.2 31.2 124.3 31.2 123.7 0 224-100.3 224-224 0-59.1-23.6-115.4-67.1-157.1zm-156.9 338.7c-38.6 0-76.4-10.4-108.8-30l-7.8-4.6-58.9 19.5 19.8-57.4-5-8c-22-35.3-33.6-75.8-33.6-117.2 0-113.3 92.1-205.4 205.4-205.4 54.8 0 106.2 21.3 144.8 60 38.5 38.6 59.8 89.9 59.8 144.7-.1 113.3-92.2 205.4-205.3 205.4zm101.2-138.4c-5.6-2.8-33.2-16.4-38.3-18.3-5-1.9-8.6-2.8-12.2 2.8-3.6 5.6-13.9 18.3-17 22.1-3.1 3.8-6.3 4.3-11.9 1.5-32.3-16.1-53.4-28.8-74.9-65-5.7-9.8 5.7-9.1 16.3-30.4 1.8-3.7-.9-6.9-.5-9.7-1.5-2.8-12.2-29.4-16.7-40.3-4.4-10.9-8.9-9.4-12.2-9.6-3.2-.2-6.8-.2-10.4-.2-3.6 0-9.4 1.3-14.3 6.6-4.9 5.3-18.7 18.3-18.7 44.6 0 26.3 19.1 51.7 21.8 55.3 2.7 3.6 38.1 58.1 92.3 81.5 54.2 23.4 54.2 15.6 64-14.6 9.8-30.2 39.5-49.8 41.2-53.4 1.7-3.6 1.7-6.7 1.2-7.3z" />
          </svg>
        </button>
      </div>
    </div>
  </div>

  <!-- Modal de confirmación de eliminación -->
  <ConfirmDeleteModal
    v-if="showDeleteModal"
    :loading="deleteLoading"
    @confirm="confirmDelete"
    @cancel="showDeleteModal = false"
  />

  <!-- Modal de edición -->
  <EditPublication
    v-if="showEditModal && product"
    :publicacion-id="product.id"
    @close="handleEditClose"
  />
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useNuxtApp } from '#app';
import {
  ChevronLeftIcon,
  StarIcon,
  EnvelopeIcon,
  PhoneIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/vue/24/solid';
import ConfirmDeleteModal from '@/components/modal/ConfirmDeleteModal.vue'
import EditPublication from '@/components/Publicaciones/EditPublication.vue';

interface Product {
  id: number;
  titulo?: string;
  title?: string;
  descripcion?: string;
  description?: string;
  precio?: number;
  price?: string;
  multimedia?: string[];
  imageUrl?: string;
  contacto_correo?: string;
  contacto_telefono?: string;
  contact?: string;
  phone?: string;
  categorias?: string[];
  category?: string;
  subcategorias?: string[];
  subcategory?: string[];
  creado_en?: string;
  perfil_negocio_id?: number | null | string;
  seller?: string;
  rating?: number;
  vendedor_id?: number;
  usuario_id?: number;
}

interface Props {
  productId: number | string;
  showEditDelete?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showEditDelete: false
});

const emit = defineEmits<{
  close: [];
  publicationDeleted: [id: number | string];
  publicationUpdated: [];
}>();

const router = useRouter();
const { $axios } = useNuxtApp();

const product = ref<Product | null>(null);
const loading = ref<boolean>(false);
const error = ref<string | null>(null);
const showDeleteModal = ref<boolean>(false);
const deleteLoading = ref<boolean>(false);
const showEditModal = ref<boolean>(false);
const currentUserProfile = ref<any>(null);

// Función para obtener el perfil del usuario actual
async function fetchCurrentUserProfile(): Promise<void> {
  try {
    const token = localStorage.getItem('token');
    if (!token) return;

    const response = await $axios.get('/vendedor/perfil', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    currentUserProfile.value = response.data;
  } catch (err) {
    console.error('Error fetching current user profile:', err);
  }
}

// Computed para determinar si el usuario actual es el propietario
const isOwner = computed<boolean>(() => {
  if (!product.value || !currentUserProfile.value) return false;
  
  // Comparar el perfil_negocio_id de la publicación con el id del perfil del usuario actual
  return String(product.value.perfil_negocio_id) === String(currentUserProfile.value.id);
});

// Computed para determinar si puede editar/eliminar
const canEditDelete = computed<boolean>(() => {
  if (!props.showEditDelete || !product.value) return false;
  return isOwner.value;
});

async function fetchProduct(): Promise<void> {
  const token = localStorage.getItem('token');
  loading.value = true;
  error.value = null;

  try {
    console.log('Fetching product with ID:', props.productId);
    
    const response = await $axios.get<{ publicacion: Product }>(
      `/publicaciones/${props.productId}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    
    product.value = response.data.publicacion;
    console.log('Product loaded:', product.value);
    
  } catch (err: any) {
    console.error('Error fetching product:', err);
    if (err.response) {
      error.value = `Error ${err.response.status}: ${err.response.data?.message || err.response.statusText}`;
    } else {
      error.value = err.message || 'Error desconocido';
    }
  } finally {
    loading.value = false;
  }
}

function closeDetail(): void {
  emit('close');
}

function navegarAPerfilNegocio(): void {
  if (!product.value?.perfil_negocio_id) return;
  
  emit('close');
  
  // Si es el propietario, navegar a su perfil sin restricciones
  if (isOwner.value) {
    router.push('/PerfilNegocio');
  } else {
    // Si no es el propietario, navegar como visitante
    router.push({
      path: '/PerfilNegocio',
      query: {
        id: product.value.perfil_negocio_id,
        from: 'details'
      }
    });
  }
}

function handleEdit(): void {
  console.log('Opening edit modal for product:', product.value?.id);
  if (!product.value?.id) {
    console.error('No product ID available for editing');
    return;
  }
  showEditModal.value = true;
}

function handleDelete(): void {
  showDeleteModal.value = true;
}

async function confirmDelete(): Promise<void> {
  if (!product.value) return;
  
  deleteLoading.value = true;
  
  try {
    const token = localStorage.getItem('token');
    await $axios.delete(`/vendedor/publicaciones/${product.value.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    showDeleteModal.value = false;
    emit('publicationDeleted', product.value.id);
    emit('close');
  } catch (err: any) {
    console.error('Error eliminando publicación:', err);
    error.value = err.response?.data?.message || 'Error al eliminar la publicación';
  } finally {
    deleteLoading.value = false;
  }
}

function handleEditClose(): void {
  console.log('Edit modal closed');
  showEditModal.value = false;
  emit('publicationUpdated');
  // Recargar los datos del producto después de editar
  fetchProduct();
}

function handleContact(): void {
  if (contactPhone.value && contactPhone.value !== '—') {
    window.location.href = `https://wa.me/${contactPhone.value}`;
  }
}

// Computed properties
const daysAgo = computed<number>(() => {
  if (!product.value?.creado_en) return 0;
  const diff = Date.now() - new Date(product.value.creado_en).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
});

const title = computed<string>(() => 
  product.value?.titulo ?? product.value?.title ?? '—'
);

const description = computed<string>(() => 
  product.value?.descripcion ?? product.value?.description ?? '—'
);

const price = computed<string>(() => 
  product.value?.precio != null ? `$${product.value.precio}` : product.value?.price ?? '—'
);

const contactEmail = computed<string>(() => 
  product.value?.contacto_correo ?? product.value?.contact ?? '—'
);

const contactPhone = computed<string>(() => 
  product.value?.contacto_telefono ?? product.value?.phone ?? '—'
);

const primaryCategory = computed<string>(() => 
  product.value?.categorias?.[0] ?? product.value?.category ?? '—'
);

const primarySubcategory = computed<string>(() =>
  product.value?.subcategorias?.[0] 
    ?? (Array.isArray(product.value?.subcategory) ? product.value.subcategory[0] : product.value?.subcategory)
    ?? '—'
);

onMounted(async () => {
  console.log('ProductDetail mounted with productId:', props.productId);
  await Promise.all([
    fetchProduct(),
    fetchCurrentUserProfile()
  ]);
});
</script>

<style scoped>
@keyframes spin {
  to { transform: rotate(360deg); }
}
.animate-spin { animation: spin 1s linear infinite; }
</style>