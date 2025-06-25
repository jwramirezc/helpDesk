/**
 * Configuración general de la aplicación
 *
 * Este archivo contiene todas las constantes y configuraciones
 * generales de la aplicación que no están relacionadas específicamente
 * con el sistema de menús.
 */
const AppConfig = {
  // Configuración de rutas de archivos
  PATHS: {
    CONFIG: 'data/config/',
    VIEWS: 'src/views/html/',
    STYLES: 'src/styles/views/',
    I18N: 'data/i18n/',
    MENU_JSON: 'data/config/menu-config.json',
    DEFAULT_CONFIG: 'data/config/default-config.json',
    TEMAS_JSON: 'data/config/temas.json',
    NOTIFICACIONES_JSON: 'data/notificaciones.json',
    STANDARD_BUTTONS_JSON: 'data/config/standard-buttons.json',
    HEADER_CONFIG_JSON: 'data/config/header-config.json',
  },

  // Configuración de desarrollo
  DEVELOPMENT: {
    DEBUG_MODE:
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1',
    LOG_LEVEL: 'warn', // 'debug', 'info', 'warn', 'error'
    VALIDATE_ON_LOAD: true,
  },

  // Configuración de entornos
  ENVIRONMENTS: {
    LOCALHOST: 'localhost',
    LOCAL_IP: '127.0.0.1',
  },

  // Configuración de mensajes de error
  MESSAGES: {
    ERRORS: {
      GENERIC: 'Error:',
      VIEW_LOAD_FAILED: 'Error al cargar la vista',
      CONFIG_LOAD_FAILED: 'Error al cargar configuración',
      NOTIFICATIONS_LOAD_FAILED: 'Error al cargar las notificaciones',
    },
    SUCCESS: {
      CONFIG_LOADED: 'Configuración inicial cargada desde archivos JSON',
    },
  },

  // Configuración de eventos
  EVENTS: {
    CLICK: 'click',
    RESIZE: 'resize',
    TOUCHSTART: 'touchstart',
    TOUCHEND: 'touchend',
    LOAD: 'load',
    DOMCONTENTLOADED: 'DOMContentLoaded',
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
   * Obtiene la ruta completa para una vista HTML
   * @param {string} viewName - Nombre de la vista
   * @returns {string}
   */
  getViewPath(viewName) {
    return `${this.PATHS.VIEWS}${viewName}.html`;
  },

  /**
   * Obtiene la ruta completa para un archivo CSS
   * @param {string} viewName - Nombre de la vista
   * @returns {string}
   */
  getStylePath(viewName) {
    return `${this.PATHS.STYLES}${viewName}.css`;
  },

  /**
   * Obtiene la ruta completa para un archivo de traducción
   * @param {string} language - Código del idioma (ej: 'es', 'en')
   * @returns {string}
   */
  getI18nPath(language) {
    return `${this.PATHS.I18N}${language}.json`;
  },

  /**
   * Obtiene un mensaje de error
   * @param {string} key - Clave del mensaje
   * @returns {string}
   */
  getErrorMessage(key) {
    return this.MESSAGES.ERRORS[key] || this.MESSAGES.ERRORS.GENERIC;
  },
};

// Exportar para uso global
window.AppConfig = AppConfig;
