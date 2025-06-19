class MenuService {
  constructor() {
    /** @type {Promise<{top: Array<MenuItem>, bottom: Array<MenuItem>}>|null} */
    this._menuPromise = null;
  }

  /**
   * Limpia el estado activo (para cargas iniciales)
   */
  limpiarEstadoActivo() {
    sessionStorage.removeItem('activeMenuItem');
    sessionStorage.removeItem('activeParentMenuItem');
    sessionStorage.removeItem('hasNavigated');
  }

  /**
   * Devuelve los items del menú (top & bottom).
   * El archivo solo se carga la primera vez; las siguientes
   * llamadas reutilizan el resultado ('caching' en memoria).
   * @returns {Promise<{top: Array<MenuItem>, bottom: Array<MenuItem>}>}
   */
  async getMenuItems() {
    if (this._menuPromise) return this._menuPromise;

    this._menuPromise = fetch('data/config/menu.json')
      .then(resp => {
        if (!resp.ok) {
          throw new Error('Error al cargar data/config/menu.json');
        }
        return resp.json();
      })
      .then(json => {
        const menuItems = json.menuItems || { top: [], bottom: [] };

        const result = {
          top: menuItems.top.map(item => new MenuItem(item)),
          bottom: menuItems.bottom.map(item => new MenuItem(item)),
        };

        // Restaurar estado activo
        this.restoreActiveState(result);

        return result;
      })
      .catch(err => {
        console.error('MenuService: Error:', err);
        // Valor por defecto minimalista para no romper la UI
        return { top: [], bottom: [] };
      });

    return this._menuPromise;
  }

  /**
   * Restaura el estado activo de los ítems desde sessionStorage
   * @private
   * @param {{top: Array<MenuItem>, bottom: Array<MenuItem>}} menuItems
   */
  restoreActiveState(menuItems) {
    // Solo restaurar estado si el usuario ha navegado (no al cargar inicialmente)
    const hasNavigated = sessionStorage.getItem('hasNavigated');
    if (!hasNavigated) {
      // Es la primera carga, no restaurar estado activo
      return;
    }

    const activeItemId = sessionStorage.getItem('activeMenuItem');
    const activeParentId = sessionStorage.getItem('activeParentMenuItem');

    if (activeItemId) {
      // Buscar y activar el ítem activo
      const activeItem = this.findItemInSections(activeItemId, menuItems);
      if (activeItem) {
        activeItem.setActive(true);
      }
    }

    if (activeParentId) {
      // Buscar y activar el ítem padre
      const parentItem = this.findItemInSections(activeParentId, menuItems);
      if (parentItem) {
        parentItem.setActive(true);
      }
    }
  }

  /**
   * Busca un ítem por su ID en todas las secciones del menú
   * @private
   * @param {string} id - ID del ítem a buscar
   * @param {{top: Array<MenuItem>, bottom: Array<MenuItem>}} menuItems
   * @returns {MenuItem|null}
   */
  findItemInSections(id, menuItems) {
    // Buscar en items top
    for (const item of menuItems.top) {
      const found = item.findById(id);
      if (found) return found;
    }

    // Buscar en items bottom
    for (const item of menuItems.bottom) {
      const found = item.findById(id);
      if (found) return found;
    }

    return null;
  }

  /**
   * Busca un ítem por su ID en todo el menú
   * @param {string} id - ID del ítem a buscar
   * @returns {Promise<MenuItem|null>}
   */
  async findItemById(id) {
    const menuItems = await this.getMenuItems();
    return this.findItemInSections(id, menuItems);
  }

  /**
   * Activa un ítem y su padre (si existe)
   * @param {string} id - ID del ítem a activar
   */
  async activateItem(id) {
    const item = await this.findItemById(id);
    if (item) {
      item.setActive(true);
      const parent = item.getParent();
      if (parent) {
        parent.setActive(true);
      }
    }
  }
}
