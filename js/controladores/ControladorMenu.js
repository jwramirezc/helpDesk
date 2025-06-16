class ControladorMenu {
  constructor() {
    this.config = Configuracion.cargar();
    this.sidebar = document.getElementById('sidebar');
    this.mobileMenu = document.querySelector('.mobile-menu');
    this.mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    this.mobileMenuItems = document.querySelector('.mobile-menu-items');
    this.usuario = this.config.usuario;
    this.menuItems = null;
  }

  async cargarMenu() {
    try {
      // Cargar elementos del menú
      const response = await fetch('data/menu.json');
      if (!response.ok) {
        throw new Error('Error al cargar el menú');
      }
      const data = await response.json();
      this.menuItems = data.menuItems;

      // Generar HTML del menú lateral
      let menuHTML = `
        <div class="sidebar-logo">
          <img src="assets/img/logo-saia.png" alt="Logo">
        </div>
        <div class="sidebar-menu">
          <div class="menu-top">
            ${this.menuItems.top
              .map(
                item => `
              <div class="menu-item" 
                   id="${item.id}" 
                   data-tooltip="${item.name}"
                   data-vista="${item.vista}">
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
              <div class="menu-item" 
                   id="${item.id}" 
                   data-tooltip="${item.name}"
                   data-vista="${item.vista}">
                <i class="${item.icon}"></i>
              </div>
            `
              )
              .join('')}
          </div>
        </div>
      `;

      // Actualizar sidebar
      this.sidebar.innerHTML = menuHTML;

      // Generar HTML del menú móvil
      let mobileMenuHTML = `
        <div class="mobile-menu-top">
          ${this.menuItems.top
            .map(
              item => `
            <a href="#" class="mobile-menu-item" id="mobile_${item.id}" data-vista="${item.vista}">
              <i class="${item.icon}"></i>
              <span>${item.name}</span>
            </a>
          `
            )
            .join('')}
        </div>
        <div class="mobile-menu-bottom">
          ${this.menuItems.bottom
            .map(
              item => `
            <a href="#" class="mobile-menu-item" id="mobile_${item.id}" data-vista="${item.vista}">
              <i class="${item.icon}"></i>
              <span>${item.name}</span>
            </a>
          `
            )
            .join('')}
        </div>
      `;

      // Actualizar menú móvil
      this.mobileMenuItems.innerHTML = mobileMenuHTML;

      // Actualizar información del usuario en el menú móvil
      this.actualizarInfoUsuario();

      // Agregar eventos
      this.agregarEventos();
    } catch (error) {
      console.error('Error al cargar el menú:', error);
    }
  }

  actualizarInfoUsuario() {
    const userAvatar = this.mobileMenu.querySelector('.user-avatar img');
    const userName = this.mobileMenu.querySelector('.user-name');
    const userCompany = this.mobileMenu.querySelector('.user-company');

    if (userAvatar) userAvatar.src = this.usuario.avatar;
    if (userName)
      userName.textContent = `${this.usuario.nombre} ${this.usuario.apellidos}`;
    if (userCompany) userCompany.textContent = this.usuario.empresa;
  }

  agregarEventos() {
    // Eventos del menú lateral
    this.sidebar.addEventListener('click', e => {
      const menuItem = e.target.closest('.menu-item');
      if (!menuItem) return;

      const id = menuItem.id;
      if (id === 'menu_logout') {
        this.cerrarSesion();
      } else if (id === 'menu_config') {
        this.abrirConfiguracion();
      } else {
        this.seleccionarItem(id);
      }
    });

    // Eventos del menú móvil
    if (this.mobileMenuToggle) {
      this.mobileMenuToggle.addEventListener('click', e => {
        e.stopPropagation();
        this.mobileMenu.classList.toggle('active');
      });
    }

    if (this.mobileMenuItems) {
      this.mobileMenuItems.addEventListener('click', e => {
        const menuItem = e.target.closest('.mobile-menu-item');
        if (!menuItem) return;

        e.preventDefault();
        const id = menuItem.id.replace('mobile_', '');

        if (id === 'menu_logout') {
          this.cerrarSesion();
        } else if (id === 'menu_config') {
          this.abrirConfiguracion();
        } else {
          this.seleccionarItem(id);
        }

        // Cerrar menú móvil después de seleccionar
        this.mobileMenu.classList.remove('active');
      });
    }

    // Cerrar menú móvil al hacer clic fuera
    document.addEventListener('click', e => {
      if (
        this.mobileMenu &&
        !this.mobileMenu.contains(e.target) &&
        !this.mobileMenuToggle.contains(e.target) &&
        this.mobileMenu.classList.contains('active')
      ) {
        this.mobileMenu.classList.remove('active');
      }
    });
  }

  seleccionarItem(id) {
    // Remover clase active de todos los items
    this.sidebar.querySelectorAll('.menu-item').forEach(item => {
      item.classList.remove('active');
    });
    if (this.mobileMenuItems) {
      this.mobileMenuItems
        .querySelectorAll('.mobile-menu-item')
        .forEach(item => {
          item.classList.remove('active');
        });
    }

    // Agregar clase active al item seleccionado
    const item = this.sidebar.querySelector(`#${id}`);
    const mobileItem = this.mobileMenuItems?.querySelector(`#mobile_${id}`);
    if (item) item.classList.add('active');
    if (mobileItem) mobileItem.classList.add('active');
  }

  abrirConfiguracion() {
    // Implementar lógica para abrir configuración
    console.log('Abrir configuración');
  }

  cerrarSesion() {
    // Implementar lógica para cerrar sesión
    console.log('Cerrar sesión');
    // Aquí iría la lógica para limpiar la sesión y redirigir al login
  }

  actualizarVisibilidad(id, visible) {
    // Buscar en elementos estándar
    const standardItem =
      this.config.menu.top.find(item => item.id === id) ||
      this.config.menu.bottom.find(item => item.id === id);
    if (standardItem) {
      standardItem.visible = visible;
      this.config.guardar();
      this.cargarMenu();
      return;
    }

    // Buscar en elementos dinámicos
    const dynamicItem = this.menuItems?.top.find(item => item.id === id);
    if (dynamicItem) {
      dynamicItem.visible = visible;
      // Aquí se podría implementar la lógica para guardar los cambios en el servidor
      this.cargarMenu();
    }
  }

  actualizarOrden(id, nuevoOrden) {
    // Buscar en elementos estándar
    const standardItem =
      this.config.menu.top.find(item => item.id === id) ||
      this.config.menu.bottom.find(item => item.id === id);
    if (standardItem) {
      standardItem.orden = nuevoOrden;
      this.config.guardar();
      this.cargarMenu();
      return;
    }

    // Buscar en elementos dinámicos
    const dynamicItem = this.menuItems?.top.find(item => item.id === id);
    if (dynamicItem) {
      dynamicItem.orden = nuevoOrden;
      // Aquí se podría implementar la lógica para guardar los cambios en el servidor
      this.cargarMenu();
    }
  }
}
