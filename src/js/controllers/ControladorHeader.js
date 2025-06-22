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

      ComponentConfig.log(
        'ControladorHeader',
        'Controlador inicializado correctamente'
      );
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

      ComponentConfig.log(
        'ControladorHeader',
        'Header renderizado correctamente',
        {
          usuario: usuario.nombre,
          tieneNotificaciones,
          botonesHabilitados:
            this.headerConfigService.getEnabledButtons().length,
          botonesConSubmenus:
            this.headerConfigService.getButtonsWithSubmenus().length,
        }
      );
    } catch (error) {
      ComponentConfig.logError(
        'ControladorHeader',
        'Error al renderizar header',
        error
      );
    }
  }

  /**
   * Actualiza el estado de notificaciones
   * @param {boolean} tieneNotificaciones - Nuevo estado
   */
  updateNotificationsState(tieneNotificaciones) {
    if (!this.isInitialized || !this.headerView) {
      ComponentConfig.logError(
        'ControladorHeader',
        'Controlador no inicializado para actualizar notificaciones'
      );
      return;
    }

    this.headerView.updateNotificationsState(tieneNotificaciones);

    ComponentConfig.log(
      'ControladorHeader',
      'Estado de notificaciones actualizado',
      {
        tieneNotificaciones,
      }
    );
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
   * Valida la configuración del header
   * @returns {Object} Resultado de la validación
   */
  validateConfiguration() {
    if (!this.headerConfigService) {
      return {
        isValid: false,
        errors: ['HeaderConfigService no inicializado'],
        warnings: [],
      };
    }

    return this.headerConfigService.validateConfig();
  }

  /**
   * Obtiene botones habilitados para un rol específico
   * @param {string} userRole - Rol del usuario
   * @returns {Array} Botones habilitados
   */
  getEnabledButtons(userRole) {
    if (!this.headerConfigService) {
      return [];
    }

    return this.headerConfigService.getEnabledButtons(userRole);
  }

  /**
   * Obtiene botones con submenús
   * @returns {Array} Botones con submenús
   */
  getButtonsWithSubmenus() {
    if (!this.headerConfigService) {
      return [];
    }

    return this.headerConfigService.getButtonsWithSubmenus();
  }

  /**
   * Actualiza la configuración del header
   * @param {Object} newConfig - Nueva configuración
   */
  async updateConfiguration(newConfig) {
    if (!this.headerConfigService) {
      ComponentConfig.logError(
        'ControladorHeader',
        'HeaderConfigService no inicializado para actualizar configuración'
      );
      return;
    }

    try {
      // Actualizar configuración
      this.headerConfigService.updateConfig(newConfig);

      // Actualizar popovers si es necesario
      if (this.headerPopoverService) {
        await this.headerPopoverService.updatePopovers();
      }

      ComponentConfig.log(
        'ControladorHeader',
        'Configuración actualizada correctamente'
      );
    } catch (error) {
      ComponentConfig.logError(
        'ControladorHeader',
        'Error al actualizar configuración',
        error
      );
    }
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

      ComponentConfig.log('ControladorHeader', 'Acción de submenú recibida', {
        action,
        itemId,
        buttonId,
      });

      // Aquí puedes implementar lógica específica del controlador
      // para manejar las acciones de submenús
    });

    ComponentConfig.log('ControladorHeader', 'Event listeners configurados');
  }

  /**
   * Destruye el controlador y limpia recursos
   */
  destroy() {
    if (this.headerPopoverService) {
      this.headerPopoverService.destroy();
    }

    this.isInitialized = false;
    this.headerView = null;
    this.headerConfigService = null;
    this.headerPopoverService = null;

    ComponentConfig.log('ControladorHeader', 'Controlador destruido');
  }
}

// Exportar para uso global
window.ControladorHeader = ControladorHeader;
