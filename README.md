# KHUS SAC - Plataforma de Directorio Profesional

KHUS SAC es una plataforma web moderna desarrollada con Next.js que conecta profesionales con clientes potenciales. La aplicación permite a los profesionales crear perfiles detallados, mostrar sus servicios, galería de trabajos y ubicación en un mapa interactivo.

## Características Principales

### Para Profesionales
- **Gestión de Perfiles**: Crear y editar perfiles profesionales completos
- **Galería de Trabajos**: Mostrar portfolio con imágenes de proyectos realizados
- **Mapa Interactivo**: Integración con Leaflet para mostrar ubicación exacta
- **Gestión de Servicios**: Listar y categorizar servicios ofrecidos
- **Sistema de Tarifas**: Configurar precios por proyecto, hora o día
- **Información de Contacto**: Teléfono, email y ubicación detallada

### Para Clientes
- **Búsqueda Avanzada**: Filtrar por nombre, profesión, ubicación y precio
- **Visualización de Perfiles**: Ver información completa de profesionales
- **Contacto Directo**: Integración con WhatsApp para comunicación inmediata
- **Mapa de Ubicación**: Visualizar ubicación exacta de cada profesional
- **Sistema de Reseñas**: Calificaciones y comentarios de clientes

### Funcionalidades Técnicas
- **Autenticación**: Sistema de login y registro seguro
- **Responsive Design**: Optimizado para dispositivos móviles y desktop
- **Mapas Reales**: Integración con Leaflet y Google Maps
- **Optimización de Imágenes**: Carga eficiente con Next.js Image
- **TypeScript**: Tipado estático para mayor robustez
- **Tailwind CSS**: Diseño moderno y consistente

## Requisitos del Sistema

- Node.js 18.0 o superior
- npm 8.0 o superior
- Navegador web moderno (Chrome, Firefox, Safari, Edge)

## Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/johaanq/khus-sac.git
cd khus-sac
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

Crear un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Ejecutar en Modo Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## Scripts Disponibles

### Desarrollo
```bash
npm run dev          # Inicia servidor de desarrollo
npm run build        # Construye la aplicación para producción
npm run start        # Inicia servidor de producción
npm run lint         # Ejecuta ESLint para verificar código
```

### Construcción
```bash
npm run build        # Genera build optimizado
npm run start        # Ejecuta build de producción
```

## Estructura del Proyecto

```
khus-sac/
├── public/                 # Archivos estáticos
│   ├── db.json            # Base de datos JSON
│   └── placeholder.svg    # Imagen placeholder
├── src/
│   ├── app/               # Páginas de la aplicación
│   │   ├── login/         # Página de inicio de sesión
│   │   ├── register/      # Página de registro
│   │   ├── profile/       # Perfil público del usuario
│   │   ├── dashboard/     # Panel de edición
│   │   └── professional/  # Perfiles individuales
│   ├── components/        # Componentes reutilizables
│   │   ├── ui/           # Componentes de interfaz
│   │   ├── header.tsx    # Navegación principal
│   │   ├── real-map.tsx  # Mapa interactivo
│   │   └── photo-upload.tsx # Subida de imágenes
│   └── lib/              # Utilidades y configuración
│       ├── api.ts        # Lógica de API
│       ├── utils.ts      # Funciones auxiliares
│       └── whatsapp.ts   # Integración WhatsApp
├── package.json          # Dependencias del proyecto
├── tailwind.config.js    # Configuración de Tailwind
├── tsconfig.json         # Configuración de TypeScript
└── next.config.ts        # Configuración de Next.js
```

## Configuración de Base de Datos

La aplicación utiliza un archivo JSON (`public/db.json`) como base de datos. Este archivo contiene:

- **Profesionales**: Información completa de cada profesional
- **Usuarios**: Credenciales de acceso
- **Servicios**: Catálogo de servicios disponibles

### Estructura de Datos

```json
{
  "id": 1,
  "name": "María González",
  "profession": "Diseñadora Gráfica",
  "email": "maria@email.com",
  "phone": "+51987654321",
  "password": "123456",
  "profileImage": "url_de_imagen",
  "gallery": ["url1", "url2", "url3"],
  "description": "Descripción profesional",
  "services": ["Servicio 1", "Servicio 2"],
  "location": {
    "district": "Miraflores",
    "city": "Lima",
    "address": "Dirección específica",
    "coordinates": { "lat": -12.1201, "lng": -77.0341 }
  },
  "rate": {
    "min": 150,
    "max": 500,
    "currency": "PEN",
    "type": "por proyecto"
  },
  "rating": 4.8,
  "reviewsCount": 24,
  "isActive": true
}
```

## Credenciales de Prueba

Para probar la aplicación, puede usar las siguientes credenciales:

- **Email**: maria@email.com
- **Contraseña**: 123456

## Tecnologías Utilizadas

### Frontend
- **Next.js 15**: Framework de React para aplicaciones web
- **React 18**: Biblioteca de interfaz de usuario
- **TypeScript**: Tipado estático para JavaScript
- **Tailwind CSS**: Framework de CSS utilitario
- **Lucide React**: Iconografía moderna

### Mapas y Ubicación
- **Leaflet**: Biblioteca de mapas interactivos
- **Google Maps**: Integración para direcciones específicas

### Desarrollo
- **ESLint**: Linter para JavaScript/TypeScript
- **PostCSS**: Procesador de CSS
- **Turbopack**: Bundler de Next.js

## Despliegue

### Vercel (Recomendado)

1. Conectar repositorio con Vercel
2. Configurar variables de entorno
3. Desplegar automáticamente

### Otras Plataformas

La aplicación puede desplegarse en cualquier plataforma que soporte Node.js:

- **Netlify**: Para sitios estáticos
- **Railway**: Para aplicaciones full-stack
- **DigitalOcean**: Para control completo del servidor
- **AWS**: Para escalabilidad empresarial

## Contribución

1. Fork del repositorio
2. Crear rama de feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## Soporte

Para soporte técnico o consultas:

- **Email**: soporte@khus-sac.com
- **Documentación**: [docs.khus-sac.com](https://docs.khus-sac.com)
- **Issues**: [GitHub Issues](https://github.com/johaanq/khus-sac/issues)

## Changelog

### v1.0.0
- Lanzamiento inicial
- Sistema de autenticación
- Gestión de perfiles profesionales
- Integración de mapas
- Sistema de búsqueda y filtros
- Diseño responsive
- Integración con WhatsApp