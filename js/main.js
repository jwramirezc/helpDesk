// Clase principal de la aplicación
class App {
  constructor() {
    this.controladorUsuario = new ControladorUsuario();
    this.controladorContenido = new ControladorContenido(
      this.controladorUsuario
    );
    this.controladorSidebar = new ControladorSidebar(this.controladorContenido);
    this.controladorHeader = new ControladorHeader(this.controladorUsuario);
    this.controladorMenu = new ControladorMenu();
    this.temaHelper = new TemaHelper();
    this.tooltipHelper = new TooltipHelper();
  }

  async inicializar() {
    try {
      // Cargar tema
      this.temaHelper.aplicarTema();

      // Inicializar componentes
      await this.inicializarComponentes();

      // Inicializar tooltips
      this.tooltipHelper.inicializarTooltips();
    } catch (error) {
      console.error('Error al inicializar la aplicación:', error);
    }
  }

  async inicializarComponentes() {
    // Inicializar menú
    await this.controladorMenu.cargarMenu();

    // Inicializar sidebar
    this.controladorSidebar.inicializar();

    // Inicializar header
    await this.controladorHeader.inicializar();

    // Inicializar contenido
    this.controladorContenido.inicializar();
  }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.inicializar();
});
