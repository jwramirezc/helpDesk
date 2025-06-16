class ControladorNotificaciones {
  constructor() {
    this.config = Configuracion.cargar();
    this.estadoNotificaciones = null;
    this.cargarEstadoNotificaciones();
  }

  async cargarEstadoNotificaciones() {
    try {
      const response = await fetch('data/notificaciones.json');
      if (!response.ok) {
        throw new Error('Error al cargar las notificaciones');
      }
      this.estadoNotificaciones = await response.json();
      this.actualizarEstadoNotificaciones(
        this.estadoNotificaciones.tieneNotificaciones
      );
    } catch (error) {
      console.error('Error:', error);
    }
  }

  actualizarEstadoNotificaciones(tieneNotificaciones) {
    const badge = document.querySelector('.notification-badge');
    if (tieneNotificaciones) {
      if (!badge) {
        const notifications = document.querySelector('.notifications');
        if (!notifications) {
          const header = document.getElementById('header');
          const newNotifications = document.createElement('div');
          newNotifications.className = 'notifications';
          newNotifications.setAttribute('data-tooltip', 'Notificaciones');
          newNotifications.innerHTML = '<i class="fas fa-bell"></i>';
          header.appendChild(newNotifications);
        }
        const newBadge = document.createElement('span');
        newBadge.className = 'notification-badge';
        notifications.appendChild(newBadge);
      }
    } else {
      if (badge) {
        badge.remove();
      }
    }
  }

  obtenerEstadoNotificaciones() {
    return document.querySelector('.notification-badge') !== null;
  }
}
