/**
 * Componente Tooltip Reutilizable
 *
 * Este componente maneja la funcionalidad de tooltips de forma reutilizable
 * y configurable en toda la aplicación.
 */
class TooltipComponent {
  constructor(options = {}) {
    // Obtener opciones por defecto desde la configuración
    const defaultOptions = ComponentConfig.getDefaultOptions('TOOLTIP');

    this.options = {
      ...defaultOptions,
      ...options,
    };

    this.tooltip = null;
    this.arrow = null;
    this.currentTarget = null;
    this.showTimeout = null;
    this.hideTimeout = null;
    this.isInitialized = false;
  }

  /**
   * Inicializa el componente
   */
  initialize() {
    if (this.isInitialized) return;

    this.setupEventListeners();
    this.isInitialized = true;

    // Log en desarrollo usando configuración centralizada
    ComponentConfig.log('TooltipComponent', 'Inicializado');
  }

  /**
   * Configura los event listeners
   */
  setupEventListeners() {
    // Event listener para mostrar tooltip
    document.addEventListener('mouseover', e => {
      const target = e.target.closest(this.options.triggerSelector);
      if (target && target !== this.currentTarget) {
        this.currentTarget = target;
        this.scheduleShow(target);
      }
    });

    // Event listener para ocultar tooltip
    document.addEventListener('mouseout', e => {
      const target = e.target.closest(this.options.triggerSelector);
      const relatedTarget = e.relatedTarget;

      if (target && (!relatedTarget || !target.contains(relatedTarget))) {
        this.scheduleHide();
      }
    });

    // Event listener para click fuera
    document.addEventListener('click', e => {
      if (this.tooltip && !this.tooltip.contains(e.target)) {
        this.hideTooltip();
      }
    });
  }

  /**
   * Programa mostrar el tooltip con delay
   * @param {HTMLElement} target - Elemento target
   */
  scheduleShow(target) {
    this.clearTimeouts();

    this.showTimeout = setTimeout(() => {
      this.showTooltip(target);
    }, this.options.delay);
  }

  /**
   * Programa ocultar el tooltip con delay
   */
  scheduleHide() {
    this.clearTimeouts();

    // Usar hideDelay desde configuración
    const hideDelay = ComponentConfig.getDefaultOption('TOOLTIP', 'hideDelay');

    this.hideTimeout = setTimeout(() => {
      this.hideTooltip();
    }, hideDelay);
  }

  /**
   * Limpia los timeouts activos
   */
  clearTimeouts() {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }

  /**
   * Muestra el tooltip
   * @param {HTMLElement} target - Elemento target
   */
  showTooltip(target) {
    const texto = target.getAttribute('data-tooltip');
    if (!texto) return;

    // Crear tooltip si no existe
    if (!this.tooltip) {
      this.tooltip = document.createElement('div');
      this.tooltip.className = ComponentConfig.getCSSClass(
        'TOOLTIP',
        'TOOLTIP'
      );
      document.body.appendChild(this.tooltip);
    }

    // Crear flecha si no existe
    if (!this.arrow) {
      this.arrow = document.createElement('div');
      this.arrow.className = ComponentConfig.getCSSClass('TOOLTIP', 'ARROW');
      document.body.appendChild(this.arrow);
    }

    // Posicionar tooltip
    this.positionTooltip(target, texto);

    // Mostrar tooltip
    this.tooltip.style.display = 'block';
    this.arrow.style.display = 'block';
  }

  /**
   * Posiciona el tooltip
   * @param {HTMLElement} target - Elemento target
   * @param {string} texto - Texto del tooltip
   */
  positionTooltip(target, texto) {
    const rect = target.getBoundingClientRect();
    const scrollLeft =
      window.pageXOffset || document.documentElement.scrollLeft;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Determinar placement
    const placement = this.determinePlacement(target, rect);

    // Aplicar clases de placement usando configuración
    const tooltipClass = ComponentConfig.getCSSClass('TOOLTIP', 'TOOLTIP');
    const arrowClass = ComponentConfig.getCSSClass('TOOLTIP', 'ARROW');
    const placementPrefix = ComponentConfig.getCSSClass(
      'TOOLTIP',
      'PLACEMENT_PREFIX'
    );
    const arrowPlacementPrefix = ComponentConfig.getCSSClass(
      'TOOLTIP',
      'ARROW_PLACEMENT_PREFIX'
    );

    this.tooltip.className = tooltipClass;
    this.arrow.className = arrowClass;

    if (placement === ComponentConfig.TOOLTIP.PLACEMENTS.BOTTOM) {
      this.tooltip.classList.add(`${placementPrefix}bottom`);
      this.arrow.classList.add(`${arrowPlacementPrefix}up`);
    } else if (placement === ComponentConfig.TOOLTIP.PLACEMENTS.TOP) {
      this.tooltip.classList.add(`${placementPrefix}top`);
      this.arrow.classList.add(`${arrowPlacementPrefix}down`);
    } else if (placement === ComponentConfig.TOOLTIP.PLACEMENTS.LEFT) {
      this.tooltip.classList.add(`${placementPrefix}left`);
      this.arrow.classList.add(`${arrowPlacementPrefix}right`);
    } else {
      this.tooltip.classList.add(`${placementPrefix}right`);
      this.arrow.classList.add(`${arrowPlacementPrefix}left`);
    }

    // Calcular posición usando offsets desde configuración
    let tooltipLeft, tooltipTop, arrowLeft, arrowTop;
    const arrowOffsets = ComponentConfig.TOOLTIP.ARROW_OFFSETS;

    switch (placement) {
      case ComponentConfig.TOOLTIP.PLACEMENTS.BOTTOM:
        tooltipLeft = rect.left + scrollLeft + rect.width / 2;
        tooltipTop = rect.bottom + scrollTop + this.options.offset;
        arrowLeft = rect.left + scrollLeft + rect.width / 2;
        arrowTop = rect.bottom + scrollTop + arrowOffsets.bottom;
        this.tooltip.style.transform = 'translateX(-50%)';
        this.arrow.style.transform = 'translateX(-50%)';
        break;
      case ComponentConfig.TOOLTIP.PLACEMENTS.TOP:
        tooltipLeft = rect.left + scrollLeft + rect.width / 2;
        tooltipTop = rect.top + scrollTop - this.options.offset;
        arrowLeft = rect.left + scrollLeft + rect.width / 2;
        arrowTop = rect.top + scrollTop - arrowOffsets.top;
        this.tooltip.style.transform = 'translateX(-50%)';
        this.arrow.style.transform = 'translateX(-50%)';
        break;
      case ComponentConfig.TOOLTIP.PLACEMENTS.LEFT:
        tooltipLeft = rect.left + scrollLeft - this.options.offset;
        tooltipTop = rect.top + scrollTop + rect.height / 2;
        arrowLeft = rect.left + scrollLeft - arrowOffsets.left;
        arrowTop = rect.top + scrollTop + rect.height / 2;
        this.tooltip.style.transform = 'translateY(-50%)';
        this.arrow.style.transform = 'translateY(-50%)';
        break;
      case ComponentConfig.TOOLTIP.PLACEMENTS.RIGHT:
      default:
        tooltipLeft = rect.right + scrollLeft + this.options.offset;
        tooltipTop = rect.top + scrollTop + rect.height / 2;
        arrowLeft = rect.right + scrollLeft + arrowOffsets.right;
        arrowTop = rect.top + scrollTop + rect.height / 2;
        this.tooltip.style.transform = 'translateY(-50%)';
        this.arrow.style.transform = 'translateY(-50%)';
        break;
    }

    // Aplicar posición
    this.tooltip.style.left = `${tooltipLeft}px`;
    this.tooltip.style.top = `${tooltipTop}px`;
    this.arrow.style.left = `${arrowLeft}px`;
    this.arrow.style.top = `${arrowTop}px`;

    // Aplicar texto y estilos
    this.tooltip.textContent = texto;
    this.tooltip.style.maxWidth = `${this.options.maxWidth}px`;
  }

  /**
   * Determina el placement óptimo para el tooltip
   * @param {HTMLElement} target - Elemento target
   * @param {DOMRect} rect - Rectángulo del target
   * @returns {string} Placement óptimo
   */
  determinePlacement(target, rect) {
    const placements = ComponentConfig.TOOLTIP.PLACEMENTS;

    // Verificar clases específicas del target
    if (target.classList.contains('tooltip-bottom')) return placements.BOTTOM;
    if (target.classList.contains('tooltip-top')) return placements.TOP;
    if (target.classList.contains('tooltip-left')) return placements.LEFT;
    if (target.classList.contains('tooltip-right')) return placements.RIGHT;
    if (target.classList.contains('sidebar-item')) return placements.RIGHT;

    // Calcular espacio disponible
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;
    const spaceRight = viewportWidth - rect.left;
    const spaceLeft = rect.right;

    // Priorizar placement según espacio disponible
    if (spaceBelow >= 50 || spaceBelow > spaceAbove) {
      return placements.BOTTOM;
    } else if (spaceAbove >= 50) {
      return placements.TOP;
    } else if (spaceRight >= 200 || spaceRight > spaceLeft) {
      return placements.RIGHT;
    } else {
      return placements.LEFT;
    }
  }

  /**
   * Oculta el tooltip
   */
  hideTooltip() {
    this.clearTimeouts();

    if (this.tooltip) {
      this.tooltip.style.display = 'none';
    }
    if (this.arrow) {
      this.arrow.style.display = 'none';
    }

    this.currentTarget = null;
  }

  /**
   * Destruye el componente y limpia recursos
   */
  destroy() {
    this.hideTooltip();

    if (this.tooltip && this.tooltip.parentNode) {
      this.tooltip.parentNode.removeChild(this.tooltip);
      this.tooltip = null;
    }

    if (this.arrow && this.arrow.parentNode) {
      this.arrow.parentNode.removeChild(this.arrow);
      this.arrow = null;
    }

    this.isInitialized = false;

    // Log en desarrollo usando configuración centralizada
    ComponentConfig.log('TooltipComponent', 'Destruido');
  }
}

// Exportar para uso global
window.TooltipComponent = TooltipComponent;
