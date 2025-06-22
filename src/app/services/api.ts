import { ENDPOINTS, validateApiConfig } from '../config/api';
import { Tecnologia, Proyecto } from '../types';

// Función para obtener todas las tecnologías
export const fetchTecnologias = async (): Promise<Tecnologia[]> => {
  try {
    // Validar configuración de API
    if (!validateApiConfig()) {
      throw new Error('API_BASE_URL no está configurada correctamente');
    }

    const response = await fetch(ENDPOINTS.TECNOLOGIAS);
    if (!response.ok) {
      throw new Error(`Error al obtener tecnologías: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching tecnologías:', error);
    throw error;
  }
};

// Función para obtener todos los proyectos
export const fetchProyectos = async (): Promise<Proyecto[]> => {
  try {
    // Validar configuración de API
    if (!validateApiConfig()) {
      throw new Error('API_BASE_URL no está configurada correctamente');
    }

    const response = await fetch(ENDPOINTS.PROYECTOS);
    if (!response.ok) {
      throw new Error(`Error al obtener proyectos: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching proyectos:', error);
    throw error;
  }
};

// Función para agrupar tecnologías por categoría
export const groupTecnologiasByCategoria = (tecnologias: Tecnologia[]) => {
  const grouped = tecnologias.reduce((acc, tecnologia) => {
    const categoria = tecnologia.categoria;
    if (!acc[categoria]) {
      acc[categoria] = [];
    }
    acc[categoria].push(tecnologia);
    return acc;
  }, {} as Record<string, Tecnologia[]>);

  return Object.entries(grouped).map(([categoria, tecnologias]) => ({
    categoria,
    tecnologias
  }));
};

// Función para filtrar tecnologías por categorías específicas
export const filterTecnologiasByCategorias = (tecnologias: Tecnologia[], categorias: string[]) => {
  return tecnologias.filter(tecnologia => 
    categorias.includes(tecnologia.categoria)
  );
};

// Función para agrupar tecnologías filtradas por categoría
export const groupTecnologiasByCategoriaFiltered = (tecnologias: Tecnologia[], categorias: string[]) => {
  const tecnologiasFiltradas = filterTecnologiasByCategorias(tecnologias, categorias);
  return groupTecnologiasByCategoria(tecnologiasFiltradas);
}; 