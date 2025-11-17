<template>
  <div>
    <!-- Botón básico con las clases por defecto -->
    <PrimaryButton @click="handlePrimaryButtonClick">¡Haz clic aquí!</PrimaryButton>

    <!-- Botón con estilo personalizado -->
    <PrimaryButton
      :buttonClass="'py-1 mt-8 text-black ml-32 rounded-lg bg-red-500 hover:bg-yellow-900'"
      @click="handlePrimaryButtonClick"
    >
      Botón Personalizado 1
    </PrimaryButton>
  </div>
</template>

<script>
import PrimaryButton from '../components/primaryButton.vue';

export default {
  components: {
    PrimaryButton
  },
  methods: {
    handlePrimaryButtonClick() {
      alert('¡Botón presionado!');
    }
  }
}
</script>
