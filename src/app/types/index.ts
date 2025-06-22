// Tipos para las entidades del backend
export interface Tecnologia {
  id: number;
  nombre: string;
  imagen: string;
  categoria: string;
}

export interface Proyecto {
  id: number;
  titulo: string;
  imagen: string;
  urlRepo: string;
  tecnologias?: Tecnologia[];
}

// Tipos para agrupar tecnologías por categoría
export interface TecnologiaCategoria {
  categoria: string;
  tecnologias: Tecnologia[];
} 