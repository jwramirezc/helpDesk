class TooltipHelper {
  constructor() {
    this.tooltip = null;
  }

  inicializarTooltips() {
    document.addEventListener('mouseover', e => {
      // Buscar el elemento más cercano con data-tooltip (ya sea el elemento actual o un padre)
      const target = e.target.closest('[data-tooltip]');
      if (target) {
        this.mostrarTooltip(target);
      }
    });

    document.addEventListener('mouseout', e => {
      // Verificar si el elemento al que se movió el mouse está fuera del elemento con tooltip
      const target = e.target.closest('[data-tooltip]');
      const relatedTarget = e.relatedTarget;

      if (target && (!relatedTarget || !target.contains(relatedTarget))) {
        this.ocultarTooltip();
      }
    });
  }

  mostrarTooltip(elemento) {
    const texto = elemento.getAttribute('data-tooltip');

    // Crear tooltip si no existe
    if (!this.tooltip) {
      this.tooltip = document.createElement('div');
      this.tooltip.className = 'custom-tooltip';
      document.body.appendChild(this.tooltip);
    }

    // Posicionar tooltip
    const rect = elemento.getBoundingClientRect();
    const scrollLeft =
      window.pageXOffset || document.documentElement.scrollLeft;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    this.tooltip.style.left = `${rect.right + scrollLeft + 10}px`;
    this.tooltip.style.top = `${rect.top + scrollTop + rect.height / 2}px`;
    this.tooltip.textContent = texto;
    this.tooltip.style.display = 'block';
  }

  ocultarTooltip() {
    if (this.tooltip) {
      this.tooltip.style.display = 'none';
    }
  }
}
