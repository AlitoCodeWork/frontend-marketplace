<template>
  <div>
    <Navbar @toggle-sidebar="isSidebarOpen = true" @create-publication="openCreatePublication" @register-business="openRegisterProfile" @create-publication-business="openCreateBusinessPublication" @perfilNegocio="openPerfilNegocio" @open-admin-panel="openAdminPanel" />

    <!-- Sidebar -->
    <Sidebar v-if="isSidebarOpen" @close="isSidebarOpen = false" />

    <!-- Contenedor principal -->
    <div class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Filtros -->
        <div class="w-full lg:w-1/4 hidden lg:block">
          <Tagscategories @filter="filterProducts" />
        </div>

        <!-- Publicaciones -->
        <div class="w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <Car
            v-for="(product, index) in filteredProducts"
            :key="index"
            :product="product"
            @open-detail="openProductDetail"
          />
        </div>
      </div>
    </div>

    <!-- Footer -->
    <Footer />

    <!-- Detalle del producto - MODIFICADO AQUÍ -->
    <DetalleProducto
      v-if="isProductDetailVisible"
      :product-id="selectedProductId"
      api-base-url="/api"
      @close="closeProductDetail"
    />

    <!-- Formulario para crear publicación -->
    <CrearPublicacion
      v-if="isCreatePublicationVisible"
      @close="closeCreatePublication"
    />

    <CreateBusinessPublication
      v-if="isCreateBusinessPublicationVisible"
      @close="closeCreatePublicationBusiness"
    />

    <!-- Formulario para registrar negocio -->
    <RegistrarPerfil
      v-if="isRegisterProfileVisible" 
      @close="closeRegisterProfile"
    />

    <PerfilNegocio
      v-if="isPerfilNegocio" 
      @close="closePerfilNegocio"
    />

    

    
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useNuxtApp } from '#app'
import Navbar from '@/components/navbar.vue'
import Sidebar from '@/components/SideBar.vue'
import Tagscategories from '@/components/Tagscategories.vue'
import Car from '@/components/Card.vue'
import Footer from '@/components/footer.vue'
import DetalleProducto from '@/components/DetalleProducto.vue'
import CrearPublicacion from '../components/Publicaciones/CrearPublicacion'
import RegistrarPerfil from '../components/RegistrarPerfil' 
import CreateBusinessPublication from '../components/Publicaciones/CreateBusinessPublication'  
import PerfilNegocio from '../pages/perfilNegocio'
import AdminPanel from '../components/Admin/PanelAdministracion'

export default {
  name: 'DashboardPublicaciones',
  components: {
    Navbar,
    Sidebar,
    Tagscategories,
    Car,
    Footer,
    DetalleProducto,
    CrearPublicacion,
    RegistrarPerfil,
    CreateBusinessPublication, 
    PerfilNegocio,
    AdminPanel 
  },
  setup() {
    const isRegisterProfileVisible = ref(false)
    const isSidebarOpen = ref(false)
    const isProductDetailVisible = ref(false)
    const isCreatePublicationVisible = ref(false)  
    const isCreateBusinessPublicationVisible = ref(false)
    const isPerfilNegocio =ref(false)
    const openPerfilNegocio = () => { isPerfilNegocio.value = true }
    const closePerfilNegocio = () => { isPerfilNegocio.value = false }
    const openAdminPanel = () => { isAdminPanel.value = true }
    const closeAdminPanel = () => { isAdminPanel.value = false }
    
    
    // CAMBIO: Guardamos solo el ID del producto seleccionado
    const selectedProductId = ref(null)
    const products = ref([])

    // Variables para los filtros
    const categoriesFilter = ref([]) 
    const subcategoriesFilter = ref([]) 

    const { $axios } = useNuxtApp()

    // Obtener publicaciones
    onMounted(async () => {
      try {
        const response = await $axios.get('/publicaciones') 
        const data = response.data.publicaciones

        products.value = data.map(pub => ({
          title: pub.titulo,
          price: `$${pub.precio}`,
          imageUrl: pub.multimedia?.[0] || '/placeholder.jpg',
          description: pub.descripcion,
          seller: pub.perfil_negocio_id ? pub.seller : '—',  
          category: pub.categoria,
          subcategory: pub.subcategorias,
          rating: 4,
          ...pub,
        }))
      } catch (error) {
        console.error('Error al cargar publicaciones:', error)
      }
    })

    // CAMBIO: Abrir detalle del producto - solo guardamos el ID
    const openProductDetail = (product) => {
      selectedProductId.value = product.id
      isProductDetailVisible.value = true
    }

    // Cerrar detalle del producto
    const closeProductDetail = () => {
      isProductDetailVisible.value = false
      selectedProductId.value = null
    }

    // Abrir formulario de crear publicación
    const openCreatePublication = () => {
      isCreatePublicationVisible.value = true
    }
    
    const openCreateBusinessPublication = () => {
      isCreateBusinessPublicationVisible.value = true
    }

    // Cerrar formulario de crear publicación
    const closeCreatePublication = () => {
      isCreatePublicationVisible.value = false
    }
    
    const closeCreatePublicationBusiness = () => {
      isCreateBusinessPublicationVisible.value = false
    }

    // Abrir formulario de registrar perfil de negocio
    const openRegisterProfile = () => {
      isRegisterProfileVisible.value = true
    }

    // Cerrar formulario de registrar perfil de negocio
    const closeRegisterProfile = () => {
      isRegisterProfileVisible.value = false
    }

    

    

    

    // Filtrar publicaciones según las categorías y subcategorías seleccionadas
    const filterProducts = (categories, subcategories) => {
      categoriesFilter.value = categories
      subcategoriesFilter.value = subcategories
    }

    // Computed para las publicaciones filtradas
    const filteredProducts = computed(() => {
      let filtered = products.value
      if (categoriesFilter.value.length > 0) {
        filtered = filtered.filter(product =>
          categoriesFilter.value.includes(product.category)
        )
      }
      if (subcategoriesFilter.value.length > 0) {
        filtered = filtered.filter(product =>
          subcategoriesFilter.value.some(subcat =>
            product.subcategory.includes(subcat)
          )
        )
      }
      return filtered
    })

    return {
      isSidebarOpen,
      isProductDetailVisible,
      isCreatePublicationVisible,
      isRegisterProfileVisible,
      isPerfilNegocio,
      selectedProductId, // CAMBIO: Exportamos el ID en lugar del objeto
      products,
      filteredProducts,
      openProductDetail,
      closeProductDetail,
      filterProducts,
      openCreatePublication,
      closeCreatePublication,
      openRegisterProfile,
      closeRegisterProfile,
      openCreateBusinessPublication,
      closeCreatePublicationBusiness,
      isCreateBusinessPublicationVisible,
      openPerfilNegocio, 
      closePerfilNegocio,
      openAdminPanel,
      closeAdminPanel


    }
  }
}
</script>