<template>
  <!-- Fondo oscuro para el modal -->
  <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <!-- Contenedor del modal (formulario) -->
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-xs  sm:max-w-xl">
      <!-- Título del modal -->
      <h2 class="text-2xl font-bold text-[#204347] text-center mb-6">Recuperación de contraseña</h2>

      <!-- Formulario de recuperación -->
      <form @submit.prevent="handleSubmit">
        <p class="text-center text-sm text-gray-500 mb-4">
          Introduzca su correo electrónico para recuperar su contraseña.
        </p>
        <div class="mb-4">
          <label for="email" class="block text-sm font-semibold text-gray-700">Correo Electrónico</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="ej: usuario@gmail.com"
            class="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#204347]"
            required
          >
        </div>
        <!-- Usando el componente PrimaryButton en lugar del botón normal -->
        <PrimaryButton
          :buttonClass="'w-full py-2 mt-6 text-white bg-[#204347] rounded-lg hover:bg-[#204347]'"
          @click="handleSubmit"
        >
          Aceptar
        </PrimaryButton>
      </form>
      <!-- Botón para cerrar el modal -->
      <div class="mt-4 text-center">
        <button class="text-sm text-gray-600 hover:underline" @click="closeModal">
          Cerrar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PrimaryButton from '@/components/primaryButton.vue';

// Definir la emisión del evento 'close' en el componente
const emit = defineEmits<{
  (e: 'close'): void;
}>();

// Definir las propiedades para email y la función handleSubmit
const email = ref<string>('');

// Lógica para manejar el envío del formulario
const handleSubmit = (): void => {
  console.log("Correo para recuperación:", email.value);
  // Aquí podrías agregar la lógica para hacer una petición de recuperación de contraseña
  closeModal(); // Cerrar el modal después de enviar
};

// Función para cerrar el modal
const closeModal = (): void => {
  emit('close'); // Emitir el evento 'close' para cerrar el modal desde el componente padre
};
</script>

<style scoped>
/* Puedes agregar estilos adicionales si lo necesitas */
</style>
