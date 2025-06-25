/**
 * Clase para manejar la vista de Help Desk
 * Gestiona tickets, filtros, estadísticas y formularios
 */
class HelpDeskView {
  constructor() {
    this.tickets = [];
    this.filtros = {
      estado: '',
      prioridad: '',
      categoria: '',
      busqueda: '',
    };
    this.paginaActual = 1;
    this.ticketsPorPagina = 10;
    this.modal = null;
    this.isInitialized = false;
    // No auto-inicializar en el constructor
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
  inicializar() {
    this.cargarDatosIniciales();
    this.agregarEventos();
    this.cargarTickets();
  }

  /**
   * Carga datos iniciales y estadísticas
   */
  async cargarDatosIniciales() {
    // Simular carga de estadísticas
    this.actualizarEstadisticas({
      pendientes: 12,
      urgentes: 3,
      enProceso: 8,
      resueltos: 45,
    });
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

    // Búsqueda
    const buscarTicket = document.getElementById('buscar-ticket');
    if (buscarTicket) {
      buscarTicket.addEventListener('input', e => {
        this.filtros.busqueda = e.target.value;
        this.aplicarFiltros();
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

        // Ver ticket
        if (target.classList.contains('btn-ver-ticket')) {
          const ticketId = target.dataset.ticketId;
          this.verTicket(ticketId);
        }

        // Editar ticket
        if (target.classList.contains('btn-editar-ticket')) {
          const ticketId = target.dataset.ticketId;
          this.editarTicket(ticketId);
        }

        // Eliminar ticket
        if (target.classList.contains('btn-eliminar-ticket')) {
          const ticketId = target.dataset.ticketId;
          this.eliminarTicket(ticketId);
        }
      });
    }
  }

  /**
   * Carga los tickets desde el servidor
   */
  async cargarTickets() {
    try {
      // Simular datos de tickets
      const ticketsSimulados = this.generarTicketsSimulados();
      this.tickets = ticketsSimulados;

      this.renderizarTabla();
      this.renderizarPaginacion();
    } catch (error) {
      console.error('Error al cargar tickets:', error);
      this.mostrarError('Error al cargar los tickets');
    }
  }

  /**
   * Genera tickets simulados para demostración
   */
  generarTicketsSimulados() {
    const estados = ['pendiente', 'en-proceso', 'resuelto', 'cerrado'];
    const prioridades = ['baja', 'media', 'alta', 'urgente'];
    const categorias = ['software', 'hardware', 'red', 'usuario'];
    const asuntos = [
      'Problema con el sistema de correo',
      'Impresora no funciona',
      'Error de conexión a internet',
      'Solicitud de nuevo software',
      'Problema con el servidor',
      'Actualización de antivirus',
      'Configuración de VPN',
      'Backup de datos',
    ];

    const tickets = [];
    for (let i = 1; i <= 25; i++) {
      const estado = estados[Math.floor(Math.random() * estados.length)];
      const prioridad =
        prioridades[Math.floor(Math.random() * prioridades.length)];
      const categoria =
        categorias[Math.floor(Math.random() * categorias.length)];
      const asunto = asuntos[Math.floor(Math.random() * asuntos.length)];

      tickets.push({
        id: `TKT-${String(i).padStart(4, '0')}`,
        asunto: asunto,
        categoria: categoria,
        prioridad: prioridad,
        estado: estado,
        fecha: new Date(
          Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
        ).toLocaleDateString(),
        descripcion: `Descripción del ticket ${i}`,
        departamento: 'Soporte Técnico',
      });
    }

    return tickets;
  }

  /**
   * Renderiza la tabla de tickets
   */
  renderizarTabla() {
    const tbody = document.getElementById('tickets-tbody');
    if (!tbody) return;

    const ticketsFiltrados = this.filtrarTickets();
    const inicio = (this.paginaActual - 1) * this.ticketsPorPagina;
    const fin = inicio + this.ticketsPorPagina;
    const ticketsPaginados = ticketsFiltrados.slice(inicio, fin);

    tbody.innerHTML = ticketsPaginados
      .map(
        ticket => `
      <tr class="ticket-row" data-ticket-id="${ticket.id}">
        <td><span class="badge bg-secondary">${ticket.id}</span></td>
        <td>
          <div class="ticket-asunto">
            <strong>${ticket.asunto}</strong>
            <small class="text-muted d-block">${ticket.descripcion.substring(
              0,
              50
            )}...</small>
          </div>
        </td>
        <td>
          <span class="badge bg-info">${this.capitalizar(
            ticket.categoria
          )}</span>
        </td>
        <td>
          ${this.renderizarPrioridad(ticket.prioridad)}
        </td>
        <td>
          ${this.renderizarEstado(ticket.estado)}
        </td>
        <td>
          <small class="text-muted">${ticket.fecha}</small>
        </td>
        <td>
          <div class="btn-group btn-group-sm" role="group">
            <button type="button" class="btn btn-outline-primary btn-ver-ticket" data-ticket-id="${
              ticket.id
            }" title="Ver">
              <i class="fas fa-eye"></i>
            </button>
            <button type="button" class="btn btn-outline-warning btn-editar-ticket" data-ticket-id="${
              ticket.id
            }" title="Editar">
              <i class="fas fa-edit"></i>
            </button>
            <button type="button" class="btn btn-outline-danger btn-eliminar-ticket" data-ticket-id="${
              ticket.id
            }" title="Eliminar">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `
      )
      .join('');
  }

  /**
   * Renderiza la prioridad con colores
   */
  renderizarPrioridad(prioridad) {
    const clases = {
      baja: 'bg-success',
      media: 'bg-warning',
      alta: 'bg-danger',
      urgente: 'bg-dark',
    };

    return `<span class="badge ${
      clases[prioridad] || 'bg-secondary'
    }">${this.capitalizar(prioridad)}</span>`;
  }

  /**
   * Renderiza el estado con colores
   */
  renderizarEstado(estado) {
    const clases = {
      pendiente: 'bg-warning',
      'en-proceso': 'bg-info',
      resuelto: 'bg-success',
      cerrado: 'bg-secondary',
    };

    return `<span class="badge ${
      clases[estado] || 'bg-secondary'
    }">${this.capitalizar(estado)}</span>`;
  }

  /**
   * Renderiza la paginación
   */
  renderizarPaginacion() {
    const paginacion = document.getElementById('paginacion-tickets');
    if (!paginacion) return;

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
        paginacionHTML +=
          '<li class="page-item disabled"><span class="page-link">...</span></li>';
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

    // Agregar eventos a la paginación
    paginacion.addEventListener('click', e => {
      e.preventDefault();
      if (
        e.target.classList.contains('page-link') &&
        !e.target.parentElement.classList.contains('disabled')
      ) {
        const pagina = parseInt(e.target.dataset.pagina);
        if (pagina && pagina !== this.paginaActual) {
          this.paginaActual = pagina;
          this.renderizarTabla();
          this.renderizarPaginacion();
        }
      }
    });
  }

  /**
   * Filtra los tickets según los criterios establecidos
   */
  filtrarTickets() {
    return this.tickets.filter(ticket => {
      // Filtro por estado
      if (this.filtros.estado && ticket.estado !== this.filtros.estado) {
        return false;
      }

      // Filtro por prioridad
      if (
        this.filtros.prioridad &&
        ticket.prioridad !== this.filtros.prioridad
      ) {
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
        const texto =
          `${ticket.asunto} ${ticket.descripcion} ${ticket.id}`.toLowerCase();
        if (!texto.includes(busqueda)) {
          return false;
        }
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

    const nuevoTicket = {
      id: `TKT-${String(this.tickets.length + 1).padStart(4, '0')}`,
      asunto: document.getElementById('ticket-asunto').value,
      categoria: document.getElementById('ticket-categoria').value,
      prioridad: document.getElementById('ticket-prioridad').value,
      estado: 'pendiente',
      fecha: new Date().toLocaleDateString(),
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
  refrescarTickets() {
    this.cargarTickets();
    this.mostrarExito('Tickets actualizados');
  }

  /**
   * Exporta los tickets
   */
  exportarTickets() {
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
    // Aquí podrías usar una librería de notificaciones como Toastr
    console.log('Éxito:', mensaje);
  }

  /**
   * Muestra un mensaje de error
   */
  mostrarError(mensaje) {
    // Aquí podrías usar una librería de notificaciones como Toastr
    console.error('Error:', mensaje);
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
  }
}

// Exportar la clase al objeto window global
if (typeof window !== 'undefined') {
  window.HelpDeskView = HelpDeskView;
}
