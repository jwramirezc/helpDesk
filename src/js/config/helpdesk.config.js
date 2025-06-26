/**
 * Configuración centralizada para la vista HelpDesk
 *
 * Este archivo contiene todas las configuraciones relacionadas con:
 * - Datos y URLs
 * - Configuración de Bootstrap Table
 * - Formatters y formateo
 * - Configuración de desarrollo
 */
const helpdeskConfig = {
  // Configuración de datos
  datos: {
    url: 'data/helpdesk-tickets.json',
    actualizacionAutomatica: true,
    intervaloActualizacion: 30000, // 30 segundos
  },

  // Configuración de Bootstrap Table
  bootstrapTable: {
    habilitado: true,
    configuracion: {
      locale: 'es-ES',
      pagination: true,
      search: true,
      showRefresh: true,
      showToggle: true,
      showColumns: true,
      showExport: true,
      clickToSelect: true,
      pageSize: 10,
      pageList: [5, 10, 25, 50, 100],
      showFooter: false,
      maintainSelected: true,
      exportDataType: 'all',
      exportTypes: ['csv', 'txt', 'excel'],
      exportOptions: {
        fileName: 'mis-tickets',
      },
    },
  },

  // Configuración de columnas (centralizada)
  columnas: [
    {
      key: 'id',
      label: 'ID',
      sortable: true,
      width: '100px',
      visible: true,
      field: 'id',
    },
    {
      key: 'asunto',
      label: 'Asunto',
      sortable: true,
      width: 'auto',
      visible: true,
      field: 'asunto',
    },
    {
      key: 'categoria',
      label: 'Categoría',
      sortable: true,
      width: '120px',
      visible: true,
      field: 'categoria',
    },
    {
      key: 'estado',
      label: 'Estado',
      sortable: true,
      width: '120px',
      visible: true,
      field: 'estado',
    },
    {
      key: 'fecha',
      label: 'Fecha',
      sortable: true,
      width: '100px',
      visible: true,
      field: 'fecha',
    },
    {
      key: 'departamento',
      label: 'Departamento',
      sortable: true,
      width: '150px',
      visible: true,
      field: 'departamento',
    },
  ],

  // Formatters centralizados
  formatters: {
    id: value => `<span class="badge bg-secondary">${value}</span>`,

    asunto: (value, row) => `
      <div class="ticket-asunto">
        <strong>${value}</strong>
        <small class="text-muted d-block">${
          row.descripcion ? row.descripcion.substring(0, 50) + '...' : ''
        }</small>
      </div>
    `,

    categoria: value => `<span class="badge bg-info">${value}</span>`,

    estado: value => {
      const clases = {
        Pendiente: 'bg-warning',
        'En Proceso': 'bg-info',
        Resuelto: 'bg-success',
        Cerrado: 'bg-secondary',
      };
      return `<span class="badge ${
        clases[value] || 'bg-secondary'
      }">${value}</span>`;
    },

    fecha: value =>
      `<small class="text-muted">${new Date(value).toLocaleDateString(
        'es-ES'
      )}</small>`,

    departamento: value => `<span class="text-muted">${value}</span>`,
  },

  // Configuración de búsqueda
  busqueda: {
    habilitada: true,
    placeholder: 'Buscar ticket...',
    campos: ['id', 'asunto', 'descripcion', 'categoria', 'departamento'],
    tiempoDebounce: 300,
  },

  // Configuración de notificaciones
  notificaciones: {
    mostrarExito: true,
    mostrarError: true,
    duracion: 3000,
    posicion: 'top-right',
  },

  // Configuración de desarrollo
  desarrollo: {
    modoDebug: true,
    mostrarLogs: true,
    simularLatencia: false,
    tiempoLatencia: 1000,
  },
};

// Exportar para uso global
window.helpdeskConfig = helpdeskConfig;
