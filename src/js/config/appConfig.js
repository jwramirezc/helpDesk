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
    MENU_JSON: 'data/config/menu-config.js',
    DEFAULT_CONFIG: 'data/config/default-config.json',
    TEMAS_JSON: 'data/config/temas.json',
    NOTIFICACIONES_JSON: 'data/notificaciones.json',
    STANDARD_BUTTONS_JSON: 'data/config/standard-buttons.json',
    HEADER_CONFIG_JSON: 'data/config/header-config.json',
  },

  // Configuración de extensiones de archivos
  EXTENSIONS: {
    HTML: '.html',
    CSS: '.css',
    JSON: '.json',
  },

  // Configuración de tiempo y intervalos
  TIMING: {
    UPDATE_INTERVAL: 1000, // 1 segundo para actualización de tiempo
    CONFIG_INTERVAL: 300000, // 5 minutos para configuración
    ANIMATION_DURATION: 300, // 300ms para animaciones
    DAYS_IN_MILLISECONDS: 30 * 24 * 60 * 60 * 1000, // 30 días
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

  // Configuración de iconos Font Awesome
  ICONS: {
    THEME: {
      LIGHT: 'fas fa-moon',
      DARK: 'fas fa-sun',
    },
    ACTIONS: {
      VIEW: 'fas fa-eye',
      EDIT: 'fas fa-edit',
      DELETE: 'fas fa-trash',
      ARROW_LEFT: 'fas fa-arrow-left',
      CHEVRON_RIGHT: 'fas fa-chevron-right',
    },
  },

  // Configuración de clases CSS comunes
  CSS_CLASSES: {
    HIDDEN: 'hidden',
    ACTIVE: 'active',
    ALERT: 'alert',
    ALERT_DANGER: 'alert-danger',
    PAGE_ITEM: 'page-item',
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

  // Configuración de datos por defecto
  DEFAULT_DATA: {
    USER: {
      nombre: 'Usuario',
      apellidos: 'Demo',
      empresa: 'Empresa Demo',
      telefono: '+57 300 123 4567',
      id: 'USR001',
    },
    PAGINATION: {
      ITEMS_PER_PAGE: 10,
      MAX_PAGES: 5,
    },
  },

  // Configuración de validación
  VALIDATION: {
    REQUIRED_FIELDS: ['id', 'label', 'type'],
    VALID_TYPES: ['item', 'submenu'],
    MAX_DEPTH: 3,
    MAX_ITEMS_PER_SECTION: 20,
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
   * Obtiene la ruta completa para un archivo de configuración
   * @param {string} filename - Nombre del archivo
   * @returns {string}
   */
  getConfigPath(filename) {
    return `${this.PATHS.CONFIG}${filename}`;
  },

  /**
   * Obtiene la ruta completa para una vista HTML
   * @param {string} viewName - Nombre de la vista
   * @returns {string}
   */
  getViewPath(viewName) {
    return `${this.PATHS.VIEWS}${viewName}${this.EXTENSIONS.HTML}`;
  },

  /**
   * Obtiene la ruta completa para un archivo CSS
   * @param {string} viewName - Nombre de la vista
   * @returns {string}
   */
  getStylePath(viewName) {
    return `${this.PATHS.STYLES}${viewName}${this.EXTENSIONS.CSS}`;
  },

  /**
   * Obtiene la ruta completa para un archivo de traducción
   * @param {string} language - Código del idioma (ej: 'es', 'en')
   * @returns {string}
   */
  getI18nPath(language) {
    return `${this.PATHS.I18N}${language}${this.EXTENSIONS.JSON}`;
  },

  /**
   * Obtiene un mensaje de error
   * @param {string} key - Clave del mensaje
   * @returns {string}
   */
  getErrorMessage(key) {
    return this.MESSAGES.ERRORS[key] || this.MESSAGES.ERRORS.GENERIC;
  },

  /**
   * Obtiene un icono por tipo
   * @param {string} category - Categoría del icono (THEME, ACTIONS)
   * @param {string} type - Tipo específico del icono
   * @returns {string}
   */
  getIcon(category, type) {
    return this.ICONS[category]?.[type] || '';
  },

  /**
   * Valida la ruta de un archivo CSS
   * @param {string} viewName - Nombre de la vista
   * @returns {string} Ruta del archivo CSS
   */
  validateStylePath(viewName) {
    const stylePath = this.getStylePath(viewName);
    console.log(`AppConfig: Validando ruta CSS: ${stylePath}`);
    return stylePath;
  },

  /**
   * Obtiene la lista de estilos disponibles
   * @returns {Array}
   */
  getAvailableStyles() {
    return ['home', 'helpdesk', 'consultas'];
  },

  /**
   * Verifica si un archivo CSS existe
   * @param {string} viewName - Nombre de la vista
   * @returns {Promise<boolean>} True si el archivo existe
   */
  async checkStyleExists(viewName) {
    const stylePath = this.getStylePath(viewName);
    try {
      const response = await fetch(stylePath, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      console.error(
        `AppConfig: Error verificando existencia de CSS para ${viewName}:`,
        error
      );
      return false;
    }
  },
};

// Exportar para uso global
window.AppConfig = AppConfig;
