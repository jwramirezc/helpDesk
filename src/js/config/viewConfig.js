/**
 * Configuración específica para vistas y componentes de la interfaz
 *
 * Este archivo contiene configuraciones relacionadas con las vistas,
 * componentes de UI, paginación y elementos de la interfaz.
 */
const ViewConfig = {
  // Configuración de vistas disponibles
  VIEWS: {
    HOME: 'home',
    HELPDESK: 'helpdesk',
    PQRS: 'pqrs',
    CONSULTAS: 'consultas',
    REPORTES: 'reportes',
    CONFIGURACION: 'configuracion',
  },

  // Mapeo de vistas a clases JavaScript
  VIEW_CLASSES: {
    home: 'HomeView',
    helpdesk: 'HelpDeskView',
    pqrs: 'PQRSView',
    consultas: 'ConsultasView',
    reportes: 'ReportesView',
  },

  // Configuración de paginación
  PAGINATION: {
    ITEMS_PER_PAGE: 10,
    MAX_PAGES_DISPLAY: 5,
    DEFAULT_PAGE: 1,
  },

  // Configuración de tablas
  TABLE: {
    DEFAULT_SORT: 'id',
    SORT_DIRECTION: {
      ASC: 'asc',
      DESC: 'desc',
    },
    ACTIONS: {
      VIEW: 'view',
      EDIT: 'edit',
      DELETE: 'delete',
    },
  },

  // Configuración de modales
  MODAL: {
    BACKDROP: 'static',
    KEYBOARD: false,
    FOCUS: true,
    SHOW: true,
  },

  // Configuración de formularios
  FORM: {
    VALIDATION: {
      REQUIRED: 'required',
      EMAIL: 'email',
      PHONE: 'phone',
      MIN_LENGTH: 'minLength',
      MAX_LENGTH: 'maxLength',
    },
    SUBMIT_MODE: {
      AJAX: 'ajax',
      FORM: 'form',
    },
  },

  // Configuración de notificaciones
  NOTIFICATIONS: {
    TYPES: {
      SUCCESS: 'success',
      ERROR: 'error',
      WARNING: 'warning',
      INFO: 'info',
    },
    POSITION: {
      TOP_RIGHT: 'top-right',
      TOP_LEFT: 'top-left',
      BOTTOM_RIGHT: 'bottom-right',
      BOTTOM_LEFT: 'bottom-left',
    },
    DURATION: 5000, // 5 segundos
  },

  // Configuración de estados de carga
  LOADING: {
    STATES: {
      IDLE: 'idle',
      LOADING: 'loading',
      SUCCESS: 'success',
      ERROR: 'error',
    },
    SPINNER_SIZE: 'sm',
    SPINNER_TYPE: 'border',
  },

  // Configuración de datos simulados
  MOCK_DATA: {
    TICKETS: {
      STATUS: ['Abierto', 'En Proceso', 'Cerrado', 'Pendiente'],
      PRIORITY: ['Baja', 'Media', 'Alta', 'Crítica'],
      CATEGORY: ['Soporte Técnico', 'Solicitud', 'Incidente', 'Consulta'],
    },
    PQRS: {
      TYPE: ['Petición', 'Queja', 'Reclamo', 'Sugerencia'],
      STATUS: ['Recibida', 'En Revisión', 'Respondida', 'Cerrada'],
      PRIORITY: ['Normal', 'Urgente', 'Crítica'],
    },
  },

  // Configuración de exportación
  EXPORT: {
    FORMATS: {
      CSV: 'csv',
      EXCEL: 'xlsx',
      PDF: 'pdf',
    },
    FILENAME_PREFIX: {
      TICKETS: 'tickets_',
      PQRS: 'pqrs_',
      REPORTES: 'reportes_',
    },
  },

  // Configuración de filtros
  FILTERS: {
    DATE_RANGE: {
      TODAY: 'today',
      WEEK: 'week',
      MONTH: 'month',
      QUARTER: 'quarter',
      YEAR: 'year',
      CUSTOM: 'custom',
    },
    STATUS_FILTER: {
      ALL: 'all',
      ACTIVE: 'active',
      INACTIVE: 'inactive',
    },
  },

  // Configuración de búsqueda
  SEARCH: {
    MIN_CHARS: 3,
    DEBOUNCE_DELAY: 300,
    FIELDS: {
      TICKETS: ['id', 'titulo', 'descripcion', 'usuario'],
      PQRS: ['id', 'tipo', 'descripcion', 'usuario'],
    },
  },

  /**
   * Obtiene la clase JavaScript para una vista
   * @param {string} viewName - Nombre de la vista
   * @returns {string|null}
   */
  getViewClass(viewName) {
    return this.VIEW_CLASSES[viewName] || null;
  },

  /**
   * Verifica si una vista existe
   * @param {string} viewName - Nombre de la vista
   * @returns {boolean}
   */
  viewExists(viewName) {
    return Object.values(this.VIEWS).includes(viewName);
  },

  /**
   * Obtiene la configuración de paginación
   * @param {number} totalItems - Total de elementos
   * @param {number} currentPage - Página actual
   * @returns {Object}
   */
  getPaginationConfig(totalItems, currentPage = 1) {
    const totalPages = Math.ceil(totalItems / this.PAGINATION.ITEMS_PER_PAGE);
    const startPage = Math.max(
      1,
      currentPage - Math.floor(this.PAGINATION.MAX_PAGES_DISPLAY / 2)
    );
    const endPage = Math.min(
      totalPages,
      startPage + this.PAGINATION.MAX_PAGES_DISPLAY - 1
    );

    return {
      totalItems,
      totalPages,
      currentPage,
      startPage,
      endPage,
      itemsPerPage: this.PAGINATION.ITEMS_PER_PAGE,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
    };
  },

  /**
   * Obtiene datos simulados por tipo
   * @param {string} type - Tipo de datos (TICKETS, PQRS)
   * @param {string} field - Campo específico
   * @returns {Array}
   */
  getMockData(type, field) {
    return this.MOCK_DATA[type]?.[field] || [];
  },

  /**
   * Obtiene la configuración de exportación
   * @param {string} type - Tipo de exportación
   * @param {string} format - Formato de archivo
   * @returns {Object}
   */
  getExportConfig(type, format) {
    const timestamp = new Date().toISOString().slice(0, 10);
    const prefix = this.EXPORT.FILENAME_PREFIX[type] || 'export_';

    return {
      filename: `${prefix}${timestamp}.${format}`,
      format: format,
      type: type,
    };
  },
};

// Exportar para uso global
window.ViewConfig = ViewConfig;
