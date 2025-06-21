# 📍 Configuración de Posicionamiento de Submenús

## 🎯 **Descripción General**

El sistema permite configurar la posición de los submenús (popovers) de forma flexible y específica. Puedes definir la dirección y el offset para cada submenú individualmente.

## 🔧 **Opciones de Configuración**

### 1. **Configuración por Item en `menu.json`**

Puedes agregar propiedades específicas a cada item con submenús:

```json
{
  "id": "menu_config",
  "label": "Configuración",
  "icon": "fas fa-cog",
  "type": "submenu",
  "popoverPlacement": "top", // Dirección del popover
  "popoverOffset": 12, // Distancia del trigger (px)
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

#### **Propiedades Disponibles**

| Propiedad          | Tipo   | Descripción           | Valores                                  |
| ------------------ | ------ | --------------------- | ---------------------------------------- |
| `popoverPlacement` | string | Dirección del popover | `'top'`, `'bottom'`, `'left'`, `'right'` |
| `popoverOffset`    | number | Distancia del trigger | Número en píxeles (ej: 8, 12, 16)        |

### 2. **Configuración Global en `componentConfig.js`**

Configuración centralizada para todos los submenús:

```javascript
POPOVER: {
  SUBMENU: {
    DEFAULT_PLACEMENT: 'bottom',    // Placement por defecto
    DEFAULT_OFFSET: 8,              // Offset por defecto

    // Placements automáticos por posición del menú
    PLACEMENTS_BY_MENU_POSITION: {
      'top': 'bottom',    // Items superiores → popover abajo
      'bottom': 'top',    // Items inferiores → popover arriba
      'left': 'right',    // Items izquierdos → popover derecha
      'right': 'left',    // Items derechos → popover izquierda
    },

    // Configuración personalizada por ID
    CUSTOM_PLACEMENTS: {
      'menu_config': 'top',      // Configuración siempre arriba
      'menu_reportes': 'right',  // Reportes siempre a la derecha
      'menu_consultas': 'left',  // Consultas siempre a la izquierda
    }
  }
}
```

## 🎨 **Comportamiento Visual**

### **Direcciones Disponibles**

- **`top`**: El popover aparece arriba del botón, flecha apunta hacia abajo
- **`bottom`**: El popover aparece debajo del botón, flecha apunta hacia arriba
- **`left`**: El popover aparece a la izquierda del botón, flecha apunta hacia la derecha
- **`right`**: El popover aparece a la derecha del botón, flecha apunta hacia la izquierda

### **Offset (Distancia)**

- **Valor por defecto**: 8px
- **Rango recomendado**: 4px - 20px
- **Efecto**: Controla la distancia entre el botón y el popover

## 📋 **Ejemplos de Configuración**

### **Ejemplo 1: Submenú Arriba**

```json
{
  "id": "menu_config",
  "label": "Configuración",
  "type": "submenu",
  "popoverPlacement": "top",
  "popoverOffset": 12,
  "children": [...]
}
```

### **Ejemplo 2: Submenú a la Derecha**

```json
{
  "id": "menu_reportes",
  "label": "Reportes",
  "type": "submenu",
  "popoverPlacement": "right",
  "popoverOffset": 16,
  "children": [...]
}
```

### **Ejemplo 3: Submenú a la Izquierda**

```json
{
  "id": "menu_consultas",
  "label": "Consultas",
  "type": "submenu",
  "popoverPlacement": "left",
  "popoverOffset": 10,
  "children": [...]
}
```

## 🔄 **Prioridad de Configuración**

El sistema sigue este orden de prioridad para determinar la posición:

1. **Configuración personalizada por ID** (en `componentConfig.js`)
2. **Configuración específica del item** (en `menu.json`)
3. **Configuración automática por posición** (según sección del menú)
4. **Configuración por defecto** (valores globales)

## 🧪 **Verificación y Testing**

### **Verificar Configuración Actual**

```javascript
// Obtener configuración de un submenú específico
const menuService = new MenuService();
const menuPopoverService = new MenuPopoverService(menuService);

// Verificar placement de un item específico
const item = await menuService.findItemById('menu_config');
const placement = menuPopoverService.determineSubmenuPlacement(item);
console.log('Placement configurado:', placement);
```

### **Testing de Diferentes Configuraciones**

1. **Cambiar `popoverPlacement`** en `menu.json`
2. **Ajustar `popoverOffset`** para diferentes distancias
3. **Agregar configuraciones personalizadas** en `componentConfig.js`
4. **Verificar comportamiento** en diferentes tamaños de pantalla

## 🎛️ **Configuración Avanzada**

### **Configuración Dinámica**

```javascript
// Cambiar placement dinámicamente
const popoverComponent = new PopoverComponent();
popoverComponent.setForcePlacement('top');

// Limpiar placement forzado
popoverComponent.clearForcePlacement();
```

### **Configuración por Breakpoint**

```javascript
// Configuración específica para tablets
if (window.innerWidth >= 769 && window.innerWidth <= 1024) {
  // Usar placement específico para tablets
  popoverComponent.setForcePlacement('right');
}
```

## 📝 **Mejores Prácticas**

### **Recomendaciones de UX**

1. **Items superiores**: Usar `bottom` para evitar que se salgan de la pantalla
2. **Items inferiores**: Usar `top` para mantener visibilidad
3. **Items laterales**: Usar `left` o `right` según el espacio disponible
4. **Offset consistente**: Mantener valores similares para coherencia visual

### **Consideraciones Técnicas**

1. **Espacio disponible**: Verificar que hay suficiente espacio para el popover
2. **Responsive**: Considerar diferentes tamaños de pantalla
3. **Accesibilidad**: Asegurar que el popover sea accesible con teclado
4. **Performance**: Evitar cambios frecuentes de configuración

## 🐛 **Solución de Problemas**

### **Problema: Popover se sale de la pantalla**

- **Solución**: Cambiar `popoverPlacement` a una dirección con más espacio
- **Ejemplo**: Cambiar de `bottom` a `top` si está en la parte inferior

### **Problema: Popover muy cerca del botón**

- **Solución**: Aumentar `popoverOffset`
- **Ejemplo**: Cambiar de 8px a 12px o 16px

### **Problema: Configuración no se aplica**

- **Verificar**: Que el ID del item coincida exactamente
- **Verificar**: Que la propiedad esté bien escrita en `menu.json`
- **Verificar**: Que no haya errores en la consola

## 🎉 **Resultado Final**

Con esta configuración tienes control total sobre:

- ✅ **Posición de cada submenú** individualmente
- ✅ **Distancia del popover** al botón activador
- ✅ **Comportamiento automático** según la posición del menú
- ✅ **Configuración centralizada** para casos especiales
- ✅ **Flexibilidad total** para casos específicos

La configuración es intuitiva y permite crear experiencias de usuario optimizadas para cada contexto específico.
