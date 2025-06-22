# Configuración de la API del Backend

## Variables de Entorno

Para que el frontend pueda conectarse con el backend, necesitas configurar la variable de entorno `NEXT_PUBLIC_API_URL`.

### 1. Crear archivo .env.local

Crea un archivo `.env.local` en la raíz del proyecto `portafolio-f` con el siguiente contenido:

```env
NEXT_PUBLIC_API_URL=https://tu-backend-url-en-render.onrender.com
```

### 2. Reemplazar la URL

Reemplaza `https://tu-backend-url-en-render.onrender.com` con la URL real de tu backend desplegado en Render.

### 3. Reiniciar el servidor de desarrollo

Después de crear el archivo `.env.local`, reinicia el servidor de desarrollo:

```bash
npm run dev
```

## Estructura de Datos Esperada

### Tecnologías
El backend debe devolver un array de tecnologías con la siguiente estructura:

```json
[
  {
    "id": 1,
    "nombre": "Java",
    "imagen": "/java.png",
    "categoria": "Lenguajes de Programación"
  },
  {
    "id": 2,
    "nombre": "Python",
    "imagen": "/piton.png",
    "categoria": "Lenguajes de Programación"
  }
]
```

### Proyectos
El backend debe devolver un array de proyectos con la siguiente estructura:

```json
[
  {
    "id": 1,
    "titulo": "Perceptrón Multicapa para Clasificación de Emociones",
    "imagen": "/emociones-texto.jpg",
    "urlRepo": "https://github.com/AntoinetteDizz/Multilayer-Perceptron.git"
  }
]
```

## Categorías de Tecnologías

Las tecnologías se agrupan automáticamente por categoría. Algunas categorías sugeridas:

- Lenguajes de Programación
- Frameworks
- Bases de Datos
- Desarrollo Web
- Herramientas de Diseño

## Fallbacks

El frontend incluye fallbacks para manejar errores:

- Si una imagen de tecnología falla, se muestra un ícono genérico
- Si una imagen de proyecto falla, se muestra un ícono genérico
- Si hay errores de conexión, se muestra un mensaje de error con opción de reintentar 