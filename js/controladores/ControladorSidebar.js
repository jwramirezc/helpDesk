class ControladorSidebar {
  constructor(controladorContenido) {
    this.controladorContenido = controladorContenido;
    this.sidebar = document.getElementById('sidebar');
    this.menuItems = {
      top: [],
      bottom: [],
    };
  }

  async inicializar() {
    await this.cargarMenuItems();
    this.cargarSidebar();
    this.verificarLogo();
    this.inicializarEventos();
  }

  async cargarMenuItems() {
    try {
      const response = await fetch('data/menu.json');
      if (!response.ok) {
        throw new Error('Error al cargar el menú');
      }
      const data = await response.json();
      this.menuItems = data.menuItems;
    } catch (error) {
      console.error('Error al cargar los elementos del menú:', error);
      // Cargar menú por defecto en caso de error
      this.menuItems = {
        top: [
          {
            id: 'dashboard',
            icon: 'fas fa-home',
            name: 'Dashboard',
            vista: 'dashboard',
          },
          {
            id: 'tickets',
            icon: 'fas fa-ticket-alt',
            name: 'Tickets',
            vista: 'tickets',
          },
          {
            id: 'usuarios',
            icon: 'fas fa-users',
            name: 'Usuarios',
            vista: 'usuarios',
          },
        ],
        bottom: [
          {
            id: 'configuracion',
            icon: 'fas fa-cog',
            name: 'Configuración',
            vista: 'configuracion',
          },
        ],
      };
    }
  }

  cargarSidebar() {
    if (!this.sidebar) {
      console.error('No se encontró el elemento sidebar');
      return;
    }

    this.sidebar.innerHTML = `
      <div class="sidebar-logo">
        <img src="assets/img/logo-saia.png" alt="Logo">
      </div>
      <div class="sidebar-menu">
        <div class="menu-top">
          ${this.menuItems.top
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
          ${this.menuItems.bottom
            .map(
              item => `
            <div class="menu-item" id="${item.id}" data-tooltip="${item.name}" data-vista="${item.vista}">
              <i class="${item.icon}"></i>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    `;
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
}
