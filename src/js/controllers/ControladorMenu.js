class ControladorMenu {
  constructor(configService = null, menuService = new MenuService()) {
    // Servicios inyectados
    this.configService = configService;
    this.menuService = menuService;

    this.config = configService ? configService.config : Configuracion.cargar();
    this.sidebar = document.getElementById('sidebar');
    this.mobileMenu = document.querySelector('.mobile-menu');
    this.mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    this.mobileMenuItems = document.querySelector('.mobile-menu-items');
    this.usuario = this.config.usuario;
    this.menuItems = null;
    this.temaHelper = new TemaHelper();
    // Almacenar el item activo actual
    this.itemActivo = null;
    // Vista (DOM)
    this.menuView = new MenuView(this.sidebar, this.mobileMenu);
  }

  async cargarMenu() {
    try {
      // Obtener elementos del menú desde MenuService
      this.menuItems = await this.menuService.getMenuItems();

      // Obtener logo desde el tema actual
      const logoPath = this.temaHelper.obtenerLogoTemaActual();

      // Renderizar vista a través de MenuView
      this.menuView.render(this.menuItems, logoPath);

      // Actualizar ícono del tema según el tema actual
      this.actualizarIconoTema();

      // Actualizar información del usuario en el menú móvil
      this.actualizarInfoUsuario();

      // Agregar eventos
      this.agregarEventos();
    } catch (error) {
      console.error('Error al cargar el menú:', error);
    }
  }

  actualizarInfoUsuario() {
    const userAvatar = this.mobileMenu.querySelector('.mobile-menu-header img');
    const userName = this.mobileMenu.querySelector('.user-name');
    const userCompany = this.mobileMenu.querySelector('.user-company');

    if (userAvatar) userAvatar.src = this.usuario.avatar;
    if (userName)
      userName.textContent = `${this.usuario.nombre} ${this.usuario.apellidos}`;
    if (userCompany) userCompany.textContent = this.usuario.empresa;
  }

  actualizarIconoTema() {
    const temaActual = this.temaHelper.obtenerTemaActual();

    // Actualizar ícono en el menú de escritorio
    const themeButton = this.sidebar.querySelector('#menu_theme i');
    if (themeButton) {
      themeButton.className =
        temaActual.modo === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }

    // Actualizar ícono en el menú móvil
    const mobileThemeButton = this.mobileMenuItems?.querySelector(
      '#mobile_menu_theme i'
    );
    if (mobileThemeButton) {
      mobileThemeButton.className =
        temaActual.modo === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }

    // Cambiar el logo según el tema actual
    const logoImg = this.sidebar.querySelector('.sidebar-logo img');
    if (logoImg) {
      logoImg.src = this.temaHelper.obtenerLogoTemaActual();
    }
  }

  agregarEventos() {
    // Eventos del menú lateral
    this.sidebar.addEventListener('click', e => {
      const logo = e.target.closest('#sidebar_logo');
      if (logo) {
        window.open('https://www.saiasoftware.com', '_blank');
        return;
      }
      const menuItem = e.target.closest('.menu-item');
      if (!menuItem) return;
      const id = menuItem.id;

      if (id === 'menu_theme') {
        this.cambiarTema();
        return;
      }

      // Remover clase active de todos los items excepto el tema
      this.sidebar
        .querySelectorAll('.menu-item:not(#menu_theme)')
        .forEach(item => {
          item.classList.remove('active');
        });

      // Agregar clase active al item seleccionado
      menuItem.classList.add('active');

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

        if (id === 'menu_theme') {
          this.cambiarTema();
          return;
        }

        // Remover clase active de todos los items móviles excepto el tema
        this.mobileMenuItems
          .querySelectorAll('.mobile-menu-item:not(#mobile_menu_theme)')
          .forEach(item => {
            item.classList.remove('active');
          });

        // Agregar clase active al item seleccionado
        menuItem.classList.add('active');

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

    // Guardar el item activo
    this.itemActivo = id;
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

  cambiarTema() {
    const temaActual = this.temaHelper.obtenerTemaActualCompleto();
    const temasDisponibles = this.temaHelper.obtenerTemasDisponibles();

    if (!temaActual || !temasDisponibles.length) {
      // Fallback al comportamiento anterior
      const modoActual = this.temaHelper.obtenerTemaActual().modo;
      const nuevoModo = modoActual === 'light' ? 'dark' : 'light';
      this.temaHelper.cambiarModo(nuevoModo);
    } else {
      // Encontrar el siguiente tema en la lista
      const indiceActual = temasDisponibles.findIndex(
        t => t.id === temaActual.id
      );
      const siguienteIndice = (indiceActual + 1) % temasDisponibles.length;
      const siguienteTema = temasDisponibles[siguienteIndice];

      // Cambiar al siguiente tema
      this.temaHelper.cambiarModo(siguienteTema.id);
    }

    // Actualizar los íconos
    this.actualizarIconoTema();
  }
}
