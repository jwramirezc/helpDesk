/**
 * Vista del Header con configuración dinámica
 *
 * Esta vista renderiza el header usando configuración JSON,
 * eliminando completamente los datos hardcodeados.
 */
class HeaderView {
  /**
   * @param {HTMLElement} header contenedor DOM del header
   */
  constructor(header) {
    this.header = header;
    this.headerConfigService = new HeaderConfigService();
    this.headerPopoverService = null;
    this.isInitialized = false;
  }

  /**
   * Inicializa la vista
   */
  async initialize() {
    if (this.isInitialized) return;

    try {
      await this.headerConfigService.initialize();

      // Inicializar el servicio de popovers del header
      this.headerPopoverService = new HeaderPopoverService(
        this.headerConfigService
      );
      await this.headerPopoverService.initialize();

      this.isInitialized = true;
    } catch (error) {
      ComponentConfig.logError(
        'HeaderView',
        'Error al inicializar vista',
        error
      );
    }
  }

  /**
   * Renderiza la cabecera usando configuración dinámica.
   * @param {Usuario} usuario
   * @param {boolean} tieneNotificaciones
   * @param {function(string):string} t función de traducción
   */
  async render(usuario, tieneNotificaciones, t = k => k) {
    if (!this.header) {
      ComponentConfig.logError(
        'HeaderView',
        'Contenedor del header no encontrado'
      );
      return;
    }

    // Inicializar si no está hecho
    if (!this.isInitialized) {
      await this.initialize();
    }

    // Establecer rol del usuario
    const userRole = usuario.rol || 'user';
    this.headerConfigService.setUserRole(userRole);

    // Obtener estructura del header
    const structure = this.headerConfigService.getStructure();

    // Generar HTML dinámicamente
    const buttonsHTML = this.generateButtonsHTML(
      t,
      tieneNotificaciones,
      userRole
    );
    const userInfoHTML = this.generateUserInfoHTML(usuario, structure.userInfo);
    const userAvatarHTML = this.generateUserAvatarHTML(
      usuario,
      structure.userAvatar
    );

    // Ordenar elementos según configuración
    const elements = [
      {
        type: 'buttons',
        order: structure.buttons?.order || 0,
        html: buttonsHTML,
      },
      {
        type: 'userInfo',
        order: structure.userInfo?.order || 1,
        html: userInfoHTML,
      },
      {
        type: 'userAvatar',
        order: structure.userAvatar?.order || 2,
        html: userAvatarHTML,
      },
    ].sort((a, b) => a.order - b.order);

    // Renderizar HTML
    this.header.innerHTML = `
      <div class="user-info">
        ${elements.map(el => el.html).join('')}
      </div>`;

    // Crear popovers usando el servicio unificado
    if (this.headerPopoverService) {
      await this.headerPopoverService.createPopoversForHeaderButtons();
    }
  }

  /**
   * Genera el HTML de los botones del header
   * @param {Function} t - Función de traducción
   * @param {boolean} hasNotifications - Estado de notificaciones
   * @param {string} userRole - Rol del usuario
   * @returns {string} HTML de los botones
   */
  generateButtonsHTML(t, hasNotifications, userRole) {
    const buttons = this.headerConfigService.getEnabledButtons(userRole);

    if (buttons.length === 0) {
      return '';
    }

    return buttons
      .map(button => {
        // Generar badge si está habilitado
        const badgeHTML = this.generateBadgeHTML(button, hasNotifications);

        // Generar atributos de popover si es necesario
        const popoverAttrs = this.generatePopoverAttrs(button);

        // Generar clases CSS
        const classes = this.generateButtonClasses(button);

        return `
        <div id="${button.id}" 
             class="${classes}" 
             data-tooltip="${t(button.tooltip)}"
             ${popoverAttrs}>
          <i class="${button.icon}"></i>
          ${badgeHTML}
        </div>
      `;
      })
      .join('');
  }

  /**
   * Genera el HTML del badge de un botón
   * @param {Object} button - Configuración del botón
   * @param {boolean} hasNotifications - Estado de notificaciones
   * @returns {string} HTML del badge
   */
  generateBadgeHTML(button, hasNotifications) {
    if (!button.badge?.enabled) {
      return '';
    }

    // Verificar condición del badge
    const showBadge =
      button.badge.condition === 'hasNotifications' ? hasNotifications : true;

    if (!showBadge) {
      return '';
    }

    return `<span class="${button.badge.class}"></span>`;
  }

  /**
   * Genera los atributos de popover para un botón
   * @param {Object} button - Configuración del botón
   * @returns {string} Atributos de popover
   */
  generatePopoverAttrs(button) {
    if (button.type !== 'popover' || !button.popover) {
      return '';
    }

    return `data-popover-id="${button.popover.content}" data-popover-placement="${button.popover.placement}"`;
  }

  /**
   * Genera las clases CSS para un botón
   * @param {Object} button - Configuración del botón
   * @returns {string} Clases CSS
   */
  generateButtonClasses(button) {
    const classes = ['header-button', 'tooltip-bottom'];

    if (button.type === 'popover') {
      classes.push('popover-trigger');
    }

    // Agregar clase para ocultar en móvil si es necesario
    if (button.movil === false) {
      const mobileHiddenClass = ComponentConfig.getCSSClass(
        'HEADER',
        'MOBILE_HIDDEN'
      );
      classes.push(mobileHiddenClass);
    }

    return classes.join(' ');
  }

  /**
   * Genera el HTML de la información del usuario
   * @param {Object} usuario - Datos del usuario
   * @param {Object} userInfoConfig - Configuración de información del usuario
   * @returns {string} HTML de la información del usuario
   */
  generateUserInfoHTML(usuario, userInfoConfig) {
    if (!userInfoConfig?.enabled) {
      return '';
    }

    const fields = this.headerConfigService.getEnabledUserFields();
    if (fields.length === 0) {
      return '';
    }

    const fieldsHTML = fields
      .map(field => {
        const value = this.evaluateFieldSource(field.source, usuario);
        return `<div id="${field.id}" class="${field.class}">${value}</div>`;
      })
      .join('');

    return `<div class="user-details">${fieldsHTML}</div>`;
  }

  /**
   * Genera el HTML del avatar del usuario
   * @param {Object} usuario - Datos del usuario
   * @param {Object} avatarConfig - Configuración del avatar
   * @returns {string} HTML del avatar
   */
  generateUserAvatarHTML(usuario, avatarConfig) {
    if (!avatarConfig?.enabled) {
      return '';
    }

    const altText = avatarConfig.altText || 'Avatar del usuario';
    const defaultIcon = avatarConfig.defaultIcon || 'fas fa-user';

    // Usar avatar del usuario si existe, sino usar icono por defecto
    const userAvatar = usuario.avatar;

    if (userAvatar) {
      // Si hay avatar del usuario, usar imagen
      return `
        <div class="user-avatar">
          <img src="${userAvatar}" 
               alt="${altText}"
               onerror="this.onerror=null; this.style.display='none'; this.nextElementSibling.style.display='flex'; console.warn('Avatar no encontrado, usando icono por defecto');">
          <div class="user-avatar-icon" style="display: none;">
            <i class="${defaultIcon}"></i>
          </div>
        </div>
      `;
    } else {
      // Si no hay avatar, usar icono por defecto
      return `
        <div class="user-avatar">
          <div class="user-avatar-icon">
            <i class="${defaultIcon}"></i>
          </div>
        </div>
      `;
    }
  }

  /**
   * Evalúa la fuente de datos de un campo
   * @param {string} source - Expresión de la fuente de datos
   * @param {Object} user - Datos del usuario
   * @returns {string} Valor evaluado
   */
  evaluateFieldSource(source, user) {
    try {
      // Crear una función segura para evaluar la expresión
      const safeEval = new Function(
        'user',
        `
        try {
          return ${source};
        } catch (error) {
          return '';
        }
      `
      );

      const result = safeEval(user);
      return result || '';
    } catch (error) {
      ComponentConfig.logError(
        'HeaderView',
        `Error evaluando campo: ${source}`,
        error
      );
      return '';
    }
  }

  /**
   * Actualiza el estado de notificaciones
   * @param {boolean} hasNotifications - Nuevo estado de notificaciones
   */
  updateNotificationsState(hasNotifications) {
    const notificationButton = this.header.querySelector('#btn-notifications');
    if (!notificationButton) return;

    const badge = notificationButton.querySelector('.notification-badge');
    const button = this.headerConfigService.getButton('btn-notifications');

    if (button?.badge?.enabled) {
      if (hasNotifications && !badge) {
        // Agregar badge
        const newBadge = document.createElement('span');
        newBadge.className = button.badge.class;
        notificationButton.appendChild(newBadge);
      } else if (!hasNotifications && badge) {
        // Remover badge
        badge.remove();
      }
    }

    ComponentConfig.log('HeaderView', 'Estado de notificaciones actualizado', {
      hasNotifications,
    });
  }

  /**
   * Obtiene información del estado de la vista
   * @returns {Object} Estado de la vista
   */
  getViewState() {
    return {
      isInitialized: this.isInitialized,
      hasContainer: !!this.header,
      serviceInfo: this.headerConfigService.getServiceInfo(),
      popoverServiceInfo: this.headerPopoverService?.getServiceInfo(),
      validation: this.headerConfigService.validateConfig(),
    };
  }
}

// Exponer clase globalmente para acceso desde otros módulos
window.HeaderView = HeaderView;
