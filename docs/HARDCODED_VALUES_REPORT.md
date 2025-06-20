# Reporte de Valores Hardcodeados - Portal HELP DESK

## 📊 Resumen Ejecutivo

Se encontraron **valores hardcodeados** en múltiples archivos del proyecto. Se ha **consolidado la configuración** en los archivos existentes sin duplicar información.

## 🔍 Valores Hardcodeados Encontrados

### 1. **Breakpoints (768, 1024, 1200, 576, 992)**

#### ✅ **Ya Centralizados en `menuConfig.js`:**

- `BREAKPOINTS.MOBILE: 768`
- `BREAKPOINTS.TABLET: 1024`
- `BREAKPOINTS.DESKTOP: 1200`
- `BREAKPOINTS.SMALL: 576` (agregado)
- `BREAKPOINTS.MEDIUM: 992` (agregado)

#### ✅ **Archivos Refactorizados:**

- `src/js/views/MenuView.js` - Usa `MenuConfig.BREAKPOINTS.MOBILE`
- `src/js/controllers/ControladorMenu.js` - Usa `MenuConfig.BREAKPOINTS.MOBILE`

#### 📋 **En CSS (No requiere refactorización):**

- `src/styles/components/app.css` - `@media (max-width: 768px)`
- `src/styles/layout/layout.css` - Sistema de grid responsive
- `src/styles/views/*.css` - Media queries por vista

### 2. **Valores de Tiempo (1000, 300000, 300, 5000)**

#### ✅ **Ya Centralizados en archivos existentes:**

- `src/js/config/appConfig.js`:

  - `UPDATE_INTERVAL: 1000` ✅
  - `CONFIG_INTERVAL: 300000` ✅
  - `ANIMATION_DURATION: 300` ✅
  - `DAYS_IN_MILLISECONDS: 30 * 24 * 60 * 60 * 1000` ✅

- `src/js/config/viewConfig.js`:

  - `DURATION: 5000` ✅
  - `DEBOUNCE_DELAY: 300` ✅

- `src/js/config/menuConfig.js`:
  - `ANIMATIONS.DURATION: 300` ✅

#### ❌ **Requieren refactorización:**

- `src/js/models/Configuracion.js`:

  - `intervalo: 300000` ❌ **Usar AppConfig.TIMING.CONFIG_INTERVAL**

- `src/js/views/HomeView.js`:
  - `setTimeout(..., 1000)` ❌ **Usar AppConfig.TIMING.UPDATE_INTERVAL**

### 3. **Colores (#007bff, #6c757d, #ffffff, #212529)**

#### ❌ **Requieren refactorización:**

- `src/js/models/Configuracion.js`:

  - `primario: '#007bff'` ❌ **Crear configuración de colores**
  - `secundario: '#6c757d'` ❌ **Crear configuración de colores**
  - `fondo: '#ffffff'` ❌ **Crear configuración de colores**
  - `texto: '#212529'` ❌ **Crear configuración de colores**

- `src/js/utils/TemaHelper.js`:
  - `primario: '#007bff'` ❌ **Crear configuración de colores**
  - `secundario: '#6c757d'` ❌ **Crear configuración de colores**
  - `fondo: '#ffffff'` ❌ **Crear configuración de colores**
  - `texto: '#212529'` ❌ **Crear configuración de colores**

### 4. **Dimensiones y Espaciado (10, 4, 40, 50, 1.5)**

#### ✅ **Centralizados en `menuConfig.js`:**

- `DIMENSIONS.MENU_ITEM_SIZE: 50` ✅
- `DIMENSIONS.MENU_ITEM_ICON_SIZE: 1.5` ✅
- `DIMENSIONS.TOOLTIP_OFFSET: 10` ✅
- `DIMENSIONS.TOOLTIP_ARROW_OFFSET: 4` ✅

#### ❌ **Requieren refactorización:**

- `src/js/utils/TooltipHelper.js`:
  - `10px` (tooltip offset) ❌ **Usar MenuConfig.getDimension('TOOLTIP_OFFSET')**
  - `4px` (arrow offset) ❌ **Usar MenuConfig.getDimension('TOOLTIP_ARROW_OFFSET')**

### 5. **Límites y Validaciones (3, 20, 10, 255, 1)**

#### ✅ **Ya Centralizados:**

- `src/js/config/menuConfig.js`:

  - `VALIDATION.MAX_DEPTH: 3` ✅
  - `VALIDATION.MAX_ITEMS_PER_SECTION: 20` ✅
  - `LIMITS.MAX_SUBMENU_ITEMS: 10` ✅ (agregado)
  - `LIMITS.MAX_LOGS_TO_KEEP: 10` ✅ (agregado)
  - `LIMITS.FAST_OPERATION_THRESHOLD: 10` ✅ (agregado)

- `src/js/config/viewConfig.js`:
  - `SEARCH.MIN_CHARS: 3` ✅
  - `PAGINATION.ITEMS_PER_PAGE: 10` ✅
  - `PAGINATION.MAX_PAGES_DISPLAY: 5` ✅

#### ❌ **Requieren refactorización:**

- `src/js/utils/MenuDebugger.js`:
  - `slice(-10)` (últimos 10 logs) ❌ **Usar MenuConfig.getLimit('MAX_LOGS_TO_KEEP')**
  - `duration < 10` (threshold) ❌ **Usar MenuConfig.getLimit('FAST_OPERATION_THRESHOLD')**

### 6. **Datos por Defecto**

#### ✅ **Ya Centralizados:**

- `src/js/config/appConfig.js`:
  - `DEFAULT_DATA.USER.TELEFONO: '+57 300 123 4567'` ✅

#### ✅ **Centralizados en `menuConfig.js`:**

- `PATHS.DEFAULT_AVATAR: 'public/images/avatar1.png'` ✅ (agregado)

#### ❌ **Requieren refactorización:**

- `src/js/views/HomeView.js`:

  - `telefono: '+57 300 123 4567'` ❌ **Usar AppConfig.DEFAULT_DATA.USER.TELEFONO**

- `src/js/views/PQRSView.js`:

  - `telefono: '+57 300...'` ❌ **Usar AppConfig.DEFAULT_DATA.USER.TELEFONO**

- `src/js/models/Usuario.js`:
  - `'public/images/avatar1.png'` ❌ **Usar MenuConfig.PATHS.DEFAULT_AVATAR**

## 🚀 Configuración Consolidada

### 📁 **Archivos de Configuración Existentes:**

1. **`src/js/config/menuConfig.js`** - Configuración del menú y breakpoints
2. **`src/js/config/appConfig.js`** - Configuración general de la aplicación
3. **`src/js/config/viewConfig.js`** - Configuración de vistas y componentes

### 🔧 **Mejoras Realizadas:**

1. **Expandido `menuConfig.js`** con dimensiones y límites específicos del menú
2. **Evitado duplicación** de información entre archivos
3. **Mantenido separación de responsabilidades** por dominio

## 📋 Archivos que Requieren Refactorización

### 🔴 **Prioridad Alta:**

1. `src/js/models/Configuracion.js` - Colores hardcodeados
2. `src/js/utils/TemaHelper.js` - Colores hardcodeados
3. `src/js/models/Usuario.js` - Ruta de avatar hardcodeada

### 🟡 **Prioridad Media:**

1. `src/js/utils/TooltipHelper.js` - Dimensiones hardcodeadas
2. `src/js/utils/MenuDebugger.js` - Límites hardcodeados
3. `src/js/views/HomeView.js` - Datos hardcodeados
4. `src/js/views/PQRSView.js` - Datos hardcodeados

### 🟢 **Prioridad Baja:**

1. Archivos que ya están centralizados
2. Valores que son lógica de negocio específica

## ✅ Beneficios de la Consolidación

1. **Sin duplicación**: Cada valor está en un solo lugar apropiado
2. **Separación de responsabilidades**: Cada archivo de configuración tiene su dominio
3. **Mantenimiento**: Cambiar valores en el lugar correcto
4. **Consistencia**: Todos los archivos usan la misma configuración
5. **Documentación**: Valores claramente definidos y comentados

## 🔄 Próximos Pasos

1. **Refactorizar archivos de prioridad alta**
2. **Crear configuración de colores** (nuevo archivo o en appConfig.js)
3. **Actualizar documentación**
4. **Crear tests para validar la configuración**
5. **Implementar validación de configuración al inicio**

## 📝 Reglas para el Futuro

1. **NUNCA** duplicar información entre archivos de configuración
2. **SIEMPRE** usar la configuración existente apropiada
3. **MANTENER** separación de responsabilidades por dominio
4. **DOCUMENTAR** cualquier nuevo valor agregado
5. **VALIDAR** que los valores sean consistentes
