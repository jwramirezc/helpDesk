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
    // Flag para controlar si estamos en un submenú
    this.isInSubmenu = false;

    // Validar elementos críticos del DOM
    this._validateCriticalElements();
  }

  /**
   * Valida que los elementos críticos del DOM estén presentes
   * @private
   */
  _validateCriticalElements() {
    const criticalElements = [
      { name: 'sidebar', element: this.sidebar },
      { name: 'mobileMenu', element: this.mobileMenu },
      { name: 'mobileMenuToggle', element: this.mobileMenuToggle },
      { name: 'mobileMenuItems', element: this.mobileMenuItems },
    ];

    const missingElements = criticalElements.filter(item => !item.element);

    if (missingElements.length > 0) {
      console.error(
        'ControladorMenu: Elementos críticos faltantes:',
        missingElements.map(item => item.name)
      );
    }
  }

  async cargarMenu() {
    try {
      // Limpiar estado activo al cargar inicialmente
      this.menuService.limpiarEstadoActivo();

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

      // Actualizar la vista para reflejar los estados activos
      this.actualizarVistaMenu();

      // Log de éxito solo en desarrollo
      if (
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1'
      ) {
        console.log('ControladorMenu: Menú cargado correctamente');
      }
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
    this.sidebar.addEventListener('click', async e => {
      const logo = e.target.closest('#sidebar_logo');
      if (logo) {
        window.open('https://www.saiasoftware.com', '_blank');
        return;
      }

      const menuItem = e.target.closest('.menu-item');
      if (!menuItem) return;

      await this.handleMenuItemClick(menuItem, false);
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
        this.isInSubmenu = false; // Resetear el estado al cerrar el menú
        this.cerrarMenuMovil();
      });
    }

    if (this.mobileMenuItems) {
      this.agregarEventosMenuMovil();
    }

    // Cerrar menú móvil al hacer clic fuera
    document.addEventListener('click', e => {
      if (
        this.mobileMenu &&
        !this.mobileMenu.contains(e.target) &&
        !this.mobileMenuToggle.contains(e.target) &&
        this.mobileMenu.classList.contains('active') &&
        !this.isInSubmenu // No cerrar si estamos en un submenú
      ) {
        this.cerrarMenuMovil();
      }
    });

    // Manejar cambios de tamaño de ventana
    window.addEventListener('resize', () => {
      this.manejarCambioTamanio();
    });
  }

  /**
   * Maneja el clic en un ítem del menú (desktop y móvil)
   * @param {HTMLElement} menuItem - Elemento del menú clickeado
   * @param {boolean} isMobile - Indica si es desde el menú móvil
   */
  async handleMenuItemClick(menuItem, isMobile = false) {
    const id = isMobile ? menuItem.id.replace('mobile_', '') : menuItem.id;
    const type = menuItem.dataset.type;
    const action = menuItem.dataset.action;
    const message = menuItem.dataset.message;
    const target = menuItem.dataset.target;

    if (id === 'menu_theme') {
      this.cambiarTema();
      return;
    }

    // Si es un submenú con acción alert, mostrar el mensaje
    if (type === 'submenu' && action === 'alert') {
      // Activar solo Configuración y desactivar los demás
      await this.activarSoloItem(id);
      alert(message);
      return;
    }

    // Si es un ítem normal, cargar la vista en el contenedor principal
    if (type === 'item' && target) {
      // Activar solo este ítem y desactivar los demás
      await this.activarSoloItem(id);
      // Cerrar el menú móvil antes de cargar la vista
      if (isMobile) {
        this.cerrarMenuMovil();
      }
      // Cargar la vista en el contenedor principal
      await this.cargarVista(id);
      return;
    }
  }

  /**
   * Agrega eventos específicos para el menú móvil principal
   */
  agregarEventosMenuMovil() {
    if (this.mobileMenuItems) {
      // Remover eventos previos para evitar duplicados
      this.mobileMenuItems.removeEventListener(
        'click',
        this.handleMobileMenuClick
      );

      // Agregar el nuevo evento
      this.handleMobileMenuClick = async e => {
        const menuItem = e.target.closest('.mobile-menu-item');
        if (!menuItem) return;

        e.preventDefault();
        e.stopPropagation(); // Evitar que el clic se propague

        const id = menuItem.id.replace('mobile_', '');
        const type = menuItem.dataset.type;

        // Comportamiento adaptativo para submenús
        if (type === 'submenu') {
          if (window.innerWidth >= 768) {
            // En PC: usar el handler común
            await this.handleMenuItemClick(menuItem, true);
          } else {
            // En móvil: mostrar submenú en vista separada
            const parentItem = await this.menuService.findItemById(id);
            if (parentItem && parentItem.children.length > 0) {
              this.isInSubmenu = true; // Indicar que estamos en un submenú
              // Activar solo Configuración y desactivar los demás
              await this.activarSoloItem(id);
              this.menuView.showMobileSubmenu(parentItem);
              this.agregarEventosSubmenuMovil();
            }
          }
          return;
        }

        // Para ítems normales, usar el handler común
        await this.handleMenuItemClick(menuItem, true);

        // Solo cerrar el menú si no estamos en un submenú
        if (!this.isInSubmenu) {
          this.cerrarMenuMovil();
        }
      };

      this.mobileMenuItems.addEventListener(
        'click',
        this.handleMobileMenuClick
      );
    }
  }

  /**
   * Agrega eventos para el botón de volver en submenús móviles
   */
  agregarEventosSubmenuMovil() {
    const backButton = document.getElementById('mobile_back_button');
    if (backButton) {
      // Remover eventos previos para evitar duplicados
      backButton.removeEventListener('click', this.handleBackButtonClick);

      // Agregar el nuevo evento
      this.handleBackButtonClick = e => {
        e.preventDefault();
        e.stopPropagation(); // Evitar que el clic se propague
        this.isInSubmenu = false; // Indicar que salimos del submenú
        this.menuView.showMobileMainMenu();
        this.agregarEventosMenuMovil();
        // Asegurar que solo Configuración quede activo
        this.actualizarVistaMenu();
      };

      backButton.addEventListener('click', this.handleBackButtonClick);
    }

    // Agregar eventos para los subítems
    const submenuItems = document.querySelectorAll(
      '.mobile-submenu-items .mobile-menu-item'
    );
    submenuItems.forEach(item => {
      item.addEventListener('click', async e => {
        e.preventDefault();
        e.stopPropagation();

        const id = item.id.replace('mobile_', '');
        const type = item.dataset.type;
        const target = item.dataset.target;

        if (type === 'item' && target) {
          // Activar solo este subítem y desactivar los demás
          await this.activarSoloItem(id);
          // Cerrar el menú móvil
          this.cerrarMenuMovil();
          // Cargar la vista en el contenedor principal
          await this.cargarVista(id);
        }
      });
    });
  }

  /**
   * Activa solo un ítem y desactiva todos los demás
   * @param {string} itemId - ID del ítem a activar
   */
  async activarSoloItem(itemId) {
    // Desactivar todos los ítems primero
    const allMenuItems = await this.menuService.getMenuItems();

    // Desactivar todos los ítems top
    for (const item of allMenuItems.top) {
      item.setActive(false);
      // También desactivar todos los subítems
      for (const child of item.children) {
        child.setActive(false);
      }
    }

    // Desactivar todos los ítems bottom
    for (const item of allMenuItems.bottom) {
      item.setActive(false);
      // También desactivar todos los subítems
      for (const child of item.children) {
        child.setActive(false);
      }
    }

    // Activar solo el ítem seleccionado
    const selectedItem = await this.menuService.findItemById(itemId);
    if (selectedItem) {
      selectedItem.setActive(true);
      // Si tiene padre, también activarlo
      const parent = selectedItem.getParent();
      if (parent) {
        parent.setActive(true);
      }
    }

    // Actualizar la vista para reflejar los cambios
    this.actualizarVistaMenu();
  }

  /**
   * Activa un ítem sin desactivar otros (para submenús)
   * @param {string} itemId - ID del ítem a activar
   */
  async activarItem(itemId) {
    const selectedItem = await this.menuService.findItemById(itemId);
    if (selectedItem) {
      selectedItem.setActive(true);
      // Si tiene padre, también activarlo
      const parent = selectedItem.getParent();
      if (parent) {
        parent.setActive(true);
      }
    }
    this.actualizarVistaMenu();
  }

  /**
   * Actualiza la vista del menú para reflejar los estados activos
   */
  actualizarVistaMenu() {
    // Actualizar el menú de escritorio
    const desktopItems = this.sidebar.querySelectorAll('.menu-item');
    desktopItems.forEach(item => {
      const id = item.id;
      const menuItem =
        this.menuItems?.top.find(i => i.id === id) ||
        this.menuItems?.bottom.find(i => i.id === id);
      if (menuItem) {
        if (menuItem.isActive()) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      }
    });

    // Actualizar el menú móvil principal
    if (this.mobileMenuItems) {
      const mobileItems =
        this.mobileMenuItems.querySelectorAll('.mobile-menu-item');
      mobileItems.forEach(item => {
        const id = item.id.replace('mobile_', '');
        const menuItem =
          this.menuItems?.top.find(i => i.id === id) ||
          this.menuItems?.bottom.find(i => i.id === id);
        if (menuItem) {
          if (menuItem.isActive()) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        }
      });
    }

    // Actualizar subítems en el menú móvil
    const submenuItems = document.querySelectorAll(
      '.mobile-submenu-items .mobile-menu-item'
    );
    submenuItems.forEach(item => {
      const id = item.id.replace('mobile_', '');
      // Buscar en todos los subítems de todos los ítems
      let foundItem = null;
      for (const menuItem of [
        ...(this.menuItems?.top || []),
        ...(this.menuItems?.bottom || []),
      ]) {
        for (const child of menuItem.children) {
          if (child.id === id) {
            foundItem = child;
            break;
          }
        }
        if (foundItem) break;
      }

      if (foundItem) {
        if (foundItem.isActive()) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      }
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

  cambiarTema() {
    this.temaHelper.cambiarTema();
    this.actualizarIconoTema();
    // No activar el ítem tema, solo cambiar el tema
  }

  /**
   * Carga una vista en el contenedor principal
   * @param {string} id - ID del ítem del menú
   */
  async cargarVista(id) {
    try {
      // Obtener el ítem del menú para acceder a su target
      const menuItem = await this.menuService.findItemById(id);

      if (!menuItem) {
        console.error(`Ítem del menú no encontrado: ${id}`);
        return;
      }

      // Si tenemos un controlador de contenido, extraer el nombre del archivo del target
      if (this.controladorContenido) {
        // Extraer el nombre del archivo sin extensión del target
        let vistaName = '';

        if (menuItem.target) {
          // Obtener el nombre del archivo sin extensión
          const fileName = menuItem.target.split('/').pop(); // Obtener el último segmento
          vistaName = fileName.replace('.html', ''); // Remover la extensión
        } else {
          // Si no hay target, usar el ID sin el prefijo 'menu_'
          vistaName = id.replace('menu_', '');
        }

        console.log(
          `Cargando vista: ${vistaName} para el ítem: ${id} (target: ${menuItem.target})`
        );
        await this.controladorContenido.cargarVista(vistaName);
        return;
      }

      // Si no hay controlador de contenido, cargar directamente el HTML
      if (menuItem.target) {
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
          // Cargar el contenido HTML en el contenedor principal
          const response = await fetch(menuItem.target);
          if (!response.ok) {
            throw new Error(`Error al cargar ${menuItem.target}`);
          }
          const html = await response.text();
          mainContent.innerHTML = html;
        }
      } else {
        console.warn(`Ítem ${id} no tiene target definido`);
      }
    } catch (error) {
      console.error('Error al cargar la vista:', error);
    }
  }

  /**
   * Obtiene información del estado actual del controlador
   * @returns {Object}
   */
  getControllerState() {
    return {
      isInSubmenu: this.isInSubmenu,
      itemActivo: this.itemActivo,
      hasMenuItems: !!this.menuItems,
      menuViewState: this.menuView.getViewState(),
      mobileMenuActive: this.mobileMenu?.classList.contains('active') || false,
    };
  }

  /**
   * Valida la estructura del menú y reporta problemas
   * @returns {Promise<Object>}
   */
  async validateMenuStructure() {
    try {
      const errors = await this.menuService.validateMenuStructure();
      const stats = await this.menuService.getMenuStats();

      return {
        isValid: errors.length === 0,
        errors,
        stats,
        domValid: this.menuView.validateDOM(),
      };
    } catch (error) {
      console.error('Error al validar estructura del menú:', error);
      return {
        isValid: false,
        errors: [error.message],
        stats: null,
        domValid: false,
      };
    }
  }
}
