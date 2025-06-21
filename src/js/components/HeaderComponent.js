/**
 * Componente Header Reutilizable
 *
 * Este componente maneja la renderización del header de forma reutilizable
 * y configurable en toda la aplicación.
 */
class HeaderComponent {
  constructor(container, options = {}) {
    this.container = container;

    // Obtener opciones por defecto desde la configuración
    const defaultOptions = ComponentConfig.getDefaultOptions('HEADER');

    this.options = {
      ...defaultOptions,
      ...options,
    };

    this.currentUser = null;
    this.hasNotifications = false;
    this.translationFunction = null;
    this.isInitialized = false;
  }

  /**
   * Inicializa el componente
   * @param {Function} translationFunction - Función de traducción (opcional)
   */
  initialize(translationFunction = null) {
    if (this.isInitialized) return;

    this.translationFunction = translationFunction || (key => key);
    this.isInitialized = true;

    // Log en desarrollo usando configuración centralizada
    ComponentConfig.log('HeaderComponent', 'Inicializado');
  }

  /**
   * Renderiza el header
   * @param {Object} user - Objeto usuario
   * @param {boolean} hasNotifications - Indica si hay notificaciones
   * @param {Function} translationFunction - Función de traducción (opcional)
   */
  render(user, hasNotifications = false, translationFunction = null) {
    if (!this.container) {
      ComponentConfig.logError(
        'HeaderComponent',
        ComponentConfig.getErrorMessage('CONTAINER_NOT_FOUND')
      );
      return;
    }

    if (!user) {
      ComponentConfig.logError(
        'HeaderComponent',
        ComponentConfig.getErrorMessage('USER_NOT_PROVIDED')
      );
      return;
    }

    // Actualizar estado interno
    this.currentUser = user;
    this.hasNotifications = hasNotifications;

    if (translationFunction) {
      this.translationFunction = translationFunction;
    }

    // Generar HTML
    const headerHTML = this.generateHeaderHTML();

    // Aplicar al contenedor
    this.container.innerHTML = headerHTML;

    // Configurar eventos
    this.setupEventListeners();

    // Log en desarrollo usando configuración centralizada
    ComponentConfig.log('HeaderComponent', 'Header renderizado', {
      user: user.nombre,
      notifications: hasNotifications,
    });
  }

  /**
   * Genera el HTML del header
   * @returns {string} HTML del header
   */
  generateHeaderHTML() {
    const t = this.translationFunction;
    const userInfoClass = ComponentConfig.getCSSClass('HEADER', 'USER_INFO');

    return `
      <div class="${userInfoClass}">
        ${
          this.options.showNotifications
            ? this.generateNotificationsHTML(t)
            : ''
        }
        ${this.options.showUserInfo ? this.generateUserInfoHTML() : ''}
        ${this.options.showUserAvatar ? this.generateUserAvatarHTML() : ''}
      </div>
    `;
  }

  /**
   * Genera el HTML de las notificaciones
   * @param {Function} t - Función de traducción
   * @returns {string} HTML de notificaciones
   */
  generateNotificationsHTML(t) {
    // Usar StandardButtonsService si está disponible
    if (window.StandardButtonsService && window.standardButtonsService) {
      return window.standardButtonsService.generateButtonHTML(
        'notifications',
        t,
        {
          showTooltip: this.options.tooltipEnabled,
          showBadge: this.options.notificationBadge && this.hasNotifications,
        }
      );
    }

    // Fallback al método original si el servicio no está disponible
    const notificationsClass = ComponentConfig.getCSSClass(
      'HEADER',
      'NOTIFICATIONS'
    );
    const tooltipClass = this.options.tooltipEnabled
      ? ComponentConfig.getCSSClass('HEADER', 'TOOLTIP_BOTTOM')
      : '';
    const tooltipAttr = this.options.tooltipEnabled
      ? `data-tooltip="${t('notifications')}"`
      : '';

    return `
      <div class="${notificationsClass} ${tooltipClass}" ${tooltipAttr}>
        <i class="far fa-bell"></i>
        ${
          this.options.notificationBadge && this.hasNotifications
            ? `<span class="${ComponentConfig.getCSSClass(
                'HEADER',
                'NOTIFICATION_BADGE'
              )}"></span>`
            : ''
        }
      </div>
    `;
  }

  /**
   * Genera el HTML de la información del usuario
   * @returns {string} HTML de información del usuario
   */
  generateUserInfoHTML() {
    const userDetailsClass = ComponentConfig.getCSSClass(
      'HEADER',
      'USER_DETAILS'
    );
    const userNameClass = ComponentConfig.getCSSClass('HEADER', 'USER_NAME');
    const userCompanyClass = ComponentConfig.getCSSClass(
      'HEADER',
      'USER_COMPANY'
    );

    return `
      <div class="${userDetailsClass}">
        <span class="${userNameClass}">${this.currentUser.nombre} ${this.currentUser.apellidos}</span>
        <span class="${userCompanyClass}">${this.currentUser.empresa}</span>
      </div>
    `;
  }

  /**
   * Genera el HTML del avatar del usuario
   * @returns {string} HTML del avatar
   */
  generateUserAvatarHTML() {
    const userAvatarClass = ComponentConfig.getCSSClass(
      'HEADER',
      'USER_AVATAR'
    );
    const defaultAvatarPath = ComponentConfig.getPath(
      'HEADER',
      'DEFAULT_AVATAR'
    );

    return `
      <div class="${userAvatarClass}">
        <img src="${this.currentUser.avatar}" alt="Avatar" onerror="this.src='${defaultAvatarPath}'">
      </div>
    `;
  }

  /**
   * Configura los event listeners
   */
  setupEventListeners() {
    // Event listener para notificaciones
    const notificationsElement = this.container.querySelector(
      `.${ComponentConfig.getCSSClass('HEADER', 'NOTIFICATIONS')}`
    );
    if (notificationsElement) {
      notificationsElement.addEventListener('click', e => {
        e.preventDefault();
        this.handleNotificationsClick();
      });
    }

    // Event listener para avatar del usuario
    const userAvatar = this.container.querySelector(
      `.${ComponentConfig.getCSSClass('HEADER', 'USER_AVATAR')}`
    );
    if (userAvatar) {
      userAvatar.addEventListener('click', e => {
        e.preventDefault();
        this.handleUserAvatarClick();
      });
    }

    // Event listener para información del usuario
    const userDetails = this.container.querySelector(
      `.${ComponentConfig.getCSSClass('HEADER', 'USER_DETAILS')}`
    );
    if (userDetails) {
      userDetails.addEventListener('click', e => {
        e.preventDefault();
        this.handleUserDetailsClick();
      });
    }
  }

  /**
   * Maneja el click en notificaciones
   */
  handleNotificationsClick() {
    // Disparar evento personalizado usando configuración
    const eventName = ComponentConfig.HEADER.EVENTS.NOTIFICATIONS_CLICK;
    const event = new CustomEvent(eventName, {
      detail: {
        user: this.currentUser,
        hasNotifications: this.hasNotifications,
      },
    });
    document.dispatchEvent(event);

    // Log en desarrollo usando configuración centralizada
    ComponentConfig.log('HeaderComponent', 'Click en notificaciones');
  }

  /**
   * Maneja el click en el avatar del usuario
   */
  handleUserAvatarClick() {
    // Disparar evento personalizado usando configuración
    const eventName = ComponentConfig.HEADER.EVENTS.USER_AVATAR_CLICK;
    const event = new CustomEvent(eventName, {
      detail: {
        user: this.currentUser,
      },
    });
    document.dispatchEvent(event);

    // Log en desarrollo usando configuración centralizada
    ComponentConfig.log('HeaderComponent', 'Click en avatar del usuario');
  }

  /**
   * Maneja el click en la información del usuario
   */
  handleUserDetailsClick() {
    // Disparar evento personalizado usando configuración
    const eventName = ComponentConfig.HEADER.EVENTS.USER_DETAILS_CLICK;
    const event = new CustomEvent(eventName, {
      detail: {
        user: this.currentUser,
      },
    });
    document.dispatchEvent(event);

    // Log en desarrollo usando configuración centralizada
    ComponentConfig.log('HeaderComponent', 'Click en información del usuario');
  }

  /**
   * Actualiza la información del usuario
   * @param {Object} user - Nuevo objeto usuario
   */
  updateUserInfo(user) {
    if (!user) return;

    this.currentUser = user;

    // Actualizar elementos específicos sin re-renderizar todo
    const userNameElement = this.container.querySelector(
      `.${ComponentConfig.getCSSClass('HEADER', 'USER_NAME')}`
    );
    const userCompanyElement = this.container.querySelector(
      `.${ComponentConfig.getCSSClass('HEADER', 'USER_COMPANY')}`
    );
    const userAvatarElement = this.container.querySelector(
      `.${ComponentConfig.getCSSClass('HEADER', 'USER_AVATAR')} img`
    );

    if (userNameElement) {
      userNameElement.textContent = `${user.nombre} ${user.apellidos}`;
    }

    if (userCompanyElement) {
      userCompanyElement.textContent = user.empresa;
    }

    if (userAvatarElement) {
      userAvatarElement.src = user.avatar;
    }

    // Log en desarrollo usando configuración centralizada
    ComponentConfig.log(
      'HeaderComponent',
      'Información del usuario actualizada',
      user.nombre
    );
  }

  /**
   * Actualiza el estado de las notificaciones
   * @param {boolean} hasNotifications - Indica si hay notificaciones
   */
  updateNotifications(hasNotifications) {
    this.hasNotifications = hasNotifications;

    const notificationBadge = this.container.querySelector(
      `.${ComponentConfig.getCSSClass('HEADER', 'NOTIFICATION_BADGE')}`
    );

    if (this.options.notificationBadge) {
      if (hasNotifications && !notificationBadge) {
        // Agregar badge si no existe
        const notificationsElement = this.container.querySelector(
          `.${ComponentConfig.getCSSClass('HEADER', 'NOTIFICATIONS')}`
        );
        if (notificationsElement) {
          const badge = document.createElement('span');
          badge.className = ComponentConfig.getCSSClass(
            'HEADER',
            'NOTIFICATION_BADGE'
          );
          notificationsElement.appendChild(badge);
        }
      } else if (!hasNotifications && notificationBadge) {
        // Remover badge si existe
        notificationBadge.remove();
      }
    }

    // Log en desarrollo usando configuración centralizada
    ComponentConfig.log(
      'HeaderComponent',
      'Estado de notificaciones actualizado',
      hasNotifications
    );
  }

  /**
   * Obtiene el usuario actual
   * @returns {Object|null} Usuario actual
   */
  getCurrentUser() {
    return this.currentUser;
  }

  /**
   * Obtiene el estado de las notificaciones
   * @returns {boolean} Estado de notificaciones
   */
  getNotificationsState() {
    return this.hasNotifications;
  }

  /**
   * Obtiene el estado del componente
   * @returns {Object} Estado del componente
   */
  getComponentState() {
    return {
      isInitialized: this.isInitialized,
      hasContainer: !!this.container,
      currentUser: this.currentUser,
      hasNotifications: this.hasNotifications,
      options: this.options,
    };
  }

  /**
   * Destruye el componente y limpia recursos
   */
  destroy() {
    // Remover event listeners
    const notificationsElement = this.container.querySelector(
      `.${ComponentConfig.getCSSClass('HEADER', 'NOTIFICATIONS')}`
    );
    const userAvatar = this.container.querySelector(
      `.${ComponentConfig.getCSSClass('HEADER', 'USER_AVATAR')}`
    );
    const userDetails = this.container.querySelector(
      `.${ComponentConfig.getCSSClass('HEADER', 'USER_DETAILS')}`
    );

    if (notificationsElement) {
      notificationsElement.removeEventListener(
        'click',
        this.handleNotificationsClick
      );
    }
    if (userAvatar) {
      userAvatar.removeEventListener('click', this.handleUserAvatarClick);
    }
    if (userDetails) {
      userDetails.removeEventListener('click', this.handleUserDetailsClick);
    }

    // Limpiar contenedor
    if (this.container) {
      this.container.innerHTML = '';
    }

    this.isInitialized = false;
    this.currentUser = null;
    this.hasNotifications = false;
    this.translationFunction = null;

    // Log en desarrollo usando configuración centralizada
    ComponentConfig.log('HeaderComponent', 'Destruido');
  }
}

// Exportar para uso global
window.HeaderComponent = HeaderComponent;
