/**
 * Configuración específica para la vista HelpDesk
 *
 * Este archivo contiene todas las configuraciones relacionadas con:
 * - Filtros y búsqueda
 * - Paginación
 * - Exportación de datos
 * - Configuración de columnas
 * - Acciones disponibles
 * - Opciones de visualización
 */
const helpdeskConfig = {
  // Configuración de filtros
  filtros: {
    estados: [
      { value: '', label: 'Todos los estados' },
      { value: 'pendiente', label: 'Pendiente' },
      { value: 'en-proceso', label: 'En Proceso' },
      { value: 'resuelto', label: 'Resuelto' },
      { value: 'cerrado', label: 'Cerrado' },
    ],
    prioridades: [
      { value: '', label: 'Todas las prioridades' },
      { value: 'baja', label: 'Baja' },
      { value: 'media', label: 'Media' },
      { value: 'alta', label: 'Alta' },
      { value: 'urgente', label: 'Urgente' },
    ],
    categorias: [
      { value: '', label: 'Todas las categorías' },
      { value: 'software', label: 'Software' },
      { value: 'hardware', label: 'Hardware' },
      { value: 'red', label: 'Red' },
      { value: 'usuario', label: 'Usuario' },
    ],
    departamentos: [
      { value: '', label: 'Todos los departamentos' },
      { value: 'soporte', label: 'Soporte Técnico' },
      { value: 'desarrollo', label: 'Desarrollo' },
      { value: 'infraestructura', label: 'Infraestructura' },
    ],
  },

  // Configuración de paginación
  paginacion: {
    itemsPorPagina: 5,
    mostrarTotal: true,
    mostrarNavegacion: true,
    opcionesPorPagina: [5, 10, 25, 50],
  },

  // Configuración de exportación
  exportacion: {
    habilitarCSV: true,
    habilitarPDF: true,
    habilitarImprimir: true,
    formatoFecha: 'DD/MM/YYYY',
    incluirCabeceras: true,
  },

  // Configuración de columnas de la tabla
  columnas: [
    {
      key: 'id',
      label: 'ID',
      sortable: true,
      width: '100px',
      visible: true,
      formatter: value => `<span class="badge bg-secondary">${value}</span>`,
    },
    {
      key: 'asunto',
      label: 'Asunto',
      sortable: true,
      width: 'auto',
      visible: true,
      formatter: (value, row) => `
        <div class="ticket-asunto">
          <strong>${value}</strong>
          <small class="text-muted d-block">${row.descripcion.substring(
            0,
            50
          )}...</small>
        </div>
      `,
    },
    {
      key: 'categoria',
      label: 'Categoría',
      sortable: false,
      width: '120px',
      visible: true,
      formatter: value => `<span class="badge bg-info">${value}</span>`,
    },
    {
      key: 'prioridad',
      label: 'Prioridad',
      sortable: true,
      width: '100px',
      visible: true,
      formatter: value => {
        const clases = {
          baja: 'bg-success',
          media: 'bg-warning',
          alta: 'bg-danger',
          urgente: 'bg-dark',
        };
        return `<span class="badge ${
          clases[value.toLowerCase()] || 'bg-secondary'
        }">${value}</span>`;
      },
    },
    {
      key: 'estado',
      label: 'Estado',
      sortable: true,
      width: '120px',
      visible: true,
      formatter: value => {
        const clases = {
          pendiente: 'bg-warning',
          'en-proceso': 'bg-info',
          resuelto: 'bg-success',
          cerrado: 'bg-secondary',
        };
        return `<span class="badge ${
          clases[value.toLowerCase()] || 'bg-secondary'
        }">${value}</span>`;
      },
    },
    {
      key: 'fecha',
      label: 'Fecha',
      sortable: true,
      width: '100px',
      visible: true,
      formatter: value => `<small class="text-muted">${value}</small>`,
    },
    {
      key: 'acciones',
      label: 'Acciones',
      sortable: false,
      width: '80px',
      visible: true,
      formatter: (value, row) => `
        <button type="button" class="btn btn-outline-secondary btn-sm btn-acciones-ticket" 
                data-ticket-id="${row.id}" 
                data-popover-id="popover-acciones-${row.id}"
                title="Opciones">
          <i class="fa-solid fa-ellipsis"></i>
        </button>
      `,
    },
  ],

  // Configuración de acciones
  acciones: {
    ver: true,
    editar: true,
    eliminar: true,
    crear: true,
    exportar: true,
    refrescar: true,
  },

  // Configuración de estadísticas
  estadisticas: {
    mostrarResumen: true,
    actualizarAutomaticamente: true,
    intervaloActualizacion: 30000, // 30 segundos
  },

  // Configuración de búsqueda
  busqueda: {
    habilitada: true,
    placeholder: 'Buscar ticket...',
    campos: ['id', 'asunto', 'descripcion', 'categoria'],
    tiempoDebounce: 300,
  },

  // Configuración de formulario nuevo ticket
  formularioNuevoTicket: {
    campos: {
      asunto: { required: true, maxLength: 200 },
      descripcion: { required: true, maxLength: 1000 },
      prioridad: { required: true },
      categoria: { required: true },
      departamento: { required: false },
    },
    validaciones: {
      asunto: {
        minLength: 5,
        pattern: /^[a-zA-Z0-9\s\-_.,!?()]+$/,
      },
    },
  },

  // Configuración de notificaciones
  notificaciones: {
    mostrarExito: true,
    mostrarError: true,
    duracion: 5000,
    posicion: 'top-right',
  },

  // Configuración de datos
  datos: {
    url: 'data/config/helpdesk-user.json',
    cacheTime: 60000, // 1 minuto
    retryAttempts: 3,
    retryDelay: 1000,
  },

  // Configuración de desarrollo
  desarrollo: {
    modoDebug: false,
    logNivel: 'warn', // 'debug', 'info', 'warn', 'error'
    simularLatencia: false,
    latenciaSimulada: 500,
  },

  // Configuración de acciones del popover
  accionesPopover: {
    habilitado: true,
    ignorarBreakpoints: true,
    opciones: [
      {
        id: 'ver',
        label: 'Ver Ticket',
        icon: 'fas fa-eye',
        accion: 'ver',
        habilitado: true,
      },
      {
        id: 'editar',
        label: 'Editar Ticket',
        icon: 'fas fa-edit',
        accion: 'editar',
        habilitado: true,
      },
      {
        id: 'separador1',
        type: 'separator',
      },
      {
        id: 'eliminar',
        label: 'Eliminar Ticket',
        icon: 'fas fa-trash',
        accion: 'eliminar',
        habilitado: true,
        confirmacion: true,
      },
    ],
    placement: 'left', // 'top', 'bottom', 'left', 'right'
    offset: 8,
  },
};

// Exportar para uso global
window.helpdeskConfig = helpdeskConfig;
