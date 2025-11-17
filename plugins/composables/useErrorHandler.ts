// composables/useErrorHandler.ts
export const useErrorHandler = () => {
  const handleAxiosError = (error: any) => {
    console.error('API Error:', error);
    
    if (error.response) {
      // Error con respuesta del servidor
      const status = error.response.status;
      const message = error.response.data?.message || error.response.statusText;
      
      switch (status) {
        case 400:
          return `Error en la solicitud: ${message}`;
        case 401:
          return 'No autorizado. Verifica tus credenciales.';
        case 403:
          return 'Acceso denegado.';
        case 404:
          return 'Recurso no encontrado.';
        case 500:
          return 'Error interno del servidor.';
        default:
          return `Error ${status}: ${message}`;
      }
    } else if (error.request) {
      // Error de red
      return 'Error de conexión. Verifica tu conexión a internet y que el servidor esté funcionando.';
    } else {
      // Error en la configuración
      return error.message || 'Error desconocido';
    }
  };

  return { handleAxiosError };
};