<template>
  <div class="bg-white relative">
    <!-- Logo -->
    <div class="absolute top-4 left-[200px] flex items-center">
      <ShoppingBagIcon class="w-8 h-8 text-[#204347]" />
    </div>

    <div class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <!-- Buscador + Botones (escritorio) -->
      <div class="flex flex-col lg:flex-row gap-4 justify-between lg:items-center pb-4">
        <div class="flex flex-col lg:flex-row gap-4 justify-end w-full lg:items-center">
          <!-- Buscador escritorio -->
          <div class="hidden lg:block relative w-72">
            <input
              type="text"
              placeholder="Buscar"
              v-model="searchTerm"
              class="w-full h-9 py-1 pl-4 pr-10 border rounded-full focus:outline-none"
            />
            <button
              @click="handleSearch"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <MagnifyingGlassIcon class="w-5 h-5" />
            </button>
          </div>

          <!-- Realizar Publicación -->
          <TertiaryButton
            v-if="userType === 'client'"
            :buttonClass="'py-2 px-4 h-8 border border-gray-700 rounded-lg hover:bg-[#204347] hover:text-white'"
            @click="openCreatePublication"
          >
            Realizar Publicación
          </TertiaryButton>
          <TertiaryButton
            v-if="userType === 'business'"
            :buttonClass="'py-2 px-4 h-8 border border-gray-700 rounded-lg hover:bg-[#204347] hover:text-white'"
            @click="openCreatePublicationBusiness"
          >
            Realizar Publicación
          </TertiaryButton>

          <!-- Registrar Negocio -->
          <PrimaryButton
            v-if="userType === 'client'"
            :buttonClass="'py-2 px-4 h-8 bg-[#204347] text-white rounded-lg hover:bg-[#16675c]'"
            @click="handleRegisterClick"
          >
            Registrar Negocio
          </PrimaryButton>

          <!-- Mi Perfil de Negocio -->
          <PrimaryButton
            v-if="userType === 'business'"
            :buttonClass="'py-2 px-4 h-8 bg-[#204347] text-white rounded-lg hover:bg-[#16675c]'"
            @click="handleProfileClick"
          >
            Mi Perfil de Negocio
          </PrimaryButton>

          <!-- Ajustes -->
          <PrimaryButton
            v-if="userType === 'admin'"
            :buttonClass="'py-2 px-4 h-8 bg-[#204347] text-white rounded-lg hover:bg-[#16675c]'"
            @click="handleSettingsClick"
          >
            Ajustes
          </PrimaryButton>

          <!-- Autenticarse / Cerrar Sesión -->
          <PrimaryButton
            v-if="!isAuthenticated"
            :buttonClass="'py-2 px-4 h-8 border rounded-lg hover:bg-[#204347] hover:text-white'"
            @click="handleLoginClick"
          >
            Autenticarse
          </PrimaryButton>
          
          <PrimaryButton
            v-if="isAuthenticated"
            :buttonClass="'py-2 px-4 h-8 border rounded-lg hover:bg-[#204347] hover:text-white'"
            @click="handleLogout"
          >
            Cerrar Sesión
          </PrimaryButton>
        </div>
      </div>

      <!-- Separador -->
      <div class="border-b-2 border-gray-300 w-full mt-2 mb-4"></div>

      <!-- Mapa y Navegación -->
      <div class="hidden lg:flex justify-between items-center mb-4">
        <button
          class="flex items-center text-sm text-[#204347] hover:text-white hover:bg-[#204347] px-3 py-1 rounded-lg"
          @click="handleViewMap"
        >
          <MapPinIcon class="w-5 h-5 mr-1" />
          Ver Mapa
        </button>
        <div class="flex space-x-8 text-l">
          <a href="#" class="bg-gray-300 px-2 rounded">Publicaciones</a>
          <a href="#">Términos de uso</a>
          <a href="#">Sobre Marketplace x</a>
        </div>
      </div>

      <!-- Formularios flotantes -->
      <RegistrarPerfil v-if="showRegistrarPerfil" @close="showRegistrarPerfil = false" />
      <LoginForm
        v-if="showLoginForm"
        @close="showLoginForm = false"
        @login-success="onLoginSuccess"
      />
      <!-- Panel de Administración -->
      <AdminPanel
        v-if="showAdminPanel"
        :currentUser="currentUser"
        @close="showAdminPanel = false"
        @logout="handleLogout"
      />

      <!-- Botón menú móvil -->
      <button
        @click="toggleSidebar"
        class="lg:hidden absolute top-4 right-4 text-gray-600 hover:text-gray-800"
      >
        <Bars3Icon class="w-6 h-6" />
      </button>

      <Sidebar
        v-if="showSidebar"
        @close="showSidebar = false"
        class="lg:hidden fixed top-0 right-0 w-full h-full z-40 bg-white shadow-lg"
      />
    </div>
  </div>
</template>

<script>
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  MapPinIcon,
} from '@heroicons/vue/24/solid';

import PrimaryButton   from '@/components/primaryButton.vue';
import SecondaryButton from '@/components/secondaryButton.vue';
import TertiaryButton  from '@/components/tertiaryButton.vue';
import Sidebar         from '@/components/SideBar.vue';
import RegistrarPerfil from '../components/RegistrarPerfil';
import LoginForm       from './LoginForm.vue';
import perfilNegocio   from '../pages/perfilNegocio';
import AdminPanel      from '../components/Admin/PanelAdministracion'

export default {
  name: 'Navbar',
  components: {
    Bars3Icon,
    MagnifyingGlassIcon,
    ShoppingBagIcon,
    MapPinIcon,
    PrimaryButton,
    SecondaryButton,
    TertiaryButton,
    Sidebar,
    RegistrarPerfil,
    LoginForm,
    perfilNegocio,
    AdminPanel
  },
  data() {
    return {
      searchTerm: '',
      showSidebar: false,
      userType: 'client',       // 'client' | 'business' | 'admin'
      showRegistrarPerfil: false,
      showLoginForm: false,
      isAuthenticated: false,
      currentUser: null,
      showAdminPanel: false,
    };
  },
  mounted() {
    // Verificar autenticación al montar el componente
    this.checkAuthentication();
  },
  methods: {
    // Verificar si el usuario está autenticado
    checkAuthentication() {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('userData');
      
      if (token && userData) {
        try {
          const user = JSON.parse(userData);
          this.isAuthenticated = true;
          this.currentUser = user;
          this.setUserType(user);
        } catch (error) {
          console.error('Error parsing user data:', error);
          this.clearAuthentication();
        }
      } else {
        this.clearAuthentication();
      }
    },
    
    // Establecer el tipo de usuario basado en los datos
    setUserType(user) {
      if (user.isAdmin) {
        this.userType = 'admin';
      } else if (user.esVendedor) {
        this.userType = 'business';
      } else {
        this.userType = 'client';
      }
    },
    
    // Limpiar datos de autenticación
    clearAuthentication() {
      this.isAuthenticated = false;
      this.currentUser = null;
      this.userType = 'client';
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
    },
    
    // Cerrar sesión
    handleLogout() {
      this.clearAuthentication();
      // Redirigir al inicio o página de login
      this.$router.push('/');
    },
    
    toggleSidebar() {
      this.showSidebar = !this.showSidebar;
    },
    
    handleSearch() {
      // lógica de búsqueda
    },
    
    openCreatePublication() {
      this.$emit('create-publication');
    },
    
    openCreatePublicationBusiness() {
      this.$emit('create-publication-business');
    },
    
    handleRegisterClick() {
      this.showRegistrarPerfil = true;
    },
    
    handleProfileClick() {
      const router = useRouter()
      router.push('/perfilNegocio')
    },
    
    handleSettingsClick() {
      const router =useRouter()
      router.push('open-admin-panel')
    },
    
    handleLoginClick() {
      this.showLoginForm = true;
    },
    
    handleViewMap() {
      // lógica para ver el mapa
    },
    
    onLoginSuccess({ token, user }) {
      // Guardar token y datos del usuario
      localStorage.setItem('token', token);
      localStorage.setItem('userData', JSON.stringify(user));
      
      // Actualizar estado del componente
      this.isAuthenticated = true;
      this.currentUser = user;
      this.setUserType(user);
      
      // Cerrar el formulario
      this.showLoginForm = false;
    }
  }
};
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
  background-color: rgba(0, 0, 0, 0.5);
}
.bg-white {
  max-width: 100%;
  margin: 0 auto;
}
</style>