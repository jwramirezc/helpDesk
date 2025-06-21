/**
 * Configuración específica del sistema de menús
 *
 * Este archivo extiende la configuración base con configuraciones
 * específicas del sistema de menús.
 */
const MenuConfig = BaseConfig.extend({
  // Configuración específica de validación del menú
  VALIDATION: {
    REQUIRED_FIELDS: ['id', 'label', 'type'],
    VALID_TYPES: ['item', 'submenu'],
  },

  // Configuración específica de clases CSS del menú
  CSS_CLASSES: {
    MENU_ITEM: 'menu-item',
    MOBILE_MENU_ITEM: 'mobile-menu-item',
    ACTIVE: 'active',
    HAS_SUBMENU: 'has-submenu',
    MOBILE_SUBMENU_HEADER: 'mobile-submenu-header',
    MOBILE_BACK_BUTTON: 'mobile-back-button',
  },

  // Configuración específica de selectores DOM del menú
  SELECTORS: {
    SIDEBAR: '#sidebar',
    MOBILE_MENU: '.mobile-menu',
    MOBILE_MENU_TOGGLE: '.mobile-menu-toggle',
    MOBILE_MENU_ITEMS: '.mobile-menu-items',
    MOBILE_MENU_CLOSE: '.mobile-menu-close',
  },

  // Configuración específica de dimensiones del menú
  DIMENSIONS: {
    MENU_ITEM_SIZE: 50, // px
    MENU_ITEM_ICON_SIZE: 1.5, // rem
    TOOLTIP_OFFSET: 10, // px
    TOOLTIP_ARROW_OFFSET: 4, // px
  },

  // Configuración específica de mensajes del menú
  MESSAGES: {
    ERRORS: {
      MENU_LOAD_FAILED: 'Error al cargar el menú',
      INVALID_ITEM: 'Ítem del menú inválido',
      MISSING_TARGET: 'Ítem sin target definido',
      DUPLICATE_ID: 'ID duplicado encontrado',
    },
    WARNINGS: {
      EMPTY_SUBMENU: 'Submenú sin elementos',
      MISSING_ICON: 'Ítem sin ícono definido',
    },
  },

  /**
   * Obtiene una dimensión específica del menú
   * @param {string} dimensionName - Nombre de la dimensión
   * @returns {number}
   */
  getMenuDimension(dimensionName) {
    return this.DIMENSIONS[dimensionName.toUpperCase()] || 0;
  },

  /**
   * Verifica si un ítem del menú es válido
   * @param {Object} item - Ítem del menú
   * @returns {boolean}
   */
  isValidMenuItem(item) {
    if (!item) return false;

    return this.VALIDATION.REQUIRED_FIELDS.every(
      field =>
        item.hasOwnProperty(field) &&
        item[field] !== null &&
        item[field] !== undefined
    );
  },

  /**
   * Verifica si un tipo de menú es válido
   * @param {string} type - Tipo de menú
   * @returns {boolean}
   */
  isValidMenuType(type) {
    return this.VALIDATION.VALID_TYPES.includes(type);
  },
});

// Exportar para uso global
window.MenuConfig = MenuConfig;
