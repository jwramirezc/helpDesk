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
        console.log('MenuPopoverService: Ya inicializado');
        return;
      }

      // Verificar si estamos en el breakpoint correcto
      if (!this.isActiveInCurrentBreakpoint()) {
        console.log('MenuPopoverService: No activo en este breakpoint');
        return;
      }

      console.time('MenuPopoverService: Inicialización');

      // Inicializar componente popover si no existe
      if (!this.popoverComponent) {
        console.time('MenuPopoverService: Creación componente');
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
        console.timeEnd('MenuPopoverService: Creación componente');
      }

      // Crear popovers para items con submenús
      console.time('MenuPopoverService: Creación popovers');
      await this.createPopoversForSubmenus();
      console.timeEnd('MenuPopoverService: Creación popovers');

      this.isInitialized = true;

      console.timeEnd('MenuPopoverService: Inicialización');

      // Log en desarrollo
      if (MenuConfig.getEnvironmentConfig().isDevelopment) {
        console.log('MenuPopoverService: Inicializado');
        console.log(
          'MenuPopoverService: Breakpoint actual:',
          MenuConfig.getCurrentBreakpoint()
        );
        console.log('MenuPopoverService: Ancho de ventana:', window.innerWidth);
        console.log(
          'MenuPopoverService: ¿Activo en breakpoint?',
          this.isActiveInCurrentBreakpoint()
        );
      }
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

      // Log en desarrollo
      if (MenuConfig.getEnvironmentConfig().isDevelopment) {
        console.log(
          'MenuPopoverService: Items con submenús encontrados:',
          submenuItems.length
        );
        submenuItems.forEach(item => {
          console.log(
            `- ${item.id}: ${item.label} (${item.children.length} hijos)`
          );
        });
      }

      // Crear popovers para items con submenús
      for (const item of submenuItems) {
        await this.createPopoverForMenuItem(item);
      }

      // Log en desarrollo
      if (MenuConfig.getEnvironmentConfig().isDevelopment) {
        console.log(
          `MenuPopoverService: Creados ${submenuItems.length} popovers`
        );
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

      // Configurar trigger
      const trigger = document.getElementById(triggerId);
      if (trigger) {
        trigger.classList.add('popover-trigger');
        trigger.dataset.popoverId = popoverId;
        trigger.dataset.popoverPlacement = placement;

        // Log en desarrollo
        if (MenuConfig.getEnvironmentConfig().isDevelopment) {
          console.log(
            `MenuPopoverService: Trigger configurado para ${menuItem.id}:`,
            {
              id: trigger.id,
              classes: trigger.className,
              popoverId: trigger.dataset.popoverId,
              placement: trigger.dataset.popoverPlacement,
              offset: offset,
            }
          );
        }
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

      // Log en desarrollo
      if (MenuConfig.getEnvironmentConfig().isDevelopment) {
        console.log(
          `MenuPopoverService: Popover creado para ${menuItem.id} con placement: ${placement}`
        );
      }
    } catch (error) {
      console.error(
        `MenuPopoverService: Error al crear popover para ${menuItem.id}:`,
        error
      );
    }
  }

  /**
   * Determina el placement específico para un submenú
   * @param {MenuItem} menuItem - Item del menú
   * @returns {string} Placement ('top', 'bottom', 'left', 'right')
   */
  determineSubmenuPlacement(menuItem) {
    const submenuConfig = ComponentConfig.POPOVER.SUBMENU;

    // Log de debugging para verificar las propiedades
    console.log(
      `MenuPopoverService: Verificando placement para ${menuItem.id}:`,
      {
        popoverPlacement: menuItem.popoverPlacement,
        popoverOffset: menuItem.popoverOffset,
        hasCustomPlacement: !!submenuConfig.CUSTOM_PLACEMENTS[menuItem.id],
        customPlacement: submenuConfig.CUSTOM_PLACEMENTS[menuItem.id],
      }
    );

    // 1. Verificar configuración personalizada por ID
    if (submenuConfig.CUSTOM_PLACEMENTS[menuItem.id]) {
      const placement = submenuConfig.CUSTOM_PLACEMENTS[menuItem.id];
      console.log(
        `MenuPopoverService: Usando placement personalizado para ${menuItem.id}: ${placement}`
      );
      return placement;
    }

    // 2. Verificar configuración en el item del menú
    if (menuItem.popoverPlacement) {
      console.log(
        `MenuPopoverService: Usando placement del item ${menuItem.id}: ${menuItem.popoverPlacement}`
      );
      return menuItem.popoverPlacement;
    }

    // 3. Determinar por posición en el menú
    const menuItems = this.menuService.getMenuItemsSync();
    if (menuItems) {
      // Buscar en qué sección está el item
      if (menuItems.top.some(item => item.id === menuItem.id)) {
        const placement = submenuConfig.PLACEMENTS_BY_MENU_POSITION.top;
        console.log(
          `MenuPopoverService: Usando placement por posición (top) para ${menuItem.id}: ${placement}`
        );
        return placement;
      } else if (menuItems.bottom.some(item => item.id === menuItem.id)) {
        const placement = submenuConfig.PLACEMENTS_BY_MENU_POSITION.bottom;
        console.log(
          `MenuPopoverService: Usando placement por posición (bottom) para ${menuItem.id}: ${placement}`
        );
        return placement;
      }
    }

    // 4. Usar placement por defecto
    const placement = submenuConfig.DEFAULT_PLACEMENT;
    console.log(
      `MenuPopoverService: Usando placement por defecto para ${menuItem.id}: ${placement}`
    );
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

    // Log en desarrollo
    if (MenuConfig.getEnvironmentConfig().isDevelopment) {
      console.log(
        `MenuPopoverService: Popover configurado con placement: ${placement}, offset: ${offset}`
      );
    }
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
        console.log(`MenuPopoverService: Submenú clickeado: ${item.id}`);
      }

      // Log en desarrollo
      if (MenuConfig.getEnvironmentConfig().isDevelopment) {
        console.log(`MenuPopoverService: Item clickeado: ${item.id}`);
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

      // Log en desarrollo
      if (MenuConfig.getEnvironmentConfig().isDevelopment) {
        console.log('MenuPopoverService: Popovers actualizados');
      }
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

    // Log en desarrollo
    if (MenuConfig.getEnvironmentConfig().isDevelopment) {
      console.log('MenuPopoverService: Destruido');
    }
  }
}

// Exportar para uso global
window.MenuPopoverService = MenuPopoverService;
