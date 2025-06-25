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

  // Configuración de desarrollo (compartida)
  DEVELOPMENT: {
    DEBUG_MODE:
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1',
    LOG_LEVEL: 'error', // 'debug', 'info', 'warn', 'error'
    VALIDATE_ON_LOAD: true,
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
   * Extiende la configuración base con configuraciones específicas
   * @param {Object} specificConfig - Configuración específica
   * @returns {Object} Configuración extendida
   */
  extend(specificConfig) {
    return {
      ...this,
      ...specificConfig,
      // Preservar métodos de baseConfig
      getEnvironmentConfig: this.getEnvironmentConfig,
      isDevelopment: this.isDevelopment,
      isMobile: this.isMobile,
      getCurrentBreakpoint: this.getCurrentBreakpoint,
      getErrorMessage: this.getErrorMessage,
      getSuccessMessage: this.getSuccessMessage,
      log: this.log,
      logError: this.logError,
      extend: this.extend,
    };
  },
};

// Exportar para uso global
window.BaseConfig = BaseConfig;
