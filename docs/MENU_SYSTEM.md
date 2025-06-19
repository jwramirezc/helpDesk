# Sistema de Menús - Documentación Técnica

## 📋 **Descripción General**

El sistema de menús es una arquitectura modular que maneja la navegación tanto en dispositivos de escritorio como móviles, con soporte completo para submenús y gestión de estado.

## 🏗️ **Arquitectura**

### **Componentes Principales**

1. **`MenuItem.js`** - Modelo de datos para cada ítem del menú
2. **`MenuService.js`** - Servicio para gestión de datos y validación
3. **`MenuView.js`** - Vista para renderizado del DOM
4. **`ControladorMenu.js`** - Controlador principal que coordina todo
5. **`menu.json`** - Configuración de la estructura del menú
6. **`menu.css`** - Estilos del sistema de menús

## 📁 **Estructura de Archivos**

```
src/js/
├── models/
│   └── MenuItem.js          # Modelo de datos
├── services/
│   └── MenuService.js       # Servicio de datos
├── views/
│   └── MenuView.js          # Vista del menú
├── controllers/
│   └── ControladorMenu.js   # Controlador principal
└── styles/components/
    └── menu.css             # Estilos del menú

data/config/
└── menu.json               # Configuración del menú
```

## 🔧 **Configuración del Menú (menu.json)**

### **Estructura Básica**

```json
{
  "menuItems": {
    "top": [
      {
        "id": "menu_home",
        "label": "Home",
        "icon": "fas fa-home",
        "type": "item",
        "target": "home.html"
      }
    ],
    "bottom": [
      {
        "id": "menu_config",
        "label": "Configuración",
        "type": "submenu",
        "openAction": "alert",
        "message": "Submenú activado",
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
    ]
  }
}
```

### **Propiedades de los Ítems**

| Propiedad    | Tipo   | Requerido | Descripción                               |
| ------------ | ------ | --------- | ----------------------------------------- |
| `id`         | string | ✅        | Identificador único                       |
| `label`      | string | ✅        | Texto a mostrar                           |
| `type`       | string | ✅        | `"item"` o `"submenu"`                    |
| `icon`       | string | ❌        | Clase CSS del ícono (Font Awesome)        |
| `target`     | string | ❌        | URL destino (solo para `type: "item"`)    |
| `openAction` | string | ❌        | Acción al abrir (`"alert"` para submenús) |
| `message`    | string | ❌        | Mensaje para alertas                      |
| `children`   | array  | ❌        | Subítems (solo para `type: "submenu"`)    |

## 🎯 **Funcionalidades Principales**

### **1. Gestión de Estado**

- Persistencia en `sessionStorage`
- Solo un ítem activo a la vez
- Activación automática de padres en submenús

### **2. Responsive Design**

- **Desktop**: Submenús con alertas o expansión inline
- **Mobile**: Submenús en vistas separadas con botón "Volver"

### **3. Temas**

- Cambio dinámico de tema
- Actualización automática de íconos y logos

### **4. Validación**

- Validación de estructura del menú
- Validación de elementos del DOM
- Reportes de errores detallados

## 🔍 **Métodos de Debugging**

### **ControladorMenu**

```javascript
// Obtener estado actual
const state = controladorMenu.getControllerState();

// Validar estructura del menú
const validation = await controladorMenu.validateMenuStructure();
```

### **MenuService**

```javascript
// Obtener estadísticas
const stats = await menuService.getMenuStats();

// Obtener ítems con submenús
const submenuItems = await menuService.getSubmenuItems();

// Validar estructura
const errors = await menuService.validateMenuStructure();
```

### **MenuView**

```javascript
// Obtener estado de la vista
const viewState = menuView.getViewState();

// Validar DOM
const domValid = menuView.validateDOM();
```

## 🚀 **Agregar Nuevos Ítems**

### **1. Ítem Simple**

```json
{
  "id": "menu_nuevo",
  "label": "Nuevo Ítem",
  "icon": "fas fa-plus",
  "type": "item",
  "target": "nuevo.html"
}
```

### **2. Submenú**

```json
{
  "id": "menu_submenu",
  "label": "Submenú",
  "icon": "fas fa-folder",
  "type": "submenu",
  "openAction": "alert",
  "message": "Submenú activado",
  "children": [
    {
      "id": "subitem1",
      "label": "Subítem 1",
      "icon": "fas fa-file",
      "type": "item",
      "target": "subitem1.html"
    }
  ]
}
```

## 🎨 **Personalización de Estilos**

### **Variables CSS Disponibles**

```css
:root {
  --primary-color: #007bff;
  --icon-color: #6c757d;
  --icon-color-active: #ffffff;
  --background-color: #f8f9fa;
  --border-color: #e0e0e0;
  --text-color: #333;
  --hover-color: #e9ecef;
}
```

### **Clases CSS Importantes**

- `.menu-item` / `.mobile-menu-item` - Ítems del menú
- `.active` - Estado activo
- `.has-submenu` - Ítems con submenús
- `.mobile-submenu-header` - Encabezado de submenú móvil
- `.mobile-back-button` - Botón de volver

## 🐛 **Solución de Problemas**

### **Problemas Comunes**

1. **Ítem no se activa**

   - Verificar que el ID existe en `menu.json`
   - Revisar console para errores de validación

2. **Submenú no funciona en móvil**

   - Verificar que el ítem tiene `children` definidos
   - Validar que `type` es `"submenu"`

3. **Estilos no se aplican**
   - Verificar que `menu.css` está incluido
   - Revisar variables CSS del tema

### **Logs de Debugging**

El sistema incluye logs detallados en la consola:

- Carga del menú
- Activación de ítems
- Cambios de vista móvil
- Errores de validación

## 📈 **Escalabilidad**

### **Para Crecimiento Futuro**

1. **Múltiples Niveles de Submenús**

   - El sistema soporta submenús anidados
   - Cada nivel se maneja automáticamente

2. **Acciones Personalizadas**

   - Extender `openAction` para nuevas acciones
   - Implementar en `ControladorMenu.handleClick()`

3. **Permisos y Roles**

   - Agregar propiedad `permissions` a los ítems
   - Implementar filtrado en `MenuService`

4. **Internacionalización**
   - Agregar propiedad `i18n` para múltiples idiomas
   - Implementar en `MenuItem.toHTML()`

## 🔒 **Seguridad**

- Validación de entrada en `MenuItem` constructor
- Sanitización de HTML en `toHTML()`
- Validación de URLs en `cargarVista()`

## 📊 **Métricas y Monitoreo**

El sistema proporciona métricas automáticas:

- Número total de ítems
- Número de submenús
- Número de subítems
- Estado del DOM
- Errores de validación

---

**Última actualización**: Diciembre 2024
**Versión**: 1.0.0
