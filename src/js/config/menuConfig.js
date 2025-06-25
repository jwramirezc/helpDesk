/**
 * Configuración específica del sistema de menús
 *
 * Este archivo extiende la configuración base con configuraciones
 * específicas del sistema de menús.
 */
const MenuConfig = BaseConfig.extend({
  // Configuración específica de breakpoints del menú
  BREAKPOINTS: {
    MOBILE: 768,
    TABLET: 1024,
    DESKTOP: 1200,
  },
});

// Exportar para uso global
window.MenuConfig = MenuConfig;
