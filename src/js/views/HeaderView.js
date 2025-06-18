class HeaderView {
  /**
   * @param {HTMLElement} header contenedor DOM del header
   */
  constructor(header) {
    this.header = header;
  }

  /**
   * Renderiza la cabecera.
   * @param {Usuario} usuario
   * @param {boolean} tieneNotificaciones
   * @param {function(string):string} t función de traducción
   */
  render(usuario, tieneNotificaciones, t = k => k) {
    if (!this.header) return;

    this.header.innerHTML = `
      <div class="user-info">
        <div class="notifications tooltip-bottom" data-tooltip="${t(
          'notifications'
        )}">
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
      </div>`;
  }
}
