<!-- components/Toast/ToastContainer.vue -->
<template>
  <Teleport to="body">
    <div class="fixed top-5 right-5 z-50 space-y-2" aria-live="polite">
      <TransitionGroup
        name="toast"
        tag="div"
        class="space-y-2"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="bg-white rounded-lg shadow-lg border border-gray-200 p-4 min-w-80 max-w-md transform transition-all duration-300 ease-in-out"
          :class="getToastClasses(toast)"
        >
          <div class="flex items-start">
            <!-- Icono según el tipo -->
            <div class="flex-shrink-0 mr-3">
              <!-- Success -->
              <svg 
                v-if="toast.type === 'success'" 
                class="w-5 h-5 text-green-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              
              <!-- Error -->
              <svg 
                v-else-if="toast.type === 'error'" 
                class="w-5 h-5 text-red-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              
              <!-- Warning -->
              <svg 
                v-else-if="toast.type === 'warning'" 
                class="w-5 h-5 text-yellow-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
              
              <!-- Info -->
              <svg 
                v-else 
                class="w-5 h-5 text-blue-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            
            <!-- Mensaje -->
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 break-words">{{ toast.message }}</p>
              
              <!-- Información adicional para toast persistente -->
              <p v-if="toast.persistent" class="text-xs text-gray-500 mt-1">
                Presiona para cerrar
              </p>
            </div>
            
            <!-- Botón cerrar -->
            <button 
              @click="removeToast(toast.id)"
              class="flex-shrink-0 ml-3 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded"
              :aria-label="`Cerrar notificación: ${toast.message}`"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <!-- Barra de progreso -->
          <div 
            v-if="toast.type === 'success' && toast.progress !== undefined" 
            class="mt-3 w-full bg-gray-200 rounded-full h-1"
          >
            <div 
              class="bg-green-500 h-1 rounded-full transition-all duration-100 ease-linear"
              :style="{ width: `${toast.progress}%` }"
            ></div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useToast, type Toast } from '@/plugins/composables/useToast'

const { toasts, removeToast } = useToast()

const getToastClasses = (toast: Toast) => {
  const baseClasses = 'border-l-4'
  
  switch (toast.type) {
    case 'success':
      return `${baseClasses} border-green-500 bg-green-50`
    case 'error':
      return `${baseClasses} border-red-500 bg-red-50`
    case 'warning':
      return `${baseClasses} border-yellow-500 bg-yellow-50`
    case 'info':
    default:
      return `${baseClasses} border-blue-500 bg-blue-50`
  }
}
</script>

<style scoped>
/* Animaciones para TransitionGroup */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>