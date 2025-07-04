/**
 * Configuración específica de componentes
 *
 * Este archivo extiende la configuración base con configuraciones
 * específicas de los componentes del sistema.
 */
const ComponentConfig = BaseConfig.extend({
  // Configuración de PopoverComponent
  POPOVER: {
    DEFAULT_OPTIONS: {
      triggerSelector: '.popover-trigger',
      placement: 'bottom',
      offset: 8,
      autoClose: true,
      closeOnClickOutside: true,
      closeOnResize: true,
      forcePlacement: null,
    },
    SUBMENU: {
      DEFAULT_PLACEMENT: 'bottom',
      DEFAULT_OFFSET: 8,
      PLACEMENTS_BY_MENU_POSITION: {
        top: 'bottom',
        bottom: 'top',
        left: 'right',
        right: 'left',
      },
      CUSTOM_PLACEMENTS: {
        menu_consultas: 'left',
      },
    },
    PLACEMENTS: {
      TOP: 'top',
      BOTTOM: 'bottom',
      LEFT: 'left',
      RIGHT: 'right',
    },
    CSS_CLASSES: {
      POPOVER: 'rs-popover',
      ARROW: 'rs-popover-arrow',
      CONTENT: 'rs-popover-content',
      ITEM: 'rs-popover-item',
      SEPARATOR: 'rs-popover-separator',
      VISIBLE: 'visible',
      PLACEMENT_PREFIX: 'placement-',
    },
    BREAKPOINTS: {
      TABLET_MIN: 769,
      TABLET_MAX: 1024,
    },
  },

  // Configuración de animaciones
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

  // Configuración de desarrollo
  DEVELOPMENT: {
    DEBUG_MODE:
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1',
    LOG_LEVEL: 'warn', // 'debug', 'info', 'warn', 'error'
    VALIDATE_ON_LOAD: true,
  },

  // Configuración específica de mensajes de componentes
  MESSAGES: {
    ERRORS: {
      CONTAINER_NOT_FOUND: 'Contenedor no encontrado',
      USER_NOT_PROVIDED: 'Usuario no proporcionado',
      POPOVER_NOT_FOUND: 'Popover no encontrado',
      THEME_LOAD_FAILED: 'Error al cargar temas',
      CONFIG_LOAD_FAILED: 'Error al cargar configuración',
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
   * Obtiene una opción por defecto de un componente
   * @param {string} componentName - Nombre del componente
   * @param {string} optionName - Nombre de la opción
   * @returns {any}
   */
  getDefaultOption(componentName, optionName) {
    const componentConfig = this[componentName.toUpperCase()];
    if (!componentConfig || !componentConfig.DEFAULT_OPTIONS) {
      return null;
    }
    return componentConfig.DEFAULT_OPTIONS[optionName];
  },

  /**
   * Obtiene todas las opciones por defecto de un componente
   * @param {string} componentName - Nombre del componente
   * @returns {Object}
   */
  getDefaultOptions(componentName) {
    const componentConfig = this[componentName.toUpperCase()];
    return componentConfig?.DEFAULT_OPTIONS || {};
  },

  /**
   * Obtiene una clase CSS de un componente
   * @param {string} componentName - Nombre del componente
   * @param {string} className - Nombre de la clase
   * @returns {string}
   */
  getCSSClass(componentName, className) {
    const componentConfig = this[componentName.toUpperCase()];
    if (!componentConfig || !componentConfig.CSS_CLASSES) {
      return '';
    }
    return componentConfig.CSS_CLASSES[className] || '';
  },

  /**
   * Obtiene una ruta de un componente
   * @param {string} componentName - Nombre del componente
   * @param {string} pathName - Nombre de la ruta
   * @returns {string}
   */
  getPath(componentName, pathName) {
    const componentConfig = this[componentName.toUpperCase()];
    if (!componentConfig || !componentConfig.PATHS) {
      return '';
    }
    return componentConfig.PATHS[pathName] || '';
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
    if (this.isDevelopment()) {
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
});

// Exportar para uso global
window.ComponentConfig = ComponentConfig;
