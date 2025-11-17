// composables/useToast.ts
import { ref, reactive } from 'vue'

export interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  visible: boolean
  progress?: number
  duration?: number
  persistent?: boolean // No se auto-elimina
}

interface ToastOptions {
  duration?: number
  persistent?: boolean
}

// Estado global compartido entre todos los componentes
const toasts = ref<Toast[]>([])
let toastIdCounter = 0

export const useToast = () => {
  
  // Función principal para mostrar toast
  const showToast = (
    message: string, 
    type: Toast['type'] = 'info', 
    options: ToastOptions = {}
  ) => {
    const { duration = 5000, persistent = false } = options
    
    const toast: Toast = {
      id: ++toastIdCounter,
      message,
      type,
      visible: false,
      progress: type === 'success' ? 100 : undefined,
      duration,
      persistent
    }
    
    toasts.value.push(toast)
    
    // Mostrar el toast con un pequeño delay para la animación
    setTimeout(() => {
      const currentToast = toasts.value.find(t => t.id === toast.id)
      if (currentToast) {
        currentToast.visible = true
      }
    }, 100)
    
    // Auto-remover si no es persistente
    if (!persistent) {
      if (type === 'success') {
        // Para success, mostrar barra de progreso que decrece
        let currentProgress = 100
        const decrementAmount = (100 / duration) * 100 // Porcentaje por cada 100ms
        
        const interval = setInterval(() => {
          const currentToast = toasts.value.find(t => t.id === toast.id)
          if (currentToast && currentProgress > 0) {
            currentProgress -= decrementAmount
            currentToast.progress = Math.max(0, currentProgress)
          } else {
            clearInterval(interval)
            removeToast(toast.id)
          }
        }, 100)
      } else {
        // Para otros tipos, remover después del tiempo especificado
        setTimeout(() => {
          removeToast(toast.id)
        }, duration)
      }
    }
    
    return toast.id // Retornar ID para control manual si es necesario
  }
  
  // Función para remover toast
  const removeToast = (id: number) => {
    const toast = toasts.value.find(t => t.id === id)
    if (toast) {
      toast.visible = false
      setTimeout(() => {
        const index = toasts.value.findIndex(t => t.id === id)
        if (index > -1) {
          toasts.value.splice(index, 1)
        }
      }, 300) // Esperar a que termine la animación
    }
  }
  
  // Funciones de conveniencia para cada tipo
  const success = (message: string, options?: ToastOptions) => {
    return showToast(message, 'success', options)
  }
  
  const error = (message: string, options?: ToastOptions) => {
    return showToast(message, 'error', options)
  }
  
  const info = (message: string, options?: ToastOptions) => {
    return showToast(message, 'info', options)
  }
  
  const warning = (message: string, options?: ToastOptions) => {
    return showToast(message, 'warning', options)
  }
  
  // Función para limpiar todos los toast
  const clearAll = () => {
    toasts.value.forEach(toast => {
      toast.visible = false
    })
    setTimeout(() => {
      toasts.value.length = 0
    }, 300)
  }
  
  // Función para obtener cantidad de toast activos
  const getActiveCount = () => {
    return toasts.value.length
  }
  
  return {
    // Estado
    toasts: toasts.value,
    
    // Funciones principales
    showToast,
    removeToast,
    clearAll,
    
    // Funciones de conveniencia
    success,
    error,
    info,
    warning,
    
    // Utilidades
    getActiveCount
  }
}