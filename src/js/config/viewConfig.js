/**
 * Configuración específica para vistas y componentes de la interfaz
 *
 * Este archivo contiene configuraciones relacionadas con las vistas,
 * componentes de UI, paginación y elementos de la interfaz.
 */
const ViewConfig = {
  // Mapeo de vistas a clases JavaScript
  VIEW_CLASSES: {
    home: 'HomeView',
    helpdesk: 'HelpDeskView',
    consultas: 'ConsultasView',
  },
};

// Exportar para uso global
window.ViewConfig = ViewConfig;
