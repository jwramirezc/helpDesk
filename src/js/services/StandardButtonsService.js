/**
 * Servicio para administrar botones estándar de la aplicación
 *
 * Este servicio centraliza la gestión de botones estándar
 * que pueden usar componentes como Popover, Tooltip, etc.
 *
 * NOTA: Para botones del header, usar HeaderConfigService
 */
class StandardButtonsService {
  constructor() {
    this.buttons = {};
    this.categories = {};
    this.permissions = {};
    this.userRole = 'user'; // Por defecto
    this.isLoaded = false;
  }

  /**
   * Inicializa el servicio cargando la configuración
   */
  async initialize() {
    try {
      const response = await fetch(AppConfig.PATHS.STANDARD_BUTTONS_JSON);
      const config = await response.json();

      this.buttons = config.buttons || {};
      this.categories = config.categories || {};
      this.permissions = config.permissions || {};

      this.isLoaded = true;

      ComponentConfig.log(
        'StandardButtonsService',
        'Configuración de botones estándar cargada',
        {
          totalButtons: Object.keys(this.buttons).length,
          categories: Object.keys(this.categories).length,
          note: 'Para botones del header, usar HeaderConfigService',
        }
      );

      return true;
    } catch (error) {
      ComponentConfig.logError(
        'StandardButtonsService',
        'Error al cargar configuración de botones estándar',
        error
      );
      return false;
    }
  }

  /**
   * Establece el rol del usuario actual
   * @param {string} role - Rol del usuario
   */
  setUserRole(role) {
    this.userRole = role;
    ComponentConfig.log(
      'StandardButtonsService',
      'Rol de usuario establecido',
      { role }
    );
  }

  /**
   * Obtiene un botón específico por ID
   * @param {string} buttonId - ID del botón
   * @returns {Object|null} Configuración del botón o null si no existe
   */
  getButton(buttonId) {
    if (!this.isLoaded) {
      ComponentConfig.logError(
        'StandardButtonsService',
        'Servicio no inicializado'
      );
      return null;
    }

    const button = this.buttons[buttonId];
    if (!button) {
      ComponentConfig.logError(
        'StandardButtonsService',
        `Botón estándar no encontrado: ${buttonId}`
      );
      return null;
    }

    // Verificar acceso según el rol del usuario
    if (!this.hasAccess(buttonId)) {
      ComponentConfig.log(
        'StandardButtonsService',
        `Acceso denegado al botón estándar: ${buttonId}`,
        { role: this.userRole }
      );
      return null;
    }

    return { ...button }; // Retornar copia para evitar modificaciones
  }

  /**
   * Obtiene todos los botones de una categoría específica
   * @param {string} category - Categoría de botones (sidebar, toolbar, floating, etc.)
   * @returns {Array} Array de botones de la categoría
   */
  getButtonsByCategory(category) {
    if (!this.isLoaded) {
      ComponentConfig.logError(
        'StandardButtonsService',
        'Servicio no inicializado'
      );
      return [];
    }

    const categoryButtons = Object.entries(this.buttons)
      .filter(([id, button]) => {
        return button.category === category && this.hasAccess(id);
      })
      .map(([id, button]) => ({
        id,
        ...button,
      }))
      .sort((a, b) => a.order - b.order);

    ComponentConfig.log(
      'StandardButtonsService',
      `Botones estándar obtenidos para categoría: ${category}`,
      {
        count: categoryButtons.length,
      }
    );

    return categoryButtons;
  }

  /**
   * Obtiene todos los botones disponibles para el usuario actual
   * @returns {Array} Array de todos los botones con acceso
   */
  getAllAvailableButtons() {
    if (!this.isLoaded) {
      ComponentConfig.logError(
        'StandardButtonsService',
        'Servicio no inicializado'
      );
      return [];
    }

    const availableButtons = Object.entries(this.buttons)
      .filter(([id, button]) => this.hasAccess(id))
      .map(([id, button]) => ({
        id,
        ...button,
      }))
      .sort((a, b) => a.order - b.order);

    return availableButtons;
  }

  /**
   * Verifica si el usuario tiene acceso a un botón específico
   * @param {string} buttonId - ID del botón
   * @returns {boolean} True si tiene acceso
   */
  hasAccess(buttonId) {
    const button = this.buttons[buttonId];
    if (!button) return false;

    // Verificar acceso directo del botón
    if (!button.access) return false;

    // Verificar permisos por rol
    const rolePermissions = this.permissions.roles[this.userRole];
    if (!rolePermissions) return false;

    return rolePermissions.includes(buttonId);
  }

  /**
   * Genera el HTML de un botón estándar
   * @param {string} buttonId - ID del botón
   * @param {Function} t - Función de traducción
   * @param {Object} options - Opciones adicionales
   * @returns {string} HTML del botón
   */
  generateButtonHTML(buttonId, t = key => key, options = {}) {
    const button = this.getButton(buttonId);
    if (!button) return '';

    const {
      showTooltip = true,
      showBadge = true,
      customClasses = '',
      customAttributes = {},
    } = options;

    // Clases base
    let classes = `standard-button ${button.category}-button`;
    if (customClasses) classes += ` ${customClasses}`;

    // Agregar clase para popover si es necesario
    if (button.type === 'popover') {
      classes += ' popover-trigger';
    }

    // Tooltip
    let tooltipAttr = '';
    if (showTooltip && button.tooltip) {
      classes += ' tooltip-bottom';
      tooltipAttr = `data-tooltip="${t(button.tooltip)}"`;
    }

    // Atributos personalizados
    const attributes = Object.entries(customAttributes)
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ');

    // Atributos específicos para popover
    let popoverAttrs = '';
    if (button.type === 'popover' && button.popover) {
      popoverAttrs = `data-popover-id="${button.popover.content}" data-popover-placement="${button.position}"`;
    }

    // Badge
    const badgeHTML =
      showBadge && button.badge?.enabled
        ? `<span class="${button.badge.class || 'button-badge'}"></span>`
        : '';

    return `
      <div 
        id="${button.id}" 
        class="${classes}" 
        ${tooltipAttr}
        ${popoverAttrs}
        ${attributes}
        data-button-type="${button.type}"
        data-button-position="${button.position}"
      >
        <i class="${button.icon}"></i>
        ${badgeHTML}
      </div>
    `;
  }

  /**
   * Renderiza botones de una categoría específica en un contenedor
   * @param {string} category - Categoría de botones
   * @param {HTMLElement} container - Contenedor donde renderizar
   * @param {Function} t - Función de traducción
   * @param {Object} options - Opciones adicionales
   */
  renderButtonsInContainer(category, container, t = key => key, options = {}) {
    if (!container) {
      ComponentConfig.logError(
        'StandardButtonsService',
        'Contenedor no proporcionado'
      );
      return;
    }

    const buttons = this.getButtonsByCategory(category);

    if (buttons.length === 0) {
      ComponentConfig.log(
        'StandardButtonsService',
        `No hay botones para la categoría: ${category}`
      );
      return;
    }

    const buttonsHTML = buttons
      .map(button => this.generateButtonHTML(button.id, t, options))
      .join('');

    container.innerHTML = buttonsHTML;

    ComponentConfig.log(
      'StandardButtonsService',
      `Botones renderizados en contenedor`,
      {
        category,
        count: buttons.length,
        container: container.id || 'sin-id',
      }
    );
  }

  /**
   * Actualiza el estado de un botón (ej: mostrar/ocultar badge)
   * @param {string} buttonId - ID del botón
   * @param {Object} updates - Actualizaciones a aplicar
   */
  updateButtonState(buttonId, updates) {
    const button = this.getButton(buttonId);
    if (!button) return;

    // Actualizar configuración
    Object.assign(this.buttons[buttonId], updates);

    // Actualizar DOM si existe
    const buttonElement = document.getElementById(buttonId);
    if (buttonElement) {
      // Actualizar badge
      if (updates.hasOwnProperty('badge')) {
        const badge = buttonElement.querySelector('.button-badge');
        if (updates.badge && !badge) {
          const newBadge = document.createElement('span');
          newBadge.className = updates.badge.class || 'button-badge';
          buttonElement.appendChild(newBadge);
        } else if (!updates.badge && badge) {
          badge.remove();
        }
      }

      // Actualizar icono
      if (updates.icon) {
        const icon = buttonElement.querySelector('i');
        if (icon) {
          icon.className = updates.icon;
        }
      }

      // Actualizar tooltip
      if (updates.tooltip) {
        buttonElement.setAttribute('data-tooltip', updates.tooltip);
      }
    }

    ComponentConfig.log(
      'StandardButtonsService',
      `Estado del botón estándar actualizado: ${buttonId}`,
      updates
    );
  }

  /**
   * Obtiene la configuración de categorías
   * @returns {Object} Configuración de categorías
   */
  getCategories() {
    return { ...this.categories };
  }

  /**
   * Verifica si el servicio está cargado
   * @returns {boolean} True si está cargado
   */
  isServiceLoaded() {
    return this.isLoaded;
  }

  /**
   * Obtiene información del servicio para debugging
   * @returns {Object} Información del servicio
   */
  getServiceInfo() {
    return {
      isLoaded: this.isLoaded,
      userRole: this.userRole,
      totalButtons: Object.keys(this.buttons).length,
      categories: Object.keys(this.categories),
      permissions: Object.keys(this.permissions.roles || {}),
      note: 'Para botones del header, usar HeaderConfigService',
    };
  }
}

// Exportar para uso global
window.StandardButtonsService = StandardButtonsService;
