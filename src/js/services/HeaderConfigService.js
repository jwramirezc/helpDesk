/**
 * Servicio para manejar la configuración dinámica del header
 *
 * Este servicio centraliza la gestión de la configuración del header,
 * permitiendo personalizar botones, campos de usuario y permisos
 * sin necesidad de modificar código.
 */
class HeaderConfigService {
  constructor() {
    this.config = null;
    this.isLoaded = false;
    this.userRole = 'user'; // Rol por defecto
  }

  /**
   * Inicializa el servicio cargando la configuración
   */
  async initialize() {
    try {
      const response = await fetch(AppConfig.PATHS.HEADER_CONFIG_JSON);
      if (!response.ok) {
        throw new Error(
          `Error al cargar configuración del header: ${response.status}`
        );
      }

      this.config = await response.json();
      this.isLoaded = true;

      return true;
    } catch (error) {
      ComponentConfig.logError(
        'HeaderConfigService',
        'Error al cargar configuración del header',
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
  }

  /**
   * Obtiene la estructura completa del header
   * @returns {Object} Estructura del header
   */
  getStructure() {
    return this.config?.structure || {};
  }

  /**
   * Obtiene todos los botones configurados
   * @returns {Array} Array de botones
   */
  getButtons() {
    return this.config?.buttons || [];
  }

  /**
   * Obtiene los campos de información del usuario
   * @returns {Array} Array de campos
   */
  getUserInfoFields() {
    return this.config?.userInfo?.fields || [];
  }

  /**
   * Obtiene la configuración del avatar del usuario
   * @returns {Object} Configuración del avatar
   */
  getUserAvatarConfig() {
    return this.config?.userAvatar || {};
  }

  /**
   * Obtiene la configuración de información del usuario
   * @returns {Object} Configuración de información del usuario
   */
  getUserInfoConfig() {
    return this.config?.userInfo || {};
  }

  /**
   * Verifica si el usuario tiene permiso para un botón específico
   * @param {string} buttonId - ID del botón
   * @param {string} userRole - Rol del usuario (opcional, usa el rol actual si no se proporciona)
   * @returns {boolean} True si tiene permiso
   */
  hasPermission(buttonId, userRole = null) {
    const role = userRole || this.userRole;
    const button = this.getButton(buttonId);

    if (!button || !button.permissions) {
      return true; // Sin restricciones si no hay configuración
    }

    const allowedRoles = button.permissions.roles || [];
    return allowedRoles.includes(role);
  }

  /**
   * Obtiene los botones habilitados para el usuario actual
   * @param {string} userRole - Rol del usuario (opcional)
   * @returns {Array} Array de botones habilitados ordenados
   */
  getEnabledButtons(userRole = null) {
    const role = userRole || this.userRole;

    return this.getButtons()
      .filter(button => button.enabled && this.hasPermission(button.id, role))
      .sort((a, b) => a.order - b.order);
  }

  /**
   * Obtiene los botones habilitados para móvil
   * @param {string} userRole - Rol del usuario (opcional)
   * @returns {Array} Array de botones habilitados para móvil
   */
  getEnabledButtonsForMobile(userRole = null) {
    const role = userRole || this.userRole;

    return this.getButtons()
      .filter(
        button =>
          button.enabled &&
          this.hasPermission(button.id, role) &&
          button.movil !== false // Mostrar si movil es true o undefined
      )
      .sort((a, b) => a.order - b.order);
  }

  /**
   * Obtiene los botones habilitados para desktop
   * @param {string} userRole - Rol del usuario (opcional)
   * @returns {Array} Array de botones habilitados para desktop
   */
  getEnabledButtonsForDesktop(userRole = null) {
    const role = userRole || this.userRole;

    return this.getButtons()
      .filter(button => button.enabled && this.hasPermission(button.id, role))
      .sort((a, b) => a.order - b.order);
  }

  /**
   * Verifica si un botón debe mostrarse en móvil
   * @param {string} buttonId - ID del botón
   * @returns {boolean} True si debe mostrarse en móvil
   */
  isButtonVisibleOnMobile(buttonId) {
    const button = this.getButton(buttonId);
    return button ? button.movil !== false : false;
  }

  /**
   * Obtiene los breakpoints del header
   * @returns {Object} Breakpoints del header
   */
  getHeaderBreakpoints() {
    // Usar breakpoints genéricos ya que HEADER config fue eliminada
    return {
      MOBILE_MAX: 768,
      TABLET_MIN: 769,
      TABLET_MAX: 1024,
      DESKTOP_MIN: 1025,
    };
  }

  /**
   * Verifica si el dispositivo actual es móvil
   * @returns {boolean} True si es móvil
   */
  isMobileDevice() {
    const breakpoints = this.getHeaderBreakpoints();
    return window.innerWidth <= breakpoints.MOBILE_MAX;
  }

  /**
   * Obtiene un botón específico por ID
   * @param {string} buttonId - ID del botón
   * @returns {Object|null} Configuración del botón o null si no existe
   */
  getButton(buttonId) {
    return this.getButtons().find(button => button.id === buttonId) || null;
  }

  /**
   * Obtiene los campos de usuario habilitados
   * @returns {Array} Array de campos habilitados
   */
  getEnabledUserFields() {
    return this.getUserInfoFields().filter(field => field.enabled);
  }

  /**
   * Verifica si el servicio está cargado
   * @returns {boolean} True si está cargado
   */
  isServiceLoaded() {
    return this.isLoaded;
  }

  /**
   * Obtiene la configuración de popover por defecto
   * @returns {Object} Configuración de popover
   */
  getPopoverDefaults() {
    return this.config?.popover?.defaults || {};
  }

  /**
   * Obtiene la configuración de submenú por defecto
   * @returns {Object} Configuración de submenú
   */
  getSubmenuDefaults() {
    return this.config?.submenu?.defaults || {};
  }

  /**
   * Obtiene los estilos de submenú
   * @returns {Object} Estilos de submenú
   */
  getSubmenuStyles() {
    return this.config?.submenu?.styles || {};
  }

  /**
   * Obtiene el submenú de un botón específico
   * @param {string} buttonId - ID del botón
   * @returns {Object|null} Configuración del submenú o null si no existe
   */
  getButtonSubmenu(buttonId) {
    const button = this.getButton(buttonId);
    if (!button || !button.popover) {
      return null;
    }

    const submenu = button.popover.submenu;
    if (!submenu || !submenu.enabled) {
      return null;
    }

    return {
      ...submenu,
      items: (submenu.items || [])
        .filter(item => item.enabled)
        .sort((a, b) => a.order - b.order),
    };
  }

  /**
   * Obtiene todos los botones que tienen submenús habilitados
   * @returns {Array} Array de botones con submenús
   */
  getButtonsWithSubmenus() {
    return this.getEnabledButtons().filter(button => {
      const submenu = this.getButtonSubmenu(button.id);
      return submenu !== null;
    });
  }

  /**
   * Verifica si un botón tiene submenú habilitado
   * @param {string} buttonId - ID del botón
   * @returns {boolean} True si tiene submenú
   */
  hasSubmenu(buttonId) {
    return this.getButtonSubmenu(buttonId) !== null;
  }

  /**
   * Convierte los items del submenú al formato esperado por PopoverComponent
   * @param {string} buttonId - ID del botón
   * @returns {Array} Array de items en formato del menú
   */
  getSubmenuItemsForPopover(buttonId) {
    const submenu = this.getButtonSubmenu(buttonId);
    if (!submenu) {
      return [];
    }

    return submenu.items.map(item => {
      // Convertir al formato esperado por PopoverComponent
      return {
        id: item.id,
        label: item.label,
        icon: item.icon,
        type: item.type === 'divider' ? 'separator' : 'item',
        target: item.action, // Usar action como target
        enabled: item.enabled,
        order: item.order,
        // Datos adicionales para el header
        headerAction: item.action,
        headerClass: item.class,
      };
    });
  }

  /**
   * Obtiene las acciones disponibles en submenús
   * @returns {Array} Array de acciones únicas
   */
  getAvailableSubmenuActions() {
    const actions = new Set();

    this.getButtonsWithSubmenus().forEach(button => {
      const submenu = this.getButtonSubmenu(button.id);
      if (submenu) {
        submenu.items.forEach(item => {
          if (item.action) {
            actions.add(item.action);
          }
        });
      }
    });

    return Array.from(actions);
  }

  /**
   * Obtiene un item específico de submenú
   * @param {string} buttonId - ID del botón
   * @param {string} itemId - ID del item
   * @returns {Object|null} Item del submenú o null si no existe
   */
  getSubmenuItem(buttonId, itemId) {
    const submenu = this.getButtonSubmenu(buttonId);
    if (!submenu) {
      return null;
    }

    return submenu.items.find(item => item.id === itemId) || null;
  }

  /**
   * Valida la configuración de submenús
   * @returns {Object} Resultado de la validación
   */
  validateSubmenuConfig() {
    const errors = [];
    const warnings = [];

    if (!this.config) {
      errors.push('Configuración no cargada');
      return { isValid: false, errors, warnings };
    }

    // Validar configuración de submenú
    const submenuConfig = this.config.submenu;
    if (!submenuConfig) {
      warnings.push('Configuración de submenú no definida');
      return { isValid: true, errors, warnings };
    }

    // Validar defaults
    if (submenuConfig.defaults) {
      if (
        submenuConfig.defaults.maxItems &&
        submenuConfig.defaults.maxItems < 1
      ) {
        errors.push('maxItems debe ser mayor a 0');
      }
    }

    // Validar submenús de botones
    this.getButtonsWithSubmenus().forEach(button => {
      const submenu = this.getButtonSubmenu(button.id);
      if (submenu) {
        submenu.items.forEach((item, index) => {
          if (!item.id) {
            errors.push(`Submenú de ${button.id}: Item ${index} sin ID`);
          }
          if (!item.label && item.type !== 'divider') {
            errors.push(`Submenú de ${button.id}: Item ${item.id} sin label`);
          }
          if (!item.action && item.type !== 'divider') {
            warnings.push(
              `Submenú de ${button.id}: Item ${item.id} sin action`
            );
          }
        });
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Valida la configuración de botones móviles
   * @returns {Object} Resultado de la validación
   */
  validateMobileConfig() {
    const errors = [];
    const warnings = [];

    if (!this.config) {
      errors.push('Configuración no cargada');
      return { isValid: false, errors, warnings };
    }

    // Validar botones
    this.getButtons().forEach(button => {
      // Verificar que la propiedad móvil sea booleana si está definida
      if (button.movil !== undefined && typeof button.movil !== 'boolean') {
        errors.push(
          `Botón ${button.id}: La propiedad 'movil' debe ser true o false`
        );
      }

      // Advertencia si no tiene configuración móvil
      if (button.movil === undefined) {
        warnings.push(
          `Botón ${button.id}: No tiene configuración 'movil', se mostrará en todos los dispositivos`
        );
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Obtiene información del servicio para debugging (actualizada)
   * @returns {Object} Información del servicio
   */
  getServiceInfo() {
    return {
      isLoaded: this.isLoaded,
      userRole: this.userRole,
      configVersion: this.config?.version,
      totalButtons: this.getButtons().length,
      enabledButtons: this.getEnabledButtons().length,
      mobileButtons: this.getEnabledButtonsForMobile().length,
      desktopButtons: this.getEnabledButtonsForDesktop().length,
      buttonsWithSubmenus: this.getButtonsWithSubmenus().length,
      userFields: this.getUserInfoFields().length,
      enabledUserFields: this.getEnabledUserFields().length,
      hasUserInfo: this.getUserInfoConfig().enabled,
      hasUserAvatar: this.getUserAvatarConfig().enabled,
      availableSubmenuActions: this.getAvailableSubmenuActions(),
      submenuDefaults: this.getSubmenuDefaults(),
      submenuStyles: this.getSubmenuStyles(),
      isMobileDevice: this.isMobileDevice(),
      headerBreakpoints: this.getHeaderBreakpoints(),
    };
  }

  /**
   * Valida la configuración del header
   * @returns {Object} Resultado de la validación
   */
  validateConfig() {
    const errors = [];
    const warnings = [];

    if (!this.config) {
      errors.push('Configuración no cargada');
      return { isValid: false, errors, warnings };
    }

    // Validar estructura básica
    if (!this.config.structure) {
      errors.push('Estructura del header no definida');
    }

    // Validar botones
    const buttons = this.getButtons();
    buttons.forEach((button, index) => {
      if (!button.id) {
        errors.push(`Botón ${index}: ID no definido`);
      }
      if (!button.icon) {
        warnings.push(`Botón ${button.id}: Icono no definido`);
      }
      if (button.type === 'popover' && !button.popover) {
        errors.push(`Botón ${button.id}: Configuración de popover faltante`);
      }
    });

    // Validar campos de usuario
    const userFields = this.getUserInfoFields();
    userFields.forEach((field, index) => {
      if (!field.id) {
        errors.push(`Campo de usuario ${index}: ID no definido`);
      }
      if (!field.source) {
        errors.push(`Campo ${field.id}: Fuente de datos no definida`);
      }
    });

    // Validar permisos
    const roles = Object.keys(this.config.permissions?.roles || {});
    if (roles.length === 0) {
      warnings.push('No hay roles de permisos definidos');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Recarga la configuración desde el servidor
   * @returns {Promise<boolean>} True si se recargó correctamente
   */
  async reload() {
    this.isLoaded = false;
    this.config = null;
    return await this.initialize();
  }
}

// Exportar para uso global
window.HeaderConfigService = HeaderConfigService;
