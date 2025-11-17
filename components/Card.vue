<template>
  <div class="card bg-white p-4 rounded-lg border hover:shadow transition duration-300 w-full" @click="handleClick">
    <img
      :src="props.product?.imageUrl || props.product?.imagen_url || '/placeholder.jpg'"
      :alt="props.product?.title || props.product?.titulo || 'product image'"
      class="w-full h-[150px] object-cover rounded-lg"
    />
    <div class="mt-4">
      <h3 class="text-l">{{ props.product?.title ?? props.product?.titulo ?? 'Sin título' }}</h3>
      <div class="mt-2 flex justify-between items-center">
        <span class="text-l font-semibold">{{ props.product?.price ?? props.product?.precio ?? '$0' }}</span>
        <div class="flex items-center text-yellow-500">
          <StarIcon class="w-4 h-4" />
          <StarIcon class="w-4 h-4" />
          <StarIcon class="w-4 h-4" />
          <StarIcon class="w-4 h-4" />
          <StarIcon class="w-4 h-4 opacity-50" />
          <span class="ml-2 text-sm text-gray-600">4.5</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { StarIcon } from '@heroicons/vue/24/solid'

const props = defineProps({
  product: {
    type: Object,
    required: false,
    default: () => ({})
  }
})

const emit = defineEmits(['open-detail'])

const handleClick = () => {
  if (props.product) {
    emit('open-detail', props.product)
  }
}
</script>