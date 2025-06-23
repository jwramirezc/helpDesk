# 🎨 GUÍA DEL SISTEMA DE TEMAS - PORTAL HELP DESK

## 📋 **RESUMEN DEL SISTEMA**

El sistema de temas ha sido **simplificado y optimizado** para incluir únicamente las variables que realmente necesitan cambiar con el tema. Se han separado las configuraciones por componentes específicos: **sidebar** y **submenu**.

## 🏗️ **ARQUITECTURA DEL SISTEMA**

### **📁 Estructura de Archivos**

```
src/
├── styles/
│   └── components/
│       └── app.css              # Variables del sistema (constantes)
├── js/
│   └── utils/
│       └── TemaHelper.js        # Lógica de aplicación de temas
└── data/
    └── config/
        └── temas.json           # Configuración de temas por componente
```

### **🎯 Separación de Responsabilidades**

#### **`app.css` - Variables del Sistema (CONSTANTES)**

- **NO TEMATIZABLES**: Layout, spacing, transitions, z-index, font sizes, border radius, box shadows
- **COLORES GLOBALES**: Colores primarios, secundarios, de texto, fondos, bordes (no cambian con tema)

#### **`temas.json` - Variables Temáticas (PERSONALIZABLES)**

- **SIDEBAR**: Logo, colores específicos del sidebar
- **SUBMENU**: Colores específicos del submenu
- **COMPORTAMIENTOS**: Configuraciones específicas del tema

#### **`TemaHelper.js` - Aplicación de Temas**

- **CARGA**: Lee temas desde JSON
- **APLICACIÓN**: Establece variables CSS específicas por componente
- **GESTIÓN**: Maneja cambios de tema y persistencia

## 🎨 **VARIABLES TEMÁTICAS DISPONIBLES**

### **📱 SIDEBAR - Variables Temáticas**

```json
{
  "sidebar": {
    "logo": "public/images/logo-saia-light.png",
    "logo-movil": "public/images/logo-movil-light.png",
    "sidebar-bg": "#f5f5f6",
    "icon-color": "#555555",
    "icon-color-active": "#ffffff",
    "background-icon": "#e8e8e8",
    "focus-color": "rgba(0, 123, 255, 0.25)",
    "hover-color": "rgba(0, 0, 0, 0.05)"
  }
}
```

### **📋 SUBMENU - Variables Temáticas**

```json
{
  "submenu": {
    "color": "#1a1a1a",
    "icon-color": "#6c757d",
    "icon-color-active": "#007bff",
    "background-icon": "#e8e8e8",
    "focus-color": "rgba(0, 123, 255, 0.25)",
    "hover-color": "rgba(0, 0, 0, 0.05)"
  }
}
```

### **⚙️ COMPORTAMIENTOS - Configuraciones**

```json
{
  "comportamientos": {
    "mobile-menu-hover-text-change": false,
    "mobile-menu-active-text-change": false,
    "mobile-menu-focus-text-change": false,
    "mobile-menu-hover-bg": true,
    "mobile-menu-active-bg": true,
    "mobile-menu-focus-bg": true
  }
}
```

## ⚙️ **VARIABLES DEL SISTEMA (NO TEMATIZABLES)**

### **📐 Layout & Dimensions**

```css
--sidebar-width: 60px;
--header-height: 60px;
--submenu-width: 240px;
--mobile-menu-width: 280px;
```

### **🔘 Border Radius**

```css
--border-radius-xs: 4px;
--border-radius-sm: 6px;
--border-radius-md: 8px;
--border-radius-lg: 10px;
--border-radius-xl: 12px;
--border-radius-xxl: 20px;
--border-radius-circle: 50%;
--border-radius-pill: 1rem;
```

### **📏 Spacing**

```css
--spacing-xs: 0.25rem;
--spacing-sm: 0.5rem;
--spacing-md: 1rem;
--spacing-lg: 1.5rem;
--spacing-xl: 2rem;
--spacing-xxl: 3rem;
```

### **⏱️ Transitions**

```css
--transition-fast: all 0.15s ease;
--transition-base: all 0.3s ease;
--transition-slow: all 0.5s ease;
```

### **📚 Z-Index**

```css
--z-index-dropdown: 1000;
--z-index-sticky: 1020;
--z-index-fixed: 1030;
--z-index-modal-backdrop: 1040;
--z-index-modal: 1050;
--z-index-popover: 1060;
--z-index-tooltip: 1070;
--z-index-mobile-toggle: 9999;
```

### **🔤 Typography**

```css
--font-size-xs: 0.75rem;
--font-size-sm: 0.875rem;
--font-size-base: 1rem;
--font-size-lg: 1.125rem;
--font-size-xl: 1.25rem;
--font-size-xxl: 1.5rem;

--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

### **🌫️ Box Shadows**

```css
--shadow-xs: 0 1px 3px rgba(0, 0, 0, 0.12);
--shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 8px 15px rgba(0, 0, 0, 0.15);
--shadow-xl: 0 10px 30px rgba(0, 0, 0, 0.3);
--shadow-focus: 0 0 0 3px rgba(0, 123, 255, 0.1);
--shadow-focus-primary: 0 0 0 2px rgba(0, 123, 255, 0.25);
--shadow-focus-danger: 0 0 0 2px rgba(220, 53, 69, 0.25);
```

## 🚀 **CÓMO AGREGAR UN NUEVO TEMA**

### **PASO 1: Definir el Tema en `temas.json`**

```json
{
  "id": "corporate",
  "nombre": "Tema Corporativo",
  "modo": "corporate",
  "sidebar": {
    "logo": "public/images/logo-corporate.png",
    "logo-movil": "public/images/logo-movil-corporate.png",
    "sidebar-bg": "#2c3e50",
    "icon-color": "#555555",
    "icon-color-active": "#ffffff",
    "background-icon": "#34495e",
    "focus-color": "rgba(44, 62, 80, 0.25)",
    "hover-color": "rgba(44, 62, 80, 0.1)"
  },
  "submenu": {
    "color": "#2c3e50",
    "icon-color": "#6c757d",
    "icon-color-active": "#3498db",
    "background-icon": "#34495e",
    "focus-color": "rgba(44, 62, 80, 0.25)",
    "hover-color": "rgba(44, 62, 80, 0.1)"
  },
  "comportamientos": {
    "mobile-menu-hover-text-change": true,
    "mobile-menu-active-text-change": true,
    "mobile-menu-focus-text-change": true,
    "mobile-menu-hover-bg": true,
    "mobile-menu-active-bg": true,
    "mobile-menu-focus-bg": true
  }
}
```

### **PASO 2: Agregar al Array de Temas**

```json
{
  "temas": [
    // ... temas existentes
    {
      "id": "corporate"
      // ... definición del tema
    }
  ],
  "temaPorDefecto": "dark"
}
```

### **PASO 3: Probar el Tema**

```javascript
// En la consola del navegador
const temaHelper = new TemaHelper();
temaHelper.cambiarModo('corporate');
```

## 🔧 **API DEL TEMAHELPER**

### **Métodos Principales**

```javascript
// Cambiar tema
temaHelper.cambiarModo('light');
temaHelper.cambiarModo('dark');
temaHelper.cambiarModo('corporate');

// Obtener información
temaHelper.obtenerTemasDisponibles();
temaHelper.obtenerTemaActual();
temaHelper.obtenerTemaActualCompleto();

// Obtener recursos del tema
temaHelper.obtenerLogoTemaActual();
temaHelper.obtenerLogoMovilTemaActual();
temaHelper.obtenerComportamientosActuales();

// Cambiar al siguiente tema
temaHelper.cambiarTema();
```

### **Eventos del Sistema**

```javascript
// Escuchar cambios de tema
document.addEventListener('themeChanged', event => {
  console.log('Tema cambiado a:', event.detail.tema);
});

// Escuchar errores de tema
document.addEventListener('themeError', event => {
  console.error('Error en tema:', event.detail.error);
});
```

## 🎯 **BENEFICIOS DE LA SIMPLIFICACIÓN**

### **✅ VENTAJAS**

1. **Simplicidad**: Solo las variables que realmente cambian están en el JSON
2. **Mantenibilidad**: Menos variables que gestionar
3. **Rendimiento**: Menos variables CSS que aplicar
4. **Claridad**: Separación clara por componentes
5. **Escalabilidad**: Fácil agregar nuevos componentes temáticos

### **🎨 COMPONENTES TEMATIZABLES**

- **Sidebar**: Logo, colores de fondo, iconos activos, hover, focus
- **Submenu**: Colores de texto, iconos activos, hover, focus
- **Comportamientos**: Configuraciones específicas del tema

### **⚙️ COMPONENTES DEL SISTEMA**

- **Layout**: Dimensiones, espaciado, z-index
- **Tipografía**: Tamaños, pesos de fuente
- **Efectos**: Border radius, box shadows, transitions
- **Colores Globales**: Paleta principal (no cambia con tema)

## 🔍 **DEBUGGING**

### **Verificar Variables Aplicadas**

```javascript
// En la consola del navegador
const root = document.documentElement;
const computedStyle = getComputedStyle(root);

// Verificar variables del sidebar
console.log(
  'Sidebar BG:',
  computedStyle.getPropertyValue('--background-color-dark')
);
console.log(
  'Icon Active:',
  computedStyle.getPropertyValue('--icon-color-active')
);

// Verificar variables del submenu
console.log('Text Color:', computedStyle.getPropertyValue('--text-color'));
```

### **Verificar Tema Actual**

```javascript
// Verificar tema en localStorage
console.log(JSON.parse(localStorage.getItem('config')));

// Verificar atributo data-theme
console.log(document.body.getAttribute('data-theme'));
```

## 📊 **ESTADÍSTICAS DEL SISTEMA**

- **Variables Temáticas**: 14 variables (8 sidebar + 6 submenu)
- **Variables del Sistema**: 35 variables (constantes)
- **Temas Disponibles**: 2 (light, dark)
- **Comportamientos**: 6 configuraciones
- **Componentes Tematizables**: 2 (sidebar, submenu)

## 🎯 **BEST PRACTICES**

### **✅ HACER**

- Usar variables temáticas solo para componentes específicos
- Mantener colores globales en CSS como constantes
- Documentar nuevos temas agregados
- Probar temas en diferentes componentes
- Usar nombres descriptivos para variables

### **❌ NO HACER**

- Agregar variables globales al JSON de temas
- Duplicar configuraciones entre temas
- Ignorar la accesibilidad en temas
- Usar colores que no contrasten bien
- Modificar variables del sistema en temas

---

**Última actualización**: $(date)
**Versión del sistema**: 3.0 (Simplificado)
**Compatibilidad**: CSS Custom Properties (IE11+)
