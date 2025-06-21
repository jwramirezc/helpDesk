# Portal Help Desk

Sistema de portal de ayuda y soporte técnico con interfaz moderna y responsive.

## Estructura del Proyecto

```
/
├── public/                 # Archivos públicos servidos al navegador
│   ├── index.html         # Página principal
│   ├── favicon.ico        # Icono del sitio
│   └── images/            # Imágenes estáticas
│       ├── logo-saia-dark.png
│       ├── logo-saia-light.png
│       ├── logo-saia.png
│       └── avatar1.png
├── src/                   # Código fuente
│   ├── js/               # JavaScript
│   │   ├── controllers/  # Controladores de la aplicación
│   │   ├── services/     # Servicios y managers
│   │   ├── views/        # Vistas y componentes de UI
│   │   ├── utils/        # Utilidades y helpers
│   │   ├── models/       # Modelos de datos
│   │   └── main.js       # Archivo principal de la aplicación
│   ├── components/       # Componentes HTML
│   └── styles/           # Estilos CSS
│       ├── main.css
│       ├── components.css
│       ├── app.css
│       ├── layout.css
│       └── utilities.css
├── data/                 # Datos y configuraciones
│   ├── config/           # Archivos de configuración
│   │   ├── default-config.json
│   │   ├── menu.json
│   │   ├── temas.json
│   │   └── notificationes.json
│   └── i18n/             # Internacionalización
│       ├── en.json
│       └── es.json
├── config.js             # Configuración inicial
└── README.md             # Este archivo
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
