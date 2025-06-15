class ControladorMenu {
  constructor() {
    this.config = Configuracion.cargar();
    this.sidebar = document.getElementById('sidebar');
    this.mobileMenu = document.querySelector('.mobile-menu');
    this.mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    this.mobileMenuItems = document.querySelector('.mobile-menu-items');
    this.usuario = this.config.usuario;
  }

  async cargarMenu() {
    // Ordenar menú por orden
    const menuOrdenado = this.config.menu.sort((a, b) => a.orden - b.orden);

    // Generar HTML del menú lateral
    let menuHTML = `
      <div class="sidebar-logo">
        <img src="assets/img/logo-saia.png" alt="Logo">
      </div>
    `;

    menuHTML += menuOrdenado.map(item => item.toHTML()).join('');

    // Agregar botón de configuración al final
    menuHTML += `
            <div class="menu-item" 
                 id="menu_config" 
                 data-tooltip="Configuración"
                 style="margin-top: auto;">
                <i class="fas fa-cog"></i>
            </div>
        `;

    // Actualizar sidebar
    this.sidebar.innerHTML = menuHTML;

    // Generar HTML del menú móvil
    let mobileMenuHTML = menuOrdenado
      .map(
        item => `
            <a href="#" class="mobile-menu-item" id="mobile_${item.id}">
                <i class="fas ${item.icono}"></i>
                <span>${item.titulo}</span>
            </a>
        `
      )
      .join('');

    // Agregar configuración al menú móvil
    mobileMenuHTML += `
            <a href="#" class="mobile-menu-item" id="mobile_menu_config">
                <i class="fas fa-cog"></i>
                <span>Configuración</span>
            </a>
        `;

    // Actualizar menú móvil
    this.mobileMenuItems.innerHTML = mobileMenuHTML;

    // Actualizar información del usuario en el menú móvil
    this.actualizarInfoUsuario();

    // Agregar eventos
    this.agregarEventos();
  }

  actualizarInfoUsuario() {
    const mobileMenuHeader = this.mobileMenu.querySelector(
      '.mobile-menu-header'
    );
    mobileMenuHeader.querySelector('img').src = this.usuario.avatar;
    mobileMenuHeader.querySelector(
      '.user-name'
    ).textContent = `${this.usuario.nombre} ${this.usuario.apellidos}`;
    mobileMenuHeader.querySelector('.user-company').textContent =
      this.usuario.empresa;
  }

  agregarEventos() {
    // Eventos del menú lateral
    this.sidebar.addEventListener('click', e => {
      const menuItem = e.target.closest('.menu-item');
      if (!menuItem) return;

      const id = menuItem.id;
      if (id === 'menu_config') {
        this.abrirConfiguracion();
      } else {
        this.seleccionarItem(id);
      }
    });

    // Eventos del menú móvil
    this.mobileMenuToggle.addEventListener('click', () => {
      this.mobileMenu.classList.toggle('active');
    });

    this.mobileMenuItems.addEventListener('click', e => {
      const menuItem = e.target.closest('.mobile-menu-item');
      if (!menuItem) return;

      e.preventDefault();
      const id = menuItem.id.replace('mobile_', '');

      if (id === 'menu_config') {
        this.abrirConfiguracion();
      } else {
        this.seleccionarItem(id);
      }

      // Cerrar menú móvil después de seleccionar
      this.mobileMenu.classList.remove('active');
    });

    // Cerrar menú móvil al hacer clic fuera
    document.addEventListener('click', e => {
      if (
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
    this.mobileMenuItems.querySelectorAll('.mobile-menu-item').forEach(item => {
      item.classList.remove('active');
    });

    // Agregar clase active al item seleccionado
    const item = this.sidebar.querySelector(`#${id}`);
    const mobileItem = this.mobileMenuItems.querySelector(`#mobile_${id}`);
    if (item) item.classList.add('active');
    if (mobileItem) mobileItem.classList.add('active');
  }

  abrirConfiguracion() {
    // Aquí se implementará la lógica para abrir la configuración
    console.log('Abrir configuración');
  }

  actualizarVisibilidad(id, visible) {
    const item = this.config.menu.find(item => item.id === id);
    if (item) {
      item.visible = visible;
      this.config.guardar();
      this.cargarMenu();
    }
  }

  actualizarOrden(id, nuevoOrden) {
    const item = this.config.menu.find(item => item.id === id);
    if (item) {
      item.orden = nuevoOrden;
      this.config.guardar();
      this.cargarMenu();
    }
  }
}
