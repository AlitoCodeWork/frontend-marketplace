<template>
  <button
    :class="buttonClass"
    :style="customStyle"
    @click="handleClick"
  >
    <slot></slot> <!-- Permite contenido dinámico dentro del botón -->
  </button>
</template>

<script>
export default {
  name: 'TertiaryButton',
  props: {
    // Permite pasar un estilo en línea, si se desea personalizar
    customStyle: {
      type: Object,
      default: () => ({})
    },
    // Clases personalizadas que se aplicarán al botón
    buttonClass: {
      type: String,
      default: ' py-2 px-4 rounded-lg hover:bg-[#204347] hover:text-white'
    }
  },
  methods: {
    handleClick() {
      // Emite el evento cuando se hace clic en el botón
      this.$emit('click');
    }
  }
}
</script>

<style scoped>
/* No es necesario agregar estilos adicionales, ya que Tailwind se encarga de todo */
</style>
