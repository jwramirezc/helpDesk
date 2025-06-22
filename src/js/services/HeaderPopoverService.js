/**
 * Servicio para manejar popovers del header
 *
 * Este servicio unifica el sistema de popovers del header
 * usando el PopoverComponent existente, igual que los submenús
 * de la barra lateral.
 */
class HeaderPopoverService {
  constructor(headerConfigService = null, popoverComponent = null) {
    this.headerConfigService = headerConfigService;
    this.popoverComponent = popoverComponent;
    this.popovers = new Map(); // Almacena referencias a los popovers creados
    this.isInitialized = false;
  }

  /**
   * Inicializa el servicio
   */
  async initialize() {
    try {
      if (!this.headerConfigService) {
        this.headerConfigService = new HeaderConfigService();
        await this.headerConfigService.initialize();
      }

      if (!this.popoverComponent) {
        this.popoverComponent = window.popoverComponent;
        if (!this.popoverComponent) {
          throw new Error('PopoverComponent no está disponible');
        }
      }

      this.isInitialized = true;
    } catch (error) {
      console.error('HeaderPopoverService: Error al inicializar:', error);
    }
  }

  /**
   * Crea popovers para todos los botones del header que tienen submenús
   */
  async createPopoversForHeaderButtons() {
    if (!this.isInitialized) {
      console.warn('HeaderPopoverService: No está inicializado');
      return;
    }

    const buttonsWithSubmenus =
      this.headerConfigService.getButtonsWithSubmenus();

    for (const button of buttonsWithSubmenus) {
      await this.createPopoverForButton(button);
    }
  }

  /**
   * Crea un popover para un botón específico
   * @param {Object} button - Configuración del botón
   */
  async createPopoverForButton(button) {
    const popoverId = button.popover?.content;
    if (!popoverId) {
      console.warn(
        `HeaderPopoverService: Botón ${button.id} no tiene popoverId configurado`
      );
      return;
    }

    // Verificar si ya existe
    if (this.popovers.has(popoverId)) {
      return;
    }

    try {
      // Obtener items del submenú en formato del menú
      const menuItems = this.headerConfigService.getSubmenuItemsForPopover(
        button.id
      );

      if (menuItems.length === 0) {
        console.warn(
          `HeaderPopoverService: No hay items para el submenú de ${button.id}`
        );
        return;
      }

      // Determinar placement específico para este botón
      const placement = this.determineButtonPlacement(button);
      const offset = this.determineButtonOffset(button);

      // Crear popover usando el componente existente
      const popover = this.popoverComponent.createPopoverFromMenu(
        menuItems,
        popoverId,
        (item, element) => this.handlePopoverItemClick(item, element, button.id)
      );

      // Configurar placement específico para este popover
      this.configurePopoverPlacement(popover, placement, offset);

      // Agregar popover al DOM
      document.body.appendChild(popover);

      // Configurar trigger
      const trigger = document.getElementById(button.id);
      if (trigger) {
        trigger.classList.add('popover-trigger');
        trigger.dataset.popoverId = popoverId;
        trigger.dataset.popoverPlacement = placement;
      } else {
        console.warn(
          `HeaderPopoverService: Trigger no encontrado para ${button.id}`
        );
      }

      // Almacenar referencia
      this.popovers.set(popoverId, {
        element: popover,
        button: button,
        trigger: trigger,
        placement: placement,
        offset: offset,
      });
    } catch (error) {
      console.error(
        `HeaderPopoverService: Error al crear popover para ${button.id}:`,
        error
      );
    }
  }

  /**
   * Determina el placement específico para un botón del header
   * @param {Object} button - Configuración del botón
   * @returns {string} Placement ('top', 'bottom', 'left', 'right')
   */
  determineButtonPlacement(button) {
    // 1. Verificar configuración específica del botón
    if (button.popover?.placement) {
      return button.popover.placement;
    }

    // 2. Usar placement por defecto según el tipo de botón
    const defaultPlacements = {
      'btn-notifications': 'bottom',
      'btn-user-menu': 'bottom-right',
      'btn-theme-toggle': 'bottom',
      'btn-language-selector': 'bottom',
      'btn-help': 'bottom',
    };

    const placement = defaultPlacements[button.id] || 'bottom';
    return placement;
  }

  /**
   * Determina el offset específico para un botón del header
   * @param {Object} button - Configuración del botón
   * @returns {number} Offset en píxeles
   */
  determineButtonOffset(button) {
    // Usar offset específico del botón o por defecto
    return button.popover?.offset || 8;
  }

  /**
   * Configura el placement específico para un popover
   * @param {HTMLElement} popover - Elemento popover
   * @param {string} placement - Placement específico
   * @param {number} offset - Offset específico
   */
  configurePopoverPlacement(popover, placement, offset) {
    // Agregar atributos de datos para configuración específica
    popover.dataset.placement = placement;
    popover.dataset.offset = offset;

    // Aplicar clase de placement inicial
    const placementPrefix = ComponentConfig.getCSSClass(
      'POPOVER',
      'PLACEMENT_PREFIX'
    );
    popover.classList.add(`${placementPrefix}${placement}`);
  }

  /**
   * Maneja el click en un item del popover
   * @param {Object} item - Item clickeado
   * @param {HTMLElement} element - Elemento DOM clickeado
   * @param {string} buttonId - ID del botón que originó el popover
   */
  handlePopoverItemClick(item, element, buttonId) {
    try {
      console.log(`HeaderPopoverService: Item clickeado en ${buttonId}:`, item);

      // Ejecutar acción específica del header
      if (item.headerAction) {
        this.executeHeaderAction(item.headerAction, item.id, buttonId);
      }

      // Cerrar el popover
      this.popoverComponent.hideActivePopover();
    } catch (error) {
      console.error('HeaderPopoverService: Error al manejar click:', error);
    }
  }

  /**
   * Ejecuta una acción específica del header
   * @param {string} action - Acción a ejecutar
   * @param {string} itemId - ID del item
   * @param {string} buttonId - ID del botón
   */
  executeHeaderAction(action, itemId, buttonId) {
    console.log(
      `HeaderPopoverService: Ejecutando acción ${action} para ${itemId} en ${buttonId}`
    );

    // Aquí puedes implementar la lógica específica para cada acción
    // Por ahora, solo logueamos la acción
    switch (action) {
      case 'view-all-notifications':
        console.log('Ver todas las notificaciones');
        break;
      case 'view-unread-notifications':
        console.log('Ver notificaciones no leídas');
        break;
      case 'notification-settings':
        console.log('Configurar notificaciones');
        break;
      case 'mark-all-read':
        console.log('Marcar todas como leídas');
        break;
      case 'view-profile':
        console.log('Ver perfil de usuario');
        break;
      case 'user-settings':
        console.log('Configuración de usuario');
        break;
      case 'user-preferences':
        console.log('Preferencias de usuario');
        break;
      case 'security-settings':
        console.log('Configuración de seguridad');
        break;
      case 'logout':
        console.log('Cerrar sesión');
        break;
      case 'set-theme-light':
        console.log('Cambiar tema a claro');
        break;
      case 'set-theme-dark':
        console.log('Cambiar tema a oscuro');
        break;
      case 'set-theme-auto':
        console.log('Cambiar tema a automático');
        break;
      case 'set-language-es':
        console.log('Cambiar idioma a español');
        break;
      case 'set-language-en':
        console.log('Cambiar idioma a inglés');
        break;
      case 'set-language-fr':
        console.log('Cambiar idioma a francés');
        break;
      case 'open-documentation':
        console.log('Abrir documentación');
        break;
      case 'open-tutorials':
        console.log('Abrir tutoriales');
        break;
      case 'open-faq':
        console.log('Abrir FAQ');
        break;
      case 'contact-support':
        console.log('Contactar soporte');
        break;
      case 'send-feedback':
        console.log('Enviar feedback');
        break;
      default:
        console.log(`Acción no implementada: ${action}`);
    }

    // Disparar evento personalizado para que otros componentes puedan escuchar
    const event = new CustomEvent('header:submenu-action', {
      detail: {
        action,
        itemId,
        buttonId,
        timestamp: Date.now(),
      },
    });
    document.dispatchEvent(event);
  }

  /**
   * Actualiza los popovers existentes
   */
  async updatePopovers() {
    if (!this.isInitialized) return;

    console.log('HeaderPopoverService: Actualizando popovers...');

    // Limpiar popovers existentes
    this.clearPopovers();

    // Recrear popovers
    await this.createPopoversForHeaderButtons();
  }

  /**
   * Limpia todos los popovers
   */
  clearPopovers() {
    console.log('HeaderPopoverService: Limpiando popovers...');

    this.popovers.forEach((popoverData, popoverId) => {
      if (popoverData.element && popoverData.element.parentNode) {
        popoverData.element.parentNode.removeChild(popoverData.element);
      }
    });

    this.popovers.clear();
  }

  /**
   * Obtiene información del servicio
   * @returns {Object} Información del servicio
   */
  getServiceInfo() {
    return {
      isInitialized: this.isInitialized,
      totalPopovers: this.popovers.size,
      popoverIds: Array.from(this.popovers.keys()),
      hasHeaderConfigService: !!this.headerConfigService,
      hasPopoverComponent: !!this.popoverComponent,
    };
  }

  /**
   * Destruye el servicio
   */
  destroy() {
    this.clearPopovers();
    this.isInitialized = false;
    console.log('HeaderPopoverService: Destruido');
  }
}

// Exportar para uso global
window.HeaderPopoverService = HeaderPopoverService;
