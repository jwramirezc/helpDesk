class ControladorContenido {
  constructor(controladorUsuario) {
    this.controladorUsuario = controladorUsuario;
    this.mainContent = document.getElementById('main-content');
    this.vistaActual = null; // Para mantener referencia a la vista activa
    this.cssCargado = null; // Para rastrear qué CSS está cargado
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
                <p><strong>Nombre:</strong> ${usuario.nombreCompleto}</p>
                <p><strong>Empresa:</strong> ${usuario.empresa}</p>
                <p><strong>Teléfono:</strong> ${usuario.telefono}</p>
                <p><strong>ID:</strong> ${usuario.id}</p>
                <p><strong>Iniciales:</strong> ${usuario.iniciales}</p>
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

  /**
   * Carga una vista específica
   * @param {string} vista - Nombre de la vista a cargar
   */
  async cargarVista(vista) {
    try {
      // 1. Cargar el HTML usando AppConfig
      const viewPath = AppConfig.getViewPath(vista);
      const response = await fetch(viewPath);
      if (!response.ok) {
        throw new Error(`Vista '${vista}' no encontrada`);
      }

      const html = await response.text();
      this.mainContent.innerHTML = html;

      // 2. Cargar CSS específico de la vista usando AppConfig
      await this.cargarCSSVista(vista);

      // 3. Cargar e inicializar la clase JS correspondiente
      await this.cargarVistaJS(vista);
    } catch (error) {
      console.error('Error al cargar vista:', error);
      this.mainContent.innerHTML = `
        <div class="container">
          <div class="alert alert-danger" role="alert">
            <h4 class="alert-heading">Error al cargar la vista</h4>
            <p>No se pudo cargar la vista: <strong>${vista}</strong></p>
            <hr>
            <p class="mb-0">Detalles del error: ${error.message}</p>
          </div>
        </div>
      `;
    }
  }

  /**
   * Carga CSS específico de la vista
   * @param {string} vista - Nombre de la vista
   */
  async cargarCSSVista(vista) {
    // Remover CSS anterior si existe
    if (this.cssCargado) {
      const linkAnterior = document.querySelector(
        `link[data-vista="${this.cssCargado}"]`
      );
      if (linkAnterior) {
        linkAnterior.remove();
      }
    }

    // Cargar nuevo CSS usando AppConfig
    const stylePath = AppConfig.getStylePath(vista);

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = stylePath;
    link.setAttribute('data-vista', vista);

    // Solo agregar si el archivo existe
    try {
      const response = await fetch(link.href, { method: 'HEAD' });
      if (response.ok) {
        document.head.appendChild(link);
        this.cssCargado = vista;
      } else {
        console.warn(
          `ControladorContenido: CSS no encontrado para vista ${vista}, usando estilos por defecto`
        );
      }
    } catch (error) {
      console.error(
        `ControladorContenido: Error al cargar CSS para vista ${vista}:`,
        error
      );
    }
  }

  /**
   * Carga e inicializa la clase JS correspondiente a la vista
   * @param {string} vista - Nombre de la vista
   */
  async cargarVistaJS(vista) {
    // Usar configuración centralizada de ViewConfig
    const nombreClase = ViewConfig.VIEW_CLASSES[vista];

    if (nombreClase && window[nombreClase]) {
      try {
        // Limpiar vista anterior si existe
        if (this.vistaActual && this.vistaActual.destruir) {
          this.vistaActual.destruir();
        }

        // Crear nueva instancia
        this.vistaActual = new window[nombreClase]();

        // Inicializar la vista si tiene método init
        if (
          this.vistaActual.init &&
          typeof this.vistaActual.init === 'function'
        ) {
          await this.vistaActual.init();
        }
      } catch (error) {
        console.error(
          `ControladorContenido: Error al inicializar vista JS ${nombreClase}:`,
          error
        );

        // Mostrar error en la interfaz
        this.mainContent.innerHTML += `
          <div class="alert alert-warning mt-3" role="alert">
            <h6>Advertencia</h6>
            <p>La vista se cargó pero hubo un problema al inicializar la funcionalidad JavaScript.</p>
            <small>Error: ${error.message}</small>
          </div>
        `;
      }
    } else {
      console.warn(
        `ControladorContenido: Clase ${nombreClase} no encontrada para vista ${vista}`
      );

      // Mostrar advertencia en la interfaz
      this.mainContent.innerHTML += `
        <div class="alert alert-info mt-3" role="alert">
          <h6>Información</h6>
          <p>La vista se cargó correctamente pero no tiene funcionalidad JavaScript específica.</p>
        </div>
      `;
    }
  }

  /**
   * Método para limpiar recursos cuando se destruye el controlador
   */
  destruir() {
    if (this.vistaActual && this.vistaActual.destruir) {
      this.vistaActual.destruir();
    }

    // Limpiar CSS cargado
    if (this.cssCargado) {
      const link = document.querySelector(
        `link[data-vista="${this.cssCargado}"]`
      );
      if (link) {
        link.remove();
      }
    }
  }
}
