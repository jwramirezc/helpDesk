# Configuración Centralizada de Breakpoints

## 📍 Ubicación Principal

La configuración de breakpoints está centralizada en:

```
src/js/config/menuConfig.js
```

## 🎯 Breakpoints Definidos

```javascript
BREAKPOINTS: {
  MOBILE: 768,    // < 768px: Dispositivos móviles
  TABLET: 1024,   // 768px - 1024px: Tablets
  DESKTOP: 1200,  // 1024px - 1200px: Escritorio
}
```

## 📁 Archivos que Usan la Configuración

### ✅ Archivos Refactorizados (Usan MenuConfig)

- `src/js/views/MenuView.js`
- `src/js/controllers/ControladorMenu.js`

### 📋 Archivos CSS (Breakpoints en Media Queries)

- `src/styles/components/app.css` - `@media (max-width: 768px)`
- `src/styles/layout/layout.css` - Sistema de grid responsive
- `src/styles/views/*.css` - Responsive design por vista

## 🔧 Cómo Usar MenuConfig

### Detectar si es móvil:

```javascript
// ✅ Correcto
const isMobile = window.innerWidth < MenuConfig.BREAKPOINTS.MOBILE;

// ❌ Incorrecto (hardcodeado)
const isMobile = window.innerWidth < 768;
```

### Obtener breakpoint actual:

```javascript
const breakpoint = MenuConfig.getCurrentBreakpoint();
// Retorna: 'mobile', 'tablet', 'desktop', 'large'
```

### Verificar si es móvil:

```javascript
const isMobile = MenuConfig.isMobile();
```

## 🚀 Beneficios de la Centralización

1. **Mantenimiento**: Cambiar un breakpoint en un solo lugar
2. **Consistencia**: Todos los archivos usan los mismos valores
3. **Flexibilidad**: Fácil ajuste para diferentes dispositivos
4. **Documentación**: Valores claramente definidos y documentados

## ⚠️ Reglas Importantes

1. **NUNCA** usar valores hardcodeados como `768`
2. **SIEMPRE** usar `MenuConfig.BREAKPOINTS.MOBILE`
3. **Mantener** los media queries CSS sincronizados
4. **Documentar** cualquier cambio en los breakpoints

## 🔄 Proceso de Actualización

Si necesitas cambiar un breakpoint:

1. Modificar `MenuConfig.BREAKPOINTS.MOBILE` en `menuConfig.js`
2. Actualizar los media queries CSS correspondientes
3. Verificar que todos los archivos JS usen MenuConfig
4. Probar en diferentes tamaños de pantalla
