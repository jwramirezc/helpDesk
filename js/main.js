// Clase principal de la aplicación
class App {
  constructor() {
    this.controladorUsuario = new ControladorUsuario();
    this.controladorContenido = new ControladorContenido(
      this.controladorUsuario
    );
    this.controladorSidebar = new ControladorSidebar(this.controladorContenido);
    this.controladorHeader = new ControladorHeader(this.controladorUsuario);
    this.temaHelper = new TemaHelper();
    this.tooltipHelper = new TooltipHelper();
  }

  async inicializar() {
    try {
      console.log('Inicializando aplicación...');

      // Cargar tema
      this.temaHelper.aplicarTema();
      console.log('Tema aplicado:', this.temaHelper.obtenerTemaActual());

      // Inicializar componentes
      await this.inicializarComponentes();
      console.log('Componentes inicializados');

      // Inicializar tooltips
      this.tooltipHelper.inicializarTooltips();
      console.log('Tooltips inicializados');
    } catch (error) {
      console.error('Error al inicializar la aplicación:', error);
    }
  }

  async inicializarComponentes() {
    // Inicializar sidebar
    this.controladorSidebar.inicializar();
    console.log('Sidebar inicializado');

    // Inicializar header
    await this.controladorHeader.inicializar();
    console.log('Header inicializado');

    // Inicializar contenido
    this.controladorContenido.inicializar();
    console.log('Contenido inicializado');
  }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM cargado, iniciando aplicación...');
  const app = new App();
  app.inicializar();
});
