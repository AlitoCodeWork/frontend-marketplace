<template>
  <div class="fixed inset-0 bg-gray-500 bg-opacity-50 z-50 flex">
    <div class="min-h-screen bg-white w-full sm:w-[600px] md:w-[500px] lg:w-[400px] xl:w-[500px] rounded-lg p-6 max-h-[90vh] overflow-y-auto">
      <!-- Encabezado con flecha para cerrar -->
      <div class="flex items-center justify-center mt-4">
        <button @click="close" class="text-gray-600 hover:text-gray-800">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-8 h-8">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5l-7 7 7 7" />
          </svg>
        </button>
        <h2 class="text-xl font-semibold text-center">Crear Perfil de Negocio</h2>
      </div>

      
       <!-- Imagen -->
      <div class="flex justify-center mt-8">
        <label for="product-image" class="cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-12 h-12 text-gray-600">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h14l4 4m0 0l4-4m-4 4V3H3v11h14z" />
          </svg>
          <input
            type="file"
            id="product-image"
            class="hidden"
            @change="handleImageChange"
            accept="image/*"
          />
        </label>
      </div>

      

      <!-- Formulario -->
      <form @submit.prevent="submitForm">
        <div class="mt-4">
          <label for="nombre_negocio" class="block text-sm font-medium text-gray-700">Nombre del negocio</label>
          <input
            type="text"
            id="nombre_negocio"
            v-model="form.nombre_negocio"
            class="mt-1 p-2 w-full border rounded-lg"
            placeholder="Escribe el nombre del negocio"
            required
          />
        </div>

        <div class="mt-4">
          <label for="descripcion" class="block text-sm font-medium text-gray-700">Descripción del negocio</label>
          <textarea
            id="descripcion"
            v-model="form.descripcion"
            class="mt-1 p-2 w-full border rounded-lg"
            placeholder="Describe brevemente tu negocio"
            required
          />
        </div>

        <div class="mt-4">
          <label for="direccion" class="block text-sm font-medium text-gray-700">Dirección del negocio</label>
          <input
            type="text"
            id="direccion"
            v-model="form.direccion"
            class="mt-1 p-2 w-full border rounded-lg"
            placeholder="Ingrese la dirección del negocio"
            required
          />
        </div>

        <!-- Datos de contacto -->
        <div class="mt-4">
          <label for="correo" class="block text-sm font-medium text-gray-700">Correo Electrónico</label>
          <input
            type="email"
            id="correo_contacto"
            v-model="form.contacto_correo"
            class="mt-1 p-2 w-full border rounded-lg"
            placeholder="ej: negocio@correo.com"
            required
          />
        </div>

        <div class="mt-4">
          <label for="contacto" class="block text-sm font-medium text-gray-700">Teléfono</label>
          <input
            type="text"
            id="contacto"
            v-model="form.contacto_telefono"
            class="mt-1 p-2 w-full border rounded-lg"
            placeholder="ej: 0949954954"
            required
          />
        </div>

        <!-- Datos de acceso -->
        <div class="mt-4">
          <label for="correo" class="block text-sm font-medium text-gray-700">Correo Electrónico (Acceso)</label>
          <input
            type="email"
            id="correo"
            v-model="form.correo"
            class="mt-1 p-2 w-full border rounded-lg"
            placeholder="ej: usuario@correo.com"
            required
          />
        </div>

        <div class="mt-4">
          <label for="password" class="block text-sm font-medium text-gray-700">Contraseña</label>
          <input
            type="password"
            id="password"
            v-model="form.password"
            class="mt-1 p-2 w-full border rounded-lg"
            placeholder="Proporcione una contraseña segura"
            required
          />
        </div>

        <div class="mt-4">
          <label for="confirm-password" class="block text-sm font-medium text-gray-700">Confirmar Contraseña</label>
          <input
            type="password"
            id="confirm-password"
            v-model="form.confirmPassword"
            class="mt-1 p-2 w-full border rounded-lg"
            placeholder="Confirme su contraseña"
            required
          />
        </div>

        <!-- Campos de latitud y longitud con valores predeterminados -->
        <div class="mt-4">
          <label for="latitud" class="block text-sm font-medium text-gray-700">Latitud</label>
          <input
            type="text"
            id="latitud"
            v-model="form.latitude"
            class="mt-1 p-2 w-full border rounded-lg"
            placeholder="Latitud"
            required
          />
        </div>

        <div class="mt-4">
          <label for="longitud" class="block text-sm font-medium text-gray-700">Longitud</label>
          <input
            type="text"
            id="longitud"
            v-model="form.longitude"
            class="mt-1 p-2 w-full border rounded-lg"
            placeholder="Longitud"
            required
          />
        </div>

        <!-- Botón de publicación centrado y bajado -->
        <button
          type="submit"
          class="mt-8 mb-4 bg-[#204347] text-white py-2 px-4 rounded-md w-full flex items-center justify-center space-x-2"
        >
          <span>Crear Perfil</span>
        </button>
      </form>
    </div>
  </div>
</template>
<script setup>
import { reactive } from 'vue';
import { useNuxtApp } from '#app';

const { $axios } = useNuxtApp();

const form = reactive({
  nombre_negocio: '',
  direccion: '',
  correo: '',
  password: '',
  confirmPassword: '',
  image: null,
  contacto_telefono:'',
  contacto_email:'',
  longitude:'',
  latitude:'',
  descripcion:''
});

const handleImageChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      alert('Por favor, sube una imagen en formato JPEG o PNG');
      return;
    }
    if (file.size > 5 * 1024 * 1024) { // Limitar el tamaño máximo a 5MB
      alert('La imagen no debe exceder los 5MB');
      return;
    }
    form.image = file; // Guardar la imagen seleccionada
  }
};

const submitForm = async () => {
  try {
    // Crear el FormData
    const formData = new FormData();
    formData.append('nombre_negocio', form.nombre_negocio);
    formData.append('direccion', form.direccion);
    formData.append('correo', form.correo);
    formData.append('password', form.password);
    formData.append('descripcion', form.descripcion);
    formData.append('contacto_correo', form.contacto_correo);
    formData.append('contacto_telefono', form.contacto_telefono);
   
    formData.append('longitude', form.longitude);
    formData.append('latitude', form.latitude);
    
    // Agregar imagen solo si está presente
    if (form.image) {
      formData.append('imagen', form.image); 
    }

    // Imprimir en consola los datos que se enviarán al backend
    console.log('Datos enviados al backend:', {
      nombre_negocio: form.nombre_negocio,
      direccion: form.direccion,
      correo: form.correo,
      password: form.password,
      descripcion: form.descripcion,
      imagen: form.image ? form.image.name : 'No hay imagen',
    });

    // Enviar la solicitud POST
    const response = await $axios.post('http://localhost:4000/vendedor/register', formData);
    alert('Perfil creado con éxito');
  } catch (err) {
    console.error('Error al crear el perfil:', err);
    alert('Hubo un error al crear el perfil');
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
</style>
