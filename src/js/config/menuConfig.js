/**
 * Configuración centralizada del sistema de menús
 *
 * Este archivo contiene todas las constantes y configuraciones
 * relacionadas con el sistema de menús para facilitar el mantenimiento.
 */
const MenuConfig = {
  // Configuración de breakpoints
  BREAKPOINTS: {
    MOBILE: 768,
    TABLET: 1024,
    DESKTOP: 1200,
    SMALL: 576,
    MEDIUM: 992,
  },

  // Configuración de animaciones
  ANIMATIONS: {
    DURATION: 300,
    EASING: 'ease-in-out',
  },

  // Configuración de storage
  STORAGE: {
    ACTIVE_ITEM_KEY: 'activeMenuItem',
    ACTIVE_PARENT_KEY: 'activeParentMenuItem',
    NAVIGATION_FLAG: 'hasNavigated',
  },

  // Configuración de validación
  VALIDATION: {
    REQUIRED_FIELDS: ['id', 'label', 'type'],
    VALID_TYPES: ['item', 'submenu'],
    MAX_DEPTH: 3, // Máximo nivel de anidación
    MAX_ITEMS_PER_SECTION: 20,
  },

  // Configuración de eventos
  EVENTS: {
    CLICK: 'click',
    RESIZE: 'resize',
    TOUCHSTART: 'touchstart',
    TOUCHEND: 'touchend',
  },

  // Configuración de clases CSS
  CSS_CLASSES: {
    MENU_ITEM: 'menu-item',
    MOBILE_MENU_ITEM: 'mobile-menu-item',
    ACTIVE: 'active',
    HAS_SUBMENU: 'has-submenu',
    MOBILE_SUBMENU_HEADER: 'mobile-submenu-header',
    MOBILE_BACK_BUTTON: 'mobile-back-button',
  },

  // Configuración de selectores DOM
  SELECTORS: {
    SIDEBAR: '#sidebar',
    MOBILE_MENU: '.mobile-menu',
    MOBILE_MENU_TOGGLE: '.mobile-menu-toggle',
    MOBILE_MENU_ITEMS: '.mobile-menu-items',
    MOBILE_MENU_CLOSE: '.mobile-menu-close',
  },

  // Configuración de mensajes
  MESSAGES: {
    ERRORS: {
      MENU_LOAD_FAILED: 'Error al cargar el menú',
      INVALID_ITEM: 'Ítem del menú inválido',
      MISSING_TARGET: 'Ítem sin target definido',
      DUPLICATE_ID: 'ID duplicado encontrado',
    },
    WARNINGS: {
      EMPTY_SUBMENU: 'Submenú sin elementos',
      MISSING_ICON: 'Ítem sin ícono definido',
    },
  },

  // Configuración de desarrollo
  DEVELOPMENT: {
    DEBUG_MODE:
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1',
    LOG_LEVEL: 'warn', // 'debug', 'info', 'warn', 'error'
    VALIDATE_ON_LOAD: true,
  },

  // Configuración de dimensiones específicas del menú
  DIMENSIONS: {
    MENU_ITEM_SIZE: 50, // px
    MENU_ITEM_ICON_SIZE: 1.5, // rem
    TOOLTIP_OFFSET: 10, // px
    TOOLTIP_ARROW_OFFSET: 4, // px
  },

  // Configuración de límites específicos del menú
  LIMITS: {
    MAX_SUBMENU_ITEMS: 10,
    MAX_LOGS_TO_KEEP: 10,
    FAST_OPERATION_THRESHOLD: 10, // ms
  },

  // Configuración de rutas específicas del menú
  PATHS: {
    DEFAULT_AVATAR: 'public/images/avatar1.png',
  },

  /**
   * Obtiene la configuración según el entorno
   * @returns {Object}
   */
  getEnvironmentConfig() {
    return {
      isDevelopment: this.DEVELOPMENT.DEBUG_MODE,
      isProduction: !this.DEVELOPMENT.DEBUG_MODE,
      logLevel: this.DEVELOPMENT.LOG_LEVEL,
    };
  },

  /**
   * Verifica si estamos en modo móvil
   * @returns {boolean}
   */
  isMobile() {
    return window.innerWidth <= this.BREAKPOINTS.MOBILE;
  },

  /**
   * Obtiene el breakpoint actual
   * @returns {string}
   */
  getCurrentBreakpoint() {
    const width = window.innerWidth;
    if (width <= this.BREAKPOINTS.MOBILE) return 'mobile';
    if (width <= this.BREAKPOINTS.TABLET) return 'tablet';
    if (width <= this.BREAKPOINTS.DESKTOP) return 'desktop';
    return 'large';
  },

  /**
   * Obtiene una dimensión específica del menú
   * @param {string} dimensionName - Nombre de la dimensión
   * @returns {number}
   */
  getDimension(dimensionName) {
    return this.DIMENSIONS[dimensionName.toUpperCase()] || 0;
  },

  /**
   * Obtiene un límite específico del menú
   * @param {string} limitName - Nombre del límite
   * @returns {number}
   */
  getLimit(limitName) {
    return this.LIMITS[limitName.toUpperCase()] || 0;
  },
};

// Exportar para uso global
window.MenuConfig = MenuConfig;
