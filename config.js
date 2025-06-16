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

  // Configuración del menú estándar
  menu: {
    top: [
      {
        id: 'menu_home',
        icono: 'fa-home',
        titulo: 'Home',
        visible: true,
        orden: 1,
      },
    ],
    bottom: [
      {
        id: 'menu_config',
        icono: 'fa-cog',
        titulo: 'Configuración',
        visible: true,
        orden: 1,
      },
      {
        id: 'menu_logout',
        icono: 'fa-sign-out-alt',
        titulo: 'Cerrar Sesión',
        visible: true,
        orden: 2,
      },
    ],
  },

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
