<template>
  <div class="max-w-4xl mx-auto py-12">
    <h1 class="text-3xl font-semibold text-center mb-8">
      ¡Bienvenido! Selecciona tus intereses favoritos
    </h1>
    <p class="text-center mb-8">
      Elige las categorías que más te gusten. Verás más contenido relacionado con ellas en tu experiencia personalizada.
    </p>

    <div class="flex flex-wrap justify-center gap-4">
      <div
        v-for="category in categories"
        :key="category.id"
        class="inline-flex px-4 py-2 rounded-lg shadow-md text-center cursor-pointer justify-center items-center"
        :class="category.selected ? 'bg-[#204347] text-white' : 'bg-white hover:bg-gray-100'"
        @click="toggleSelection(category)"
      >
        <span :class="{ 'font-semibold': category.selected }" class="block text-lg">
          {{ category.name }}
        </span>
      </div>
    </div>

    <div class="mt-8 text-center">
      <primaryButton @click="submitSelection" class="mb-4 w-[350px]">
        Aceptar
      </primaryButton>
      <div class="gap-4">
        <button @click="skipSelection" class="text-black py-2 px-4 rounded-lg hover:bg-gray-400">
          Saltar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { navigateTo } from '#app';
import primaryButton from '@/components/primaryButton.vue';

// Lista reactiva de categorías (se llenará desde el backend)
const categories = ref([]);
const { $axios } = useNuxtApp();
onMounted(async () => {
  try {
    const response = await $axios.get('/public/categorias');
const data = response.data;

if (!Array.isArray(data.categorias)) {
  console.error('Respuesta inválida del backend:', data);
  throw new Error('No se recibieron categorías válidas');
}

categories.value = data.categorias.map(cat => ({
  id: cat.id,
  name: cat.nombre,
  selected: false
}));

  } catch (error) {
    console.error('Error al cargar las categorías:', error);
  }
});


// Verificar si hay alguna categoría seleccionada
const hasSelectedCategories = computed(() => {
  return categories.value.some(category => category.selected);
});

// Alternar selección
const toggleSelection = (category) => {
  category.selected = !category.selected;
};

// Enviar selección
const submitSelection = () => {
  if (hasSelectedCategories.value) {
    const selectedCategories = categories.value
      .filter(category => category.selected)
      .map(category => category.name);

    console.log('Categorías seleccionadas:', selectedCategories);
    // Aquí podrías enviar al backend si lo deseas
    navigateTo('/DashboardPublicaciones');
  } else {
    alert('¡Por favor selecciona al menos una categoría!');
  }
};

// Saltar selección
const skipSelection = () => {
  navigateTo('/DashboardPublicaciones');
};
</script>

<style scoped>
/* Estilos adicionales si los necesitas */
</style>
