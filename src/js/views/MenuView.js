class MenuView {
  /**
   * @param {HTMLElement} sidebar Sidebar element (desktop)
   * @param {HTMLElement} mobileMenu Menú móvil contenedor.
   */
  constructor(sidebar, mobileMenu) {
    this.sidebar = sidebar;
    this.mobileMenu = mobileMenu;
  }

  /**
   * Dibuja ambos menús (sidebar y móvil) y devuelve nada.
   * @param {{top: Array, bottom: Array}} menuItems Estructura obtenida de MenuService.
   * @param {string} logoPath Ruta al logo segun tema.
   */
  render(menuItems, logoPath) {
    if (!this.sidebar || !this.mobileMenu) return;

    // Sidebar (desktop)
    const sidebarHTML = `
      <div class="sidebar-logo sidebar-item" id="sidebar_logo" data-tooltip="saiasoftware.com" style="cursor:pointer;">
        <img src="${logoPath}" alt="Logo">
      </div>
      <div class="sidebar-menu">
        <div class="menu-top">
          ${menuItems.top
            .map(
              item => `
                <div class="menu-item" id="${item.id}" data-tooltip="${item.name}" data-vista="${item.vista}">
                  <i class="${item.icon}"></i>
                </div>
              `
            )
            .join('')}
        </div>
        <div class="menu-bottom">
          ${menuItems.bottom
            .map(
              item => `
                <div class="menu-item" id="${item.id}" data-tooltip="${item.name}" data-vista="${item.vista}">
                  <i class="${item.icon}"></i>
                </div>
              `
            )
            .join('')}
        </div>
      </div>`;

    this.sidebar.innerHTML = sidebarHTML;

    // Mobile menu
    const mobileMenuItemsContainer =
      this.mobileMenu.querySelector('.mobile-menu-items');
    if (mobileMenuItemsContainer) {
      const mobileHTML = `
        <div class="mobile-menu-top">
          ${menuItems.top
            .map(
              item => `
                <a href="#" class="mobile-menu-item" id="mobile_${item.id}" data-vista="${item.vista}">
                  <i class="${item.icon}"></i>
                  <span>${item.name}</span>
                </a>`
            )
            .join('')}
        </div>
        <div class="mobile-menu-bottom">
          ${menuItems.bottom
            .map(
              item => `
                <a href="#" class="mobile-menu-item" id="mobile_${item.id}" data-vista="${item.vista}">
                  <i class="${item.icon}"></i>
                  <span>${item.name}</span>
                </a>`
            )
            .join('')}
        </div>`;

      mobileMenuItemsContainer.innerHTML = mobileHTML;
    }
  }
}
