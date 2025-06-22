/**
 * Configuración base compartida del sistema
 *
 * Este archivo contiene toda la configuración base que es compartida
 * entre diferentes módulos del sistema para evitar duplicación.
 */
const BaseConfig = {
  // Configuración de breakpoints (compartida)
  BREAKPOINTS: {
    MOBILE: 768,
    TABLET: 1024,
    DESKTOP: 1200,
    SMALL: 576,
    MEDIUM: 992,
    TABLET_MIN: 769,
    TABLET_MAX: 1024,
  },

  // Configuración de animaciones (compartida)
  ANIMATIONS: {
    DURATION: {
      FAST: 150,
      NORMAL: 300,
      SLOW: 500,
    },
    EASING: {
      EASE: 'ease',
      EASE_IN: 'ease-in',
      EASE_OUT: 'ease-out',
      EASE_IN_OUT: 'ease-in-out',
    },
  },

  // Configuración de desarrollo (compartida)
  DEVELOPMENT: {
    DEBUG_MODE:
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1',
    LOG_LEVEL: 'error', // 'debug', 'info', 'warn', 'error'
    VALIDATE_ON_LOAD: true,
  },

  // Configuración de storage (compartida)
  STORAGE: {
    ACTIVE_ITEM_KEY: 'activeMenuItem',
    ACTIVE_PARENT_KEY: 'activeParentMenuItem',
    NAVIGATION_FLAG: 'hasNavigated',
    THEME_KEY: 'theme',
    CONFIG_KEY: 'config',
  },

  // Configuración de eventos (compartida)
  EVENTS: {
    CLICK: 'click',
    RESIZE: 'resize',
    TOUCHSTART: 'touchstart',
    TOUCHEND: 'touchend',
  },

  // Configuración de rutas base (compartida)
  PATHS: {
    DEFAULT_AVATAR: 'public/images/default-avatar.png',
    DEFAULT_LOGO: 'public/images/logo-saia.png',
    LOGO_PREFIX: 'public/images/logo-saia-',
    LOGO_SUFFIX: '.png',
    MOBILE_LOGO_PREFIX: 'public/images/logo-saia-',
    MOBILE_LOGO_SUFFIX: '.png',
  },

  // Configuración de límites (compartida)
  LIMITS: {
    MAX_SUBMENU_ITEMS: 10,
    MAX_LOGS_TO_KEEP: 10,
    FAST_OPERATION_THRESHOLD: 10, // ms
    MAX_DEPTH: 3, // Máximo nivel de anidación
    MAX_ITEMS_PER_SECTION: 20,
  },

  // Configuración de mensajes base (compartida)
  MESSAGES: {
    ERRORS: {
      CONTAINER_NOT_FOUND: 'Contenedor no encontrado',
      LOAD_FAILED: 'Error al cargar',
      INVALID_ITEM: 'Ítem inválido',
      MISSING_TARGET: 'Target no definido',
      DUPLICATE_ID: 'ID duplicado encontrado',
      CONFIG_LOAD_FAILED: 'Error al cargar configuración',
    },
    WARNINGS: {
      EMPTY_SUBMENU: 'Submenú sin elementos',
      MISSING_ICON: 'Ítem sin ícono definido',
    },
    SUCCESS: {
      COMPONENT_INITIALIZED: 'Componente inicializado',
      COMPONENT_DESTROYED: 'Componente destruido',
    },
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
   * Verifica si estamos en modo desarrollo
   * @returns {boolean}
   */
  isDevelopment() {
    return this.DEVELOPMENT.DEBUG_MODE;
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
   * Obtiene una dimensión específica
   * @param {string} dimensionName - Nombre de la dimensión
   * @returns {number}
   */
  getDimension(dimensionName) {
    return this.DIMENSIONS?.[dimensionName.toUpperCase()] || 0;
  },

  /**
   * Obtiene un límite específico
   * @param {string} limitName - Nombre del límite
   * @returns {number}
   */
  getLimit(limitName) {
    return this.LIMITS[limitName.toUpperCase()] || 0;
  },

  /**
   * Obtiene un mensaje de error
   * @param {string} key - Clave del mensaje
   * @returns {string}
   */
  getErrorMessage(key) {
    return this.MESSAGES.ERRORS[key] || 'Error desconocido';
  },

  /**
   * Obtiene un mensaje de éxito
   * @param {string} key - Clave del mensaje
   * @returns {string}
   */
  getSuccessMessage(key) {
    return this.MESSAGES.SUCCESS[key] || '';
  },

  /**
   * Log en desarrollo
   * @param {string} componentName - Nombre del componente
   * @param {string} message - Mensaje a loggear
   * @param {any} data - Datos adicionales
   */
  log(componentName, message, data = null) {
    if (this.isDevelopment() && this.DEVELOPMENT.LOG_LEVEL === 'debug') {
      if (data) {
        console.log(`${componentName}: ${message}`, data);
      } else {
        console.log(`${componentName}: ${message}`);
      }
    }
  },

  /**
   * Log de error en desarrollo
   * @param {string} componentName - Nombre del componente
   * @param {string} message - Mensaje de error
   * @param {any} error - Error
   */
  logError(componentName, message, error = null) {
    if (this.isDevelopment()) {
      if (error) {
        console.error(`${componentName}: ${message}`, error);
      } else {
        console.error(`${componentName}: ${message}`);
      }
    }
  },

  /**
   * Extiende la configuración base con configuración específica
   * @param {Object} specificConfig - Configuración específica
   * @returns {Object}
   */
  extend(specificConfig) {
    return {
      ...this,
      ...specificConfig,
      // Preservar métodos de baseConfig
      getEnvironmentConfig: this.getEnvironmentConfig.bind(this),
      isDevelopment: this.isDevelopment.bind(this),
      isMobile: this.isMobile.bind(this),
      getCurrentBreakpoint: this.getCurrentBreakpoint.bind(this),
      getDimension: this.getDimension.bind(this),
      getLimit: this.getLimit.bind(this),
      getErrorMessage: this.getErrorMessage.bind(this),
      getSuccessMessage: this.getSuccessMessage.bind(this),
      log: this.log.bind(this),
      logError: this.logError.bind(this),
      extend: this.extend.bind(this),
    };
  },
};

// Exportar para uso global
window.BaseConfig = BaseConfig;
