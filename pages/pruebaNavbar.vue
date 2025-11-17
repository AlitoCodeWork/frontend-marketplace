<template>
  <div>
    <!-- Llamamos al componente Navbar -->
    <Navbar />
  </div>
</template>

<script>
// Importamos el componente Navbar
import Navbar from '@/components/navbar.vue'; // Asegúrate de que la ruta sea correcta

export default {
  name: 'PruebaNavbar',
  components: {
    Navbar, // Registramos el componente Navbar
  },
};
</script>

<style scoped>
/* Estilos adicionales para tu página si los necesitas */
</style>
