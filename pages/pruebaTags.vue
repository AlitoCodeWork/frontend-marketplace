<template>
  <div class="p-5">
    <!-- Usando el componente Tagscategories -->
    <Tagscategories />
  </div>
</template>

<script>
// Importar el componente Tagscategories
import Tagscategories from '@/components/Tagscategories.vue'; // Cambié el nombre de la importación para coincidir con el archivo

export default {
  name: 'PruebaTags',
  components: {
    Tagscategories, // Registrar el componente correctamente
  },
};
</script>

<style scoped>
/* Estilos adicionales para la página, si los necesitas */
</style>
