class ControladorContenido {
  constructor(controladorUsuario) {
    this.controladorUsuario = controladorUsuario;
    this.mainContent = document.getElementById('main-content');
  }

  inicializar() {
    this.cargarContenidoInicial();
    this.inicializarEventos();
  }

  cargarContenidoInicial() {
    const usuario = this.controladorUsuario.obtenerUsuarioActual();

    this.mainContent.innerHTML = `
      <div class="container">
        <div class="row">
          <div class="col-12">
            <h3>Bienvenido al Portal HELP DESK</h3>
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

  inicializarEventos() {
    // TODO: Implementar eventos específicos del contenido
  }

  cargarVista(vista) {
    // TODO: Implementar carga dinámica de vistas
    console.log('Cargando vista:', vista);
  }
}
