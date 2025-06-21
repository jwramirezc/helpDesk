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
    if (this.isInitialized) return;

    try {
      // Verificar si estamos en el breakpoint correcto
      if (!this.isActiveInCurrentBreakpoint()) {
        return;
      }

      // Inicializar componente popover si no existe
      if (!this.popoverComponent) {
        this.popoverComponent = new PopoverComponent({
          triggerSelector: '.menu-item.has-submenu',
          placement: 'bottom',
          offset: 8,
        });
      }

      // Crear popovers para items con submenús
      await this.createPopoversForSubmenus();

      this.isInitialized = true;

      // Log en desarrollo
      if (MenuConfig.getEnvironmentConfig().isDevelopment) {
        console.log('MenuPopoverService: Inicializado');
      }
    } catch (error) {
      console.error('MenuPopoverService: Error al inicializar:', error);
    }
  }

  /**
   * Verifica si el servicio está activo en el breakpoint actual
   * @returns {boolean}
   */
  isActiveInCurrentBreakpoint() {
    const currentBreakpoint = MenuConfig.getCurrentBreakpoint();
    return currentBreakpoint === 'tablet'; // Solo activo en tablets (1024px)
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
      // Crear popover usando el componente
      const popover = this.popoverComponent.createPopoverFromMenu(
        menuItem.children,
        popoverId,
        (item, element) => this.handlePopoverItemClick(item, element)
      );

      // Agregar popover al DOM
      document.body.appendChild(popover);

      // Configurar trigger
      const trigger = document.getElementById(triggerId);
      if (trigger) {
        trigger.classList.add('popover-trigger');
        trigger.dataset.popoverId = popoverId;
      }

      // Almacenar referencia
      this.popovers.set(popoverId, {
        element: popover,
        menuItem: menuItem,
        trigger: trigger,
      });

      // Log en desarrollo
      if (MenuConfig.getEnvironmentConfig().isDevelopment) {
        console.log(`MenuPopoverService: Popover creado para ${menuItem.id}`);
      }
    } catch (error) {
      console.error(
        `MenuPopoverService: Error al crear popover para ${menuItem.id}:`,
        error
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
        // Mostrar mensaje si tiene openAction
        if (item.openAction === 'alert' && item.message) {
          alert(item.message);
        }
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
