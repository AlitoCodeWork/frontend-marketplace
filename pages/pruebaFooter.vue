<template>
  <div>
    <!-- Aquí puedes colocar otros elementos de tu página si los tienes -->
    
    <!-- Llamamos al componente Footer -->
    <Footer />
  </div>
</template>

<script>
// Importamos el componente Footer
import Footer from '@/components/footer.vue'; // Asegúrate de que la ruta sea la correcta

export default {
  name: 'PruebaFooter',
  components: {
    Footer, // Registramos el componente Footer
  },
};
</script>

<style scoped>
/* Estilos adicionales para tu página si los necesitas */
</style>
