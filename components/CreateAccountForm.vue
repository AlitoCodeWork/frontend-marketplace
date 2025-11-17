<template>
  <div class="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
    <h2 class="text-2xl font-semibold text-center text-[#204347] mb-6">Crear Cuenta</h2>
    <form @submit.prevent="handleSubmit" class="space-y-6 mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">

      <!-- Foto de perfil -->
      <div class="flex justify-center col-span-1 md:col-span-2">
        <div class="relative">
          <input type="file" id="profile-pic" class="absolute inset-0 opacity-0" />
          <button type="button" class="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
            <svg class="w-8 h-8 text-teal-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v3m0 0l3-3m-3 3l3 3m13-3v3m0 0l-3-3m3 3l-3 3M8 13v1m4-1v1m4-1v1" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Nombre -->
      <div class="col-span-1">
        <label for="name" class="block text-sm font-medium text-gray-700">Nombre</label>
        <input type="text" id="name" class="mt-1 p-2 w-full border border-gray-300 rounded-md" placeholder="Escriba su nombre" required />
      </div>

      <!-- Apellidos -->
      <div class="col-span-1">
        <label for="lastName" class="block text-sm font-medium text-gray-700">Apellidos</label>
        <input type="text" id="lastName" class="mt-1 p-2 w-full border border-gray-300 rounded-md" placeholder="Escriba sus apellidos" required />
      </div>

      <!-- Correo Electrónico -->
      <div class="col-span-1">
        <label for="email" class="block text-sm font-medium text-gray-700">Correo Electrónico</label>
        <input type="email" id="email" class="mt-1 p-2 w-full border border-gray-300 rounded-md" placeholder="ej: usuario@gmail.com" required />
      </div>

      <!-- Teléfono -->
      <div class="col-span-1">
        <label for="phone" class="block text-sm font-medium text-gray-700">Teléfono</label>
        <input type="tel" id="phone" class="mt-1 p-2 w-full border border-gray-300 rounded-md" placeholder="ej: 0039393939" required />
      </div>

      <!-- Contraseña -->
      <div class="col-span-1">
        <label for="password" class="block text-sm font-medium text-gray-700">Contraseña</label>
        <input type="password" id="password" class="mt-1 p-2 w-full border border-gray-300 rounded-md" placeholder="Escriba su contraseña" required />
      </div>

      <!-- Confirmación de contraseña -->
      <div class="col-span-1">
        <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirme su contraseña</label>
        <input type="password" id="confirmPassword" class="mt-1 p-2 w-full border border-gray-300 rounded-md" placeholder="Confirme su contraseña" required />
      </div>

      <!-- Botón de creación -->
      <div class="col-span-1 md:col-span-2 mt-4 flex justify-center">
        <button type="submit" class="w-full py-2 px-4 bg-[#204347] text-white rounded-lg hover:bg-[#163d39] focus:outline-none">
          Crear Cuenta
        </button>
      </div>

      <!-- Enlace para iniciar sesión -->
      <p class="mt-4 text-center text-sm text-gray-600 col-span-1 md:col-span-2">
        ¿Ya estás registrado? <a href="/login" class="text-teal-700 hover:underline">Iniciar sesión</a>
      </p>
    </form>
  </div>
</template>

<script>
export default {
  methods: {
    handleSubmit() {
      // Aquí agregarás la lógica para enviar los datos del formulario
      alert("Formulario enviado");
    }
  }
};
</script>

<style scoped>
/* Aquí puedes agregar estilos adicionales si lo necesitas */
</style>
