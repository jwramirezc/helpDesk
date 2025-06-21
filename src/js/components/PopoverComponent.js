/**
 * Componente Popover Reutilizable
 *
 * Este componente maneja la funcionalidad de popovers para tablets (1024px)
 * y se integra con el sistema de menús existente.
 */
class PopoverComponent {
  constructor(options = {}) {
    // Obtener opciones por defecto desde la configuración
    const defaultOptions = ComponentConfig.getDefaultOptions('POPOVER');

    this.options = {
      ...defaultOptions,
      ...options,
    };

    this.activePopover = null;
    this.triggers = [];
    this.init();
  }

  /**
   * Inicializa el componente
   */
  init() {
    this.setupEventListeners();

    // Log de inicialización usando configuración centralizada
    ComponentConfig.log('PopoverComponent', 'Inicializado');
  }

  /**
   * Configura los event listeners
   */
  setupEventListeners() {
    // Event listener para clicks en triggers
    document.addEventListener('click', e => {
      const trigger = e.target.closest(this.options.triggerSelector);
      if (trigger) {
        e.stopPropagation();
        this.handleTriggerClick(trigger);
      }
    });

    // Event listener para cerrar al hacer click fuera
    if (this.options.closeOnClickOutside) {
      document.addEventListener('click', e => {
        if (this.activePopover && !this.activePopover.contains(e.target)) {
          const trigger = e.target.closest(this.options.triggerSelector);
          if (!trigger) {
            this.hideActivePopover();
          }
        }
      });
    }

    // Event listener para cerrar al redimensionar
    if (this.options.closeOnResize) {
      window.addEventListener('resize', () => {
        this.hideActivePopover();
      });
    }

    // Event listener para cerrar con ESC
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && this.activePopover) {
        this.hideActivePopover();
      }
    });
  }

  /**
   * Maneja el click en un trigger
   * @param {HTMLElement} trigger - Elemento trigger
   */
  handleTriggerClick(trigger) {
    const popoverId = trigger.dataset.popoverId;
    const popover = document.getElementById(popoverId);

    if (!popover) {
      ComponentConfig.logError(
        'PopoverComponent',
        `Popover con ID "${popoverId}" no encontrado`
      );
      return;
    }

    if (this.activePopover === popover) {
      this.hidePopover(popover);
    } else {
      this.showPopover(popover, trigger);
    }
  }

  /**
   * Muestra un popover
   * @param {HTMLElement} popover - Elemento popover
   * @param {HTMLElement} trigger - Elemento trigger
   */
  showPopover(popover, trigger) {
    // Ocultar popover activo si existe
    this.hideActivePopover();

    // Posicionar el popover
    this.positionPopover(popover, trigger);

    // Mostrar el popover usando configuración
    const visibleClass = ComponentConfig.getCSSClass('POPOVER', 'VISIBLE');
    popover.classList.add(visibleClass);
    this.activePopover = popover;

    // Log en desarrollo usando configuración centralizada
    ComponentConfig.log('PopoverComponent', 'Popover mostrado', popover.id);
  }

  /**
   * Oculta un popover específico
   * @param {HTMLElement} popover - Elemento popover
   */
  hidePopover(popover) {
    const visibleClass = ComponentConfig.getCSSClass('POPOVER', 'VISIBLE');
    popover.classList.remove(visibleClass);

    if (this.activePopover === popover) {
      this.activePopover = null;
    }

    // Log en desarrollo usando configuración centralizada
    ComponentConfig.log('PopoverComponent', 'Popover ocultado', popover.id);
  }

  /**
   * Oculta el popover activo
   */
  hideActivePopover() {
    if (this.activePopover) {
      this.hidePopover(this.activePopover);
    }
  }

  /**
   * Posiciona el popover relativo al trigger
   * @param {HTMLElement} popover - Elemento popover
   * @param {HTMLElement} trigger - Elemento trigger
   */
  positionPopover(popover, trigger) {
    const triggerRect = trigger.getBoundingClientRect();
    const popoverRect = popover.getBoundingClientRect();
    const scrollLeft =
      window.pageXOffset || document.documentElement.scrollLeft;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Determinar el placement óptimo
    const placement = this.calculateOptimalPlacement(triggerRect, popoverRect);

    // Aplicar clases de placement usando configuración
    const placementPrefix = ComponentConfig.getCSSClass(
      'POPOVER',
      'PLACEMENT_PREFIX'
    );
    popover.className = popover.className.replace(/placement-\w+/g, '');
    popover.classList.add(`${placementPrefix}${placement}`);

    // Calcular posición
    let top, left;

    switch (placement) {
      case ComponentConfig.POPOVER.PLACEMENTS.BOTTOM:
        top = triggerRect.bottom + scrollTop + this.options.offset;
        left = triggerRect.left + scrollLeft;
        break;
      case ComponentConfig.POPOVER.PLACEMENTS.TOP:
        top =
          triggerRect.top +
          scrollTop -
          popoverRect.height -
          this.options.offset;
        left = triggerRect.left + scrollLeft;
        break;
      case ComponentConfig.POPOVER.PLACEMENTS.LEFT:
        top = triggerRect.top + scrollTop;
        left =
          triggerRect.left +
          scrollLeft -
          popoverRect.width -
          this.options.offset;
        break;
      case ComponentConfig.POPOVER.PLACEMENTS.RIGHT:
        top = triggerRect.top + scrollTop;
        left = triggerRect.right + scrollLeft + this.options.offset;
        break;
    }

    // Aplicar posición
    popover.style.top = `${top}px`;
    popover.style.left = `${left}px`;
  }

  /**
   * Calcula el placement óptimo para el popover
   * @param {DOMRect} triggerRect - Rectángulo del trigger
   * @param {DOMRect} popoverRect - Rectángulo del popover
   * @returns {string} Placement óptimo
   */
  calculateOptimalPlacement(triggerRect, popoverRect) {
    const placements = ComponentConfig.POPOVER.PLACEMENTS;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Calcular espacio disponible en cada dirección
    const spaceBelow = viewportHeight - triggerRect.bottom;
    const spaceAbove = triggerRect.top;
    const spaceRight = viewportWidth - triggerRect.left;
    const spaceLeft = triggerRect.right;

    // Priorizar placement según espacio disponible
    if (spaceBelow >= popoverRect.height || spaceBelow > spaceAbove) {
      return placements.BOTTOM;
    } else if (spaceAbove >= popoverRect.height) {
      return placements.TOP;
    } else if (spaceRight >= popoverRect.width || spaceRight > spaceLeft) {
      return placements.RIGHT;
    } else {
      return placements.LEFT;
    }
  }

  /**
   * Crea un popover dinámicamente desde datos del menú
   * @param {Array} menuItems - Array de items del menú
   * @param {string} popoverId - ID del popover
   * @param {Function} onItemClick - Callback para clicks en items
   * @returns {HTMLElement} Elemento popover creado
   */
  createPopoverFromMenu(menuItems, popoverId, onItemClick = null) {
    const popover = document.createElement('div');
    popover.id = popoverId;
    popover.className = ComponentConfig.getCSSClass('POPOVER', 'POPOVER');

    const arrow = document.createElement('div');
    arrow.className = ComponentConfig.getCSSClass('POPOVER', 'ARROW');

    const content = document.createElement('div');
    content.className = ComponentConfig.getCSSClass('POPOVER', 'CONTENT');

    // Generar items del popover
    const itemsHTML = menuItems.map(item => {
      const itemElement = document.createElement('div');
      itemElement.className = ComponentConfig.getCSSClass('POPOVER', 'ITEM');
      itemElement.dataset.itemId = item.id;
      itemElement.dataset.itemType = item.type;
      itemElement.dataset.itemTarget = item.target;

      itemElement.innerHTML = `
        ${item.icon ? `<i class="${item.icon}"></i>` : ''}
        <span>${item.label}</span>
      `;

      // Agregar event listener si se proporciona callback
      if (onItemClick) {
        itemElement.addEventListener('click', e => {
          e.stopPropagation();
          onItemClick(item, itemElement);
          this.hidePopover(popover);
        });
      }

      return itemElement;
    });

    // Agregar elementos al contenido
    itemsHTML.forEach((item, index) => {
      content.appendChild(item);

      // Agregar separador si no es el último item
      if (index < itemsHTML.length - 1) {
        const separator = document.createElement('div');
        separator.className = ComponentConfig.getCSSClass(
          'POPOVER',
          'SEPARATOR'
        );
        content.appendChild(separator);
      }
    });

    popover.appendChild(arrow);
    popover.appendChild(content);

    return popover;
  }

  /**
   * Verifica si el componente está activo en el breakpoint actual
   * @returns {boolean}
   */
  isActiveInCurrentBreakpoint() {
    const breakpoints = ComponentConfig.POPOVER.BREAKPOINTS;
    const width = window.innerWidth;
    return width >= breakpoints.TABLET_MIN && width <= breakpoints.TABLET_MAX;
  }

  /**
   * Destruye el componente y limpia recursos
   */
  destroy() {
    this.hideActivePopover();
    this.triggers = [];
    this.activePopover = null;

    // Log en desarrollo usando configuración centralizada
    ComponentConfig.log('PopoverComponent', 'Destruido');
  }
}

// Exportar para uso global
window.PopoverComponent = PopoverComponent;
