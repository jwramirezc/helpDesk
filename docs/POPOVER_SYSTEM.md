# Sistema de Popovers para Tablets - Documentación

## 📋 **Descripción General**

El sistema de popovers para tablets es una extensión del sistema de menús existente que proporciona funcionalidad de popovers específicamente para dispositivos con pantalla de 1024px (tablets). Se integra perfectamente con la arquitectura MVC existente y utiliza el archivo `menu.json` como fuente de datos.

## 🎯 **Objetivos**

- **Reutilizable**: Componente popover genérico que puede usarse en cualquier parte de la aplicación
- **Dinámico**: Se alimenta automáticamente desde `menu.json`
- **Responsive**: Solo activo en tablets (1024px)
- **Integrado**: Utiliza la arquitectura y configuración existente
- **No invasivo**: No rompe la funcionalidad existente

## 🏗️ **Arquitectura**

### **Componentes Principales**

1. **`PopoverComponent.js`** - Componente base reutilizable
2. **`MenuPopoverService.js`** - Servicio específico para menús
3. **`popover.css`** - Estilos del componente
4. **Integración en `ControladorMenu.js`** - Manejo automático

### **Flujo de Datos**

```
menu.json → MenuService → MenuPopoverService → PopoverComponent → DOM
```

## 📁 **Estructura de Archivos**

```
src/
├── js/
│   ├── components/
│   │   └── PopoverComponent.js          # Componente base
│   ├── services/
│   │   └── MenuPopoverService.js        # Servicio específico
│   └── controllers/
│       └── ControladorMenu.js           # Integración
└── styles/
    └── components/
        └── popover.css                  # Estilos
```

## 🔧 **Configuración**

### **Breakpoints**

El sistema utiliza los breakpoints definidos en `MenuConfig`:

```javascript
BREAKPOINTS: {
  MOBILE: 768,
  TABLET: 1024,    // ← Solo activo aquí
  DESKTOP: 1200,
}
```

### **Activación Automática**

Los popovers se activan automáticamente cuando:

- El ancho de pantalla está entre 769px y 1024px
- Existen items con submenús en `menu.json`
- El sistema está inicializado correctamente

## 🎨 **Estilos CSS**

### **Clases Principales**

```css
.rs-popover              /* Contenedor principal */
/* Contenedor principal */
/* Contenedor principal */
/* Contenedor principal */
/* Contenedor principal */
/* Contenedor principal */
/* Contenedor principal */
/* Contenedor principal */
.rs-popover-arrow        /* Flecha del popover */
.rs-popover-content      /* Contenido interno */
.rs-popover-item         /* Items individuales */
.rs-popover-separator; /* Separadores */
```

### **Placements Soportados**

- `placement-bottom` - Aparece debajo del trigger
- `placement-top` - Aparece arriba del trigger
- `placement-left` - Aparece a la izquierda
- `placement-right` - Aparece a la derecha

### **Variables CSS Utilizadas**

```css
:root {
  --z-index-popover: 1060;
  --primary-color: #007bff;
  --text-color: #333;
  --border-color: #e0e0e0;
  --hover-color: #e9ecef;
}
```

## 🚀 **Uso del Componente**

### **Uso Básico**

```javascript
// Crear instancia del componente
const popover = new PopoverComponent({
  triggerSelector: '.my-trigger',
  placement: 'bottom',
  offset: 8,
});

// Crear popover desde datos del menú
const popoverElement = popover.createPopoverFromMenu(
  menuItems,
  'popover-id',
  (item, element) => {
    console.log('Item clickeado:', item);
  }
);
```

### **Uso con MenuService**

```javascript
// El servicio se integra automáticamente
const menuPopoverService = new MenuPopoverService(menuService);
await menuPopoverService.initialize();
```

## 📊 **Integración con menu.json**

### **Estructura Requerida**

Los popovers se crean automáticamente para items con `type: "submenu"`:

```json
{
  "id": "menu_config",
  "label": "Configuración",
  "icon": "fas fa-cog",
  "type": "submenu",
  "children": [
    {
      "id": "menu_config_usuarios",
      "label": "Usuarios",
      "icon": "fas fa-users",
      "type": "item",
      "target": "configuracion/usuarios.html"
    }
  ]
}
```

### **Comportamiento**

- **Items con `type: "item"`**: Navegan a la vista correspondiente
- **Items con `type: "submenu"`**: Muestran mensaje de alerta si tienen `openAction: "alert"`

## 🔄 **Eventos y Callbacks**

### **Eventos del PopoverComponent**

```javascript
// Click en trigger
trigger.addEventListener('click', e => {
  popover.togglePopover(popover, trigger);
});

// Click fuera del popover
document.addEventListener('click', e => {
  if (!popover.contains(e.target)) {
    popover.hidePopover(popover);
  }
});

// Redimensionamiento
window.addEventListener('resize', () => {
  popover.hidePopover(popover);
});
```

### **Callbacks del MenuPopoverService**

```javascript
// Callback para clicks en items del popover
const onItemClick = (item, element) => {
  if (item.type === 'item' && item.target) {
    // Navegar a la vista
    navigateToView(item.target);
  }
};
```

## 🎛️ **Configuración Avanzada**

### **Opciones del PopoverComponent**

```javascript
const options = {
  triggerSelector: '.popover-trigger', // Selector de triggers
  placement: 'bottom', // Placement por defecto
  offset: 8, // Offset del popover
  autoClose: true, // Cerrar automáticamente
  closeOnClickOutside: true, // Cerrar al hacer click fuera
  closeOnResize: true, // Cerrar al redimensionar
};
```

### **Métodos Disponibles**

```javascript
// Mostrar popover
popover.showPopover(popover, trigger);

// Ocultar popover
popover.hidePopover(popover);

// Ocultar todos los popovers
popover.hideAll();

// Posicionar popover
popover.positionPopover(popover, trigger);

// Calcular placement óptimo
const placement = popover.calculateOptimalPlacement(triggerRect, popoverRect);
```

## 🐛 **Solución de Problemas**

### **Problemas Comunes**

1. **Popover no aparece**

   - Verificar que el ancho de pantalla está entre 769px y 1024px
   - Confirmar que el trigger tiene la clase `popover-trigger`
   - Verificar que el `data-popover-id` está configurado

2. **Posicionamiento incorrecto**

   - El sistema calcula automáticamente el placement óptimo
   - Verificar que hay suficiente espacio en la pantalla
   - Revisar las clases CSS de placement

3. **Items no funcionan**
   - Verificar que los items en `menu.json` tienen la estructura correcta
   - Confirmar que los callbacks están configurados
   - Revisar la consola para errores

### **Logs de Debugging**

```javascript
// Verificar estado del servicio
const info = menuPopoverService.getServiceInfo();
console.log(info);

// Verificar breakpoint actual
const breakpoint = MenuConfig.getCurrentBreakpoint();
console.log('Breakpoint actual:', breakpoint);
```

## 📈 **Rendimiento**

### **Optimizaciones Implementadas**

- **Caching**: Los popovers se crean una sola vez y se reutilizan
- **Lazy Loading**: Solo se inicializa en el breakpoint correcto
- **Event Delegation**: Uso eficiente de event listeners
- **Cleanup**: Limpieza automática de recursos

### **Métricas de Rendimiento**

```javascript
// Tiempo de inicialización
const startTime = performance.now();
await menuPopoverService.initialize();
const endTime = performance.now();
console.log(`Inicialización: ${endTime - startTime}ms`);

// Número de popovers creados
const info = menuPopoverService.getServiceInfo();
console.log(`Popovers creados: ${info.popoversCount}`);
```

## 🔮 **Extensiones Futuras**

### **Funcionalidades Planificadas**

1. **Animaciones personalizadas**
2. **Temas dinámicos**
3. **Soporte para múltiples niveles**
4. **Integración con otros componentes**

### **APIs Futuras**

```javascript
// Animaciones personalizadas
popover.setAnimation('slide', { duration: 300 });

// Temas dinámicos
popover.setTheme('dark');

// Múltiples niveles
popover.createNestedPopover(parentItem, childItems);
```

## 📝 **Ejemplos de Uso**

### **Ejemplo 1: Popover Personalizado**

```javascript
// Crear popover personalizado
const customItems = [
  { id: 'item1', label: 'Opción 1', icon: 'fas fa-star' },
  { id: 'item2', label: 'Opción 2', icon: 'fas fa-heart' },
];

const popover = new PopoverComponent();
const popoverElement = popover.createPopoverFromMenu(
  customItems,
  'custom-popover',
  item => console.log('Seleccionado:', item.label)
);

document.body.appendChild(popoverElement);
```

### **Ejemplo 2: Integración Manual**

```javascript
// Integración manual con MenuService
const menuService = new MenuService();
const menuPopoverService = new MenuPopoverService(menuService);

// Inicializar manualmente
await menuPopoverService.initialize();

// Verificar estado
const info = menuPopoverService.getServiceInfo();
console.log('Servicio activo:', info.isActiveInCurrentBreakpoint);
```

## ✅ **Checklist de Implementación**

- [x] Componente PopoverComponent creado
- [x] Servicio MenuPopoverService implementado
- [x] Estilos CSS definidos
- [x] Integración en ControladorMenu
- [x] Soporte para breakpoints
- [x] Alimentación desde menu.json
- [x] Eventos y callbacks configurados
- [x] Documentación completa
- [x] Logs de debugging
- [x] Optimizaciones de rendimiento

## 🎉 **Conclusión**

El sistema de popovers para tablets proporciona una experiencia de usuario mejorada en dispositivos de 1024px, manteniendo la consistencia con la arquitectura existente y aprovechando la configuración centralizada del proyecto.
