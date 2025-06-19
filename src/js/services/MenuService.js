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

    // Usar AppConfig para obtener la ruta del menú
    const menuPath = AppConfig.PATHS.MENU_JSON;

    this._menuPromise = fetch(menuPath)
      .then(resp => {
        if (!resp.ok) {
          throw new Error(
            `Error al cargar ${menuPath}: ${resp.status} ${resp.statusText}`
          );
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
        console.error('MenuService: Error al cargar menú:', err);
        // Valor por defecto minimalista para no romper la UI
        return {
          top: [
            new MenuItem({
              id: 'menu_home',
              label: 'Home',
              icon: 'fas fa-home',
              type: 'item',
              target: AppConfig.getViewPath('home'),
            }),
          ],
          bottom: [],
        };
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
   * Obtiene todos los ítems que tienen submenús
   * @returns {Promise<Array<MenuItem>>}
   */
  async getSubmenuItems() {
    const menuItems = await this.getMenuItems();
    const submenuItems = [];

    // Buscar en items top
    for (const item of menuItems.top) {
      if (item.hasChildren()) {
        submenuItems.push(item);
      }
    }

    // Buscar en items bottom
    for (const item of menuItems.bottom) {
      if (item.hasChildren()) {
        submenuItems.push(item);
      }
    }

    return submenuItems;
  }

  /**
   * Obtiene estadísticas del menú para debugging
   * @returns {Promise<Object>}
   */
  async getMenuStats() {
    const menuItems = await this.getMenuItems();
    let totalItems = 0;
    let totalSubmenus = 0;
    let totalSubitems = 0;

    // Contar items top
    for (const item of menuItems.top) {
      totalItems++;
      if (item.hasChildren()) {
        totalSubmenus++;
        totalSubitems += item.children.length;
      }
    }

    // Contar items bottom
    for (const item of menuItems.bottom) {
      totalItems++;
      if (item.hasChildren()) {
        totalSubmenus++;
        totalSubitems += item.children.length;
      }
    }

    return {
      totalItems,
      totalSubmenus,
      totalSubitems,
      topItems: menuItems.top.length,
      bottomItems: menuItems.bottom.length,
    };
  }

  /**
   * Valida la estructura del menú y reporta errores
   * @returns {Promise<Array<string>>}
   */
  async validateMenuStructure() {
    const menuItems = await this.getMenuItems();
    const errors = [];

    // Validar items top
    for (const item of menuItems.top) {
      if (!item.id || !item.label || !item.type) {
        errors.push(`Item top inválido: ${item.id || 'sin ID'}`);
      }

      // Validar subitems
      for (const child of item.children) {
        if (!child.id || !child.label || !child.type) {
          errors.push(
            `Subitem inválido en ${item.id}: ${child.id || 'sin ID'}`
          );
        }
      }
    }

    // Validar items bottom
    for (const item of menuItems.bottom) {
      if (!item.id || !item.label || !item.type) {
        errors.push(`Item bottom inválido: ${item.id || 'sin ID'}`);
      }

      // Validar subitems
      for (const child of item.children) {
        if (!child.id || !child.label || !child.type) {
          errors.push(
            `Subitem inválido en ${item.id}: ${child.id || 'sin ID'}`
          );
        }
      }
    }

    return errors;
  }

  /**
   * Busca ítems por texto en el label (búsqueda insensible a mayúsculas)
   * @param {string} searchText - Texto a buscar
   * @returns {Promise<Array<MenuItem>>}
   *
   * @status READY - Listo para implementar
   * @priority HIGH - Prioridad alta para UX
   * @useCase "Barra de búsqueda en menú, filtrado dinámico"
   */
  async searchItems(searchText) {
    const menuItems = await this.getMenuItems();
    const results = [];
    const searchLower = searchText.toLowerCase();

    const searchInSection = items => {
      for (const item of items) {
        if (item.label.toLowerCase().includes(searchLower)) {
          results.push(item);
        }
        // Buscar también en subítems
        for (const child of item.children) {
          if (child.label.toLowerCase().includes(searchLower)) {
            results.push(child);
          }
        }
      }
    };

    searchInSection(menuItems.top);
    searchInSection(menuItems.bottom);

    return results;
  }

  /**
   * Obtiene todos los ítems que tienen un target específico
   * @param {string} target - Target a buscar
   * @returns {Promise<Array<MenuItem>>}
   *
   * @status READY - Listo para implementar
   * @priority MEDIUM - Prioridad media
   * @useCase "Análisis de navegación, auditoría de rutas"
   */
  async getItemsByTarget(target) {
    const menuItems = await this.getMenuItems();
    const results = [];

    const searchInSection = items => {
      for (const item of items) {
        if (item.target === target) {
          results.push(item);
        }
        // Buscar también en subítems
        for (const child of item.children) {
          if (child.target === target) {
            results.push(child);
          }
        }
      }
    };

    searchInSection(menuItems.top);
    searchInSection(menuItems.bottom);

    return results;
  }

  /**
   * Obtiene la ruta completa de navegación para un ítem
   * @param {string} itemId - ID del ítem
   * @returns {Promise<Array<MenuItem>>}
   *
   * @status READY - Listo para implementar
   * @priority MEDIUM - Prioridad media
   * @useCase "Breadcrumbs dinámicos, navegación jerárquica"
   */
  async getNavigationPath(itemId) {
    const item = await this.findItemById(itemId);
    if (!item) return [];

    const path = [item];
    let current = item.getParent();

    while (current) {
      path.unshift(current);
      current = current.getParent();
    }

    return path;
  }

  /**
   * Verifica si un ítem tiene permisos (placeholder para futuras implementaciones)
   * @param {string} itemId - ID del ítem
   * @param {Object} user - Usuario actual
   * @returns {Promise<boolean>}
   *
   * @status PLACEHOLDER - Requiere implementación de sistema de permisos
   * @priority LOW - Prioridad baja
   * @useCase "Sistema de roles y permisos, control de acceso granular"
   */
  async hasPermission(itemId, user = null) {
    // Por ahora retorna true, pero aquí se puede implementar lógica de permisos
    // basada en roles, grupos, etc.
    return true;
  }

  /**
   * Obtiene información detallada del servicio para debugging
   * @returns {Promise<Object>}
   */
  async getServiceInfo() {
    const menuItems = await this.getMenuItems();
    const stats = await this.getMenuStats();
    const submenuItems = await this.getSubmenuItems();
    const validation = await this.validateMenuStructure();

    return {
      serviceName: 'MenuService',
      isInitialized: !!this._menuPromise,
      hasCachedData: !!this._menuPromise,
      stats,
      submenuCount: submenuItems.length,
      validationErrors: validation.length,
      validationPassed: validation.length === 0,
      topItemsCount: menuItems.top.length,
      bottomItemsCount: menuItems.bottom.length,
      totalItems: stats.totalItems,
    };
  }

  /**
   * Limpia el caché del menú (útil para forzar recarga)
   */
  clearCache() {
    this._menuPromise = null;
    console.log('MenuService: Caché limpiado');
  }

  /**
   * Recarga el menú desde el servidor
   * @returns {Promise<{top: Array<MenuItem>, bottom: Array<MenuItem>}>}
   */
  async reload() {
    this.clearCache();
    return await this.getMenuItems();
  }

  /**
   * Obtiene todos los ítems activos
   * @returns {Promise<Array<MenuItem>>}
   */
  async getActiveItems() {
    const menuItems = await this.getMenuItems();
    const activeItems = [];

    const findActiveInSection = items => {
      for (const item of items) {
        if (item.isActive()) {
          activeItems.push(item);
        }
        // Buscar también en subítems
        for (const child of item.children) {
          if (child.isActive()) {
            activeItems.push(child);
          }
        }
      }
    };

    findActiveInSection(menuItems.top);
    findActiveInSection(menuItems.bottom);

    return activeItems;
  }

  /**
   * Obtiene la ruta de navegación como string
   * @param {string} itemId - ID del ítem
   * @returns {Promise<string>}
   */
  async getNavigationPathString(itemId) {
    const path = await this.getNavigationPath(itemId);
    return path.map(item => item.label).join(' > ');
  }

  /**
   * Verifica si un ítem existe
   * @param {string} itemId - ID del ítem a verificar
   * @returns {Promise<boolean>}
   */
  async itemExists(itemId) {
    const item = await this.findItemById(itemId);
    return item !== null;
  }
}
