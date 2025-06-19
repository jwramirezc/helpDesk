/**
 * Clase base para los ítems del menú.
 */
class MenuItem {
  /**
   * @param {Object} config - Configuración del ítem del menú
   * @param {string} config.id - Identificador único del ítem
   * @param {string} config.label - Texto a mostrar
   * @param {string} config.type - Tipo de ítem ('item' o 'submenu')
   * @param {string} [config.icon] - Clase CSS del ícono (Font Awesome)
   * @param {string} [config.target] - URL destino para items tipo 'item'
   * @param {string} [config.openAction] - Acción al abrir ('alert' para submenús en fase 1)
   * @param {string} [config.message] - Mensaje para alert en fase 1
   * @param {Array<Object>} [config.children] - Subítems para tipo 'submenu'
   * @param {MenuItem|null} [parent] - Referencia al ítem padre
   */
  constructor(config, parent = null) {
    // Validaciones básicas
    if (!config.id || !config.label || !config.type) {
      throw new Error('MenuItem: id, label y type son requeridos');
    }

    if (!['item', 'submenu'].includes(config.type)) {
      throw new Error('MenuItem: type debe ser "item" o "submenu"');
    }

    // Validaciones específicas por tipo
    if (config.type === 'item' && !config.target) {
      console.warn(
        `MenuItem: Ítem "${config.id}" de tipo "item" no tiene target definido`
      );
    }

    if (
      config.type === 'submenu' &&
      (!config.children || config.children.length === 0)
    ) {
      console.warn(
        `MenuItem: Submenú "${config.id}" no tiene children definidos`
      );
    }

    this.id = config.id;
    this.label = config.label;
    this.type = config.type;
    this.icon = config.icon || '';
    this.target = config.target || '';
    this.openAction = config.openAction || '';
    this.message = config.message || '';
    this.parent = parent;
    this.children = (config.children || []).map(
      child => new MenuItem(child, this)
    );
    this._active = false;
  }

  /**
   * Indica si el ítem está activo
   * @returns {boolean}
   */
  isActive() {
    return this._active;
  }

  /**
   * Activa o desactiva el ítem
   * @param {boolean} value
   */
  setActive(value) {
    this._active = value;
    // Si se activa un ítem, guardar su ID en sessionStorage
    if (value) {
      sessionStorage.setItem('activeMenuItem', this.id);
      // Marcar que el usuario ha navegado
      sessionStorage.setItem('hasNavigated', 'true');
      // Si tiene padre, también guardarlo
      if (this.parent) {
        sessionStorage.setItem('activeParentMenuItem', this.parent.id);
      }
    }
  }

  /**
   * Devuelve el ítem padre
   * @returns {MenuItem|null}
   */
  getParent() {
    return this.parent;
  }

  /**
   * Busca un ítem por su ID (incluyendo subítems)
   * @param {string} id - ID del ítem a buscar
   * @returns {MenuItem|null}
   */
  findById(id) {
    if (this.id === id) return this;
    for (const child of this.children) {
      const found = child.findById(id);
      if (found) return found;
    }
    return null;
  }

  /**
   * Verifica si el ítem tiene subítems
   * @returns {boolean}
   */
  hasChildren() {
    return this.children.length > 0;
  }

  /**
   * Obtiene la ruta completa del ítem (padre > hijo)
   * @returns {string}
   */
  getPath() {
    const path = [this.label];
    let current = this.parent;
    while (current) {
      path.unshift(current.label);
      current = current.parent;
    }
    return path.join(' > ');
  }

  /**
   * Genera el HTML del ítem según su tipo y estado
   * @param {boolean} isMobile - Indica si se está renderizando para móvil
   * @returns {string}
   */
  toHTML(isMobile = false) {
    const itemClass = isMobile ? 'mobile-menu-item' : 'menu-item';
    const hasSubmenuClass = this.type === 'submenu' ? 'has-submenu' : '';
    const activeClass = this._active ? 'active' : '';
    const mobilePrefix = isMobile ? 'mobile_' : '';

    return `
      <div class="${itemClass} ${hasSubmenuClass} ${activeClass}" 
           id="${mobilePrefix}${this.id}" 
           data-type="${this.type}"
           data-action="${this.openAction}"
           data-message="${this.message}"
           data-target="${this.target}"
           ${this.parent ? `data-parent="${this.parent.id}"` : ''}
           ${!isMobile ? `data-tooltip="${this.label}"` : ''}>
        ${this.icon ? `<i class="${this.icon}"></i>` : ''}
        ${isMobile ? `<span>${this.label}</span>` : ''}
        ${
          this.type === 'submenu' && isMobile
            ? '<i class="fas fa-chevron-right submenu-arrow"></i>'
            : ''
        }
      </div>
    `;
  }
}
