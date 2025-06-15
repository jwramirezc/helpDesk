// Configuración inicial de la aplicación
const CONFIG = {
  // Configuración del usuario por defecto
  usuario: {
    id: 'usr001',
    nombre: 'Juan',
    apellidos: 'Pérez',
    empresa: 'Empresa XYZ',
    avatar: 'assets/img/avatar1.png',
    telefono: '+57 3012345678',
    idioma: 'es',
  },

  // Configuración del menú
  menu: [
    {
      id: 'menu_helpdesk',
      icono: 'fa-ticket',
      titulo: 'Help Desk',
      visible: true,
      orden: 1,
    },
    {
      id: 'menu_pqr',
      icono: 'fa-comments',
      titulo: 'PQR',
      visible: true,
      orden: 2,
    },
    {
      id: 'menu_consultas',
      icono: 'fa-search',
      titulo: 'Consultas',
      visible: true,
      orden: 3,
    },
    {
      id: 'menu_reportes',
      icono: 'fa-chart-bar',
      titulo: 'Reportes',
      visible: true,
      orden: 4,
    },
  ],

  // Configuración del tema
  tema: {
    modo: 'claro',
    colores: {
      primario: '#007bff',
      secundario: '#6c757d',
      fondo: '#ffffff',
      texto: '#212529',
    },
  },

  // Configuración de notificaciones
  notificaciones: {
    activas: true,
    sonido: true,
    intervalo: 300000, // 5 minutos
  },
};

// Inicialización de localStorage
function inicializarLocalStorage() {
  // Limpiar localStorage para asegurar una inicialización limpia
  localStorage.clear();

  // Guardar la configuración inicial
  localStorage.setItem('config', JSON.stringify(CONFIG));

  // Mostrar mensaje de inicialización en la consola
  console.log('Configuración inicial cargada:', CONFIG);
}

// Ejecutar inicialización al cargar
document.addEventListener('DOMContentLoaded', () => {
  inicializarLocalStorage();
  console.log(
    'Datos cargados en localStorage:',
    localStorage.getItem('config')
  );
});
