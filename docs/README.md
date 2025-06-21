# Portal Help Desk

Sistema de portal de ayuda y soporte técnico con interfaz moderna y responsive.

## Estructura del Proyecto

```
/
├── 📁 data/                    # Datos y configuraciones
│   ├── 📁 config/             # Archivos JSON de configuración
│   └── 📁 i18n/               # Internacionalización
├── 📁 docs/                   # Documentación del proyecto
├── 📁 public/                 # Archivos públicos
│   └── 📁 images/             # Imágenes estáticas
├── 📁 src/                    # Código fuente
│   ├── 📁 js/                 # JavaScript
│   │   ├── 📁 config/         # Configuración centralizada
│   │   ├── 📁 components/     # Componentes reutilizables
│   │   ├── 📁 controllers/    # Controladores de lógica
│   │   ├── 📁 models/         # Modelos de datos
│   │   ├── 📁 services/       # Servicios y managers
│   │   ├── 📁 utils/          # Utilidades y helpers
│   │   ├── 📁 views/          # Vistas de la aplicación
│   │   └── main.js            # Punto de entrada
│   ├── 📁 styles/             # Estilos CSS
│   └── 📁 views/              # Vistas HTML (duplicado)
└── index.html                 # Página principal
```

## Características

- **Interfaz Responsive**: Adaptable a diferentes tamaños de pantalla
- **Temas Visuales**: Soporte para modo claro y oscuro
- **Internacionalización**: Soporte para múltiples idiomas
- **Componentes Modulares**: Arquitectura basada en componentes
- **Gestión de Estado**: Sistema de configuración centralizado

## Tecnologías Utilizadas

- HTML5
- CSS3 (con Bootstrap 5)
- JavaScript ES6+
- Font Awesome (iconos)

## Instalación y Uso

1. Clona el repositorio
2. Abre `public/index.html` en tu navegador
3. El sistema se inicializará automáticamente

## Estructura de Archivos JavaScript

### Controllers

- `ControladorUsuario.js` - Gestión de usuarios
- `ControladorMenu.js` - Control del menú de navegación
- `ControladorHeader.js` - Control del encabezado
- `ControladorSidebar.js` - Control de la barra lateral
- `ControladorContenido.js` - Control del contenido principal

### Services

- `ConfigService.js` - Servicio de configuración
- `MenuService.js` - Servicio de menú
- `I18nService.js` - Servicio de internacionalización

### Views

- `MenuView.js` - Vista del menú
- `SidebarView.js` - Vista de la barra lateral
- `HeaderView.js` - Vista del encabezado

### Utils

- `LocalStorageHelper.js` - Ayudante para localStorage
- `TooltipHelper.js` - Ayudante para tooltips
- `TemaHelper.js` - Ayudante para temas

### Models

- `Usuario.js` - Modelo de usuario
- `Configuracion.js` - Modelo de configuración

## Configuración

El sistema utiliza archivos JSON para la configuración:

- `default-config.json`: Configuración por defecto
- `menu.json`: Definición del menú de navegación
- `temas.json`: Configuración de temas visuales
- `notificationes.json`: Configuración de notificaciones

## Desarrollo

Para desarrollar nuevas funcionalidades:

1. Sigue la estructura de carpetas establecida
2. Utiliza los servicios existentes para la lógica de negocio
3. Mantén la separación entre controladores, vistas y modelos
4. Documenta los cambios en este README

"Necesito un componente de notificaciones que:

- Categoría: Componente reutilizable
- Dependencias: ConfigService, I18nService
- Configuración: Usar componentConfig.js para opciones por defecto
- Responsabilidades: Mostrar notificaciones, gestionar estado, no debe manejar lógica de negocio
- Debe seguir el patrón de ThemeComponent.js"

"Necesito una vista de reportes avanzados que:

- Categoría: Vista específica
- Dependencias: ControladorContenido, MenuService
- Configuración: Usar viewConfig.js para opciones
- Responsabilidades: Mostrar reportes, no debe manejar datos directamente
- Debe seguir el patrón de HelpDeskView.js"

"Necesito un servicio de autenticación que:

- Categoría: Servicio de lógica de negocio
- Dependencias: ConfigService, LocalStorageHelper
- Configuración: Usar appConfig.js para opciones
- Responsabilidades: Gestionar autenticación, no debe manejar UI
- Debe seguir el patrón de MenuService.js"

"Crear [NombreComponente] que:

1. Extienda la funcionalidad de [ComponenteExistente]
2. Use [ConfigEspecífica] de componentConfig.js
3. Siga el patrón de [ComponenteReferencia]
4. Se integre con [ServiciosNecesarios]"

"Crear [NombreServicio] que:

1. Siga el patrón de [ServicioExistente]
2. Use [ConfigEspecífica] de appConfig.js
3. Se integre con [ServiciosExistentes]
4. Maneje [ResponsabilidadesEspecíficas]"

"Crear [NombreVista] que:

1. Siga el patrón de [VistaExistente]
2. Use [ConfigEspecífica] de viewConfig.js
3. Se integre con [ControladoresExistentes]
4. Renderice [ContenidoEspecífico]"
