class TooltipHelper {
  constructor() {
    this.tooltip = null;
  }

  inicializarTooltips() {
    document.addEventListener('mouseover', e => {
      const target = e.target;
      if (target.hasAttribute('data-tooltip')) {
        this.mostrarTooltip(target);
      }
    });

    document.addEventListener('mouseout', e => {
      const target = e.target;
      if (target.hasAttribute('data-tooltip')) {
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
