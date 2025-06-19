/**
 * Clase para manejar la vista de PQRS
 * Gestiona Peticiones, Quejas, Reclamos y Sugerencias
 */
class PQRSView {
  constructor() {
    this.pqrs = [];
    this.filtros = {
      tipo: '',
      estado: '',
      prioridad: '',
      busqueda: '',
    };
    this.paginaActual = 1;
    this.pqrsPorPagina = 10;
    this.modal = null;
    this.isInitialized = false;
    // No auto-inicializar en el constructor
  }

  /**
   * Inicializa la vista
   */
  init() {
    if (this.isInitialized) return;

    console.log('PQRSView: Inicializando vista pqrs');
    this.inicializar();
    this.isInitialized = true;
  }

  /**
   * Inicializa la vista (método interno)
   */
  inicializar() {
    this.cargarDatosIniciales();
    this.agregarEventos();
    this.cargarPQRS();
  }

  /**
   * Carga datos iniciales y estadísticas
   */
  async cargarDatosIniciales() {
    // Simular carga de estadísticas
    this.actualizarEstadisticas({
      totales: 28,
      pendientes: 12,
      enProceso: 8,
      resueltas: 8,
    });
  }

  /**
   * Agrega todos los eventos de la vista
   */
  agregarEventos() {
    // Botón nueva PQRS
    const btnNuevaPQRS = document.getElementById('nueva-pqrs-btn');
    if (btnNuevaPQRS) {
      btnNuevaPQRS.addEventListener('click', () => this.abrirModalNuevaPQRS());
    }

    // Filtros
    const filtroTipo = document.getElementById('filtro-tipo');
    if (filtroTipo) {
      filtroTipo.addEventListener('change', e => {
        this.filtros.tipo = e.target.value;
        this.aplicarFiltros();
      });
    }

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

    // Búsqueda
    const buscarPQRS = document.getElementById('buscar-pqrs');
    if (buscarPQRS) {
      buscarPQRS.addEventListener('input', e => {
        this.filtros.busqueda = e.target.value;
        this.aplicarFiltros();
      });
    }

    // Botones de acción
    const btnRefresh = document.getElementById('btn-refresh-pqrs');
    if (btnRefresh) {
      btnRefresh.addEventListener('click', () => this.refrescarPQRS());
    }

    const btnExport = document.getElementById('btn-export-pqrs');
    if (btnExport) {
      btnExport.addEventListener('click', () => this.exportarPQRS());
    }

    // Formulario nueva PQRS
    const btnGuardarPQRS = document.getElementById('btn-guardar-pqrs');
    if (btnGuardarPQRS) {
      btnGuardarPQRS.addEventListener('click', () => this.guardarNuevaPQRS());
    }

    // Eventos de la tabla
    this.agregarEventosTabla();
  }

  /**
   * Agrega eventos a la tabla de PQRS
   */
  agregarEventosTabla() {
    const tabla = document.getElementById('tabla-pqrs');
    if (tabla) {
      tabla.addEventListener('click', e => {
        const target = e.target;

        // Ver PQRS
        if (target.classList.contains('btn-ver-pqrs')) {
          const pqrsId = target.dataset.pqrsId;
          this.verPQRS(pqrsId);
        }

        // Editar PQRS
        if (target.classList.contains('btn-editar-pqrs')) {
          const pqrsId = target.dataset.pqrsId;
          this.editarPQRS(pqrsId);
        }

        // Eliminar PQRS
        if (target.classList.contains('btn-eliminar-pqrs')) {
          const pqrsId = target.dataset.pqrsId;
          this.eliminarPQRS(pqrsId);
        }
      });
    }
  }

  /**
   * Carga los PQRS desde el servidor
   */
  async cargarPQRS() {
    try {
      // Simular datos de PQRS
      const pqrsSimulados = this.generarPQRSSimulados();
      this.pqrs = pqrsSimulados;

      this.renderizarTabla();
      this.renderizarPaginacion();
    } catch (error) {
      console.error('Error al cargar PQRS:', error);
      this.mostrarError('Error al cargar los PQRS');
    }
  }

  /**
   * Genera PQRS simulados para demostración
   */
  generarPQRSSimulados() {
    const tipos = ['peticion', 'queja', 'reclamo', 'sugerencia'];
    const estados = ['pendiente', 'en-proceso', 'resuelto', 'cerrado'];
    const prioridades = ['baja', 'media', 'alta', 'urgente'];
    const categorias = ['servicio', 'producto', 'facturacion', 'tecnico'];
    const asuntos = [
      'Solicitud de información sobre servicios',
      'Queja por mal servicio al cliente',
      'Reclamo por facturación incorrecta',
      'Sugerencia para mejorar la plataforma',
      'Petición de cambio de plan',
      'Queja por tiempo de respuesta lento',
      'Reclamo por producto defectuoso',
      'Sugerencia de nuevas funcionalidades',
    ];

    const pqrs = [];
    for (let i = 1; i <= 28; i++) {
      const tipo = tipos[Math.floor(Math.random() * tipos.length)];
      const estado = estados[Math.floor(Math.random() * estados.length)];
      const prioridad =
        prioridades[Math.floor(Math.random() * prioridades.length)];
      const categoria =
        categorias[Math.floor(Math.random() * categorias.length)];
      const asunto = asuntos[Math.floor(Math.random() * asuntos.length)];

      pqrs.push({
        id: `PQRS-${String(i).padStart(4, '0')}`,
        tipo: tipo,
        asunto: asunto,
        categoria: categoria,
        prioridad: prioridad,
        estado: estado,
        fecha: new Date(
          Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
        ).toLocaleDateString(),
        descripcion: `Descripción del PQRS ${i}`,
        email: `usuario${i}@ejemplo.com`,
        telefono: `+57 300 ${String(
          Math.floor(Math.random() * 999999)
        ).padStart(6, '0')}`,
      });
    }

    return pqrs;
  }

  /**
   * Renderiza la tabla de PQRS
   */
  renderizarTabla() {
    const tbody = document.getElementById('pqrs-tbody');
    if (!tbody) return;

    const pqrsFiltrados = this.filtrarPQRS();
    const inicio = (this.paginaActual - 1) * this.pqrsPorPagina;
    const fin = inicio + this.pqrsPorPagina;
    const pqrsPaginados = pqrsFiltrados.slice(inicio, fin);

    tbody.innerHTML = pqrsPaginados
      .map(
        pqrs => `
      <tr class="pqrs-row" data-pqrs-id="${pqrs.id}">
        <td><span class="badge bg-secondary">${pqrs.id}</span></td>
        <td>
          ${this.renderizarTipo(pqrs.tipo)}
        </td>
        <td>
          <div class="pqrs-asunto">
            <strong>${pqrs.asunto}</strong>
            <small class="text-muted d-block">${pqrs.descripcion.substring(
              0,
              50
            )}...</small>
          </div>
        </td>
        <td>
          ${this.renderizarPrioridad(pqrs.prioridad)}
        </td>
        <td>
          ${this.renderizarEstado(pqrs.estado)}
        </td>
        <td>
          <small class="text-muted">${pqrs.fecha}</small>
        </td>
        <td>
          <div class="btn-group btn-group-sm" role="group">
            <button type="button" class="btn btn-outline-primary btn-ver-pqrs" data-pqrs-id="${
              pqrs.id
            }" title="Ver">
              <i class="fas fa-eye"></i>
            </button>
            <button type="button" class="btn btn-outline-warning btn-editar-pqrs" data-pqrs-id="${
              pqrs.id
            }" title="Editar">
              <i class="fas fa-edit"></i>
            </button>
            <button type="button" class="btn btn-outline-danger btn-eliminar-pqrs" data-pqrs-id="${
              pqrs.id
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
   * Renderiza el tipo de PQRS con colores
   */
  renderizarTipo(tipo) {
    const clases = {
      peticion: 'bg-info',
      queja: 'bg-warning',
      reclamo: 'bg-danger',
      sugerencia: 'bg-success',
    };

    const nombres = {
      peticion: 'Petición',
      queja: 'Queja',
      reclamo: 'Reclamo',
      sugerencia: 'Sugerencia',
    };

    return `<span class="badge ${clases[tipo] || 'bg-secondary'}">${
      nombres[tipo] || tipo
    }</span>`;
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
    const paginacion = document.getElementById('paginacion-pqrs');
    if (!paginacion) return;

    const pqrsFiltrados = this.filtrarPQRS();
    const totalPaginas = Math.ceil(pqrsFiltrados.length / this.pqrsPorPagina);

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
   * Filtra los PQRS según los criterios establecidos
   */
  filtrarPQRS() {
    return this.pqrs.filter(pqrs => {
      // Filtro por tipo
      if (this.filtros.tipo && pqrs.tipo !== this.filtros.tipo) {
        return false;
      }

      // Filtro por estado
      if (this.filtros.estado && pqrs.estado !== this.filtros.estado) {
        return false;
      }

      // Filtro por prioridad
      if (this.filtros.prioridad && pqrs.prioridad !== this.filtros.prioridad) {
        return false;
      }

      // Filtro por búsqueda
      if (this.filtros.busqueda) {
        const busqueda = this.filtros.busqueda.toLowerCase();
        const texto =
          `${pqrs.asunto} ${pqrs.descripcion} ${pqrs.id}`.toLowerCase();
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
      'pqrs-totales': stats.totales,
      'pqrs-pendientes': stats.pendientes,
      'pqrs-proceso': stats.enProceso,
      'pqrs-resueltas': stats.resueltas,
    };

    Object.entries(elementos).forEach(([id, valor]) => {
      const elemento = document.getElementById(id);
      if (elemento) {
        elemento.textContent = valor;
      }
    });
  }

  /**
   * Abre el modal para crear nueva PQRS
   */
  abrirModalNuevaPQRS() {
    this.modal = new bootstrap.Modal(
      document.getElementById('modal-nueva-pqrs')
    );
    this.modal.show();
  }

  /**
   * Guarda una nueva PQRS
   */
  async guardarNuevaPQRS() {
    const form = document.getElementById('form-nueva-pqrs');
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const nuevaPQRS = {
      id: `PQRS-${String(this.pqrs.length + 1).padStart(4, '0')}`,
      tipo: document.getElementById('pqrs-tipo').value,
      asunto: document.getElementById('pqrs-asunto').value,
      categoria: document.getElementById('pqrs-categoria').value || 'servicio',
      prioridad: document.getElementById('pqrs-prioridad').value,
      estado: 'pendiente',
      fecha: new Date().toLocaleDateString(),
      descripcion: document.getElementById('pqrs-descripcion').value,
      email: document.getElementById('pqrs-email').value || '',
      telefono: document.getElementById('pqrs-telefono').value || '',
    };

    try {
      // Simular guardado
      this.pqrs.unshift(nuevaPQRS);
      this.renderizarTabla();
      this.renderizarPaginacion();

      // Cerrar modal y limpiar formulario
      this.modal.hide();
      form.reset();

      this.mostrarExito('PQRS creada exitosamente');
    } catch (error) {
      console.error('Error al guardar PQRS:', error);
      this.mostrarError('Error al crear la PQRS');
    }
  }

  /**
   * Refresca los PQRS
   */
  refrescarPQRS() {
    this.cargarPQRS();
    this.mostrarExito('PQRS actualizadas');
  }

  /**
   * Exporta los PQRS
   */
  exportarPQRS() {
    const pqrsFiltrados = this.filtrarPQRS();
    const csv = this.convertirACSV(pqrsFiltrados);
    this.descargarArchivo(csv, 'pqrs.csv', 'text/csv');
    this.mostrarExito('PQRS exportadas exitosamente');
  }

  /**
   * Convierte los PQRS a formato CSV
   */
  convertirACSV(pqrs) {
    const headers = [
      'ID',
      'Tipo',
      'Asunto',
      'Categoría',
      'Prioridad',
      'Estado',
      'Fecha',
      'Descripción',
    ];
    const rows = pqrs.map(pqrs => [
      pqrs.id,
      pqrs.tipo,
      pqrs.asunto,
      pqrs.categoria,
      pqrs.prioridad,
      pqrs.estado,
      pqrs.fecha,
      pqrs.descripcion,
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
   * Ver una PQRS específica
   */
  verPQRS(pqrsId) {
    const pqrs = this.pqrs.find(p => p.id === pqrsId);
    if (pqrs) {
      alert(`Viendo PQRS: ${pqrs.asunto}`);
      // Aquí podrías abrir un modal con los detalles de la PQRS
    }
  }

  /**
   * Editar una PQRS específica
   */
  editarPQRS(pqrsId) {
    const pqrs = this.pqrs.find(p => p.id === pqrsId);
    if (pqrs) {
      alert(`Editando PQRS: ${pqrs.asunto}`);
      // Aquí podrías abrir un modal para editar la PQRS
    }
  }

  /**
   * Eliminar una PQRS específica
   */
  eliminarPQRS(pqrsId) {
    if (confirm('¿Estás seguro de que quieres eliminar esta PQRS?')) {
      this.pqrs = this.pqrs.filter(p => p.id !== pqrsId);
      this.renderizarTabla();
      this.renderizarPaginacion();
      this.mostrarExito('PQRS eliminada exitosamente');
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
  window.PQRSView = PQRSView;
}
