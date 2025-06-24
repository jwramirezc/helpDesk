/**
 * Vista Home - Página de inicio del portal
 */
class HomeView {
  constructor() {
    this.isInitialized = false;
    this.updateInterval = null;
    this.configService = new ConfigService();
    // No auto-inicializar en el constructor
  }

  /**
   * Inicializa la vista
   */
  init() {
    if (this.isInitialized) return;

    // Cargar datos del usuario
    this.cargarDatosUsuario();

    // Cargar estadísticas
    this.cargarEstadisticas();

    // Inicializar eventos
    this.inicializarEventos();

    // Iniciar actualización de tiempo
    this.iniciarActualizacionTiempo();

    this.isInitialized = true;
  }

  /**
   * Carga los datos del usuario actual
   */
  cargarDatosUsuario() {
    try {
      // Obtener usuario del localStorage o configuración
      const usuario = this.obtenerUsuarioActual();

      if (usuario) {
        // Actualizar elementos del DOM
        this.actualizarElemento(
          'user-name',
          `${usuario.nombre} ${usuario.apellidos}`
        );
        this.actualizarElemento(
          'user-company',
          usuario.empresa || 'No especificada'
        );
        this.actualizarElemento(
          'user-phone',
          usuario.telefono || 'No especificado'
        );
        this.actualizarElemento('user-id', usuario.id || 'N/A');
      } else {
        console.warn('HomeView: No se encontró información del usuario');
        this.mostrarMensajeError(
          'No se pudo cargar la información del usuario'
        );
      }
    } catch (error) {
      console.error('HomeView: Error al cargar datos del usuario:', error);
      this.mostrarMensajeError('Error al cargar datos del usuario');
    }
  }

  /**
   * Carga las estadísticas de actividad
   */
  cargarEstadisticas() {
    try {
      // Simular carga de estadísticas (en un caso real, esto vendría de una API)
      const estadisticas = this.obtenerEstadisticas();

      this.actualizarElemento('active-tickets', estadisticas.ticketsActivos);
      this.actualizarElemento('pending-pqrs', estadisticas.pqrsPendientes);
      this.actualizarElemento('last-activity', estadisticas.ultimaActividad);
    } catch (error) {
      console.error('HomeView: Error al cargar estadísticas:', error);
      // Mostrar valores por defecto
      this.actualizarElemento('active-tickets', '0');
      this.actualizarElemento('pending-pqrs', '0');
      this.actualizarElemento('last-activity', 'Hoy');
    }
  }

  /**
   * Inicializa los eventos de la vista
   */
  inicializarEventos() {
    // Eventos para los botones de navegación rápida
    this.agregarEventoNavegacion('navigateToHelpDesk', 'menu_helpdesk');
    this.agregarEventoNavegacion('navigateToPQRS', 'menu_pqrs');
    this.agregarEventoNavegacion('navigateToConsultas', 'menu_consultas');
    this.agregarEventoNavegacion('navigateToReportes', 'menu_reportes');
  }

  /**
   * Agrega evento de navegación para un botón
   * @param {string} functionName - Nombre de la función global
   * @param {string} menuId - ID del ítem del menú
   */
  agregarEventoNavegacion(functionName, menuId) {
    // Sobrescribir la función global para usar nuestro método
    window[functionName] = () => {
      this.navegarAMenu(menuId);
    };
  }

  /**
   * Navega a un ítem específico del menú
   * @param {string} menuId - ID del ítem del menú
   */
  navegarAMenu(menuId) {
    try {
      const menuItem = document.getElementById(menuId);
      if (menuItem) {
        menuItem.click();
      } else {
        console.warn(`HomeView: No se encontró el ítem del menú: ${menuId}`);
      }
    } catch (error) {
      console.error(`HomeView: Error al navegar a ${menuId}:`, error);
    }
  }

  /**
   * Inicia la actualización automática del tiempo
   */
  iniciarActualizacionTiempo() {
    // Limpiar intervalo anterior si existe
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    // Actualizar inmediatamente
    this.actualizarTiempo();

    // Configurar actualización cada segundo
    this.updateInterval = setInterval(() => {
      this.actualizarTiempo();
    }, 1000);
  }

  /**
   * Actualiza el tiempo mostrado
   */
  actualizarTiempo() {
    try {
      const timeElement = document.getElementById('current-time');
      if (!timeElement) {
        // Elemento no existe aún, no es un error
        return;
      }

      const now = new Date();
      const timeString = now.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      timeElement.textContent = timeString;
    } catch (error) {
      console.error('HomeView: Error al actualizar tiempo:', error);
    }
  }

  /**
   * Obtiene el usuario actual
   * @returns {Object|null}
   */
  obtenerUsuarioActual() {
    try {
      console.log('HomeView: Obteniendo usuario actual...');

      // Usar ConfigService para obtener el usuario
      const usuario = this.configService.getUser();
      console.log('HomeView: Usuario obtenido del ConfigService:', usuario);

      if (usuario && usuario.esValido()) {
        console.log(
          'HomeView: Usuario válido encontrado:',
          usuario.nombreCompleto
        );
        return usuario;
      }

      console.log('HomeView: Usuario no válido, usando datos por defecto');
      // Si no hay usuario válido en ConfigService, usar datos por defecto
      return {
        nombre: 'Usuario',
        apellidos: 'Demo',
        empresa: 'Empresa Demo',
        telefono: '+57 300 123 4567',
        id: 'USR001',
      };
    } catch (error) {
      console.error('HomeView: Error al obtener usuario:', error);
      return null;
    }
  }

  /**
   * Obtiene estadísticas simuladas
   * @returns {Object}
   */
  obtenerEstadisticas() {
    // En un caso real, esto vendría de una API
    return {
      ticketsActivos: Math.floor(Math.random() * 20) + 1,
      pqrsPendientes: Math.floor(Math.random() * 10) + 1,
      ultimaActividad: this.obtenerUltimaActividad(),
    };
  }

  /**
   * Obtiene la última actividad simulada
   * @returns {string}
   */
  obtenerUltimaActividad() {
    const actividades = [
      'Hace 5 minutos',
      'Hace 15 minutos',
      'Hace 1 hora',
      'Hoy',
      'Ayer',
    ];

    return actividades[Math.floor(Math.random() * actividades.length)];
  }

  /**
   * Actualiza un elemento del DOM
   * @param {string} id - ID del elemento
   * @param {string} valor - Nuevo valor
   */
  actualizarElemento(id, valor) {
    const elemento = document.getElementById(id);
    if (elemento) {
      elemento.textContent = valor;
    } else {
      // No mostrar warning durante la carga inicial
      // console.warn(`HomeView: Elemento con ID '${id}' no encontrado`);
    }
  }

  /**
   * Muestra un mensaje de error
   * @param {string} mensaje - Mensaje a mostrar
   */
  mostrarMensajeError(mensaje) {
    console.error('HomeView:', mensaje);
    // En un caso real, mostraría una notificación al usuario
  }

  /**
   * Limpia recursos cuando se destruye la vista
   */
  destruir() {
    console.log('HomeView: Destruyendo vista');

    // Limpiar intervalo de tiempo
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }

    // Limpiar funciones globales
    delete window.navigateToHelpDesk;
    delete window.navigateToPQRS;
    delete window.navigateToConsultas;
    delete window.navigateToReportes;

    this.isInitialized = false;
  }
}

// Exportar la clase al objeto window global
if (typeof window !== 'undefined') {
  window.HomeView = HomeView;
}
