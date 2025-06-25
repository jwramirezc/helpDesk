/**
 * Controlador del Header
 *
 * Maneja la lógica de negocio del header y coordina
 * entre la vista y los servicios.
 */
class ControladorHeader {
  constructor() {
    this.headerView = null;
    this.headerConfigService = null;
    this.headerPopoverService = null;
    this.isInitialized = false;
  }

  /**
   * Inicializa el controlador
   */
  async initialize() {
    if (this.isInitialized) return;

    try {
      // Obtener contenedor del header
      const headerContainer = document.getElementById('header');
      if (!headerContainer) {
        throw new Error('Contenedor del header no encontrado (ID: header)');
      }

      // Inicializar servicios
      this.headerConfigService = new HeaderConfigService();
      await this.headerConfigService.initialize();

      // Inicializar vista
      this.headerView = new HeaderView(headerContainer);
      await this.headerView.initialize();

      // Obtener referencia al servicio de popovers de la vista
      this.headerPopoverService = this.headerView.headerPopoverService;

      this.isInitialized = true;
    } catch (error) {
      ComponentConfig.logError(
        'ControladorHeader',
        'Error al inicializar controlador',
        error
      );
    }
  }

  /**
   * Renderiza el header con datos del usuario
   * @param {Object} usuario - Datos del usuario
   * @param {boolean} tieneNotificaciones - Estado de notificaciones
   * @param {Function} t - Función de traducción
   */
  async renderHeader(usuario, tieneNotificaciones, t = key => key) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      await this.headerView.render(usuario, tieneNotificaciones, t);
    } catch (error) {
      ComponentConfig.logError(
        'ControladorHeader',
        'Error al renderizar header',
        error
      );
    }
  }

  /**
   * Obtiene información del estado del controlador
   * @returns {Object} Estado del controlador
   */
  getControllerState() {
    return {
      isInitialized: this.isInitialized,
      hasView: !!this.headerView,
      hasConfigService: !!this.headerConfigService,
      hasPopoverService: !!this.headerPopoverService,
      viewState: this.headerView?.getViewState(),
      configServiceInfo: this.headerConfigService?.getServiceInfo(),
      popoverServiceInfo: this.headerPopoverService?.getServiceInfo(),
    };
  }

  /**
   * Escucha eventos de acciones de submenús
   */
  setupEventListeners() {
    if (!this.isInitialized) {
      ComponentConfig.logError(
        'ControladorHeader',
        'Controlador no inicializado para configurar event listeners'
      );
      return;
    }

    // Escuchar eventos de acciones de submenús
    document.addEventListener('header:submenu-action', event => {
      const { action, itemId, buttonId } = event.detail;

      // Aquí puedes implementar lógica específica del controlador
      // para manejar las acciones de submenús
    });
  }

  /**
   * Destruye el controlador y limpia recursos
   */
  destroy() {
    if (this.headerView) {
      this.headerView.destroy();
    }

    if (this.headerPopoverService) {
      this.headerPopoverService.destroy();
    }

    this.isInitialized = false;
    ComponentConfig.log('ControladorHeader', 'Controlador destruido');
  }
}

// Exportar para uso global
window.ControladorHeader = ControladorHeader;
