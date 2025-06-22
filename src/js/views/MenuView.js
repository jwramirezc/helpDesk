class MenuView {
  /**
   * @param {HTMLElement} sidebar Sidebar element (desktop)
   * @param {HTMLElement} mobileMenu Menú móvil contenedor.
   */
  constructor(sidebar, mobileMenu) {
    this.sidebar = sidebar;
    this.mobileMenu = mobileMenu;
    this.isMobile = window.innerWidth < MenuConfig.BREAKPOINTS.MOBILE;
    this.currentMobileView = 'main'; // 'main' o 'submenu'
    this.currentSubmenuParent = null;
    this.currentMenuItems = null; // Almacenar los items del menú actual
    this.currentLogoPath = null; // Almacenar la ruta del logo actual

    // Escuchar cambios de tamaño de ventana
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth < MenuConfig.BREAKPOINTS.MOBILE;
    });
  }

  /**
   * Dibuja ambos menús (sidebar y móvil) y devuelve nada.
   * @param {{top: Array<MenuItem>, bottom: Array<MenuItem>}} menuItems Estructura obtenida de MenuService.
   * @param {string} logoPath Ruta al logo del sidebar segun tema.
   * @param {string} logoMovilPath Ruta al logo móvil segun tema.
   */
  render(menuItems, logoPath, logoMovilPath) {
    if (!this.sidebar || !this.mobileMenu) {
      console.error('MenuView: Elementos del DOM no encontrados');
      return;
    }

    // Validar datos de entrada
    if (!menuItems || !menuItems.top || !menuItems.bottom) {
      console.error('MenuView: Datos del menú inválidos');
      return;
    }

    // Almacenar los datos actuales
    this.currentMenuItems = menuItems;
    this.currentLogoPath = logoMovilPath;

    // Sidebar (desktop)
    this._renderDesktopMenu(menuItems, logoPath);

    // Mobile menu
    this._renderMobileMenu(menuItems, logoMovilPath);
  }

  /**
   * Renderiza el menú de escritorio
   * @private
   */
  _renderDesktopMenu(menuItems, logoPath) {
    const sidebarHTML = `
      <div class="sidebar-logo sidebar-item" id="sidebar_logo" data-tooltip="saiasoftware.com" style="cursor:pointer;">
        <img src="${logoPath}" alt="Logo">
      </div>
      <div class="sidebar-menu">
        <div class="menu-top">
          ${menuItems.top.map(item => item.toHTML(false)).join('')}
        </div>
        <div class="menu-bottom">
          ${menuItems.bottom.map(item => item.toHTML(false)).join('')}
        </div>
      </div>`;

    this.sidebar.innerHTML = sidebarHTML;
  }

  /**
   * Renderiza el menú móvil
   * @private
   */
  _renderMobileMenu(menuItems, logoPath) {
    const mobileMenuItemsContainer =
      this.mobileMenu.querySelector('.mobile-menu-items');
    if (!mobileMenuItemsContainer) {
      console.error('MenuView: Contenedor de menú móvil no encontrado');
      return;
    }

    // Validar que tenemos los datos necesarios
    if (!menuItems || !menuItems.top || !menuItems.bottom) {
      console.warn('MenuView: Datos del menú no disponibles');
      return;
    }

    let mobileHTML = '';

    if (this.currentMobileView === 'main') {
      // Vista principal del menú móvil
      mobileHTML = `
        <div class="mobile-menu-logo">
          <img src="${logoPath}" alt="Logo Móvil">
        </div>
        <div class="mobile-menu-top">
          ${menuItems.top.map(item => item.toHTML(true)).join('')}
        </div>
        <div class="mobile-menu-bottom">
          ${menuItems.bottom.map(item => item.toHTML(true)).join('')}
        </div>`;
    } else if (
      this.currentMobileView === 'submenu' &&
      this.currentSubmenuParent
    ) {
      // Vista de submenú móvil
      mobileHTML = `
        <div class="mobile-submenu-header">
          <button class="mobile-back-button" id="mobile_back_button">
            <i class="fas fa-arrow-left"></i>
            <span>Volver</span>
          </button>
          <div class="mobile-submenu-title">
            <i class="${this.currentSubmenuParent.icon}"></i>
            <span>${this.currentSubmenuParent.label}</span>
          </div>
        </div>
        <div class="mobile-submenu-items">
          ${this.currentSubmenuParent.children
            .map(child => child.toHTML(true))
            .join('')}
        </div>`;
    }

    mobileMenuItemsContainer.innerHTML = mobileHTML;
  }

  /**
   * Muestra un submenú en la vista móvil
   * @param {MenuItem} parentItem - El ítem padre del submenú
   */
  showMobileSubmenu(parentItem) {
    if (!parentItem || !parentItem.hasChildren()) {
      console.warn('MenuView: Intento de mostrar submenú inválido');
      return;
    }

    this.currentMobileView = 'submenu';
    this.currentSubmenuParent = parentItem;

    // Usar los datos almacenados para re-renderizar
    this._renderMobileMenu(this.currentMenuItems, this.currentLogoPath);

    console.log('MenuView: Submenú mostrado', {
      parent: parentItem.label,
      subitems: parentItem.children.length,
    });
  }

  /**
   * Vuelve al menú principal en la vista móvil
   */
  showMobileMainMenu() {
    this.currentMobileView = 'main';
    this.currentSubmenuParent = null;

    // Usar los datos almacenados para re-renderizar
    this._renderMobileMenu(this.currentMenuItems, this.currentLogoPath);

    console.log('MenuView: Vuelta al menú principal');
  }

  /**
   * Obtiene información del estado actual de la vista
   * @returns {Object}
   */
  getViewState() {
    return {
      currentMobileView: this.currentMobileView,
      currentSubmenuParent: this.currentSubmenuParent?.label || null,
      isMobile: this.isMobile,
      hasMenuItems: !!this.currentMenuItems,
      topItemsCount: this.currentMenuItems?.top?.length || 0,
      bottomItemsCount: this.currentMenuItems?.bottom?.length || 0,
    };
  }

  /**
   * Valida que todos los elementos del DOM estén presentes
   * @returns {boolean}
   */
  validateDOM() {
    const requiredElements = [
      this.sidebar,
      this.mobileMenu,
      this.mobileMenu?.querySelector('.mobile-menu-items'),
    ];

    const missingElements = requiredElements.filter(el => !el);

    if (missingElements.length > 0) {
      console.error(
        'MenuView: Elementos del DOM faltantes:',
        missingElements.length
      );
      return false;
    }

    return true;
  }
}

// Exponer clase globalmente para acceso desde otros módulos
window.MenuView = MenuView;
