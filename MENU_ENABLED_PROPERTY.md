# Implementación de Propiedad "enabled" en el Menú

## Resumen

Se ha implementado la propiedad `enabled` en el sistema de menús para permitir mostrar u ocultar elementos del menú de forma dinámica y administrable desde la configuración JSON.

## Archivos Modificados

### 1. `data/config/menu-config.json`

- **Cambio**: Agregada la propiedad `enabled: true` a todos los elementos del menú
- **Descripción**: Cada elemento del menú ahora incluye la propiedad `enabled` con valor por defecto `true`

#### Ejemplo de estructura:

```json
{
  "id": "menu_home",
  "label": "Home",
  "icon": "fas fa-home",
  "type": "item",
  "target": "home.html",
  "enabled": true
}
```

### 2. `src/js/models/MenuItem.js`

- **Cambio**: Agregada propiedad `enabled` al constructor y métodos relacionados
- **Líneas**: Constructor (línea ~40) y método `isEnabled()` (línea ~70)

#### Nuevas funcionalidades:

1. **Propiedad enabled**: Se almacena en la instancia del MenuItem
2. **Valor por defecto**: `true` si no se especifica en la configuración
3. **Método isEnabled()**: Retorna el estado de habilitación del ítem
4. **Filtrado en toHTML()**: No genera HTML si el ítem está deshabilitado
5. **Debug info**: Incluye información sobre el estado enabled

### 3. `src/js/services/MenuService.js`

- **Cambio**: Actualizado el procesamiento de datos para filtrar elementos habilitados
- **Líneas**: `processMenuData()` (línea ~120) y nuevos métodos

#### Nuevas funcionalidades:

1. **Filtrado automático**: Solo procesa elementos con `enabled: true`
2. **getEnabledMenuItems()**: Método específico para obtener solo elementos habilitados
3. **getEnabledMenuStats()**: Estadísticas de elementos habilitados

## Funcionalidades Implementadas

### 1. **Configuración Dinámica**

- Los elementos del menú se pueden habilitar/deshabilitar desde `menu-config.json`
- Cambios en la configuración se reflejan automáticamente sin reiniciar la aplicación
- Valor por defecto `true` mantiene la funcionalidad existente

### 2. **Filtrado Automático**

- Los elementos deshabilitados no se renderizan en el HTML
- Se aplica tanto para elementos principales como subelementos
- Funciona en sidebar desktop y menú móvil

### 3. **Métodos de Consulta**

- `MenuItem.isEnabled()`: Verifica si un ítem específico está habilitado
- `MenuService.getEnabledMenuItems()`: Obtiene solo elementos habilitados
- `MenuService.getEnabledMenuStats()`: Estadísticas de elementos habilitados

## Uso de la Propiedad "enabled"

### Para Habilitar un Elemento:

```json
{
  "id": "menu_example",
  "label": "Ejemplo",
  "icon": "fas fa-star",
  "type": "item",
  "target": "example.html",
  "enabled": true
}
```

### Para Deshabilitar un Elemento:

```json
{
  "id": "menu_example",
  "label": "Ejemplo",
  "icon": "fas fa-star",
  "type": "item",
  "target": "example.html",
  "enabled": false
}
```

### Para Subelementos:

```json
{
  "id": "menu_submenu",
  "label": "Submenú",
  "type": "submenu",
  "enabled": true,
  "children": [
    {
      "id": "subitem_1",
      "label": "Subitem 1",
      "enabled": true
    },
    {
      "id": "subitem_2",
      "label": "Subitem 2",
      "enabled": false
    }
  ]
}
```

## Comportamiento del Sistema

### 1. **Elementos Principales (Top/Bottom)**

- Si `enabled: false`, el elemento no aparece en el menú
- No afecta la funcionalidad de otros elementos
- Se mantiene la estructura del menú

### 2. **Subelementos (Children)**

- Si un subelemento tiene `enabled: false`, no aparece en el submenú
- Si todos los subelementos están deshabilitados, el submenú aparece vacío
- El elemento padre mantiene su funcionalidad

### 3. **Renderizado**

- Los elementos deshabilitados no generan HTML
- No ocupan espacio en el layout
- No afectan la navegación

## Ventajas de la Implementación

### 1. **Administrabilidad**

- Control centralizado desde archivo JSON
- Cambios sin modificar código
- Fácil mantenimiento y escalabilidad

### 2. **Flexibilidad**

- Habilitar/deshabilitar elementos dinámicamente
- Configuración por entorno (desarrollo, producción)
- Control granular por elemento

### 3. **Compatibilidad**

- Mantiene funcionalidad existente
- Valor por defecto `true` asegura compatibilidad
- No afecta elementos sin la propiedad

### 4. **Performance**

- Filtrado temprano en el procesamiento
- No genera HTML innecesario
- Optimización automática

## Ejemplos de Uso

### Deshabilitar Temporalmente un Elemento:

```json
{
  "id": "menu_helpdesk",
  "label": "Help Desk",
  "icon": "fas fa-ticket",
  "type": "item",
  "target": "helpdesk.html",
  "enabled": false
}
```

### Deshabilitar Subelementos Específicos:

```json
{
  "id": "menu_reportes",
  "label": "Reportes",
  "type": "submenu",
  "enabled": true,
  "children": [
    {
      "id": "tickets_pendientes",
      "label": "Tickets Pendientes",
      "enabled": true
    },
    {
      "id": "tickets_proceso",
      "label": "Tickets en Proceso",
      "enabled": false
    }
  ]
}
```

## Notas Técnicas

1. **Backward Compatibility**: Los elementos sin la propiedad `enabled` se consideran habilitados por defecto
2. **Validación**: El sistema valida la estructura pero permite elementos deshabilitados
3. **Caching**: Los cambios en la configuración se reflejan al recargar la página
4. **Debugging**: Los métodos de debug incluyen información sobre el estado enabled
5. **Responsive**: Funciona tanto en desktop como en móvil
