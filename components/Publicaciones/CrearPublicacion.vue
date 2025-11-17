<template>
  <div class="fixed inset-0 bg-gray-500 bg-opacity-50 z-50 flex">
    <div class="bg-white min-h-screen w-full sm:w-[600px] md:w-[500px] lg:w-[400px] xl:w-[500px] rounded-lg p-6 overflow-y-auto">
      <!-- Encabezado con flecha para cerrar -->
      <div class="flex items-center justify-center mt-4">
        <button @click="close" class="text-gray-600 hover:text-gray-800">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-8 h-8">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5l-7 7 7 7" />
          </svg>
        </button>
        <h2 class="text-xl font-semibold text-center">Crear Publicación</h2>
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
        <!-- Nombre, Descripción, Precio -->
        <div class="mt-4">
          <label for="product-name" class="block text-sm font-medium text-gray-700">Nombre del producto o servicio</label>
          <input
            type="text"
            id="product-name"
            v-model="form.name"
            class="mt-1 p-2 w-full border rounded-lg"
            placeholder="Escribe el nombre del producto"
            required
          />
        </div>

        <div class="mt-4">
          <label for="product-description" class="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea
            id="product-description"
            v-model="form.description"
            class="mt-1 p-2 w-full border rounded-lg"
            placeholder="Hable de los detalles de su producto"
            required
          />
        </div>

        <div class="mt-4">
          <label for="product-price" class="block text-sm font-medium text-gray-700">Precio del producto o servicio</label>
          <input
            type="number"
            id="product-price"
            v-model="form.price"
            class="mt-1 p-2 w-full border rounded-lg"
            placeholder="ej: 100.45"
            required
          />
        </div>

        <!-- Categoría -->
        <div class="mt-4">
          <label for="product-category" class="block text-sm font-medium text-gray-700">Categoría</label>
          <select
            id="product-category"
            v-model="form.category"
            class="mt-1 p-2 w-full border rounded-lg"
            required
            @change="filterSubcategories"
          >
            <option value="">Seleccionar categoría</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>

        <!-- Subcategoría -->
        <div class="mt-4">
          <label for="product-subcategory" class="block text-sm font-medium text-gray-700">Subcategoría</label>
          <select
            id="product-subcategory"
            v-model="form.subcategory"
            class="mt-1 p-2 w-full border rounded-lg"
            required
          >
            <option value="">Seleccionar subcategoría</option>
            <option v-for="subcategory in filteredSubcategories" :key="subcategory.id" :value="subcategory.id">
              {{ subcategory.name }}
            </option>
          </select>
        </div>

        <!-- Oferta y Descuento -->
        <div class="mt-4">
          <label for="product-oferta" class="block text-sm font-medium text-gray-700">Oferta</label>
          <input
            type="checkbox"
            id="product-oferta"
            v-model="form.oferta"
            class="mt-1 p-2"
          />
          <span class="text-sm text-gray-600">Marcar si el producto tiene una oferta.</span>
        </div>

        <div class="mt-4">
          <label for="product-descuento" class="block text-sm font-medium text-gray-700">Descuento</label>
          <input
            type="checkbox"
            id="product-descuento"
            v-model="form.descuento"
            class="mt-1 p-2"
          />
          <span class="text-sm text-gray-600">Marcar si el producto tiene descuento.</span>
        </div>

        <!-- Datos de contacto -->
        <div class="mt-4">
          <label for="email" class="block text-sm font-medium text-gray-700">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            v-model="form.email"
            class="mt-1 p-2 w-full border rounded-lg"
            placeholder="ej: usuario@gmail.com"
            required
          />
        </div>

        <div class="mt-4">
          <label for="phone" class="block text-sm font-medium text-gray-700">Teléfono</label>
          <input
            type="text"
            id="phone"
            v-model="form.phone"
            class="mt-1 p-2 w-full border rounded-lg"
            placeholder="ej: 0949954954"
            required
          />
        </div>

        <!-- Botón de publicación -->
        <button
          type="submit"
          class="mt-8 mb-4 bg-[#204347] text-white py-2 px-4 rounded-md w-full flex items-center justify-center space-x-2"
        >
          <span>Publicar</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineEmits } from 'vue'
import { useNuxtApp } from '#app'

const { $axios } = useNuxtApp()

const emit = defineEmits(['addNewPublication']) // Emitir evento al Dashboard

const form = ref({
  name: '',
  description: '',
  price: '',
  category: null,
  subcategory: null,
  email: '',
  phone: '',
  image: null, // Esta es la imagen seleccionada
  oferta: false,
  descuento: false,
})

const categories = ref([])  // Lista de categorías
const subcategories = ref([])  // Lista de subcategorías
const filteredSubcategories = ref([])  // Subcategorías filtradas

// Función para obtener las categorías
const fetchCategories = async () => {
  try {
    const res = await $axios.get('/public/categorias')
    categories.value = res.data.categorias.map(cat => ({
      id: cat.id,
      name: cat.nombre,
    }))
  } catch (err) {
    console.error('Error al obtener categorías:', err)
  }
}

// Función para obtener las subcategorías
const fetchSubcategories = async () => {
  try {
    const res = await $axios.get('/public/subcategorias')
    subcategories.value = res.data.subcategorias.map(sub => ({
      id: sub.id,
      name: sub.nombre,
      categoriaId: sub.categoria_id,
    }))
  } catch (err) {
    console.error('Error al obtener subcategorías:', err)
  }
}

// Filtrar subcategorías según la categoría seleccionada
const filterSubcategories = () => {
  filteredSubcategories.value = subcategories.value.filter(sub => sub.categoriaId === form.value.category)
}

// Llamar a las funciones cuando el componente se monte
onMounted(() => {
  fetchCategories()
  fetchSubcategories()
})

// Manejador de cambio de imagen
const handleImageChange = (event) => {
  const file = event.target.files[0];  // Obtener el primer archivo
  if (file) {
    form.value.image = file;  // Guardamos el archivo en el estado
    console.log("Archivo de imagen seleccionado:", file);
  } else {
    console.log("No se seleccionó ninguna imagen.");
  }
};

const submitForm = async () => {
  if (!form.value.category || !form.value.subcategory || !form.value.price || !form.value.name || !form.value.email || !form.value.phone) {
    alert("Todos los campos son obligatorios.");
    return;
  }

  const formData = new FormData();
  formData.append('titulo', form.value.name);
  formData.append('descripcion', form.value.description);
  formData.append('precio', form.value.price);
  formData.append('categoria_id', form.value.category);
  formData.append('subcategoria', form.value.subcategory); 
  formData.append('contacto_correo', form.value.email);
  formData.append('contacto_telefono', form.value.phone);
  formData.append('oferta', form.value.oferta ? 'true' : 'false');
  formData.append('descuento', form.value.descuento ? 'true' : 'false');

  // Asegurarse de que el archivo de imagen esté presente
  if (form.value.image) {
    console.log("Añadiendo imagen al FormData...");
    formData.append('multimedia', form.value.image); // Solo el archivo, no la URL
  } else {
    console.log("No se seleccionó ninguna imagen.");
  }

  try {
    const response = await $axios.post('/publicaciones', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    emit('addNewPublication', { ...form.value });
    alert('Publicación creada con éxito');
  } catch (err) {
    console.error('Error al crear la publicación:', err);
    alert('Hubo un error al crear la publicación');
  }
};


const close = () => {
  form.value = {
    name: '',
    description: '',
    price: '',
    category: null,
    subcategory: null,
    email: '',
    phone: '',
    image: null, // Restablecer la imagen
    oferta: false,
    descuento: false,
  }
}
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
  margin-left: 0;
  margin-right: 0;
}
</style>
