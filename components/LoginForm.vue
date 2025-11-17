<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white w-full max-w-md p-6 rounded-lg relative">
      <!-- Cerrar -->
      <button
        class="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        @click="emitClose"
      >
        ✕
      </button>

      <h2 class="text-center text-2xl font-semibold mb-6">
        Iniciar sesión
      </h2>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium">Correo Electrónico</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="usuario@ejemplo.com"
            class="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#204347]"
            required
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium">Contraseña</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="••••••••"
            class="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#204347]"
            required
          />
        </div>

        <button
          type="submit"
          class="w-full py-2 bg-[#204347] text-white rounded hover:opacity-90"
        >
          Iniciar sesión
        </button>
      </form>

      <div class="mt-4 text-center">
        <button
          @click="showForgot = true"
          class="text-sm text-gray-600 hover:underline"
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>
    </div>

    <!-- Modal de recuperación -->
    <RecoverPasswordModal
      v-if="showForgot"
      @close="showForgot = false"
      @recovered="onRecovered"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import RecoverPasswordModal from './RecoverPassword.vue';

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'login-success', payload: { token: string; user: any }): void;
  (e: 'recovered'): void;
}>();

const router = useRouter();
const config = useRuntimeConfig();
const { $axios } = useNuxtApp() as any; // Casting temporal

const email = ref('');
const password = ref('');
const showForgot = ref(false);

function emitClose() {
  emit('close');
}

async function handleSubmit() {
  try {
    const adminResp = await $axios.post('/admin/login', {
      correo: email.value,
      password: password.value,
    });
    const admin = adminResp.data.admin;
    onLoginSuccess(adminResp.data.token, {
      ...admin,
      isAdmin: !!admin.is_admin,
    });
    return;
  } catch (err: any) {
    if (err.response?.status !== 401) {
      console.error('Error login admin:', err);
      alert(err.response?.data?.mensaje || 'Error en el login');
      return;
    }
  }

  try {
    const vendResp = await $axios.post('/vendedor/login', {
      correo: email.value,
      password: password.value,
    });
    const perfil = vendResp.data.perfil;
    onLoginSuccess(vendResp.data.token, {
      ...perfil,
      esVendedor: true,
    });
  } catch (err: any) {
    console.error('Error login vendedor:', err);
    alert(err.response?.data?.mensaje || 'Credenciales inválidas.');
  }
}

function onLoginSuccess(token: string, user: any) {
  if (process.client) {
    localStorage.setItem('token', token);
  }
  emit('login-success', { token, user });
  emit('close');
  const isAdmin = !!user.isAdmin;
  router.push(isAdmin ? '/DashboardPublicaciones' : '/DashboardPublicaciones');
}

function onRecovered() {
  showForgot.value = false;
  emit('recovered');
}
</script>

<style scoped>
/* Tailwind cubre la mayor parte */
</style>
