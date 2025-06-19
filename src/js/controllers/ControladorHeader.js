class ControladorHeader {
  constructor(controladorUsuario, i18nService) {
    this.controladorUsuario = controladorUsuario;
    this.i18nService = i18nService;
    this.header = document.getElementById('header');

    // Validar que HeaderView esté disponible
    if (typeof HeaderView === 'undefined') {
      console.error('ControladorHeader: HeaderView no está disponible');
      this.headerView = null;
    } else {
      this.headerView = new HeaderView(this.header);
    }
  }

  async inicializar() {
    try {
      await this.cargarHeader();
      this.inicializarEventos();
    } catch (error) {
      console.error('ControladorHeader: Error al inicializar:', error);
    }
  }

  async cargarHeader() {
    if (!this.headerView) {
      console.error(
        'ControladorHeader: No se puede cargar header sin HeaderView'
      );
      return;
    }

    const usuario = this.controladorUsuario.obtenerUsuarioActual();
    const tieneNotificaciones = await this.verificarNotificaciones();

    // Pasar función traductora si existe en window.app (Main)
    const t = this.i18nService.t.bind(this.i18nService);
    this.headerView.render(usuario, tieneNotificaciones, t);
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

  inicializarEventos() {
    const notificationsElement = this.header.querySelector('.notifications');
    if (notificationsElement) {
      notificationsElement.addEventListener('click', () =>
        this.mostrarNotificaciones()
      );
    }
  }

  mostrarNotificaciones() {
    // TODO: Implementar lógica para mostrar notificaciones
    console.log('Mostrando notificaciones...');
  }
}
