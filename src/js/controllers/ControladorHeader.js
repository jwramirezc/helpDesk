/**
 * Controlador del Header con configuración dinámica
 *
 * Este controlador maneja la lógica del header usando la nueva
 * HeaderView con configuración JSON en lugar de datos hardcodeados.
 */
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

    this.isInitialized = false;
  }

  /**
   * Inicializa el controlador del header
   */
  async inicializar() {
    try {
      if (!this.headerView) {
        console.error(
          'ControladorHeader: No se puede inicializar sin HeaderView'
        );
        return;
      }

      // Inicializar la vista del header
      await this.headerView.initialize();

      // Cargar el header
      await this.cargarHeader();

      // Inicializar eventos
      this.inicializarEventos();

      this.isInitialized = true;

      console.log('ControladorHeader: Inicializado correctamente');
    } catch (error) {
      console.error('ControladorHeader: Error al inicializar:', error);
    }
  }

  /**
   * Carga el header con datos del usuario
   */
  async cargarHeader() {
    if (!this.headerView) {
      console.error(
        'ControladorHeader: No se puede cargar header sin HeaderView'
      );
      return;
    }

    const usuario = this.controladorUsuario.obtenerUsuarioActual();
    const tieneNotificaciones = await this.verificarNotificaciones();

    // Pasar función traductora
    const t = this.i18nService.t.bind(this.i18nService);

    // Renderizar usando la nueva vista con configuración dinámica
    await this.headerView.render(usuario, tieneNotificaciones, t);
  }

  /**
   * Verifica si hay notificaciones pendientes
   * @returns {Promise<boolean>} True si hay notificaciones
   */
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

  /**
   * Inicializa los eventos del header
   */
  inicializarEventos() {
    if (!this.header) return;

    // Los botones de popover ya son manejados automáticamente por PopoverComponent
    // Solo necesitamos agregar eventos específicos si es necesario

    // Evento para botón de notificaciones (si existe)
    const notificationsElement =
      this.header.querySelector('#btn-notifications');
    if (notificationsElement) {
      notificationsElement.addEventListener('click', e => {
        e.preventDefault();
        this.mostrarNotificaciones();
      });
    }

    // Evento para botón de tema (si existe)
    const themeButton = this.header.querySelector('#btn-theme-toggle');
    if (themeButton) {
      themeButton.addEventListener('click', e => {
        e.preventDefault();
        this.toggleTheme();
      });
    }

    // Evento para avatar del usuario (si existe)
    const userAvatar = this.header.querySelector('.user-avatar');
    if (userAvatar) {
      userAvatar.addEventListener('click', e => {
        e.preventDefault();
        this.handleUserAvatarClick();
      });
    }

    // Evento para información del usuario (si existe)
    const userDetails = this.header.querySelector('.user-details');
    if (userDetails) {
      userDetails.addEventListener('click', e => {
        e.preventDefault();
        this.handleUserDetailsClick();
      });
    }

    console.log('ControladorHeader: Eventos inicializados');
  }

  /**
   * Muestra las notificaciones
   */
  mostrarNotificaciones() {
    console.log('Mostrando notificaciones...');

    // Aquí implementarías la lógica para mostrar notificaciones
    // Por ejemplo, abrir un modal o navegar a una vista de notificaciones

    // Disparar evento personalizado
    const event = new CustomEvent('header:notifications-click', {
      detail: {
        user: this.controladorUsuario.obtenerUsuarioActual(),
        hasNotifications: true,
      },
    });
    document.dispatchEvent(event);
  }

  /**
   * Cambia el tema de la aplicación
   */
  toggleTheme() {
    console.log('Cambiando tema...');

    // Obtener el tema actual
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    // Aplicar nuevo tema
    document.documentElement.setAttribute('data-theme', newTheme);

    // Actualizar icono del botón de tema
    const themeButton = this.header.querySelector('#btn-theme-toggle');
    if (themeButton) {
      const icon = themeButton.querySelector('i');
      if (icon) {
        icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
      }
    }

    // Disparar evento personalizado
    const event = new CustomEvent('header:theme-toggle', {
      detail: { theme: newTheme },
    });
    document.dispatchEvent(event);
  }

  /**
   * Maneja el click en el avatar del usuario
   */
  handleUserAvatarClick() {
    console.log('Click en avatar del usuario');

    // Disparar evento personalizado
    const event = new CustomEvent('header:user-avatar-click', {
      detail: {
        user: this.controladorUsuario.obtenerUsuarioActual(),
      },
    });
    document.dispatchEvent(event);
  }

  /**
   * Maneja el click en la información del usuario
   */
  handleUserDetailsClick() {
    console.log('Click en información del usuario');

    // Disparar evento personalizado
    const event = new CustomEvent('header:user-details-click', {
      detail: {
        user: this.controladorUsuario.obtenerUsuarioActual(),
      },
    });
    document.dispatchEvent(event);
  }

  /**
   * Actualiza el estado de notificaciones
   * @param {boolean} tieneNotificaciones - Nuevo estado
   */
  async actualizarNotificaciones(tieneNotificaciones) {
    if (this.headerView) {
      this.headerView.updateNotificationsState(tieneNotificaciones);
    }
  }

  /**
   * Actualiza la información del usuario
   * @param {Object} usuario - Nuevos datos del usuario
   */
  async actualizarUsuario(usuario) {
    if (this.headerView) {
      const tieneNotificaciones = await this.verificarNotificaciones();
      const t = this.i18nService.t.bind(this.i18nService);
      await this.headerView.render(usuario, tieneNotificaciones, t);
    }
  }

  /**
   * Obtiene información del estado del controlador
   * @returns {Object} Estado del controlador
   */
  getControllerState() {
    return {
      isInitialized: this.isInitialized,
      hasHeader: !!this.header,
      hasHeaderView: !!this.headerView,
      headerViewState: this.headerView?.getViewState() || null,
    };
  }
}

// Exportar para uso global
window.ControladorHeader = ControladorHeader;
