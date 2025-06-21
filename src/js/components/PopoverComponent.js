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
    this.activeTrigger = null; // Referencia al trigger activo
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

    // Event listener para actualizar posición durante scroll
    window.addEventListener(
      'scroll',
      () => {
        if (this.activePopover && this.activeTrigger) {
          this.updatePopoverPosition();
        }
      },
      { passive: true }
    );

    // Event listener para actualizar posición durante resize
    window.addEventListener(
      'resize',
      () => {
        if (this.activePopover && this.activeTrigger) {
          this.updatePopoverPosition();
        }
      },
      { passive: true }
    );
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

    // Guardar referencias
    this.activePopover = popover;
    this.activeTrigger = trigger;

    // Mostrar el popover primero para que tenga dimensiones
    const visibleClass = ComponentConfig.getCSSClass('POPOVER', 'VISIBLE');
    popover.classList.add(visibleClass);

    // Forzar reflow para asegurar que las dimensiones estén disponibles
    popover.offsetHeight;

    // Posicionar el popover después de que tenga dimensiones
    this.positionPopover(popover, trigger);

    // Asegurar posicionamiento correcto después de que el DOM se estabilice
    this.ensureCorrectPositioning(popover, trigger);

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
      this.activeTrigger = null; // Limpiar referencia al trigger
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

    // Determinar el placement: priorizar configuración específica del popover
    let placement;

    // 1. Verificar si el popover tiene configuración específica
    if (popover.dataset.placement) {
      placement = popover.dataset.placement;
      ComponentConfig.log(
        'PopoverComponent',
        `Usando placement específico: ${placement}`
      );
    }
    // 2. Verificar si el trigger tiene configuración específica
    else if (trigger.dataset.popoverPlacement) {
      placement = trigger.dataset.popoverPlacement;
      ComponentConfig.log(
        'PopoverComponent',
        `Usando placement del trigger: ${placement}`
      );
    }
    // 3. Usar placement forzado global
    else if (this.options.forcePlacement) {
      placement = this.options.forcePlacement;
      ComponentConfig.log(
        'PopoverComponent',
        `Usando placement forzado: ${placement}`
      );
    }
    // 4. Calcular placement óptimo automáticamente
    else {
      placement = this.calculateOptimalPlacement(triggerRect, popoverRect);
      ComponentConfig.log(
        'PopoverComponent',
        `Usando placement calculado: ${placement}`
      );
    }

    // Aplicar clases de placement usando configuración
    const placementPrefix = ComponentConfig.getCSSClass(
      'POPOVER',
      'PLACEMENT_PREFIX'
    );
    popover.className = popover.className.replace(/placement-\w+/g, '');
    popover.classList.add(`${placementPrefix}${placement}`);

    // Obtener offset específico del popover o usar el global
    const offset = popover.dataset.offset
      ? parseInt(popover.dataset.offset)
      : this.options.offset;

    // Calcular posición del popover para que la flecha apunte al centro del trigger
    let top, left;

    switch (placement) {
      case ComponentConfig.POPOVER.PLACEMENTS.BOTTOM:
        // Popover debajo del trigger, flecha apunta al centro del trigger
        top = triggerRect.bottom + offset;
        left = triggerRect.left + triggerRect.width / 2 - popoverRect.width / 2;
        break;
      case ComponentConfig.POPOVER.PLACEMENTS.TOP:
        // Popover arriba del trigger, flecha apunta al centro del trigger
        top = triggerRect.top - popoverRect.height - offset;
        left = triggerRect.left + triggerRect.width / 2 - popoverRect.width / 2;
        break;
      case ComponentConfig.POPOVER.PLACEMENTS.LEFT:
        // Popover a la izquierda del trigger, flecha apunta al centro del trigger
        top = triggerRect.top + triggerRect.height / 2 - popoverRect.height / 2;
        left = triggerRect.left - popoverRect.width - offset;
        break;
      case ComponentConfig.POPOVER.PLACEMENTS.RIGHT:
        // Popover a la derecha del trigger, flecha apunta al centro del trigger
        top = triggerRect.top + triggerRect.height / 2 - popoverRect.height / 2;
        left = triggerRect.right + offset;
        break;
    }

    // Aplicar posición
    popover.style.top = `${top}px`;
    popover.style.left = `${left}px`;

    // Posicionar la flecha para que apunte exactamente al centro del trigger
    this.positionArrowToTrigger(popover, trigger, placement);
  }

  /**
   * Posiciona la flecha para que apunte exactamente al centro del trigger
   * @param {HTMLElement} popover - Elemento popover
   * @param {HTMLElement} trigger - Elemento trigger
   * @param {string} placement - Dirección del popover
   */
  positionArrowToTrigger(popover, trigger, placement) {
    const arrow = popover.querySelector(
      `.${ComponentConfig.getCSSClass('POPOVER', 'ARROW')}`
    );
    if (!arrow) return;

    // Asegurar que el popover esté visible y tenga dimensiones
    if (
      !popover.classList.contains(
        ComponentConfig.getCSSClass('POPOVER', 'VISIBLE')
      )
    ) {
      popover.classList.add(ComponentConfig.getCSSClass('POPOVER', 'VISIBLE'));
    }

    // Forzar reflow para obtener dimensiones actualizadas
    popover.offsetHeight;

    const triggerRect = trigger.getBoundingClientRect();
    const popoverRect = popover.getBoundingClientRect();
    const popoverLeft = parseFloat(popover.style.left) || 0;
    const popoverTop = parseFloat(popover.style.top) || 0;

    // Calcular la posición de la flecha para que apunte al centro del trigger
    let arrowTop, arrowLeft;

    switch (placement) {
      case ComponentConfig.POPOVER.PLACEMENTS.BOTTOM:
        // Flecha en borde superior apuntando hacia arriba al centro del trigger
        arrowTop = -8; // Fuera del popover hacia arriba
        arrowLeft = triggerRect.left + triggerRect.width / 2 - popoverLeft - 8; // Centrada respecto al trigger
        break;
      case ComponentConfig.POPOVER.PLACEMENTS.TOP:
        // Flecha en borde inferior apuntando hacia abajo al centro del trigger
        arrowTop = popoverRect.height - 8; // Fuera del popover hacia abajo
        arrowLeft = triggerRect.left + triggerRect.width / 2 - popoverLeft - 8; // Centrada respecto al trigger
        break;
      case ComponentConfig.POPOVER.PLACEMENTS.LEFT:
        // Flecha en borde derecho apuntando hacia la derecha al centro del trigger
        arrowTop = triggerRect.top + triggerRect.height / 2 - popoverTop - 8; // Centrada respecto al trigger
        arrowLeft = popoverRect.width - 8; // Fuera del popover hacia la derecha
        break;
      case ComponentConfig.POPOVER.PLACEMENTS.RIGHT:
        // Flecha en borde izquierdo apuntando hacia la izquierda al centro del trigger
        arrowTop = triggerRect.top + triggerRect.height / 2 - popoverTop - 8; // Centrada respecto al trigger
        arrowLeft = -8; // Fuera del popover hacia la izquierda
        break;
    }

    // Aplicar posición de la flecha
    arrow.style.top = `${arrowTop}px`;
    arrow.style.left = `${arrowLeft}px`;

    // Log para debugging
    ComponentConfig.log(
      'PopoverComponent',
      `Flecha posicionada: top=${arrowTop}px, left=${arrowLeft}px, placement=${placement}`
    );
  }

  /**
   * Establece la dirección forzada del popover
   * @param {string} placement - Dirección ('top', 'bottom', 'left', 'right')
   */
  setForcePlacement(placement) {
    const validPlacements = ['top', 'bottom', 'left', 'right'];
    if (validPlacements.includes(placement)) {
      this.options.forcePlacement = placement;
      ComponentConfig.log(
        'PopoverComponent',
        `Placement forzado establecido: ${placement}`
      );
    } else {
      ComponentConfig.logError(
        'PopoverComponent',
        `Placement inválido: ${placement}`
      );
    }
  }

  /**
   * Limpia el placement forzado (vuelve al cálculo automático)
   */
  clearForcePlacement() {
    this.options.forcePlacement = null;
    ComponentConfig.log('PopoverComponent', 'Placement forzado limpiado');
  }

  /**
   * Actualiza la posición del popover activo durante scroll o resize
   */
  updatePopoverPosition() {
    if (this.activePopover && this.activeTrigger) {
      this.positionPopover(this.activePopover, this.activeTrigger);
    }
  }

  /**
   * Asegura el posicionamiento correcto después de que el DOM se estabilice
   * @param {HTMLElement} popover - Elemento popover
   * @param {HTMLElement} trigger - Elemento trigger
   */
  ensureCorrectPositioning(popover, trigger) {
    // Usar requestAnimationFrame para asegurar que el DOM esté listo
    requestAnimationFrame(() => {
      if (this.activePopover === popover) {
        this.positionPopover(popover, trigger);
      }
    });
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
    this.activeTrigger = null; // Limpiar referencia al trigger

    // Log en desarrollo usando configuración centralizada
    ComponentConfig.log('PopoverComponent', 'Destruido');
  }
}

// Exportar para uso global
window.PopoverComponent = PopoverComponent;
