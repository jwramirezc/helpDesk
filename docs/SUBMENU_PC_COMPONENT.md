# 🖥️ SubmenuPCComponent - Documentación Técnica

## 📋 **Descripción General**

El `SubmenuPCComponent` es un componente especializado para mostrar submenús en pantallas de escritorio (Desktop). Se posiciona a la derecha de la barra lateral y se activa dinámicamente cuando el usuario hace clic en un ítem con subitems del menú principal.

## 🎯 **Características Principales**

- ✅ **Solo para Desktop**: Funciona exclusivamente en pantallas mayores a 1024px
- ✅ **Posicionamiento Fijo**: Se ubica a la derecha de la sidebar
- ✅ **Activación Dinámica**: Se muestra automáticamente al hacer clic en ítems con submenús
- ✅ **Navegación Automática**: Carga automáticamente el primer subitem
- ✅ **Cierre Inteligente**: Se cierra al hacer clic en el botón X o en ítems normales
- ✅ **Responsive**: Se oculta automáticamente en dispositivos móviles

## 🏗️ **Arquitectura del Componente**

### **Dependencias**

```javascript
// Servicios requeridos
- MenuService: Para obtener datos del menú
- ControladorContenido: Para cargar vistas
```

### **Integración con ControladorMenu**

```javascript
// En ControladorMenu.js
this.submenuPCComponent = new SubmenuPCComponent(
  this.menuService,
  this.controladorContenido
);
```

## 🎨 **Estructura Visual**

### **Layout del Submenú**

```
┌─────────────────────────────────────────────────────────┐
│ [Sidebar] [Submenu-PC] [Header]                        │
│         │            │                                  │
│         │ ┌────────┐ │ ┌─────────────────────────────┐  │
│         │ │ Header │ │ │        Header               │  │
│         │ │  Title │ │ │                             │  │
│         │ │  [X]   │ │ └─────────────────────────────┘  │
│         │ └────────┘ │                                  │
│         │ ┌────────┐ │ ┌─────────────────────────────┐  │
│         │ │ Items  │ │ │                             │  │
│         │ │  [•]   │ │ │        Main Content         │  │
│         │ │  [•]   │ │ │                             │  │
│         │ │  [•]   │ │ │                             │  │
│         │ └────────┘ │ └─────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### **Dimensiones**

- **Ancho**: `--submenu-width: 240px`
- **Posición**: `left: var(--sidebar-width)` (60px)
- **Altura**: `100vh`
- **Z-index**: 999 (menor que sidebar, mayor que contenido)

## 🔧 **Configuración CSS**

### **Variables Requeridas**

```css
:root {
  --submenu-width: 240px;
  --sidebar-width: 60px;
  --header-height: 60px;
  --background-color-light: #ffffff;
  --border-main-content: #d1d0d0;
  --text-color: #1a1a1a;
  --text-color-secondary: #6c757d;
  --primary-color: #3498db;
  --primary-color-light: #5dade2;
  --background-color-hover: #f5f5f5;
  --border-color: #e0e0e0;
  --transition-base: all 0.3s ease;
  --transition-fast: all 0.15s ease;
}
```

### **Clases CSS Principales**

- `.submenu-pc` - Contenedor principal
- `.submenu-pc.active` - Estado visible
- `.submenu-pc-header` - Cabecera del submenú
- `.submenu-pc-title` - Título del submenú
- `.submenu-pc-close` - Botón de cerrar
- `.submenu-pc-items` - Contenedor de items
- `.submenu-pc-item` - Item individual
- `.submenu-pc-item.active` - Item activo

## 🚀 **Funcionalidades**

### **1. Activación del Submenú**

```javascript
// Se activa automáticamente cuando:
// - Usuario hace clic en ítem con type: "submenu"
// - Pantalla es mayor a 1024px
// - El ítem tiene children definidos

submenuPCComponent.show(menuItem);
```

### **2. Carga Automática del Primer Item**

```javascript
// Al mostrar el submenú:
// 1. Se activa el primer subitem
// 2. Se carga automáticamente su vista
// 3. Se marca como activo visualmente

const firstChild = menuItem.children[0];
this.setActiveSubmenuItem(firstChild.id);
this.contentController.cargarVista(vistaName);
```

### **3. Navegación entre Subitems**

```javascript
// Al hacer clic en un subitem:
// 1. Se carga la vista correspondiente
// 2. Se actualiza el estado activo
// 3. Se mantiene el submenú abierto

this.contentController.cargarVista(vistaName);
this.setActiveSubmenuItem(subMenuItem.dataset.id);
```

### **4. Cierre del Submenú**

```javascript
// Se cierra cuando:
// - Usuario hace clic en el botón X
// - Usuario hace clic en un ítem normal del menú
// - Pantalla cambia a móvil (< 1024px)

submenuPCComponent.hide();
```

## 📱 **Comportamiento Responsive**

### **Desktop (> 1024px)**

- ✅ Submenú visible y funcional
- ✅ Layout ajustado automáticamente
- ✅ Transiciones suaves

### **Tablet (769px - 1024px)**

- ❌ Submenú oculto
- ✅ Layout normal sin ajustes
- ✅ Popovers para submenús

### **Mobile (≤ 768px)**

- ❌ Submenú oculto
- ✅ Layout normal sin ajustes
- ✅ Vista móvil para submenús

## 🔄 **Integración con el Sistema**

### **ControladorMenu**

```javascript
// En handleMenuItemClick()
if (type === 'submenu') {
  await this.activarSoloItem(id);

  // En desktop, mostrar el submenú PC
  if (window.innerWidth > 1024) {
    const menuItem = await this.menuService.findItemById(id);
    if (menuItem && this.submenuPCComponent) {
      this.submenuPCComponent.show(menuItem);
    }
  }
  return;
}
```

### **Manejo de Resize**

```javascript
// En manejarCambioTamanio()
const isMobile = window.innerWidth <= MenuConfig.BREAKPOINTS.MOBILE;

// Ocultar submenú PC en móvil
if (isMobile && this.submenuPCComponent) {
  this.submenuPCComponent.hide();
}
```

## 🎯 **Casos de Uso**

### **1. Configuración del Sistema**

```json
{
  "id": "menu_config",
  "label": "Configuración",
  "type": "submenu",
  "children": [
    {
      "id": "menu_config_usuarios",
      "label": "Usuarios",
      "type": "item",
      "target": "configuracion/usuarios.html"
    }
  ]
}
```

**Comportamiento:**

1. Usuario hace clic en "Configuración"
2. Se muestra el submenú PC
3. Se carga automáticamente "Usuarios"
4. Se marca "Usuarios" como activo

### **2. Navegación entre Subitems**

**Comportamiento:**

1. Submenú ya está abierto
2. Usuario hace clic en "Perfiles"
3. Se carga la vista de perfiles
4. Se actualiza el estado activo

### **3. Cierre del Submenú**

**Comportamiento:**

1. Usuario hace clic en "Home"
2. Se cierra el submenú PC
3. Se carga la vista de Home
4. Layout vuelve a su estado normal

## 🐛 **Solución de Problemas**

### **Problema: Submenú no se muestra**

**Causas posibles:**

- Pantalla menor a 1024px
- CSS no cargado correctamente
- Variables CSS no definidas
- Componente no inicializado

**Solución:**

```javascript
// Verificar que el componente esté inicializado
console.log('SubmenuPCComponent:', this.submenuPCComponent);

// Verificar el ancho de pantalla
console.log('Window width:', window.innerWidth);

// Verificar que el CSS esté cargado
console.log('Submenu CSS:', document.querySelector('.submenu-pc'));
```

### **Problema: Layout no se ajusta**

**Causas posibles:**

- Variables CSS no definidas
- Clase `submenu-active` no se aplica
- CSS específico no se carga

**Solución:**

```css
/* Verificar que estas variables estén definidas */
:root {
  --submenu-width: 240px;
  --sidebar-width: 60px;
}

/* Verificar que estos estilos se apliquen */
body.submenu-active #main-content {
  margin-left: calc(var(--sidebar-width) + var(--submenu-width));
}
```

### **Problema: Vistas no se cargan**

**Causas posibles:**

- Target mal formateado en menu.json
- ControladorContenido no disponible
- Error en la extracción del nombre de vista

**Solución:**

```javascript
// Verificar el target en menu.json
console.log('Menu item target:', menuItem.target);

// Verificar el controlador de contenido
console.log('Content controller:', this.contentController);

// Verificar la extracción del nombre de vista
const fileName = target.split('/').pop();
const vistaName = fileName.replace('.html', '');
console.log('Vista name:', vistaName);
```

## 📈 **Métricas de Rendimiento**

### **Tiempos de Respuesta Esperados**

- **Activación del submenú**: < 50ms
- **Carga de vista**: < 200ms
- **Transiciones CSS**: < 300ms
- **Ajuste de layout**: < 100ms

### **Optimizaciones Implementadas**

- ✅ **Lazy Loading**: Solo se crea cuando es necesario
- ✅ **Event Delegation**: Un solo listener para todos los items
- ✅ **CSS Transitions**: Animaciones optimizadas
- ✅ **Memory Management**: Limpieza automática de recursos

## 🎉 **Resultado Final**

Con esta implementación, el componente SubmenuPCComponent proporciona:

- ✅ **Experiencia de usuario fluida** en desktop
- ✅ **Integración perfecta** con el sistema existente
- ✅ **Responsive design** automático
- ✅ **Navegación intuitiva** con carga automática
- ✅ **Mantenibilidad** y escalabilidad
- ✅ **Performance optimizada** para diferentes dispositivos

El componente está listo para producción y cumple con todos los requisitos especificados.
