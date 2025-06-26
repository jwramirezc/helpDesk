/**
 * Clase para manejar la vista de Help Desk
 * Gestiona tickets, filtros, estadísticas y formularios
 * Consume datos desde archivo JSON externo
 */

class HelpDeskView {
  constructor() {
    console.log('=== CONSTRUCTOR HELPDESKVIEW ===');
    console.log('Configuración disponible:', !!helpdeskConfig);

    this.tickets = [];
    this.datosUsuario = null;
    this.filtros = {
      estado: '',
      categoria: '',
      busqueda: '',
    };
    this.paginaActual = 1;
    this.ticketsPorPagina = 10; // Valor por defecto
    this.modal = null;
    this.isInitialized = false;
    this.config = helpdeskConfig;
    this.bootstrapTable = null;
    this.intervaloActualizacion = null;

    console.log('HelpDeskView construida con configuración:', this.config);
  }

  /**
   * Inicializa la vista
   */
  init() {
    console.log('=== MÉTODO INIT EJECUTÁNDOSE ===');
    console.log('isInitialized actual:', this.isInitialized);

    if (this.isInitialized) {
      console.log('HelpDeskView ya está inicializada, saliendo...');
      return;
    }

    console.log('=== INICIALIZANDO HELPDESKVIEW ===');

    // Configurar eventos globales para Bootstrap Table
    console.log('Configurando eventos globales...');
    this.configurarEventosGlobales();

    // Configurar formatters globales para Bootstrap Table
    console.log('Configurando formatters globales...');
    this.configurarFormattersGlobales();

    console.log('Llamando a inicializar()...');
    this.inicializar();
    this.isInitialized = true;
    console.log('HelpDeskView marcada como inicializada');
  }

  /**
   * Configura eventos globales para Bootstrap Table
   */
  configurarEventosGlobales() {
    window.operateEvents = {
      'click .btn-outline-primary': (e, value, row, index) => {
        e.preventDefault();
        e.stopPropagation();
        this.verTicket(row.id);
      },
      'click .btn-outline-warning': (e, value, row, index) => {
        e.preventDefault();
        e.stopPropagation();
        this.editarTicket(row.id);
      },
      'click .btn-outline-danger': (e, value, row, index) => {
        e.preventDefault();
        e.stopPropagation();
        this.eliminarTicket(row.id);
      },
    };
  }

  /**
   * Configura formatters globales para Bootstrap Table
   */
  configurarFormattersGlobales() {
    // Formatters usando la configuración centralizada
    const formatters = this.config.formatters;

    window.idFormatter = formatters.id;
    window.asuntoFormatter = formatters.asunto;
    window.categoriaFormatter = formatters.categoria;
    window.estadoFormatter = formatters.estado;
    window.fechaFormatter = formatters.fecha;
    window.departamentoFormatter = formatters.departamento;

    // Formatter para acciones (vacío ya que no se usan)
    window.operateFormatter = function (value, row, index) {
      return '';
    };
  }

  /**
   * Inicializa la vista (método interno)
   */
  async inicializar() {
    console.log('=== MÉTODO INICIALIZAR EJECUTÁNDOSE ===');
    console.log('Estado de inicialización:', this.isInitialized);
    console.log('Configuración disponible:', !!this.config);
    console.log('URL de datos:', this.config ? this.config.datos.url : 'N/A');

    try {
      // Probar acceso al JSON primero
      console.log('Iniciando prueba de acceso JSON...');
      const accesoExitoso = await this.probarAccesoJSON();
      console.log('Resultado de prueba de acceso:', accesoExitoso);

      if (!accesoExitoso) {
        console.error('No se pudo acceder al archivo JSON');
        this.mostrarError(
          'No se pudo cargar los datos. Verifique la conexión.'
        );
        return;
      }

      console.log('Cargando datos iniciales...');
      await this.cargarDatosIniciales();

      console.log('Cargando filtros...');
      this.cargarFiltros();

      console.log('Agregando eventos...');
      this.agregarEventos();

      console.log('Cargando tickets...');
      await this.cargarTickets();

      // Intentar inicializar Bootstrap Table, pero usar tabla simple como fallback
      console.log('Intentando inicializar Bootstrap Table...');
      try {
        this.inicializarBootstrapTable();
      } catch (error) {
        console.log(
          'Error al inicializar Bootstrap Table, usando tabla simple:',
          error.message
        );
        this.renderizarTablaSimple();
      }

      console.log('Configurando actualización automática...');
      this.configurarActualizacionAutomatica();

      console.log('=== INICIALIZACIÓN COMPLETADA ===');
    } catch (error) {
      console.error('Error durante la inicialización:', error);
      this.mostrarError('Error al inicializar la vista: ' + error.message);
    }
  }

  /**
   * Prueba el acceso al archivo JSON
   */
  async probarAccesoJSON() {
    try {
      console.log('Probando acceso a:', this.config.datos.url);
      const response = await fetch(this.config.datos.url);

      if (!response.ok) {
        console.error('Error HTTP:', response.status, response.statusText);
        return false;
      }

      const data = await response.json();
      console.log('Acceso JSON exitoso, datos recibidos:', !!data);
      return !!data;
    } catch (error) {
      console.error('Error al acceder al JSON:', error);
      return false;
    }
  }

  /**
   * Carga los datos iniciales desde el JSON
   */
  async cargarDatosIniciales() {
    try {
      console.log('Cargando datos desde:', this.config.datos.url);
      const response = await fetch(this.config.datos.url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Datos cargados:', data);

      this.tickets = data.tickets || [];
      this.datosUsuario = data.usuario || null;

      // Actualizar estadísticas
      if (data.resumen) {
        this.actualizarEstadisticas(data.resumen);
      }

      console.log('Datos iniciales cargados exitosamente');
      console.log('Tickets cargados:', this.tickets.length);
      console.log('Usuario:', this.datosUsuario);
    } catch (error) {
      console.error('Error al cargar datos iniciales:', error);
      throw error;
    }
  }

  /**
   * Carga los filtros con las opciones de la configuración
   */
  cargarFiltros() {
    console.log('Cargando filtros...');
    this.cargarFiltroEstados();
    this.cargarFiltroCategorias();
    this.cargarOpcionesFormulario();
  }

  /**
   * Carga las opciones del filtro de estados
   */
  cargarFiltroEstados() {
    const selectEstado = document.getElementById('filtro-estado');
    if (!selectEstado) return;

    const opciones = this.config.opciones.estados;
    selectEstado.innerHTML = opciones
      .map(opcion => `<option value="${opcion.value}">${opcion.label}</option>`)
      .join('');
  }

  /**
   * Carga las opciones del filtro de categorías
   */
  cargarFiltroCategorias() {
    const selectCategoria = document.getElementById('filtro-categoria');
    if (!selectCategoria) return;

    const opciones = this.config.opciones.categorias;
    selectCategoria.innerHTML = opciones
      .map(opcion => `<option value="${opcion.value}">${opcion.label}</option>`)
      .join('');
  }

  /**
   * Carga las opciones del formulario
   */
  cargarOpcionesFormulario() {
    this.cargarOpcionesCategoria();
    this.cargarOpcionesDepartamento();
    this.cargarOpcionesEstado();
  }

  /**
   * Carga las opciones de categoría en el formulario
   */
  cargarOpcionesCategoria() {
    const selectCategoria = document.getElementById('ticket-categoria');
    if (!selectCategoria) return;

    const opciones = this.config.opciones.categorias.filter(
      opcion => opcion.value !== ''
    );
    selectCategoria.innerHTML =
      '<option value="">Seleccionar...</option>' +
      opciones
        .map(
          opcion => `<option value="${opcion.value}">${opcion.label}</option>`
        )
        .join('');
  }

  /**
   * Carga las opciones de departamento en el formulario
   */
  cargarOpcionesDepartamento() {
    const selectDepartamento = document.getElementById('ticket-departamento');
    if (!selectDepartamento) return;

    const opciones = this.config.opciones.departamentos.filter(
      opcion => opcion.value !== ''
    );
    selectDepartamento.innerHTML =
      '<option value="">Seleccionar...</option>' +
      opciones
        .map(
          opcion => `<option value="${opcion.value}">${opcion.label}</option>`
        )
        .join('');
  }

  /**
   * Carga las opciones de estado en el formulario
   */
  cargarOpcionesEstado() {
    const selectEstado = document.getElementById('ticket-estado');
    if (!selectEstado) return;

    const opciones = this.config.opciones.estados.filter(
      opcion => opcion.value !== ''
    );
    selectEstado.innerHTML =
      '<option value="">Seleccionar...</option>' +
      opciones
        .map(
          opcion => `<option value="${opcion.value}">${opcion.label}</option>`
        )
        .join('');
  }

  /**
   * Agrega todos los eventos necesarios
   */
  agregarEventos() {
    this.agregarEventosBotones();
    this.agregarEventosFiltros();
    this.agregarEventosBusqueda();
    this.agregarEventosFormulario();
  }

  /**
   * Agrega eventos a los botones principales
   */
  agregarEventosBotones() {
    // Botón nuevo ticket
    const btnNuevoTicket = document.getElementById('nuevo-ticket-btn');
    if (btnNuevoTicket) {
      btnNuevoTicket.addEventListener('click', () =>
        this.abrirModalNuevoTicket()
      );
    }

    // Botón guardar ticket
    const btnGuardarTicket = document.getElementById('btn-guardar-ticket');
    if (btnGuardarTicket) {
      btnGuardarTicket.addEventListener('click', () =>
        this.guardarNuevoTicket()
      );
    }
  }

  /**
   * Agrega eventos a los filtros
   */
  agregarEventosFiltros() {
    const filtroEstado = document.getElementById('filtro-estado');
    const filtroCategoria = document.getElementById('filtro-categoria');

    if (filtroEstado) {
      filtroEstado.addEventListener('change', e => {
        this.filtros.estado = e.target.value;
        this.filtrarTickets();
      });
    }

    if (filtroCategoria) {
      filtroCategoria.addEventListener('change', e => {
        this.filtros.categoria = e.target.value;
        this.filtrarTickets();
      });
    }
  }

  /**
   * Agrega eventos de búsqueda
   */
  agregarEventosBusqueda() {
    const buscarTicket = document.getElementById('buscar-ticket');
    if (!buscarTicket) return;

    let timeoutId;
    buscarTicket.addEventListener('input', e => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        this.filtros.busqueda = e.target.value;
        this.filtrarTickets();
      }, this.config.busqueda.tiempoDebounce);
    });
  }

  /**
   * Agrega eventos al formulario
   */
  agregarEventosFormulario() {
    const form = document.getElementById('form-nuevo-ticket');
    if (!form) return;

    // Validación en tiempo real
    const campos = [
      'ticket-asunto',
      'ticket-categoria',
      'ticket-estado',
      'ticket-descripcion',
    ];
    campos.forEach(campoId => {
      const campo = document.getElementById(campoId);
      if (campo) {
        campo.addEventListener('blur', () => this.validarCampo(campoId));
        campo.addEventListener('input', () => this.validarCampo(campoId));
      }
    });
  }

  /**
   * Valida un campo del formulario
   */
  validarCampo(campoId) {
    const campo = document.getElementById(campoId);
    if (!campo) return;

    const valor = campo.value.trim();
    let esValido = true;
    let mensaje = '';

    switch (campoId) {
      case 'ticket-asunto':
        if (valor.length < 5) {
          esValido = false;
          mensaje = 'El asunto debe tener al menos 5 caracteres';
        }
        break;
      case 'ticket-categoria':
        if (!valor) {
          esValido = false;
          mensaje = 'Debe seleccionar una categoría';
        }
        break;
      case 'ticket-estado':
        if (!valor) {
          esValido = false;
          mensaje = 'Debe seleccionar un estado';
        }
        break;
      case 'ticket-descripcion':
        if (valor.length < 10) {
          esValido = false;
          mensaje = 'La descripción debe tener al menos 10 caracteres';
        }
        break;
    }

    this.mostrarValidacionCampo(campo, esValido, mensaje);
    return esValido;
  }

  /**
   * Muestra la validación de un campo
   */
  mostrarValidacionCampo(elemento, esValido, mensaje) {
    elemento.classList.remove('is-valid', 'is-invalid');
    elemento.classList.add(esValido ? 'is-valid' : 'is-invalid');

    // Remover mensajes anteriores
    const feedbackAnterior = elemento.parentNode.querySelector(
      '.valid-feedback, .invalid-feedback'
    );
    if (feedbackAnterior) {
      feedbackAnterior.remove();
    }

    // Agregar nuevo mensaje si es necesario
    if (!esValido && mensaje) {
      const feedback = document.createElement('div');
      feedback.className = 'invalid-feedback';
      feedback.textContent = mensaje;
      elemento.parentNode.appendChild(feedback);
    }
  }

  /**
   * Carga los tickets y los renderiza
   */
  async cargarTickets() {
    try {
      console.log('Cargando tickets...');

      if (this.tickets.length === 0) {
        console.log('No hay tickets para cargar');
        this.renderizarTabla();
        return;
      }

      console.log('Tickets disponibles:', this.tickets.length);
      this.renderizarTabla();
    } catch (error) {
      console.error('Error al cargar tickets:', error);
      this.mostrarError('Error al cargar los tickets: ' + error.message);
    }
  }

  /**
   * Verifica las dependencias necesarias
   */
  verificarDependencias() {
    console.log('Verificando dependencias...');

    const dependencias = {
      jquery: typeof $ !== 'undefined',
      bootstrap: typeof bootstrap !== 'undefined',
      bootstrapTable: typeof $.fn.bootstrapTable !== 'undefined',
    };

    console.log('Estado de dependencias:', dependencias);

    if (!dependencias.jquery) {
      console.error('jQuery no está disponible');
      return false;
    }

    if (!dependencias.bootstrap) {
      console.error('Bootstrap no está disponible');
      return false;
    }

    if (!dependencias.bootstrapTable) {
      console.error('Bootstrap Table no está disponible');
      return false;
    }

    console.log('Todas las dependencias están disponibles');
    return true;
  }

  /**
   * Inicializa Bootstrap Table
   */
  inicializarBootstrapTable() {
    console.log('=== INICIALIZANDO BOOTSTRAP TABLE ===');

    // Verificar dependencias
    if (!this.verificarDependencias()) {
      throw new Error('Dependencias no disponibles');
    }

    const tabla = document.getElementById('tabla-tickets-bootstrap');
    if (!tabla) {
      throw new Error('Tabla Bootstrap no encontrada');
    }

    // Ocultar tabla temporal
    const tablaTemporal = document.getElementById('tabla-temporal');
    if (tablaTemporal) {
      tablaTemporal.style.display = 'none';
    }

    // Mostrar contenedor de Bootstrap Table
    const container = document.getElementById('bootstrap-table-container');
    if (container) {
      container.style.display = 'block';
    }

    // Configurar Bootstrap Table
    const config = this.config.bootstrapTable.configuracion;
    const opciones = {
      ...config,
      data: this.tickets,
      columns: this.config.columnas.map(col => ({
        field: col.key,
        title: col.label,
        sortable: col.sortable,
        width: col.width,
        visible: col.visible,
        formatter: this.config.formatters[col.key],
      })),
    };

    console.log('Configuración Bootstrap Table:', opciones);

    // Inicializar Bootstrap Table
    $(tabla).bootstrapTable(opciones);

    this.bootstrapTable = $(tabla);
    console.log('Bootstrap Table inicializado exitosamente');
  }

  /**
   * Renderiza la tabla (método principal)
   */
  renderizarTabla() {
    console.log('Renderizando tabla...');

    if (this.bootstrapTable) {
      console.log('Actualizando Bootstrap Table...');
      this.bootstrapTable.bootstrapTable('load', this.tickets);
    } else {
      console.log('Usando tabla simple...');
      this.renderizarTablaSimple();
    }
  }

  /**
   * Renderiza la tabla simple (fallback)
   */
  renderizarTablaSimple() {
    console.log('Renderizando tabla simple...');

    const tbody = document.getElementById('tickets-tbody');
    if (!tbody) {
      console.error('Tbody no encontrado');
      return;
    }

    if (this.tickets.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center text-muted py-4">
            <i class="fas fa-inbox fa-2x mb-2"></i>
            <p>No hay tickets disponibles</p>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = this.tickets
      .map(ticket => this.generarFilaTabla(ticket))
      .join('');
  }

  /**
   * Genera una fila de tabla para un ticket
   */
  generarFilaTabla(ticket) {
    return `
      <tr>
        <td><span class="badge bg-secondary">${ticket.id}</span></td>
        <td>
          <div class="ticket-asunto">
            <strong>${ticket.asunto}</strong>
            <small class="text-muted d-block">${
              ticket.descripcion
                ? ticket.descripcion.substring(0, 50) + '...'
                : ''
            }</small>
          </div>
        </td>
        <td><span class="badge bg-info">${ticket.categoria}</span></td>
        <td>${this.formatearEstado(ticket.estado)}</td>
        <td><small class="text-muted">${new Date(
          ticket.fecha
        ).toLocaleDateString('es-ES')}</small></td>
        <td><span class="text-muted">${ticket.departamento}</span></td>
      </tr>
    `;
  }

  /**
   * Formatea el estado de un ticket
   */
  formatearEstado(estado) {
    const clases = {
      Pendiente: 'bg-warning',
      'En Proceso': 'bg-info',
      Resuelto: 'bg-success',
      Cerrado: 'bg-secondary',
    };
    return `<span class="badge ${
      clases[estado] || 'bg-secondary'
    }">${estado}</span>`;
  }

  /**
   * Filtra los tickets según los criterios establecidos
   */
  filtrarTickets() {
    console.log('Filtrando tickets...');
    console.log('Filtros actuales:', this.filtros);

    let ticketsFiltrados = [...this.tickets];

    // Filtro por estado
    if (this.filtros.estado) {
      ticketsFiltrados = ticketsFiltrados.filter(
        ticket => ticket.estado === this.filtros.estado
      );
    }

    // Filtro por categoría
    if (this.filtros.categoria) {
      ticketsFiltrados = ticketsFiltrados.filter(
        ticket => ticket.categoria === this.filtros.categoria
      );
    }

    // Filtro por búsqueda
    if (this.filtros.busqueda) {
      const busqueda = this.filtros.busqueda.toLowerCase();
      ticketsFiltrados = ticketsFiltrados.filter(ticket =>
        this.config.busqueda.campos.some(
          campo =>
            ticket[campo] &&
            ticket[campo].toString().toLowerCase().includes(busqueda)
        )
      );
    }

    console.log('Tickets filtrados:', ticketsFiltrados.length);

    // Actualizar tabla con tickets filtrados
    if (this.bootstrapTable) {
      this.bootstrapTable.bootstrapTable('load', ticketsFiltrados);
    } else {
      this.tickets = ticketsFiltrados;
      this.renderizarTablaSimple();
    }
  }

  /**
   * Aplica los filtros actuales
   */
  aplicarFiltros() {
    this.filtrarTickets();
  }

  /**
   * Actualiza las estadísticas mostradas
   */
  actualizarEstadisticas(stats) {
    console.log('Actualizando estadísticas:', stats);

    const elementos = {
      pendientes: document.getElementById('tickets-pendientes'),
      proceso: document.getElementById('tickets-proceso'),
      resueltos: document.getElementById('tickets-resueltos'),
    };

    if (elementos.pendientes) {
      elementos.pendientes.textContent = stats.pendientes || 0;
    }
    if (elementos.proceso) {
      elementos.proceso.textContent = stats.enProceso || 0;
    }
    if (elementos.resueltos) {
      elementos.resueltos.textContent = stats.resueltos || 0;
    }
  }

  /**
   * Configura la actualización automática
   */
  configurarActualizacionAutomatica() {
    if (!this.config.datos.actualizacionAutomatica) {
      console.log('Actualización automática deshabilitada');
      return;
    }

    console.log(
      'Configurando actualización automática cada',
      this.config.datos.intervaloActualizacion,
      'ms'
    );

    this.intervaloActualizacion = setInterval(async () => {
      console.log('Actualización automática ejecutándose...');
      await this.refrescarTickets();
    }, this.config.datos.intervaloActualizacion);
  }

  /**
   * Abre el modal para crear un nuevo ticket
   */
  abrirModalNuevoTicket() {
    console.log('Abriendo modal nuevo ticket...');

    if (!this.modal) {
      this.modal = new bootstrap.Modal(
        document.getElementById('modal-nuevo-ticket')
      );
    }

    this.limpiarFormulario();
    this.modal.show();
  }

  /**
   * Guarda un nuevo ticket
   */
  async guardarNuevoTicket() {
    console.log('Guardando nuevo ticket...');

    // Validar formulario
    const campos = [
      'ticket-asunto',
      'ticket-categoria',
      'ticket-estado',
      'ticket-descripcion',
    ];
    const camposValidos = campos.every(campo => this.validarCampo(campo));

    if (!camposValidos) {
      this.mostrarError(
        'Por favor, complete todos los campos requeridos correctamente'
      );
      return;
    }

    // Obtener datos del formulario
    const nuevoTicket = {
      id: `TKT-${Date.now()}`,
      asunto: document.getElementById('ticket-asunto').value.trim(),
      descripcion: document.getElementById('ticket-descripcion').value.trim(),
      categoria: document.getElementById('ticket-categoria').value,
      estado: document.getElementById('ticket-estado').value,
      departamento:
        document.getElementById('ticket-departamento').value || 'IT',
      fecha: new Date().toISOString(),
      usuario: this.datosUsuario ? this.datosUsuario.nombre : 'Usuario',
    };

    console.log('Nuevo ticket a guardar:', nuevoTicket);

    try {
      // Agregar a la lista local
      this.tickets.unshift(nuevoTicket);

      // Actualizar tabla
      this.renderizarTabla();

      // Cerrar modal
      if (this.modal) {
        this.modal.hide();
      }

      // Mostrar mensaje de éxito
      this.mostrarExito('Ticket creado exitosamente');

      // Limpiar formulario
      this.limpiarFormulario();
    } catch (error) {
      console.error('Error al guardar ticket:', error);
      this.mostrarError('Error al crear el ticket: ' + error.message);
    }
  }

  /**
   * Limpia el formulario de nuevo ticket
   */
  limpiarFormulario() {
    const campos = [
      'ticket-asunto',
      'ticket-categoria',
      'ticket-departamento',
      'ticket-estado',
      'ticket-descripcion',
      'ticket-adjuntos',
    ];

    campos.forEach(campoId => {
      const campo = document.getElementById(campoId);
      if (campo) {
        campo.value = '';
        campo.classList.remove('is-valid', 'is-invalid');

        // Remover mensajes de validación
        const feedback = campo.parentNode.querySelector(
          '.valid-feedback, .invalid-feedback'
        );
        if (feedback) {
          feedback.remove();
        }
      }
    });
  }

  /**
   * Refresca los tickets
   */
  async refrescarTickets() {
    console.log('Refrescando tickets...');

    try {
      await this.cargarDatosIniciales();
      this.renderizarTabla();
      console.log('Tickets refrescados exitosamente');
    } catch (error) {
      console.error('Error al refrescar tickets:', error);
    }
  }

  /**
   * Exporta los tickets
   */
  exportarTickets() {
    console.log('Exportando tickets...');

    if (this.tickets.length === 0) {
      this.mostrarError('No hay tickets para exportar');
      return;
    }

    const csv = this.convertirACSV(this.tickets);
    const nombreArchivo =
      this.config.bootstrapTable.configuracion.exportOptions.fileName ||
      'mis-tickets';

    this.descargarArchivo(csv, `${nombreArchivo}.csv`, 'text/csv');
    this.mostrarExito('Tickets exportados exitosamente');
  }

  /**
   * Convierte los tickets a formato CSV
   */
  convertirACSV(tickets) {
    const headers = [
      'ID',
      'Asunto',
      'Categoría',
      'Estado',
      'Fecha',
      'Departamento',
      'Usuario',
    ];
    const rows = tickets.map(ticket => [
      ticket.id,
      ticket.asunto,
      ticket.categoria,
      ticket.estado,
      new Date(ticket.fecha).toLocaleDateString('es-ES'),
      ticket.departamento,
      ticket.usuario,
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    return csvContent;
  }

  /**
   * Descarga un archivo
   */
  descargarArchivo(contenido, nombre, tipo) {
    const blob = new Blob([contenido], { type: tipo });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nombre;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Muestra un mensaje de éxito
   */
  mostrarExito(mensaje) {
    if (!this.config.notificaciones.mostrarExito) return;

    console.log('Éxito:', mensaje);

    // Crear notificación
    const notificacion = document.createElement('div');
    notificacion.className =
      'alert alert-success alert-dismissible fade show position-fixed';
    notificacion.style.cssText = `
      top: 20px;
      right: 20px;
      z-index: 9999;
      min-width: 300px;
    `;
    notificacion.innerHTML = `
      <i class="fas fa-check-circle me-2"></i>
      ${mensaje}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.body.appendChild(notificacion);

    // Auto-remover después del tiempo configurado
    setTimeout(() => {
      if (notificacion.parentNode) {
        notificacion.remove();
      }
    }, this.config.notificaciones.duracion);
  }

  /**
   * Muestra un mensaje de error
   */
  mostrarError(mensaje) {
    if (!this.config.notificaciones.mostrarError) return;

    console.error('Error:', mensaje);

    // Crear notificación
    const notificacion = document.createElement('div');
    notificacion.className =
      'alert alert-danger alert-dismissible fade show position-fixed';
    notificacion.style.cssText = `
      top: 20px;
      right: 20px;
      z-index: 9999;
      min-width: 300px;
    `;
    notificacion.innerHTML = `
      <i class="fas fa-exclamation-triangle me-2"></i>
      ${mensaje}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.body.appendChild(notificacion);

    // Auto-remover después del tiempo configurado
    setTimeout(() => {
      if (notificacion.parentNode) {
        notificacion.remove();
      }
    }, this.config.notificaciones.duracion);
  }

  /**
   * Capitaliza una cadena
   */
  capitalizar(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  /**
   * Métodos placeholder para acciones futuras
   */
  verTicket(id) {
    console.log('Ver ticket:', id);
    this.mostrarExito(`Viendo ticket ${id}`);
  }

  editarTicket(id) {
    console.log('Editar ticket:', id);
    this.mostrarExito(`Editando ticket ${id}`);
  }

  eliminarTicket(id) {
    console.log('Eliminar ticket:', id);
    this.mostrarExito(`Eliminando ticket ${id}`);
  }

  /**
   * Destruye la vista y limpia recursos
   */
  destruir() {
    console.log('Destruyendo HelpDeskView...');

    // Limpiar intervalo de actualización
    if (this.intervaloActualizacion) {
      clearInterval(this.intervaloActualizacion);
      this.intervaloActualizacion = null;
    }

    // Destruir Bootstrap Table si existe
    if (this.bootstrapTable) {
      this.bootstrapTable.bootstrapTable('destroy');
      this.bootstrapTable = null;
    }

    // Destruir modal si existe
    if (this.modal) {
      this.modal.dispose();
      this.modal = null;
    }

    this.isInitialized = false;
    console.log('HelpDeskView destruida');
  }
}

// Exportar para uso global
window.HelpDeskView = HelpDeskView;
