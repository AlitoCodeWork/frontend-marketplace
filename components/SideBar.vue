<template>
  <div class="fixed top-0 ml-[90px] h-full w-[78%] bg-white z-50 shadow-lg">
    <!-- Botón de cerrar -->
    <button
      @click="$emit('close')"
      class="absolute top-4 left-4 text-gray-600 hover:text-gray-800"
    >
      <XMarkIcon class="w-6 h-6" />
    </button>

    <!-- Contenido -->
    <div class="pt-16 px-6 flex flex-col h-full space-y-8">
      <!-- Páginas -->
      <div>
        <h3 class="text-lg font-semibold mb-4">Páginas</h3>
        <ul class="space-y-3 text-gray-600">
          <li class="flex items-center space-x-3">
            <DocumentTextIcon class="w-5 h-5 text-gray-500" />
            <a href="#" class="hover:text-gray-800">Publicaciones</a>
          </li>
          <li class="flex items-center space-x-3">
            <ClipboardDocumentCheckIcon class="w-5 h-5 text-gray-500" />
            <a href="#" class="hover:text-gray-800">Términos de uso</a>
          </li>
          <li class="flex items-center space-x-3">
            <LockClosedIcon class="w-5 h-5 text-gray-500" />
            <a href="#" class="hover:text-gray-800">Política de privacidad</a>
          </li>
          <li class="flex items-center space-x-3">
            <UserCircleIcon class="w-5 h-5 text-gray-500" />
            <a href="#" class="hover:text-gray-800">Mi Cuenta</a>
          </li>
        </ul>
      </div>

      <!-- Botón de registrar -->
      <PrimaryButton
          :buttonClass="'w-[200px] text-center ml-6 py-2 px-6 bg-[#204347] text-white rounded-lg hover:bg-[#204347]'"
          @click="handleSubmit"
        >
          Registrar Negocio
        </PrimaryButton>
    </div>
  </div>
</template>

<script>
import {
  XMarkIcon,
  DocumentTextIcon,
  ClipboardDocumentCheckIcon,
  LockClosedIcon,
  UserCircleIcon,
} from '@heroicons/vue/24/outline';

export default {
  name: 'Sidebar',
  components: {
    XMarkIcon,
    DocumentTextIcon,
    ClipboardDocumentCheckIcon,
    LockClosedIcon,
    UserCircleIcon,
  },
};
</script>
