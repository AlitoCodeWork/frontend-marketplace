<template>
  <div class="p-5 flex justify-center">
    <div class="border border-gray-300 p-4 rounded-lg space-y-4 max-w-xs w-auto">
      <!-- Categorías -->
      <div class="space-y-1">
        <h3 class="text-lg sm:text-xl font-semibold">Categorías</h3>
        <div
          v-if="categories.length > 0"
          v-for="category in categories"
          :key="category.id"
          class="flex items-center"
        >
          <input
            type="checkbox"
            v-model="category.selected"
            :id="category.name"
            class="form-checkbox text-black focus:ring-black checked:bg-black"
            @change="filterProducts"
          />
          <label :for="category.name" class="ml-2 text-xs sm:text-sm text-gray-900">
            {{ category.name }}
          </label>
        </div>
        <p v-else class="text-sm text-gray-500">Cargando categorías...</p>
      </div>

      <!-- Filtro de Precio -->
      <div class="space-y-1">
        <h3 class="text-lg font-semibold">Precio</h3>
        <div class="relative flex items-center">
          <input
            type="range"
            v-model="priceRange"
            min="0"
            max="100"
            step="1"
            class="w-32 h-1 bg-gray-300 rounded-full appearance-none"
          />
        </div>
        <p class="text-sm">Desde ${{ priceRange }} hasta $100</p>
      </div>

      <!-- Subcategorías filtradas -->
      <div class="space-y-1">
        <h3 class="text-lg sm:text-xl font-semibold">Subcategorías</h3>
        <div
          v-if="filteredSubcategories.length > 0"
          v-for="subcategory in filteredSubcategories"
          :key="subcategory.id"
          class="flex items-center"
        >
          <input
            type="checkbox"
            v-model="subcategory.selected"
            :id="subcategory.name"
            class="form-checkbox text-black focus:ring-black checked:bg-black"
            @change="filterProducts"
          />
          <label :for="subcategory.name" class="ml-2 text-xs sm:text-sm text-gray-900">
            {{ subcategory.name }}
          </label>
        </div>
        <p v-else class="text-sm text-gray-500">Selecciona una categoría para ver sus subcategorías</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useNuxtApp } from '#app';

// Acceder a axios desde Nuxt 3
const { $axios } = useNuxtApp();

// Definir los eventos emitidos
const emit = defineEmits();

// Variables de estado
const categories = ref([]);
const subcategories = ref([]);
const priceRange = ref(0);
const selectedCategories = ref([]);
const selectedSubcategories = ref([]);

// Obtener categorías
const fetchCategories = async () => {
  try {
    const res = await $axios.get('/public/categorias'); // Usamos axios para hacer la solicitud
    categories.value = res.data.categorias.map(cat => ({
      id: cat.id,
      name: cat.nombre,
      selected: false
    }));
  } catch (err) {
    console.error('Error al obtener categorías:', err);
  }
};

// Obtener subcategorías
const fetchSubcategories = async () => {
  try {
    const res = await $axios.get('/public/subcategorias');
    subcategories.value = res.data.subcategorias.map(sub => ({
      id: sub.id,
      name: sub.nombre,
      categoriaId: sub.categoria_id,
      selected: false
    }));
  } catch (err) {
    console.error('Error al obtener subcategorías:', err);
  }
};

// Filtrar productos según las categorías y subcategorías seleccionadas
const filterProducts = () => {
  selectedCategories.value = categories.value.filter(cat => cat.selected).map(cat => cat.id);
  selectedSubcategories.value = subcategories.value.filter(sub => sub.selected).map(sub => sub.id);

  // Emitir el filtro
  emit('filter', selectedCategories.value, selectedSubcategories.value, priceRange.value);
};

// Computed para las subcategorías filtradas por categorías seleccionadas
const filteredSubcategories = computed(() => {
  const selectedCategoryIds = categories.value.filter(cat => cat.selected).map(cat => cat.id);
  
  if (selectedCategoryIds.length === 0) {
    return [];
  }

  return subcategories.value.filter(sub => selectedCategoryIds.includes(sub.categoriaId));
});

// Cargar las categorías y subcategorías al montar el componente
onMounted(() => {
  fetchCategories();
  fetchSubcategories();
});
</script>

<style scoped>
input[type="range"] {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  height: 2px;
  background-color: #d1d5db;
  border-radius: 5px;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  background-color: #000;
  border-radius: 50%;
}

input[type="range"]::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background-color: #000;
  border-radius: 50%;
}

input[type="range"]:focus {
  outline: none;
}
</style>
