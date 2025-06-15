// Clase principal de la aplicación
class App {
  constructor() {
    this.controladorUsuario = new ControladorUsuario();
    this.controladorMenu = new ControladorMenu();
    this.temaHelper = new TemaHelper();
    this.tooltipHelper = new TooltipHelper();
  }

  async inicializar() {
    console.log('Inicializando aplicación...');

    // Cargar tema
    this.temaHelper.aplicarTema();
    console.log('Tema aplicado:', this.temaHelper.obtenerTemaActual());

    // Cargar sidebar
    this.cargarSidebar();
    console.log('Sidebar cargado');

    // Cargar menú
    await this.controladorMenu.cargarMenu();
    console.log('Menú cargado');

    // Cargar header
    await this.cargarHeader();
    console.log('Header cargado');

    // Inicializar tooltips
    this.tooltipHelper.inicializarTooltips();
    console.log('Tooltips inicializados');

    // Cargar contenido inicial
    this.cargarContenidoInicial();
    console.log('Contenido inicial cargado');
  }

  async cargarHeader() {
    const header = document.getElementById('header');
    const usuario = this.controladorUsuario.obtenerUsuarioActual();
    console.log('Usuario actual:', usuario);

    header.innerHTML = `
            <div class="user-info">
                <div class="notifications">
                    <i class="fas fa-bell"></i>
                    <span class="notification-badge">0</span>
                </div>
                <div class="user-details">
                    <span class="user-name">${usuario.nombre} ${usuario.apellidos}</span>
                    <span class="user-company">${usuario.empresa}</span>
                </div>
                <div class="user-avatar">
                    <img src="${usuario.avatar}" alt="Avatar">
                </div>
            </div>
        `;
  }

  cargarContenidoInicial() {
    const mainContent = document.getElementById('main-content');
    const usuario = this.controladorUsuario.obtenerUsuarioActual();

    mainContent.innerHTML = `
            <div class="container">
                <div class="row">
                    <div class="col-12">
                        <h1>Bienvenido al Portal HELP DESK</h1>
                        <p>Seleccione una opción del menú para comenzar.</p>
                    </div>
                </div>
                <div class="row mt-4">
                    <div class="col-12">
                        <div class="card">
                            <div class="card-header">
                                <h5>Información del Usuario</h5>
                            </div>
                            <div class="card-body">
                                <p><strong>Nombre:</strong> ${usuario.nombre} ${usuario.apellidos}</p>
                                <p><strong>Empresa:</strong> ${usuario.empresa}</p>
                                <p><strong>Teléfono:</strong> ${usuario.telefono}</p>
                                <p><strong>ID:</strong> ${usuario.id}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
  }

  cargarSidebar() {
    const sidebar = document.getElementById('sidebar');
    console.log('Sidebar element:', sidebar);

    if (!sidebar) {
      console.error('No se encontró el elemento sidebar');
      return;
    }

    sidebar.innerHTML = `
      <div class="sidebar-logo">
        <img src="assets/img/logo-saia.png" alt="Logo">
      </div>
      <div class="menu-item" data-tooltip="Dashboard">
        <i class="fas fa-home"></i>
      </div>
      <div class="menu-item" data-tooltip="Tickets">
        <i class="fas fa-ticket-alt"></i>
      </div>
      <div class="menu-item" data-tooltip="Usuarios">
        <i class="fas fa-users"></i>
      </div>
      <div class="menu-item" data-tooltip="Configuración">
        <i class="fas fa-cog"></i>
      </div>
    `;

    // Verificar si el logo se cargó correctamente
    const logoImg = sidebar.querySelector('.sidebar-logo img');
    console.log('Logo image element:', logoImg);

    if (logoImg) {
      logoImg.onload = () => console.log('Logo cargado correctamente');
      logoImg.onerror = () => console.error('Error al cargar el logo');
    }
  }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM cargado, iniciando aplicación...');
  const app = new App();
  app.inicializar();
});
