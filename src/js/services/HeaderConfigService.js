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

      ComponentConfig.log(
        'HeaderConfigService',
        'Configuración del header cargada',
        {
          version: this.config.version,
          buttonsCount: this.config.structure?.buttons?.items?.length || 0,
          userFieldsCount: this.config.structure?.userInfo?.fields?.length || 0,
        }
      );

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
    ComponentConfig.log('HeaderConfigService', 'Rol de usuario establecido', {
      role,
    });
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
    return this.config?.structure?.buttons?.items || [];
  }

  /**
   * Obtiene los campos de información del usuario
   * @returns {Array} Array de campos
   */
  getUserInfoFields() {
    return this.config?.structure?.userInfo?.fields || [];
  }

  /**
   * Obtiene la configuración del avatar del usuario
   * @returns {Object} Configuración del avatar
   */
  getUserAvatarConfig() {
    return this.config?.structure?.userAvatar || {};
  }

  /**
   * Obtiene la configuración de información del usuario
   * @returns {Object} Configuración de información del usuario
   */
  getUserInfoConfig() {
    return this.config?.structure?.userInfo || {};
  }

  /**
   * Verifica si el usuario tiene permiso para un botón específico
   * @param {string} buttonId - ID del botón
   * @param {string} userRole - Rol del usuario (opcional, usa el rol actual si no se proporciona)
   * @returns {boolean} True si tiene permiso
   */
  hasPermission(buttonId, userRole = null) {
    const role = userRole || this.userRole;
    const rolePermissions = this.config?.permissions?.roles[role] || [];
    return rolePermissions.includes(buttonId);
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
   * Obtiene información del servicio para debugging
   * @returns {Object} Información del servicio
   */
  getServiceInfo() {
    return {
      isLoaded: this.isLoaded,
      userRole: this.userRole,
      configVersion: this.config?.version,
      totalButtons: this.getButtons().length,
      enabledButtons: this.getEnabledButtons().length,
      userFields: this.getUserInfoFields().length,
      enabledUserFields: this.getEnabledUserFields().length,
      hasUserInfo: this.getUserInfoConfig().enabled,
      hasUserAvatar: this.getUserAvatarConfig().enabled,
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
