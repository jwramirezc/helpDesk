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
    this.ticketsPorPagina = 10;
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

      console.log('Generando headers de tabla...');
      this.generarHeadersTabla();

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
   * Genera los headers de tabla dinámicamente desde la configuración
   */
  generarHeadersTabla() {
    const columnas = this.config.columnas;

    // Generar headers para tabla temporal
    const tablaTemporalHeader = document.getElementById(
      'tabla-temporal-header'
    );
    if (tablaTemporalHeader) {
      tablaTemporalHeader.innerHTML = columnas
        .filter(col => col.visible)
        .map(col => `<th>${col.label}</th>`)
        .join('');
    }

    // Generar headers para Bootstrap Table
    const bootstrapTableHeader = document.getElementById(
      'bootstrap-table-header'
    );
    if (bootstrapTableHeader) {
      bootstrapTableHeader.innerHTML = columnas
        .filter(col => col.visible)
        .map(col => {
          const attrs = [
            `data-field="${col.field}"`,
            col.sortable ? 'data-sortable="true"' : '',
            col.width !== 'auto' ? `data-width="${col.width}"` : '',
          ]
            .filter(Boolean)
            .join(' ');

          return `<th ${attrs}>${col.label}</th>`;
        })
        .join('');
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
    } catch (error) {
      console.error('Error al cargar datos iniciales:', error);
      throw error;
    }
  }

  /**
   * Carga los filtros dinámicamente desde los datos
   */
  cargarFiltros() {
    console.log(
      'Cargando filtros con tickets disponibles:',
      this.tickets.length
    );

    if (this.tickets.length === 0) {
      console.warn('No hay tickets disponibles para cargar filtros');
      return;
    }

    this.cargarFiltroEstados();
    this.cargarFiltroCategorias();
  }

  /**
   * Carga las opciones de estados desde los datos
   */
  cargarFiltroEstados() {
    if (!this.tickets || this.tickets.length === 0) {
      console.warn('No hay tickets para cargar estados');
      return;
    }

    const estados = [...new Set(this.tickets.map(ticket => ticket.estado))];
    console.log('Estados encontrados:', estados);

    const select = document.getElementById('filtro-estado');
    if (select) {
      select.innerHTML = `
        <option value="">Todos los estados</option>
        ${estados
          .map(estado => `<option value="${estado}">${estado}</option>`)
          .join('')}
      `;
      console.log('Filtro de estados cargado con', estados.length, 'opciones');
    } else {
      console.error('Elemento filtro-estado no encontrado');
    }
  }

  /**
   * Carga las opciones de categorías desde los datos
   */
  cargarFiltroCategorias() {
    if (!this.tickets || this.tickets.length === 0) {
      console.warn('No hay tickets para cargar categorías');
      return;
    }

    const categorias = [
      ...new Set(this.tickets.map(ticket => ticket.categoria)),
    ];
    console.log('Categorías encontradas:', categorias);

    const select = document.getElementById('filtro-categoria');
    if (select) {
      select.innerHTML = `
        <option value="">Todas las categorías</option>
        ${categorias
          .map(
            categoria => `<option value="${categoria}">${categoria}</option>`
          )
          .join('')}
      `;
      console.log(
        'Filtro de categorías cargado con',
        categorias.length,
        'opciones'
      );
    } else {
      console.error('Elemento filtro-categoria no encontrado');
    }
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
    const nuevoTicketBtn = document.getElementById('nuevo-ticket-btn');
    if (nuevoTicketBtn) {
      nuevoTicketBtn.addEventListener('click', () =>
        this.abrirModalNuevoTicket()
      );
    }

    // Botón guardar ticket
    const guardarTicketBtn = document.getElementById('btn-guardar-ticket');
    if (guardarTicketBtn) {
      guardarTicketBtn.addEventListener('click', () =>
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
    const buscarInput = document.getElementById('buscar-ticket');
    if (buscarInput) {
      let timeoutId;
      buscarInput.addEventListener('input', e => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          this.filtros.busqueda = e.target.value;
          this.filtrarTickets();
        }, this.config.busqueda.tiempoDebounce);
      });
    }
  }

  /**
   * Agrega eventos al formulario del modal
   */
  agregarEventosFormulario() {
    // Validación en tiempo real
    const modal = document.getElementById('modal-nuevo-ticket');
    if (modal) {
      const inputs = modal.querySelectorAll('input, select, textarea');
      inputs.forEach(input => {
        input.addEventListener('blur', () => this.validarCampo(input.id));
        input.addEventListener('input', () => this.validarCampo(input.id));
      });
    }
  }

  /**
   * Valida un campo específico del formulario
   */
  validarCampo(campoId) {
    const elemento = document.getElementById(campoId);
    if (!elemento) return true;

    const valor = elemento.value.trim();
    let esValido = true;
    let mensaje = '';

    // Validaciones específicas por campo
    switch (campoId) {
      case 'asunto':
        if (valor.length < 5) {
          esValido = false;
          mensaje = 'El asunto debe tener al menos 5 caracteres';
        }
        break;
      case 'descripcion':
        if (valor.length < 10) {
          esValido = false;
          mensaje = 'La descripción debe tener al menos 10 caracteres';
        }
        break;
      case 'categoria':
        if (!valor) {
          esValido = false;
          mensaje = 'Debe seleccionar una categoría';
        }
        break;
      case 'departamento':
        if (!valor) {
          esValido = false;
          mensaje = 'Debe seleccionar un departamento';
        }
        break;
    }

    this.mostrarValidacionCampo(elemento, esValido, mensaje);
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

      // Los tickets ya están cargados en cargarDatosIniciales()
      console.log('Tickets cargados:', this.tickets.length);

      // Renderizar tabla
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

    // Verificar jQuery
    if (typeof $ === 'undefined') {
      console.warn('jQuery no está disponible');
      return false;
    }

    // Verificar Bootstrap Table
    if (typeof $.fn.bootstrapTable === 'undefined') {
      console.warn('Bootstrap Table no está disponible');
      return false;
    }

    console.log('Todas las dependencias están disponibles');
    return true;
  }

  /**
   * Inicializa Bootstrap Table
   */
  inicializarBootstrapTable() {
    console.log('Inicializando Bootstrap Table...');

    // Verificar dependencias
    if (!this.verificarDependencias()) {
      throw new Error('Dependencias no disponibles');
    }

    const $table = $('#tabla-tickets-bootstrap');
    if ($table.length === 0) {
      throw new Error('Tabla Bootstrap no encontrada');
    }

    // Configuración de Bootstrap Table
    const config = {
      ...this.config.bootstrapTable.configuracion,
      data: this.tickets,
      columns: this.config.columnas.map(col => ({
        field: col.field,
        title: col.label,
        sortable: col.sortable,
        width: col.width,
        visible: col.visible,
        formatter: window[`${col.field}Formatter`] || undefined,
      })),
    };

    console.log('Configuración Bootstrap Table:', config);

    // Inicializar tabla
    $table.bootstrapTable(config);
    this.bootstrapTable = $table;

    // Mostrar tabla Bootstrap y ocultar tabla temporal
    $('#bootstrap-table-container').show();
    $('#tabla-temporal').hide();

    console.log('Bootstrap Table inicializada correctamente');
  }

  /**
   * Renderiza la tabla según el estado actual
   */
  renderizarTabla() {
    if (this.bootstrapTable) {
      // Para Bootstrap Table, usar tickets filtrados
      const ticketsFiltrados = this.aplicarFiltros();
      this.bootstrapTable.bootstrapTable('load', ticketsFiltrados);
    } else {
      this.renderizarTablaSimple();
    }
  }

  /**
   * Renderiza la tabla simple (fallback)
   */
  renderizarTablaSimple() {
    console.log('Renderizando tabla simple...');

    const tbody = document.getElementById('tickets-tbody');
    if (!tbody) return;

    const ticketsFiltrados = this.aplicarFiltros();

    tbody.innerHTML = ticketsFiltrados
      .map(ticket => this.generarFilaTabla(ticket))
      .join('');

    // Mostrar tabla temporal y ocultar Bootstrap Table
    $('#tabla-temporal').show();
    $('#bootstrap-table-container').hide();
  }

  /**
   * Genera una fila de tabla para un ticket
   */
  generarFilaTabla(ticket) {
    const formatters = this.config.formatters;

    return `
      <tr>
        <td>${formatters.id(ticket.id)}</td>
        <td>${formatters.asunto(ticket.asunto, ticket)}</td>
        <td>${formatters.categoria(ticket.categoria)}</td>
        <td>${formatters.estado(ticket.estado)}</td>
        <td>${formatters.fecha(ticket.fecha)}</td>
        <td>${formatters.departamento(ticket.departamento)}</td>
      </tr>
    `;
  }

  /**
   * Filtra los tickets según los criterios actuales
   */
  filtrarTickets() {
    console.log('Filtrando tickets...');
    console.log('Filtros actuales:', this.filtros);

    const ticketsFiltrados = this.aplicarFiltros();
    console.log('Tickets filtrados:', ticketsFiltrados.length);

    // Actualizar tabla
    this.renderizarTabla();
  }

  /**
   * Aplica los filtros a los tickets
   */
  aplicarFiltros() {
    return this.tickets.filter(ticket => {
      // Filtro por estado
      if (this.filtros.estado && ticket.estado !== this.filtros.estado) {
        return false;
      }

      // Filtro por categoría
      if (
        this.filtros.categoria &&
        ticket.categoria !== this.filtros.categoria
      ) {
        return false;
      }

      // Filtro por búsqueda
      if (this.filtros.busqueda) {
        const busqueda = this.filtros.busqueda.toLowerCase();
        const campos = this.config.busqueda.campos;
        const coincide = campos.some(campo => {
          const valor = ticket[campo];
          return valor && valor.toString().toLowerCase().includes(busqueda);
        });
        if (!coincide) return false;
      }

      return true;
    });
  }

  /**
   * Actualiza las estadísticas en el dashboard
   */
  actualizarEstadisticas(stats) {
    console.log('Actualizando estadísticas:', stats);

    const elementos = {
      'tickets-pendientes': stats.pendientes || 0,
      'tickets-proceso': stats.enProceso || 0,
      'tickets-resueltos': stats.resueltos || 0,
    };

    Object.entries(elementos).forEach(([id, valor]) => {
      const elemento = document.getElementById(id);
      if (elemento) {
        elemento.textContent = valor;
      }
    });
  }

  /**
   * Configura la actualización automática
   */
  configurarActualizacionAutomatica() {
    if (!this.config.datos.actualizacionAutomatica) {
      console.log('Actualización automática deshabilitada');
      return;
    }

    console.log('Configurando actualización automática...');

    this.intervaloActualizacion = setInterval(async () => {
      console.log('Actualización automática ejecutándose...');
      try {
        await this.refrescarTickets();
      } catch (error) {
        console.error('Error en actualización automática:', error);
      }
    }, this.config.datos.intervaloActualizacion);

    console.log('Actualización automática configurada');
  }

  /**
   * Abre el modal para crear un nuevo ticket
   */
  abrirModalNuevoTicket() {
    console.log('Abriendo modal nuevo ticket...');

    const modal = new bootstrap.Modal(
      document.getElementById('modal-nuevo-ticket')
    );
    modal.show();
    this.modal = modal;
  }

  /**
   * Guarda un nuevo ticket
   */
  async guardarNuevoTicket() {
    console.log('Guardando nuevo ticket...');

    // Validar formulario
    const campos = ['asunto', 'descripcion', 'categoria', 'departamento'];
    const esValido = campos.every(campo => this.validarCampo(campo));

    if (!esValido) {
      this.mostrarError('Por favor, complete todos los campos correctamente');
      return;
    }

    try {
      // Recopilar datos del formulario
      const nuevoTicket = {
        id: `TKT-${Date.now()}`,
        asunto: document.getElementById('asunto').value,
        descripcion: document.getElementById('descripcion').value,
        categoria: document.getElementById('categoria').value,
        estado: 'Pendiente',
        fecha: new Date().toISOString(),
        departamento: document.getElementById('departamento').value,
        usuario: this.datosUsuario ? this.datosUsuario.nombre : 'Usuario',
      };

      // Agregar a la lista local
      this.tickets.unshift(nuevoTicket);

      // Actualizar tabla
      this.renderizarTabla();

      // Cerrar modal
      if (this.modal) {
        this.modal.hide();
      }

      // Limpiar formulario
      this.limpiarFormulario();

      // Mostrar mensaje de éxito
      this.mostrarExito('Ticket creado exitosamente');

      console.log('Ticket guardado:', nuevoTicket);
    } catch (error) {
      console.error('Error al guardar ticket:', error);
      this.mostrarError('Error al crear el ticket: ' + error.message);
    }
  }

  /**
   * Limpia el formulario del modal
   */
  limpiarFormulario() {
    const modal = document.getElementById('modal-nuevo-ticket');
    if (modal) {
      const inputs = modal.querySelectorAll('input, select, textarea');
      inputs.forEach(input => {
        input.value = '';
        input.classList.remove('is-valid', 'is-invalid');
      });

      // Limpiar mensajes de validación
      const feedbacks = modal.querySelectorAll(
        '.valid-feedback, .invalid-feedback'
      );
      feedbacks.forEach(feedback => feedback.remove());
    }
  }

  /**
   * Refresca los tickets desde el servidor
   */
  async refrescarTickets() {
    console.log('Refrescando tickets...');

    try {
      await this.cargarDatosIniciales();
      this.renderizarTabla();
      console.log('Tickets refrescados exitosamente');
    } catch (error) {
      console.error('Error al refrescar tickets:', error);
      throw error;
    }
  }

  /**
   * Exporta los tickets a CSV
   */
  exportarTickets() {
    console.log('Exportando tickets...');

    try {
      const ticketsFiltrados = this.aplicarFiltros();
      const csv = this.convertirACSV(ticketsFiltrados);
      const nombreArchivo = `tickets_${
        new Date().toISOString().split('T')[0]
      }.csv`;

      this.descargarArchivo(csv, nombreArchivo, 'text/csv');
      this.mostrarExito('Tickets exportados exitosamente');

      console.log('Tickets exportados:', ticketsFiltrados.length);
    } catch (error) {
      console.error('Error al exportar tickets:', error);
      this.mostrarError('Error al exportar tickets: ' + error.message);
    }
  }

  /**
   * Convierte los tickets a formato CSV
   */
  convertirACSV(tickets) {
    const headers = this.config.columnas
      .filter(col => col.visible)
      .map(col => col.label);

    const rows = tickets.map(ticket =>
      this.config.columnas
        .filter(col => col.visible)
        .map(col => {
          const valor = ticket[col.field];
          // Escapar comillas en CSV
          return `"${String(valor || '').replace(/"/g, '""')}"`;
        })
        .join(',')
    );

    return [headers.join(','), ...rows].join('\n');
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
    const alerta = document.createElement('div');
    alerta.className = 'alert alert-success alert-dismissible fade show';
    alerta.innerHTML = `
      <i class="fas fa-check-circle"></i>
      ${mensaje}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    // Insertar en el contenedor
    const contenedor = document.querySelector('.helpdesk-container');
    if (contenedor) {
      contenedor.insertBefore(alerta, contenedor.firstChild);
    }

    // Auto-remover después del tiempo configurado
    setTimeout(() => {
      if (alerta.parentNode) {
        alerta.remove();
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
    const alerta = document.createElement('div');
    alerta.className = 'alert alert-danger alert-dismissible fade show';
    alerta.innerHTML = `
      <i class="fas fa-exclamation-triangle"></i>
      ${mensaje}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    // Insertar en el contenedor
    const contenedor = document.querySelector('.helpdesk-container');
    if (contenedor) {
      contenedor.insertBefore(alerta, contenedor.firstChild);
    }

    // Auto-remover después del tiempo configurado
    setTimeout(() => {
      if (alerta.parentNode) {
        alerta.remove();
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
   * Métodos de acciones (placeholder)
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
   * Destruye la instancia y limpia recursos
   */
  destruir() {
    console.log('Destruyendo HelpDeskView...');

    // Limpiar intervalo de actualización
    if (this.intervaloActualizacion) {
      clearInterval(this.intervaloActualizacion);
    }

    // Limpiar Bootstrap Table
    if (this.bootstrapTable) {
      this.bootstrapTable.bootstrapTable('destroy');
    }

    // Limpiar modal
    if (this.modal) {
      this.modal.dispose();
    }

    this.isInitialized = false;
    console.log('HelpDeskView destruida');
  }
}

// Exportar para uso global
window.HelpDeskView = HelpDeskView;
