// Configuración de la API del backend
// Cambia esta URL por la URL real de tu backend desplegado en Render
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tu-backend-url-en-render.onrender.com';

// Endpoints
export const ENDPOINTS = {
  TECNOLOGIAS: `${API_BASE_URL}/tecnologias`,
  PROYECTOS: `${API_BASE_URL}/proyectos`,
} as const;

// Función para validar que la URL del backend esté configurada
export const validateApiConfig = () => {
  if (API_BASE_URL === 'https://tu-backend-url-en-render.onrender.com') {
    console.warn('⚠️  API_BASE_URL no está configurada. Por favor, configura NEXT_PUBLIC_API_URL en tu archivo .env.local');
    return false;
  }
  return true;
}; 