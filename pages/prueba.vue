<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-50 p-4">
    <!-- Usamos el componente Card directamente aquí -->
    <Card
      :imageUrl="imageUrl"
      title="Producto Ejemplo"
      
      price="$100"
    />
  </div>
</template>

<script setup lang="ts">
import Card from '@/components/Card.vue';  

// Usamos la URL correcta a la imagen
const imageUrl = '/images/pexels-jan-van-der-wolf-11680885-32275920.jpg';
</script>

<style scoped>
/* Estilos para centrar el contenido */
</style>
