class SidebarView {
  /**
   * @param {HTMLElement} sidebar DOM element donde se pinta el sidebar.
   */
  constructor(sidebar) {
    this.sidebar = sidebar;
  }

  /**
   * Renderiza el sidebar con los items indicados.
   * @param {{top:Array,bottom:Array}} menuItems
   */
  render(menuItems) {
    if (!this.sidebar) return;

    this.sidebar.innerHTML = `
      <div class="sidebar-menu">
        <div class="menu-top">
          ${menuItems.top
            .map(
              item => `
                <div class="menu-item" id="${item.id}" data-tooltip="${item.name}" data-vista="${item.vista}">
                  <i class="${item.icon}"></i>
                </div>`
            )
            .join('')}
        </div>
        <div class="menu-bottom">
          ${menuItems.bottom
            .map(
              item => `
                <div class="menu-item" id="${item.id}" data-tooltip="${item.name}" data-vista="${item.vista}">
                  <i class="${item.icon}"></i>
                </div>`
            )
            .join('')}
        </div>
      </div>`;
  }
}
