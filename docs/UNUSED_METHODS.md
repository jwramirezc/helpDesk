# Métodos No Utilizados en Services

## 📋 Resumen

Este documento lista los métodos que están implementados en los services pero que actualmente no se están utilizando en el código. Estos métodos están disponibles para futuras implementaciones.

## 🎯 MenuService - Métodos No Utilizados

### **1. searchItems(searchText)**

```javascript
async searchItems(searchText) {
  // Busca ítems por texto en el label (búsqueda insensible a mayúsculas)
}
```

**Propósito**: Búsqueda de ítems del menú por texto
**Casos de Uso Sugeridos**:

- Barra de búsqueda en el menú
- Filtrado dinámico de opciones
- Búsqueda de funcionalidades específicas

### **2. getItemsByTarget(target)**

```javascript
async getItemsByTarget(target) {
  // Obtiene todos los ítems que tienen un target específico
}
```

**Propósito**: Encontrar ítems que apuntan a una vista específica
**Casos de Uso Sugeridos**:

- Análisis de navegación
- Auditoría de rutas
- Mapeo de funcionalidades

### **3. getNavigationPath(itemId)**

```javascript
async getNavigationPath(itemId) {
  // Obtiene la ruta completa de navegación para un ítem
}
```

**Propósito**: Obtener la ruta completa de navegación
**Casos de Uso Sugeridos**:

- Breadcrumbs dinámicos
- Navegación jerárquica
- Debugging de rutas

### **4. hasPermission(itemId, user)**

```javascript
async hasPermission(itemId, user = null) {
  // Verifica si un ítem tiene permisos
}
```

**Propósito**: Control de acceso basado en permisos
**Casos de Uso Sugeridos**:

- Sistema de roles y permisos
- Control de acceso granular
- Seguridad de navegación

## 🔧 ConfigService - Métodos No Utilizados

### **1. updateTheme(tema)**

```javascript
updateTheme(tema) {
  // Actualiza el tema
}
```

**Propósito**: Actualizar configuración del tema
**Casos de Uso Sugeridos**:

- Selector de temas en la interfaz
- Cambio dinámico de apariencia
- Personalización de usuario

### **2. updateNotifications(notificaciones)**

```javascript
updateNotifications(notificaciones) {
  // Actualiza las notificaciones
}
```

**Propósito**: Actualizar configuración de notificaciones
**Casos de Uso Sugeridos**:

- Panel de configuración de notificaciones
- Personalización de alertas
- Gestión de preferencias

### **3. reset()**

```javascript
reset() {
  // Resetea la configuración a valores por defecto
}
```

**Propósito**: Restaurar configuración por defecto
**Casos de Uso Sugeridos**:

- Botón "Restaurar configuración"
- Reset de preferencias
- Solución de problemas

### **4. isValid()**

```javascript
isValid() {
  // Verifica si la configuración es válida
}
```

**Propósito**: Validar integridad de la configuración
**Casos de Uso Sugeridos**:

- Verificación de integridad
- Diagnóstico de problemas
- Validación antes de operaciones críticas

## 🌐 I18nService - Métodos No Utilizados

### **1. changeLanguage(newLang)**

```javascript
async changeLanguage(newLang) {
  // Cambia el idioma actual
}
```

**Propósito**: Cambiar idioma de la aplicación
**Casos de Uso Sugeridos**:

- Selector de idioma en la interfaz
- Cambio dinámico de idioma
- Soporte multiidioma

### **2. getCurrentLanguage()**

```javascript
getCurrentLanguage() {
  // Obtiene el idioma actual
}
```

**Propósito**: Obtener el idioma actualmente activo
**Casos de Uso Sugeridos**:

- Mostrar idioma actual en la interfaz
- Validación de idioma
- Debugging de traducciones

### **3. isTranslationsLoaded()**

```javascript
isTranslationsLoaded() {
  // Verifica si las traducciones están cargadas
}
```

**Propósito**: Verificar estado de carga de traducciones
**Casos de Uso Sugeridos**:

- Indicador de carga de traducciones
- Validación antes de mostrar contenido
- Manejo de errores de carga

## 📝 Plan de Implementación Sugerido

### **Prioridad Alta**

1. **searchItems()** - Implementar barra de búsqueda en menú
2. **changeLanguage()** - Implementar selector de idioma
3. **updateTheme()** - Implementar selector de tema

### **Prioridad Media**

1. **getNavigationPath()** - Implementar breadcrumbs
2. **updateNotifications()** - Implementar configuración de notificaciones
3. **isValid()** - Implementar validación de configuración

### **Prioridad Baja**

1. **getItemsByTarget()** - Implementar análisis de navegación
2. **hasPermission()** - Implementar sistema de permisos
3. **reset()** - Implementar reset de configuración

## 🔍 Archivos Relacionados

- `src/js/services/MenuService.js` - Métodos de menú
- `src/js/services/ConfigService.js` - Métodos de configuración
- `src/js/services/I18nService.js` - Métodos de internacionalización

**Nota**: Todos estos métodos están completamente implementados y listos para usar. Solo necesitan ser integrados en la interfaz de usuario o en la lógica de la aplicación según los casos de uso identificados.
