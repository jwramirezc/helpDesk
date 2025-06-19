/**
 * Utilidades para validación del sistema de menús
 */
class MenuValidator {
  /**
   * Valida que un ítem del menú tenga la estructura correcta
   * @param {Object} item - Ítem a validar
   * @returns {Object} - Resultado de la validación
   */
  static validateMenuItem(item) {
    const errors = [];
    const warnings = [];

    // Validaciones obligatorias
    if (!item.id) {
      errors.push('ID es requerido');
    } else if (typeof item.id !== 'string') {
      errors.push('ID debe ser una cadena de texto');
    }

    if (!item.label) {
      errors.push('Label es requerido');
    } else if (typeof item.label !== 'string') {
      errors.push('Label debe ser una cadena de texto');
    }

    if (!item.type) {
      errors.push('Type es requerido');
    } else if (!['item', 'submenu'].includes(item.type)) {
      errors.push('Type debe ser "item" o "submenu"');
    }

    // Validaciones específicas por tipo
    if (item.type === 'item') {
      if (!item.target) {
        warnings.push('Ítem de tipo "item" debería tener un target definido');
      }
    }

    if (item.type === 'submenu') {
      if (!item.children || !Array.isArray(item.children)) {
        errors.push('Submenú debe tener un array de children');
      } else if (item.children.length === 0) {
        warnings.push('Submenú no tiene children definidos');
      }
    }

    // Validaciones de formato
    if (item.icon && typeof item.icon !== 'string') {
      warnings.push('Icon debe ser una cadena de texto');
    }

    if (item.target && typeof item.target !== 'string') {
      warnings.push('Target debe ser una cadena de texto');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Valida la estructura completa del menú
   * @param {Object} menuData - Datos del menú
   * @returns {Object} - Resultado de la validación
   */
  static validateMenuStructure(menuData) {
    const errors = [];
    const warnings = [];

    if (!menuData || typeof menuData !== 'object') {
      errors.push('Datos del menú inválidos');
      return { isValid: false, errors, warnings };
    }

    if (!menuData.menuItems) {
      errors.push('menuItems es requerido');
      return { isValid: false, errors, warnings };
    }

    const { top = [], bottom = [] } = menuData.menuItems;

    // Validar sección top
    if (!Array.isArray(top)) {
      errors.push('Sección "top" debe ser un array');
    } else {
      top.forEach((item, index) => {
        const validation = this.validateMenuItem(item);
        validation.errors.forEach(error =>
          errors.push(`Top[${index}]: ${error}`)
        );
        validation.warnings.forEach(warning =>
          warnings.push(`Top[${index}]: ${warning}`)
        );
      });
    }

    // Validar sección bottom
    if (!Array.isArray(bottom)) {
      errors.push('Sección "bottom" debe ser un array');
    } else {
      bottom.forEach((item, index) => {
        const validation = this.validateMenuItem(item);
        validation.errors.forEach(error =>
          errors.push(`Bottom[${index}]: ${error}`)
        );
        validation.warnings.forEach(warning =>
          warnings.push(`Bottom[${index}]: ${warning}`)
        );
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Verifica duplicados en IDs
   * @param {Object} menuData - Datos del menú
   * @returns {Array} - Lista de IDs duplicados
   */
  static findDuplicateIds(menuData) {
    const ids = new Set();
    const duplicates = [];

    const collectIds = items => {
      items.forEach(item => {
        if (ids.has(item.id)) {
          duplicates.push(item.id);
        } else {
          ids.add(item.id);
        }

        if (item.children) {
          collectIds(item.children);
        }
      });
    };

    if (menuData.menuItems) {
      collectIds(menuData.menuItems.top || []);
      collectIds(menuData.menuItems.bottom || []);
    }

    return [...new Set(duplicates)];
  }

  /**
   * Verifica referencias rotas en targets
   * @param {Object} menuData - Datos del menú
   * @returns {Array} - Lista de targets que podrían estar rotos
   */
  static findBrokenTargets(menuData) {
    const brokenTargets = [];

    const checkTargets = items => {
      items.forEach(item => {
        if (item.type === 'item' && item.target) {
          // Verificar si el target tiene extensión .html
          if (!item.target.endsWith('.html')) {
            brokenTargets.push({
              id: item.id,
              target: item.target,
              reason: 'Target no termina en .html',
            });
          }
        }

        if (item.children) {
          checkTargets(item.children);
        }
      });
    };

    if (menuData.menuItems) {
      checkTargets(menuData.menuItems.top || []);
      checkTargets(menuData.menuItems.bottom || []);
    }

    return brokenTargets;
  }
}

// Exportar para uso global
window.MenuValidator = MenuValidator;
