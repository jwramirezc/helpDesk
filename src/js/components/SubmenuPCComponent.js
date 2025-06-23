class SubmenuPCComponent {
  constructor(menuService, contentController) {
    this.menuService = menuService;
    this.contentController = contentController;
    this.submenuContainer = null;
    this.activeParentItem = null;
  }

  /**
   * Crea el contenedor del submenú si no existe.
   */
  _ensureSubmenuContainer() {
    if (this.submenuContainer) return;

    const container = document.createElement('div');
    container.className = 'submenu-pc';
    container.id = 'submenu-pc';

    // Insertar al final del body ya que usa position: fixed
    document.body.appendChild(container);

    this.submenuContainer = container;

    // Agregar evento para cerrar el submenú
    this.submenuContainer.addEventListener('click', e => {
      const closeButton = e.target.closest('.submenu-pc-close');
      if (closeButton) {
        this.hide();
      }

      const subMenuItem = e.target.closest('.submenu-pc-item');
      if (subMenuItem && subMenuItem.dataset.target) {
        e.preventDefault();
        // Extraer el nombre del archivo sin extensión del target
        const target = subMenuItem.dataset.target;
        const fileName = target.split('/').pop(); // Obtener el último segmento
        const vistaName = fileName.replace('.html', ''); // Remover la extensión

        this.contentController.cargarVista(vistaName);
        this.setActiveSubmenuItem(subMenuItem.dataset.id);
      }
    });
  }

  /**
   * Muestra el submenú para un ítem de menú específico.
   * @param {MenuItem} menuItem - El ítem de menú padre.
   */
  show(menuItem) {
    if (!menuItem || !menuItem.hasChildren()) {
      this.hide();
      return;
    }

    // Si se hace clic en el mismo item, no hacer nada o cerrar (toggle)
    if (
      this.activeParentItem &&
      this.activeParentItem.id === menuItem.id &&
      this.submenuContainer.classList.contains('active')
    ) {
      this.hide();
      return;
    }

    this._ensureSubmenuContainer();
    this.activeParentItem = menuItem;
    this.render(menuItem);
    this.submenuContainer.classList.add('active');

    // Añadir clase al body para ajustar el layout
    document.body.classList.add('submenu-active');

    // Automáticamente activar el primer ítem del submenú y cargar su página
    if (menuItem.children && menuItem.children.length > 0) {
      const firstChild = menuItem.children[0];
      this.setActiveSubmenuItem(firstChild.id);

      // Cargar la página del primer ítem si tiene target
      if (firstChild.target) {
        // Extraer el nombre del archivo sin extensión del target
        const fileName = firstChild.target.split('/').pop(); // Obtener el último segmento
        const vistaName = fileName.replace('.html', ''); // Remover la extensión

        this.contentController.cargarVista(vistaName);
      }
    }
  }

  /**
   * Oculta el submenú.
   */
  hide() {
    if (this.submenuContainer) {
      this.submenuContainer.classList.remove('active');
    }

    // Remover clase del body para restaurar el layout
    document.body.classList.remove('submenu-active');

    this.activeParentItem = null;
  }

  /**
   * Renderiza el contenido del submenú.
   * @param {MenuItem} menuItem - El ítem de menú padre.
   */
  render(menuItem) {
    const childrenHtml = menuItem.children
      .map(
        child => `
          <a href="#" class="submenu-pc-item" data-id="${child.id}" data-target="${child.target}">
            <span class="submenu-pc-item-icon"><i class="${child.icon}"></i></span>
            <span class="submenu-pc-item-label">${child.label}</span>
          </a>
        `
      )
      .join('');

    this.submenuContainer.innerHTML = `
      <div class="submenu-pc-header">
        <h2 class="submenu-pc-title">${menuItem.label}</h2>
        <span class="submenu-pc-close"><i class="fas fa-times"></i></span>
      </div>
      <div class="submenu-pc-items">
        ${childrenHtml}
      </div>
    `;
  }

  /**
   * Marca un item del submenu como activo
   * @param {string} subMenuItemId
   */
  setActiveSubmenuItem(subMenuItemId) {
    if (!this.submenuContainer) return;

    // Desactivar item activo anterior
    const currentActive = this.submenuContainer.querySelector(
      '.submenu-pc-item.active'
    );
    if (currentActive) {
      currentActive.classList.remove('active');
    }

    // Activar nuevo item
    const newActive = this.submenuContainer.querySelector(
      `.submenu-pc-item[data-id="${subMenuItemId}"]`
    );
    if (newActive) {
      newActive.classList.add('active');
    }
  }
}
