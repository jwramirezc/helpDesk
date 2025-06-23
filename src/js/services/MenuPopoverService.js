/**
 * Servicio para manejar popovers del menú en tablets
 *
 * Este servicio se integra con MenuService y PopoverComponent para
 * proporcionar funcionalidad de popovers específicamente para tablets (1024px).
 */
class MenuPopoverService {
  constructor(menuService = null, popoverComponent = null) {
    this.menuService = menuService;
    this.popoverComponent = popoverComponent;
    this.popovers = new Map(); // Almacena popovers creados
    this.isInitialized = false;
  }

  /**
   * Inicializa el servicio
   */
  async initialize() {
    try {
      // Verificar si ya está inicializado
      if (this.isInitialized) {
        return;
      }

      // Verificar si estamos en el breakpoint correcto
      if (!this.isActiveInCurrentBreakpoint()) {
        return;
      }

      // Inicializar componente popover si no existe
      if (!this.popoverComponent) {
        // Intentar usar la instancia global primero
        if (window.popoverComponent) {
          this.popoverComponent = window.popoverComponent;
        } else if (typeof PopoverComponent !== 'undefined') {
          // Crear nueva instancia si no hay global
          this.popoverComponent = new PopoverComponent({
            triggerSelector: ComponentConfig.getDefaultOption(
              'POPOVER',
              'triggerSelector'
            ),
            placement: ComponentConfig.getDefaultOption('POPOVER', 'placement'),
            offset: ComponentConfig.getDefaultOption('POPOVER', 'offset'),
            autoClose: ComponentConfig.getDefaultOption('POPOVER', 'autoClose'),
            closeOnClickOutside: ComponentConfig.getDefaultOption(
              'POPOVER',
              'closeOnClickOutside'
            ),
            closeOnResize: ComponentConfig.getDefaultOption(
              'POPOVER',
              'closeOnResize'
            ),
          });
        } else {
          throw new Error('PopoverComponent no está disponible');
        }
      }

      // Crear popovers para items con submenús
      await this.createPopoversForSubmenus();

      this.isInitialized = true;
    } catch (error) {
      console.error('MenuPopoverService: Error al inicializar:', error);
    }
  }

  /**
   * Inicializa el servicio de forma lazy (solo cuando se necesita)
   */
  async initializeLazy() {
    // Solo inicializar si no está inicializado y estamos en el breakpoint correcto
    if (!this.isInitialized && this.isActiveInCurrentBreakpoint()) {
      await this.initialize();
    }
  }

  /**
   * Verifica si el servicio está activo en el breakpoint actual
   * @returns {boolean}
   */
  isActiveInCurrentBreakpoint() {
    // Usar la misma lógica que PopoverComponent para consistencia
    const breakpoints = ComponentConfig.POPOVER.BREAKPOINTS;
    const width = window.innerWidth;
    return width >= breakpoints.TABLET_MIN && width <= breakpoints.TABLET_MAX;
  }

  /**
   * Crea popovers para todos los items con submenús
   */
  async createPopoversForSubmenus() {
    if (!this.menuService) {
      console.warn('MenuPopoverService: MenuService no disponible');
      return;
    }

    try {
      const menuItems = await this.menuService.getMenuItems();
      const submenuItems = await this.menuService.getSubmenuItems();

      // Crear popovers para items con submenús
      for (const item of submenuItems) {
        await this.createPopoverForMenuItem(item);
      }
    } catch (error) {
      console.error('MenuPopoverService: Error al crear popovers:', error);
    }
  }

  /**
   * Crea un popover para un item específico del menú
   * @param {MenuItem} menuItem - Item del menú
   */
  async createPopoverForMenuItem(menuItem) {
    if (!menuItem.hasChildren()) {
      return;
    }

    // Verificar que el popoverComponent esté disponible
    if (!this.popoverComponent) {
      // Esperar a que PopoverComponent esté disponible
      await this.waitForPopoverComponent();

      if (!this.popoverComponent) {
        console.error(
          'MenuPopoverService: PopoverComponent no disponible después de esperar'
        );
        return;
      }
    }

    const popoverId = `popover_${menuItem.id}`;
    const triggerId = menuItem.id;

    // Verificar si el popover ya existe
    if (this.popovers.has(popoverId)) {
      return;
    }

    try {
      // Determinar placement específico para este submenú
      const placement = this.determineSubmenuPlacement(menuItem);
      const offset = this.determineSubmenuOffset(menuItem);

      // Crear popover usando el componente con configuración específica
      const popover = this.popoverComponent.createPopoverFromMenu(
        menuItem.children,
        popoverId,
        (item, element) => this.handlePopoverItemClick(item, element)
      );

      // Configurar placement específico para este popover
      this.configurePopoverPlacement(popover, placement, offset);

      // Agregar popover al DOM
      document.body.appendChild(popover);

      // Agregar clase específica para el submenú
      popover.classList.add('popover-submenu');

      // Configurar trigger
      const trigger = document.getElementById(triggerId);
      if (trigger) {
        trigger.classList.add('popover-trigger');
        trigger.dataset.popoverId = popoverId;
        trigger.dataset.popoverPlacement = placement;
      } else {
        console.warn(
          `MenuPopoverService: Trigger no encontrado para ${menuItem.id}`
        );
      }

      // Almacenar referencia
      this.popovers.set(popoverId, {
        element: popover,
        menuItem: menuItem,
        trigger: trigger,
        placement: placement,
        offset: offset,
      });
    } catch (error) {
      console.error(
        `MenuPopoverService: Error al crear popover para ${menuItem.id}:`,
        error
      );
    }
  }

  /**
   * Espera a que PopoverComponent esté disponible
   */
  async waitForPopoverComponent() {
    let attempts = 0;
    const maxAttempts = 20; // 2 segundos máximo

    while (!this.popoverComponent && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;

      // Intentar usar la instancia global
      if (window.popoverComponent) {
        this.popoverComponent = window.popoverComponent;
        break;
      }

      // Intentar crear nueva instancia
      if (typeof PopoverComponent !== 'undefined') {
        try {
          this.popoverComponent = new PopoverComponent();
          break;
        } catch (error) {
          // Continuar intentando
        }
      }
    }
  }

  /**
   * Determina el placement específico para un submenú
   * @param {MenuItem} menuItem - Item del menú
   * @returns {string} Placement ('top', 'bottom', 'left', 'right')
   */
  determineSubmenuPlacement(menuItem) {
    const submenuConfig = ComponentConfig.POPOVER.SUBMENU;

    // 1. Verificar configuración personalizada por ID
    if (submenuConfig.CUSTOM_PLACEMENTS[menuItem.id]) {
      const placement = submenuConfig.CUSTOM_PLACEMENTS[menuItem.id];
      return placement;
    }

    // 2. Verificar configuración en el item del menú
    if (menuItem.popoverPlacement) {
      return menuItem.popoverPlacement;
    }

    // 3. Determinar por posición en el menú
    const menuItems = this.menuService.getMenuItemsSync();
    if (menuItems) {
      // Buscar en qué sección está el item
      if (menuItems.top.some(item => item.id === menuItem.id)) {
        const placement = submenuConfig.PLACEMENTS_BY_MENU_POSITION.top;
        return placement;
      } else if (menuItems.bottom.some(item => item.id === menuItem.id)) {
        const placement = submenuConfig.PLACEMENTS_BY_MENU_POSITION.bottom;
        return placement;
      }
    }

    // 4. Usar placement por defecto
    const placement = submenuConfig.DEFAULT_PLACEMENT;
    return placement;
  }

  /**
   * Determina el offset específico para un submenú
   * @param {MenuItem} menuItem - Item del menú
   * @returns {number} Offset en píxeles
   */
  determineSubmenuOffset(menuItem) {
    const submenuConfig = ComponentConfig.POPOVER.SUBMENU;

    // 1. Verificar configuración en el item del menú
    if (menuItem.popoverOffset) {
      return menuItem.popoverOffset;
    }

    // 2. Usar offset por defecto
    return submenuConfig.DEFAULT_OFFSET;
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
   * @param {MenuItem} item - Item clickeado
   * @param {HTMLElement} element - Elemento DOM clickeado
   */
  handlePopoverItemClick(item, element) {
    try {
      // Simular el comportamiento del menú normal
      if (item.type === 'item' && item.target) {
        // Navegar a la vista
        this.navigateToView(item.target);
      } else if (item.type === 'submenu') {
        // Para submenús, simplemente cerrar el popover
        // El comportamiento específico se maneja en el trigger principal
      }
    } catch (error) {
      console.error('MenuPopoverService: Error al manejar click:', error);
    }
  }

  /**
   * Navega a una vista específica
   * @param {string} target - Target de la vista
   */
  navigateToView(target) {
    // Integrar con el sistema de navegación existente
    if (window.app && window.app.controladorContenido) {
      window.app.controladorContenido.cargarVista(target);
    } else {
      // Fallback: navegación directa
      window.location.href = target;
    }
  }

  /**
   * Actualiza los popovers existentes
   */
  async updatePopovers() {
    if (!this.isActiveInCurrentBreakpoint()) {
      return;
    }

    try {
      // Limpiar popovers existentes
      this.clearPopovers();

      // Recrear popovers
      await this.createPopoversForSubmenus();
    } catch (error) {
      console.error('MenuPopoverService: Error al actualizar popovers:', error);
    }
  }

  /**
   * Limpia todos los popovers
   */
  clearPopovers() {
    for (const [popoverId, popoverData] of this.popovers) {
      if (popoverData.element && popoverData.element.parentNode) {
        popoverData.element.parentNode.removeChild(popoverData.element);
      }
    }
    this.popovers.clear();
  }

  /**
   * Obtiene información del servicio
   * @returns {Object}
   */
  getServiceInfo() {
    return {
      serviceName: 'MenuPopoverService',
      isInitialized: this.isInitialized,
      isActiveInCurrentBreakpoint: this.isActiveInCurrentBreakpoint(),
      popoversCount: this.popovers.size,
      currentBreakpoint: MenuConfig.getCurrentBreakpoint(),
      hasMenuService: !!this.menuService,
      hasPopoverComponent: !!this.popoverComponent,
    };
  }

  /**
   * Destruye el servicio y limpia recursos
   */
  destroy() {
    this.clearPopovers();

    if (this.popoverComponent) {
      this.popoverComponent.destroy();
      this.popoverComponent = null;
    }

    this.isInitialized = false;
  }
}

// Exportar para uso global
window.MenuPopoverService = MenuPopoverService;
