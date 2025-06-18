class ControladorSidebar {
  constructor(
    controladorContenido,
    configService = null,
    menuService = new MenuService()
  ) {
    this.controladorContenido = controladorContenido;
    this.configService = configService;
    this.menuService = menuService;

    this.sidebar = document.getElementById('sidebar');
    this.menuItems = {
      top: [],
      bottom: [],
    };
    this.sidebarView = new SidebarView(this.sidebar);
  }

  async inicializar() {
    await this.cargarMenuItems();
    this.sidebarView.render(this.menuItems);
    this.verificarLogo();
    this.inicializarEventos();
  }

  async cargarMenuItems() {
    try {
      this.menuItems = await this.menuService.getMenuItems();
    } catch (error) {
      console.error('Error al obtener items de menú:', error);
    }
  }

  verificarLogo() {
    const logoImg = this.sidebar.querySelector('.sidebar-logo img');
    if (logoImg) {
      logoImg.onload = () => console.log('Logo cargado correctamente');
      logoImg.onerror = () => console.error('Error al cargar el logo');
    }
  }

  inicializarEventos() {
    const menuItems = this.sidebar.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
      item.addEventListener('click', () => {
        const vista = item.dataset.vista;
        this.seleccionarItem(item);
        this.controladorContenido.cargarVista(vista);
      });
    });
  }

  seleccionarItem(itemSeleccionado) {
    const items = this.sidebar.querySelectorAll('.menu-item');
    items.forEach(item => item.classList.remove('active'));
    itemSeleccionado.classList.add('active');
  }

  cargarSidebar() {
    // Método mantenido por compatibilidad: delega en SidebarView
    this.sidebarView.render(this.menuItems);
  }
}
