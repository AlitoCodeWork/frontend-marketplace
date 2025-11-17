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
  name: 'PrimaryButton',
  props: {
    // Permite pasar un estilo en línea, si se desea personalizar
    customStyle: {
      type: Object,
      default: () => ({})
    },
    // Clases personalizadas que se aplicarán al botón
    buttonClass: {
      type: String,
      default: 'w-32  py-2 mt-6 text-white bg-[#204347] rounded-lg hover:bg-[#204347]'
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
