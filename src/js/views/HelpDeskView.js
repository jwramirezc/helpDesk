/**
 * Clase para manejar la vista de Help Desk
 * Gestiona tickets, filtros, estadísticas y formularios
 * Consume datos desde archivo JSON externo
 */

class HelpDeskView {
  constructor() {
    this.tickets = [];
    this.datosUsuario = null;
    this.filtros = {
      estado: '',
      prioridad: '',
      categoria: '',
      busqueda: '',
    };
    this.paginaActual = 1;
    this.ticketsPorPagina = helpdeskConfig.paginacion.itemsPorPagina;
    this.modal = null;
    this.isInitialized = false;
    this.config = helpdeskConfig;
    this.activePopover = null;
    this.activeTrigger = null;
  }

  /**
   * Inicializa la vista
   */
  init() {
    if (this.isInitialized) return;

    this.inicializar();
    this.isInitialized = true;
  }

  /**
   * Inicializa la vista (método interno)
   */
  async inicializar() {
    await this.cargarDatosIniciales();
    this.cargarFiltros();
    this.configurarPopoverAcciones();
    this.agregarEventos();
    await this.cargarTickets();
  }

  /**
   * Carga datos iniciales desde el archivo JSON
   */
  async cargarDatosIniciales() {
    try {
      const response = await fetch(this.config.datos.url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const datos = await response.json();
      this.datosUsuario = datos.usuario;
      this.tickets = datos.tickets || [];

      // Actualizar estadísticas desde los datos del JSON
      this.actualizarEstadisticas(datos.resumen);

      if (this.config.desarrollo.modoDebug) {
        console.log('Datos cargados:', datos);
      }
    } catch (error) {
      console.error('Error al cargar datos iniciales:', error);
      this.mostrarError('Error al cargar los datos del usuario');

      // Fallback con datos por defecto
      this.actualizarEstadisticas({
        pendientes: 0,
        urgentes: 0,
        enProceso: 0,
        resueltos: 0,
      });
    }
  }

  /**
   * Carga las opciones de los filtros desde la configuración
   */
  cargarFiltros() {
    // Cargar filtro de estados
    const filtroEstado = document.getElementById('filtro-estado');
    if (filtroEstado) {
      filtroEstado.innerHTML = this.config.filtros.estados
        .map(
          estado => `<option value="${estado.value}">${estado.label}</option>`
        )
        .join('');
    }

    // Cargar filtro de prioridades
    const filtroPrioridad = document.getElementById('filtro-prioridad');
    if (filtroPrioridad) {
      filtroPrioridad.innerHTML = this.config.filtros.prioridades
        .map(
          prioridad =>
            `<option value="${prioridad.value}">${prioridad.label}</option>`
        )
        .join('');
    }

    // Cargar filtro de categorías
    const filtroCategoria = document.getElementById('filtro-categoria');
    if (filtroCategoria) {
      filtroCategoria.innerHTML = this.config.filtros.categorias
        .map(
          categoria =>
            `<option value="${categoria.value}">${categoria.label}</option>`
        )
        .join('');
    }

    // Cargar opciones del formulario nuevo ticket
    this.cargarOpcionesFormulario();
  }

  /**
   * Carga las opciones del formulario de nuevo ticket
   */
  cargarOpcionesFormulario() {
    // Prioridades para el formulario
    const ticketPrioridad = document.getElementById('ticket-prioridad');
    if (ticketPrioridad) {
      const opcionesPrioridad = this.config.filtros.prioridades
        .filter(p => p.value !== '') // Excluir "Todas las prioridades"
        .map(
          prioridad =>
            `<option value="${prioridad.value}">${prioridad.label}</option>`
        )
        .join('');
      ticketPrioridad.innerHTML =
        '<option value="">Seleccionar...</option>' + opcionesPrioridad;
    }

    // Categorías para el formulario
    const ticketCategoria = document.getElementById('ticket-categoria');
    if (ticketCategoria) {
      const opcionesCategoria = this.config.filtros.categorias
        .filter(c => c.value !== '') // Excluir "Todas las categorías"
        .map(
          categoria =>
            `<option value="${categoria.value}">${categoria.label}</option>`
        )
        .join('');
      ticketCategoria.innerHTML =
        '<option value="">Seleccionar...</option>' + opcionesCategoria;
    }

    // Departamentos para el formulario
    const ticketDepartamento = document.getElementById('ticket-departamento');
    if (ticketDepartamento) {
      const opcionesDepartamento = this.config.filtros.departamentos
        .filter(d => d.value !== '') // Excluir "Todos los departamentos"
        .map(
          departamento =>
            `<option value="${departamento.value}">${departamento.label}</option>`
        )
        .join('');
      ticketDepartamento.innerHTML =
        '<option value="">Seleccionar...</option>' + opcionesDepartamento;
    }
  }

  /**
   * Agrega todos los eventos de la vista
   */
  agregarEventos() {
    // Botón nuevo ticket
    const btnNuevoTicket = document.getElementById('nuevo-ticket-btn');
    if (btnNuevoTicket) {
      btnNuevoTicket.addEventListener('click', () =>
        this.abrirModalNuevoTicket()
      );
    }

    // Filtros
    const filtroEstado = document.getElementById('filtro-estado');
    if (filtroEstado) {
      filtroEstado.addEventListener('change', e => {
        this.filtros.estado = e.target.value;
        this.aplicarFiltros();
      });
    }

    const filtroPrioridad = document.getElementById('filtro-prioridad');
    if (filtroPrioridad) {
      filtroPrioridad.addEventListener('change', e => {
        this.filtros.prioridad = e.target.value;
        this.aplicarFiltros();
      });
    }

    const filtroCategoria = document.getElementById('filtro-categoria');
    if (filtroCategoria) {
      filtroCategoria.addEventListener('change', e => {
        this.filtros.categoria = e.target.value;
        this.aplicarFiltros();
      });
    }

    // Búsqueda con debounce
    const buscarTicket = document.getElementById('buscar-ticket');
    if (buscarTicket) {
      let timeoutId;
      buscarTicket.addEventListener('input', e => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          this.filtros.busqueda = e.target.value;
          this.aplicarFiltros();
        }, this.config.busqueda.tiempoDebounce);
      });
    }

    // Botones de acción
    const btnRefresh = document.getElementById('btn-refresh');
    if (btnRefresh) {
      btnRefresh.addEventListener('click', () => this.refrescarTickets());
    }

    const btnExport = document.getElementById('btn-export');
    if (btnExport) {
      btnExport.addEventListener('click', () => this.exportarTickets());
    }

    // Formulario nuevo ticket
    const btnGuardarTicket = document.getElementById('btn-guardar-ticket');
    if (btnGuardarTicket) {
      btnGuardarTicket.addEventListener('click', () =>
        this.guardarNuevoTicket()
      );
    }

    // Eventos de la tabla
    this.agregarEventosTabla();
  }

  /**
   * Agrega eventos a la tabla de tickets
   */
  agregarEventosTabla() {
    const tabla = document.getElementById('tabla-tickets');
    if (tabla) {
      tabla.addEventListener('click', e => {
        const target = e.target;

        // Botón de acciones (popover)
        if (target.closest('.btn-acciones-ticket')) {
          e.preventDefault();
          e.stopPropagation();
          const button = target.closest('.btn-acciones-ticket');
          const ticketId = button.dataset.ticketId;

          // Mostrar popover de acciones
          this.mostrarPopoverAcciones(ticketId, button);
        }
      });
    }
  }

  /**
   * Carga los tickets desde el servidor
   */
  async cargarTickets() {
    try {
      // Los tickets ya están cargados en cargarDatosIniciales()
      this.renderizarTabla();
      this.renderizarPaginacion();
    } catch (error) {
      console.error('Error al cargar tickets:', error);
      this.mostrarError('Error al cargar los tickets');
    }
  }

  /**
   * Renderiza la tabla de tickets usando la configuración
   */
  renderizarTabla() {
    const tbody = document.getElementById('tickets-tbody');
    if (!tbody) return;

    const ticketsFiltrados = this.filtrarTickets();
    const inicio = (this.paginaActual - 1) * this.ticketsPorPagina;
    const fin = inicio + this.ticketsPorPagina;
    const ticketsPaginados = ticketsFiltrados.slice(inicio, fin);

    tbody.innerHTML = ticketsPaginados
      .map(ticket => {
        const row = {};
        this.config.columnas.forEach(columna => {
          if (columna.key === 'acciones') {
            row[columna.key] = columna.formatter(null, ticket);
          } else {
            row[columna.key] = columna.formatter
              ? columna.formatter(ticket[columna.key], ticket)
              : ticket[columna.key];
          }
        });

        return `
          <tr class="ticket-row" data-ticket-id="${ticket.id}">
            <td>${row.id}</td>
            <td>${row.asunto}</td>
            <td>${row.categoria}</td>
            <td>${row.prioridad}</td>
            <td>${row.estado}</td>
            <td>${row.fecha}</td>
            <td>${row.acciones}</td>
          </tr>
        `;
      })
      .join('');
  }

  /**
   * Filtra los tickets según los criterios aplicados
   */
  filtrarTickets() {
    return this.tickets.filter(ticket => {
      // Filtro por estado
      if (
        this.filtros.estado &&
        ticket.estado.toLowerCase() !== this.filtros.estado.toLowerCase()
      ) {
        return false;
      }

      // Filtro por prioridad
      if (
        this.filtros.prioridad &&
        ticket.prioridad.toLowerCase() !== this.filtros.prioridad.toLowerCase()
      ) {
        return false;
      }

      // Filtro por categoría
      if (
        this.filtros.categoria &&
        ticket.categoria.toLowerCase() !== this.filtros.categoria.toLowerCase()
      ) {
        return false;
      }

      // Filtro por búsqueda
      if (this.filtros.busqueda) {
        const busqueda = this.filtros.busqueda.toLowerCase();
        const campos = this.config.busqueda.campos;
        const coincide = campos.some(campo => {
          const valor = ticket[campo]?.toString().toLowerCase() || '';
          return valor.includes(busqueda);
        });
        if (!coincide) return false;
      }

      return true;
    });
  }

  /**
   * Aplica los filtros y actualiza la vista
   */
  aplicarFiltros() {
    this.paginaActual = 1; // Resetear a la primera página
    this.renderizarTabla();
    this.renderizarPaginacion();
  }

  /**
   * Renderiza la paginación
   */
  renderizarPaginacion() {
    const paginacion = document.getElementById('paginacion-tickets');
    if (!paginacion || !this.config.paginacion.mostrarNavegacion) return;

    const ticketsFiltrados = this.filtrarTickets();
    const totalPaginas = Math.ceil(
      ticketsFiltrados.length / this.ticketsPorPagina
    );

    if (totalPaginas <= 1) {
      paginacion.innerHTML = '';
      return;
    }

    let paginacionHTML = '';

    // Botón anterior
    paginacionHTML += `
      <li class="page-item ${this.paginaActual === 1 ? 'disabled' : ''}">
        <a class="page-link" href="#" data-pagina="${
          this.paginaActual - 1
        }">Anterior</a>
      </li>
    `;

    // Números de página
    for (let i = 1; i <= totalPaginas; i++) {
      if (
        i === 1 ||
        i === totalPaginas ||
        (i >= this.paginaActual - 2 && i <= this.paginaActual + 2)
      ) {
        paginacionHTML += `
          <li class="page-item ${i === this.paginaActual ? 'active' : ''}">
            <a class="page-link" href="#" data-pagina="${i}">${i}</a>
          </li>
        `;
      } else if (i === this.paginaActual - 3 || i === this.paginaActual + 3) {
        paginacionHTML += `
          <li class="page-item disabled">
            <span class="page-link">...</span>
          </li>
        `;
      }
    }

    // Botón siguiente
    paginacionHTML += `
      <li class="page-item ${
        this.paginaActual === totalPaginas ? 'disabled' : ''
      }">
        <a class="page-link" href="#" data-pagina="${
          this.paginaActual + 1
        }">Siguiente</a>
      </li>
    `;

    paginacion.innerHTML = paginacionHTML;

    // Agregar eventos de paginación
    paginacion.addEventListener('click', e => {
      e.preventDefault();
      const target = e.target;
      if (target.classList.contains('page-link')) {
        const pagina = parseInt(target.dataset.pagina);
        if (pagina && pagina !== this.paginaActual) {
          this.paginaActual = pagina;
          this.renderizarTabla();
          this.renderizarPaginacion();
        }
      }
    });
  }

  /**
   * Actualiza las estadísticas del dashboard
   */
  actualizarEstadisticas(stats) {
    const elementos = {
      'tickets-pendientes': stats.pendientes,
      'tickets-urgentes': stats.urgentes,
      'tickets-proceso': stats.enProceso,
      'tickets-resueltos': stats.resueltos,
    };

    Object.entries(elementos).forEach(([id, valor]) => {
      const elemento = document.getElementById(id);
      if (elemento) {
        elemento.textContent = valor;
      }
    });
  }

  /**
   * Abre el modal para crear nuevo ticket
   */
  abrirModalNuevoTicket() {
    this.modal = new bootstrap.Modal(
      document.getElementById('modal-nuevo-ticket')
    );
    this.modal.show();
  }

  /**
   * Guarda un nuevo ticket
   */
  async guardarNuevoTicket() {
    const form = document.getElementById('form-nuevo-ticket');
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // Validar campos según la configuración
    const validaciones = this.config.formularioNuevoTicket.validaciones;
    const asunto = document.getElementById('ticket-asunto').value;

    if (validaciones.asunto) {
      if (asunto.length < validaciones.asunto.minLength) {
        this.mostrarError(
          `El asunto debe tener al menos ${validaciones.asunto.minLength} caracteres`
        );
        return;
      }
      if (
        validaciones.asunto.pattern &&
        !validaciones.asunto.pattern.test(asunto)
      ) {
        this.mostrarError('El asunto contiene caracteres no válidos');
        return;
      }
    }

    const nuevoTicket = {
      id: `TKT-${String(this.tickets.length + 1).padStart(4, '0')}`,
      asunto: asunto,
      categoria: document.getElementById('ticket-categoria').value,
      prioridad: document.getElementById('ticket-prioridad').value,
      estado: 'Pendiente',
      fecha: new Date().toISOString().split('T')[0],
      descripcion: document.getElementById('ticket-descripcion').value,
      departamento:
        document.getElementById('ticket-departamento').value ||
        'Soporte Técnico',
    };

    try {
      // Simular guardado
      this.tickets.unshift(nuevoTicket);
      this.renderizarTabla();
      this.renderizarPaginacion();

      // Cerrar modal y limpiar formulario
      this.modal.hide();
      form.reset();

      this.mostrarExito('Ticket creado exitosamente');
    } catch (error) {
      console.error('Error al guardar ticket:', error);
      this.mostrarError('Error al crear el ticket');
    }
  }

  /**
   * Refresca los tickets
   */
  async refrescarTickets() {
    await this.cargarDatosIniciales();
    this.renderizarTabla();
    this.renderizarPaginacion();
    this.mostrarExito('Tickets actualizados');
  }

  /**
   * Exporta los tickets
   */
  exportarTickets() {
    if (!this.config.exportacion.habilitarCSV) {
      this.mostrarError('La exportación CSV no está habilitada');
      return;
    }

    const ticketsFiltrados = this.filtrarTickets();
    const csv = this.convertirACSV(ticketsFiltrados);
    this.descargarArchivo(csv, 'tickets.csv', 'text/csv');
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
      'Prioridad',
      'Estado',
      'Fecha',
      'Descripción',
    ];
    const rows = tickets.map(ticket => [
      ticket.id,
      ticket.asunto,
      ticket.categoria,
      ticket.prioridad,
      ticket.estado,
      ticket.fecha,
      ticket.descripcion,
    ]);

    return [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
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
   * Ver un ticket específico
   */
  verTicket(ticketId) {
    const ticket = this.tickets.find(t => t.id === ticketId);
    if (ticket) {
      alert(`Viendo ticket: ${ticket.asunto}`);
      // Aquí podrías abrir un modal con los detalles del ticket
    }
  }

  /**
   * Editar un ticket específico
   */
  editarTicket(ticketId) {
    const ticket = this.tickets.find(t => t.id === ticketId);
    if (ticket) {
      alert(`Editando ticket: ${ticket.asunto}`);
      // Aquí podrías abrir un modal para editar el ticket
    }
  }

  /**
   * Eliminar un ticket específico
   */
  eliminarTicket(ticketId) {
    if (confirm('¿Estás seguro de que quieres eliminar este ticket?')) {
      this.tickets = this.tickets.filter(t => t.id !== ticketId);
      this.renderizarTabla();
      this.renderizarPaginacion();
      this.mostrarExito('Ticket eliminado exitosamente');
    }
  }

  /**
   * Muestra un mensaje de éxito
   */
  mostrarExito(mensaje) {
    if (this.config.notificaciones.mostrarExito) {
      console.log('Éxito:', mensaje);
      // Aquí podrías usar una librería de notificaciones como Toastr
    }
  }

  /**
   * Muestra un mensaje de error
   */
  mostrarError(mensaje) {
    if (this.config.notificaciones.mostrarError) {
      console.error('Error:', mensaje);
      // Aquí podrías usar una librería de notificaciones como Toastr
    }
  }

  /**
   * Capitaliza la primera letra de una cadena
   */
  capitalizar(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Método para limpiar recursos cuando se destruye la vista
   */
  destruir() {
    // Limpiar eventos y recursos si es necesario
    if (this.modal) {
      this.modal.dispose();
    }

    // Limpiar popover activo
    this.ocultarPopoverAcciones();
  }

  /**
   * Configura el popover de acciones
   */
  configurarPopoverAcciones() {
    if (!this.config.accionesPopover.habilitado) return;

    // Agregar event listener global para cerrar popover
    document.addEventListener('click', e => {
      if (
        !e.target.closest('.btn-acciones-ticket') &&
        !e.target.closest('.helpdesk-popover')
      ) {
        this.ocultarPopoverAcciones();
      }
    });

    // Agregar event listener para ESC
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        this.ocultarPopoverAcciones();
      }
    });
  }

  /**
   * Muestra el popover de acciones para un ticket
   */
  mostrarPopoverAcciones(ticketId, trigger) {
    // Ocultar popover activo si existe
    this.ocultarPopoverAcciones();

    // Crear el popover
    const popover = this.crearPopoverAcciones(ticketId);
    document.body.appendChild(popover);

    // Posicionar el popover
    this.posicionarPopover(popover, trigger);

    // Guardar referencias
    this.activePopover = popover;
    this.activeTrigger = trigger;

    // Mostrar el popover
    popover.style.display = 'block';
  }

  /**
   * Crea el popover de acciones para un ticket
   */
  crearPopoverAcciones(ticketId) {
    const popover = document.createElement('div');
    popover.className = 'helpdesk-popover';
    popover.style.cssText = `
      position: fixed;
      z-index: 9999;
      background: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      padding: 8px 0;
      min-width: 150px;
      display: none;
    `;

    // Filtrar opciones habilitadas
    const opcionesHabilitadas = this.config.accionesPopover.opciones.filter(
      opcion => opcion.habilitado !== false && opcion.type !== 'separator'
    );

    // Crear contenido del popover
    const contenido = opcionesHabilitadas
      .map(opcion => {
        return `
        <div class="popover-item" data-accion="${opcion.accion}" data-ticket-id="${ticketId}">
          <i class="${opcion.icon}"></i>
          <span>${opcion.label}</span>
        </div>
      `;
      })
      .join('');

    popover.innerHTML = contenido;

    // Agregar event listeners a los items
    popover.addEventListener('click', e => {
      const item = e.target.closest('.popover-item');
      if (item) {
        const accion = item.dataset.accion;
        const ticketId = item.dataset.ticketId;
        this.ejecutarAccionTicket(accion, ticketId);
        this.ocultarPopoverAcciones();
      }
    });

    return popover;
  }

  /**
   * Posiciona el popover relativo al trigger
   */
  posicionarPopover(popover, trigger) {
    const triggerRect = trigger.getBoundingClientRect();
    const popoverRect = popover.getBoundingClientRect();
    const placement = this.config.accionesPopover.placement;
    const offset = this.config.accionesPopover.offset;

    let top, left;

    switch (placement) {
      case 'bottom':
        top = triggerRect.bottom + offset;
        left = triggerRect.left + triggerRect.width / 2 - popoverRect.width / 2;
        break;
      case 'top':
        top = triggerRect.top - popoverRect.height - offset;
        left = triggerRect.left + triggerRect.width / 2 - popoverRect.width / 2;
        break;
      case 'left':
        top = triggerRect.top + triggerRect.height / 2 - popoverRect.height / 2;
        left = triggerRect.left - popoverRect.width - offset;
        break;
      case 'right':
        top = triggerRect.top + triggerRect.height / 2 - popoverRect.height / 2;
        left = triggerRect.right + offset;
        break;
      default:
        top = triggerRect.bottom + offset;
        left = triggerRect.left + triggerRect.width / 2 - popoverRect.width / 2;
    }

    // Asegurar que el popover no se salga de la pantalla
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (left < 0) left = 10;
    if (left + popoverRect.width > viewportWidth)
      left = viewportWidth - popoverRect.width - 10;
    if (top < 0) top = 10;
    if (top + popoverRect.height > viewportHeight)
      top = viewportHeight - popoverRect.height - 10;

    popover.style.top = `${top}px`;
    popover.style.left = `${left}px`;
  }

  /**
   * Oculta el popover de acciones
   */
  ocultarPopoverAcciones() {
    if (this.activePopover) {
      this.activePopover.remove();
      this.activePopover = null;
      this.activeTrigger = null;
    }
  }

  /**
   * Ejecuta una acción específica para un ticket
   */
  ejecutarAccionTicket(accion, ticketId) {
    switch (accion) {
      case 'ver':
        this.verTicket(ticketId);
        break;
      case 'editar':
        this.editarTicket(ticketId);
        break;
      case 'eliminar':
        this.eliminarTicket(ticketId);
        break;
      default:
        console.warn(`Acción no implementada: ${accion}`);
    }
  }
}

// Exportar la clase al objeto window global
if (typeof window !== 'undefined') {
  window.HelpDeskView = HelpDeskView;
}
