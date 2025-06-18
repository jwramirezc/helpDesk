// Clase principal de la aplicación
class App {
  constructor() {
    // Servicio de configuración compartido
    this.configService = new ConfigService();

    // Servicios compartidos
    this.menuService = new MenuService();

    // Servicio i18n
    this.i18nService = new I18nService(this.configService);

    // Controladores que dependen del servicio
    this.controladorUsuario = new ControladorUsuario(this.configService);
    this.controladorContenido = new ControladorContenido(
      this.controladorUsuario
    );
    this.controladorSidebar = new ControladorSidebar(
      this.controladorContenido,
      this.configService,
      this.menuService
    );
    this.controladorHeader = new ControladorHeader(
      this.controladorUsuario,
      this.i18nService
    );
    this.controladorMenu = new ControladorMenu(
      this.configService,
      this.menuService,
      this.controladorContenido
    );
    this.temaHelper = new TemaHelper();
    this.tooltipHelper = new TooltipHelper();
  }

  async inicializar() {
    try {
      // Cargar traducciones
      if (this.i18nService) {
        await this.i18nService.load();
      }

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

    // Inicializar header
    await this.controladorHeader.inicializar();

    // Inicializar contenido
    this.controladorContenido.inicializar();
  }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
  window.app.inicializar();
});
