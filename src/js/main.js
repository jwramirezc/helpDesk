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
    this.controladorHeader = new ControladorHeader();
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
    // Inicializar PopoverComponent primero
    if (typeof PopoverComponent !== 'undefined') {
      window.popoverComponent = new PopoverComponent();
      console.log('PopoverComponent inicializado');
    } else {
      console.error('PopoverComponent no está disponible');
    }

    // Inicializar menú
    await this.controladorMenu.cargarMenu();

    // Inicializar header con datos del usuario
    await this.cargarHeader();

    // Inicializar contenido
    this.controladorContenido.inicializar();
  }

  async cargarHeader() {
    try {
      const usuario = this.controladorUsuario.obtenerUsuarioActual();
      const tieneNotificaciones = await this.verificarNotificaciones();
      const t = this.i18nService.t.bind(this.i18nService);

      await this.controladorHeader.renderHeader(
        usuario,
        tieneNotificaciones,
        t
      );

      // Configurar event listeners del header
      this.controladorHeader.setupEventListeners();
    } catch (error) {
      console.error('Error al cargar el header:', error);
    }
  }

  async verificarNotificaciones() {
    try {
      // Usar AppConfig para obtener la ruta de notificaciones
      const response = await fetch(AppConfig.PATHS.NOTIFICACIONES_JSON);
      const data = await response.json();
      return data.tieneNotificaciones;
    } catch (error) {
      console.error('Error al cargar las notificaciones:', error);
      return false;
    }
  }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
  window.app.inicializar();
});
