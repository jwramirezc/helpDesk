class ControladorHeader {
  constructor(controladorUsuario) {
    this.controladorUsuario = controladorUsuario;
    this.header = document.getElementById('header');
  }

  async inicializar() {
    await this.cargarHeader();
    this.inicializarEventos();
  }

  async cargarHeader() {
    const usuario = this.controladorUsuario.obtenerUsuarioActual();
    const tieneNotificaciones = await this.verificarNotificaciones();

    this.header.innerHTML = `
      <div class="user-info">
        <div class="notifications tooltip-bottom" data-tooltip="Notificaciones">
          <i class="far fa-bell"></i>
          ${
            tieneNotificaciones
              ? '<span class="notification-badge"></span>'
              : ''
          }
        </div>
        <div class="user-details">
          <span class="user-name">${usuario.nombre} ${usuario.apellidos}</span>
          <span class="user-company">${usuario.empresa}</span>
        </div>
        <div class="user-avatar">
          <img src="${usuario.avatar}" alt="Avatar">
        </div>
      </div>
    `;
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
