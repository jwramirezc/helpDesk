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

    // Inicializar el servicio de noticias
    this.inicializarNewsService();

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
        this.mostrarMensajeError(
          'No se pudo cargar la información del usuario'
        );
      }
    } catch (error) {
      this.mostrarMensajeError('Error al cargar datos del usuario');
    }
  }

  /**
   * Carga las estadísticas de la aplicación
   */
  cargarEstadisticas() {
    try {
      // Simular carga de estadísticas (en un caso real, esto vendría de una API)
      const estadisticas = this.obtenerEstadisticas();

      this.actualizarElemento('active-tickets', estadisticas.ticketsActivos);
      this.actualizarElemento('last-activity', estadisticas.ultimaActividad);
    } catch (error) {
      console.error('HomeView: Error al cargar estadísticas:', error);
      // Mostrar valores por defecto
      this.actualizarElemento('active-tickets', '0');
      this.actualizarElemento('last-activity', 'Hoy');
    }
  }

  /**
   * Inicializa los eventos de la vista
   */
  inicializarEventos() {
    // No agregar eventos de navegación ya que las funciones globales
    // están definidas en index.html y funcionan correctamente
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
      // Usar ConfigService para obtener el usuario
      const usuario = this.configService.getUser();

      if (usuario && usuario.esValido()) {
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
    // Limpiar intervalo de tiempo
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }

    // No eliminar funciones globales ya que están definidas en index.html
    // y deben permanecer para la navegación

    this.isInitialized = false;
  }

  /**
   * Inicializa el servicio de noticias
   */
  inicializarNewsService() {
    try {
      console.log('HomeView: Inicializando NewsService...');

      // Verificar que NewsService esté disponible
      if (typeof NewsService === 'undefined') {
        console.error('HomeView: NewsService no está disponible');
        this.mostrarErrorNoticias('NewsService no está disponible');
        return;
      }

      // Crear instancia y inicializar
      const newsService = new NewsService();
      newsService
        .init('news-container')
        .then(() => {
          console.log('HomeView: NewsService inicializado correctamente');
        })
        .catch(error => {
          console.error('HomeView: Error al inicializar NewsService:', error);
          this.mostrarErrorNoticias('Error al cargar las noticias');
        });
    } catch (error) {
      console.error('HomeView: Error en inicializarNewsService:', error);
      this.mostrarErrorNoticias('Error al inicializar el servicio de noticias');
    }
  }

  /**
   * Muestra error en la sección de noticias
   * @param {string} mensaje - Mensaje de error
   */
  mostrarErrorNoticias(mensaje) {
    const container = document.getElementById('news-container');
    if (container) {
      container.innerHTML = `
        <div class="text-center text-muted">
          <i class="fas fa-exclamation-triangle fa-2x mb-2"></i>
          <p>${mensaje}</p>
          <button class="btn btn-outline-primary btn-sm" onclick="location.reload()">
            <i class="fas fa-redo me-1"></i>Reintentar
          </button>
        </div>
      `;
    }
  }
}

// Exportar la clase al objeto window global
if (typeof window !== 'undefined') {
  window.HomeView = HomeView;
}
