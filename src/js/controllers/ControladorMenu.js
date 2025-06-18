class ControladorMenu {
  constructor(
    configService = null,
    menuService = new MenuService(),
    controladorContenido = null
  ) {
    // Servicios inyectados
    this.configService = configService;
    this.menuService = menuService;
    this.controladorContenido = controladorContenido;

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

      // Obtener logos desde el tema actual
      const logoPath = this.temaHelper.obtenerLogoTemaActual();
      const logoMovilPath = this.temaHelper.obtenerLogoMovilTemaActual();

      // Renderizar vista a través de MenuView
      this.menuView.render(this.menuItems, logoPath, logoMovilPath);

      // Actualizar ícono del tema según el tema actual
      this.actualizarIconoTema();

      // Agregar eventos
      this.agregarEventos();

      // Inicializar comportamiento del toggle
      this.manejarCambioTamanio();
    } catch (error) {
      console.error('Error al cargar el menú:', error);
    }
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

    // Cambiar el logo del sidebar según el tema actual
    const logoImg = this.sidebar.querySelector('.sidebar-logo img');
    if (logoImg) {
      logoImg.src = this.temaHelper.obtenerLogoTemaActual();
    }

    // Cambiar el logo móvil según el tema actual
    const mobileLogoImg = this.mobileMenu?.querySelector(
      '.mobile-menu-logo img'
    );
    if (mobileLogoImg) {
      mobileLogoImg.src = this.temaHelper.obtenerLogoMovilTemaActual();
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
        this.abrirMenuMovil();
      });
    }

    // Evento para el botón de cerrar del menú móvil
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    if (mobileMenuClose) {
      mobileMenuClose.addEventListener('click', e => {
        e.stopPropagation();
        this.cerrarMenuMovil();
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
        this.cerrarMenuMovil();
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
        this.cerrarMenuMovil();
      }
    });

    // Manejar cambios de tamaño de ventana
    window.addEventListener('resize', () => {
      this.manejarCambioTamanio();
    });
  }

  // Método para abrir el menú móvil
  abrirMenuMovil() {
    if (this.mobileMenu) {
      this.mobileMenu.classList.add('active');
      // Ocultar el botón toggle cuando el menú está abierto
      if (this.mobileMenuToggle) {
        this.mobileMenuToggle.classList.add('hidden');
      }
    }
  }

  // Método para cerrar el menú móvil
  cerrarMenuMovil() {
    if (this.mobileMenu) {
      this.mobileMenu.classList.remove('active');
      // Mostrar el botón toggle cuando el menú está cerrado
      if (this.mobileMenuToggle) {
        this.mobileMenuToggle.classList.remove('hidden');
      }
    }
  }

  // Método para manejar cambios de tamaño de ventana
  manejarCambioTamanio() {
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      // En móvil, asegurar que el toggle esté visible si el menú está cerrado
      if (
        this.mobileMenuToggle &&
        !this.mobileMenu.classList.contains('active')
      ) {
        this.mobileMenuToggle.classList.remove('hidden');
      }
    } else {
      // En desktop, ocultar el toggle y cerrar el menú móvil
      if (this.mobileMenuToggle) {
        this.mobileMenuToggle.classList.add('hidden');
      }
      if (this.mobileMenu) {
        this.mobileMenu.classList.remove('active');
      }
    }
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

    // Obtener la vista del item seleccionado y cargarla
    this.cargarVista(id);
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

  cargarVista(id) {
    // Buscar el item en el menú para obtener su vista
    const item =
      this.menuItems?.top.find(item => item.id === id) ||
      this.menuItems?.bottom.find(item => item.id === id);

    if (item && item.vista && this.controladorContenido) {
      console.log('Cargando vista:', item.vista, 'para el item:', id);
      this.controladorContenido.cargarVista(item.vista);
    } else {
      console.log('No se pudo cargar la vista para el item:', id);
    }
  }
}
