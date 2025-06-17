class ControladorHeader {
  constructor(controladorUsuario, i18nService) {
    this.controladorUsuario = controladorUsuario;
    this.i18nService = i18nService;
    this.header = document.getElementById('header');
    this.headerView = new HeaderView(this.header);
  }

  async inicializar() {
    await this.cargarHeader();
    this.inicializarEventos();
  }

  async cargarHeader() {
    const usuario = this.controladorUsuario.obtenerUsuarioActual();
    const tieneNotificaciones = await this.verificarNotificaciones();

    // Pasar función traductora si existe en window.app (Main)
    const t = this.i18nService.t.bind(this.i18nService);
    this.headerView.render(usuario, tieneNotificaciones, t);
  }

  async verificarNotificaciones() {
    try {
      const response = await fetch('data/notificationes.json');
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
