class TooltipHelper {
  constructor() {
    this.tooltip = null;
    this.arrow = null;
    this.isInitialized = false;
  }

  /**
   * Verifica si el componente está activo en el breakpoint actual
   * @returns {boolean}
   */
  isActiveInCurrentBreakpoint() {
    // Solo activo en desktop (>1024px)
    const width = window.innerWidth;
    const isActive = width >= 1025; // Desktop mínimo

    return isActive;
  }

  inicializarTooltips() {
    // Solo inicializar en desktop
    if (!this.isActiveInCurrentBreakpoint()) {
      return;
    }

    if (this.isInitialized) return;

    document.addEventListener('mouseover', e => {
      // Verificación estricta: solo procesar en desktop
      if (!this.isActiveInCurrentBreakpoint()) {
        return;
      }

      const target = e.target.closest('[data-tooltip]');
      if (target) {
        this.mostrarTooltip(target);
      }
    });

    document.addEventListener('mouseout', e => {
      // Verificación estricta: solo procesar en desktop
      if (!this.isActiveInCurrentBreakpoint()) {
        return;
      }

      const target = e.target.closest('[data-tooltip]');
      const relatedTarget = e.relatedTarget;

      if (target && (!relatedTarget || !target.contains(relatedTarget))) {
        this.ocultarTooltip();
      }
    });

    // Event listener para ocultar tooltip al hacer clic
    document.addEventListener('click', e => {
      // Ocultar tooltip en cualquier breakpoint al hacer clic
      this.ocultarTooltip();
    });

    // Event listener para ocultar tooltip al cambiar breakpoint
    window.addEventListener('resize', () => {
      // Si cambiamos a tablet/móvil, ocultar tooltip y deshabilitar
      if (!this.isActiveInCurrentBreakpoint()) {
        this.ocultarTooltip();
        this.isInitialized = false; // Permitir reinicialización si vuelve a desktop
      }
    });

    this.isInitialized = true;
  }

  mostrarTooltip(elemento) {
    // Verificación estricta antes de mostrar
    if (!this.isActiveInCurrentBreakpoint()) {
      return;
    }

    const texto = elemento.getAttribute('data-tooltip');

    // Crear tooltip si no existe
    if (!this.tooltip) {
      this.tooltip = document.createElement('div');
      this.tooltip.className = 'custom-tooltip';
      document.body.appendChild(this.tooltip);
    }

    // Crear flecha si no existe
    if (!this.arrow) {
      this.arrow = document.createElement('div');
      this.arrow.className = 'tooltip-arrow';
      document.body.appendChild(this.arrow);
    }

    // Posicionar tooltip
    const rect = elemento.getBoundingClientRect();
    const scrollLeft =
      window.pageXOffset || document.documentElement.scrollLeft;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Determinar la posición del tooltip basado en las clases del elemento
    if (elemento.classList.contains('tooltip-bottom')) {
      // Tooltip debajo del elemento (para la campana de notificaciones)
      this.tooltip.style.left = `${rect.left + scrollLeft + rect.width / 2}px`;
      this.tooltip.style.top = `${rect.bottom + scrollTop + 10}px`;
      this.tooltip.style.transform = 'translateX(-50%)';

      // Flecha apuntando hacia arriba
      this.arrow.style.left = `${rect.left + scrollLeft + rect.width / 2}px`;
      this.arrow.style.top = `${rect.bottom + scrollTop + 4}px`;
      this.arrow.style.transform = 'translateX(-50%)';
      this.arrow.className = 'tooltip-arrow tooltip-arrow-up';
    } else if (elemento.classList.contains('sidebar-item')) {
      // Tooltip a la derecha (para elementos de la barra lateral)
      this.tooltip.style.left = `${rect.right + scrollLeft + 10}px`;
      this.tooltip.style.top = `${rect.top + scrollTop + rect.height / 2}px`;
      this.tooltip.style.transform = 'translateY(-50%)';

      // Flecha apuntando hacia la izquierda
      this.arrow.style.left = `${rect.right + scrollLeft + 4}px`;
      this.arrow.style.top = `${rect.top + scrollTop + rect.height / 2}px`;
      this.arrow.style.transform = 'translateY(-50%)';
      this.arrow.className = 'tooltip-arrow tooltip-arrow-left';
    } else {
      // Posicionamiento por defecto (a la derecha)
      this.tooltip.style.left = `${rect.right + scrollLeft + 10}px`;
      this.tooltip.style.top = `${rect.top + scrollTop + rect.height / 2}px`;
      this.tooltip.style.transform = 'translateY(-50%)';

      // Flecha apuntando hacia la izquierda
      this.arrow.style.left = `${rect.right + scrollLeft + 4}px`;
      this.arrow.style.top = `${rect.top + scrollTop + rect.height / 2}px`;
      this.arrow.style.transform = 'translateY(-50%)';
      this.arrow.className = 'tooltip-arrow tooltip-arrow-left';
    }

    this.tooltip.textContent = texto;
    this.tooltip.style.display = 'block';
    this.arrow.style.display = 'block';
  }

  ocultarTooltip() {
    if (this.tooltip) {
      this.tooltip.style.display = 'none';
    }
    if (this.arrow) {
      this.arrow.style.display = 'none';
    }
  }
}
