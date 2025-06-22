// Configuración de la API del backend
const IS_PROD = process.env.NODE_ENV === 'production';

// Usa la URL de Render en producción, y una URL local para desarrollo
export const API_BASE_URL = IS_PROD 
  ? process.env.NEXT_PUBLIC_API_URL 
  : 'http://127.0.0.1:8000';

// Endpoints
export const ENDPOINTS = {
  TECNOLOGIAS: `${API_BASE_URL}/tecnologias`,
  PROYECTOS: `${API_BASE_URL}/proyectos`,
} as const;

// Función para validar que la URL del backend esté configurada
export const validateApiConfig = () => {
  // En producción, asegúrate de que la variable de entorno esté definida
  if (IS_PROD && !process.env.NEXT_PUBLIC_API_URL) {
    console.error('ERROR: NEXT_PUBLIC_API_URL no está definida en el entorno de producción.');
    return false;
  }
  
  // En desarrollo, podemos permitir que no esté definida y usar el valor por defecto
  if (!IS_PROD) {
    if (API_BASE_URL === 'http://127.0.0.1:8000') {
      console.log('Usando API local en http://127.0.0.1:8000');
    }
  }

  return true;
}; 