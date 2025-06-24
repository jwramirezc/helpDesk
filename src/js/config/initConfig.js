/**
 * Configuración de inicialización de la aplicación
 *
 * Este archivo maneja la carga inicial de configuración y
 * reemplaza la funcionalidad del config.js de la raíz.
 */
class InitConfig {
  constructor() {
    this.isInitialized = false;
  }

  /**
   * Carga un archivo JSON o JavaScript de forma SINCRÓNICA.
   * Esto garantiza que la configuración esté lista antes de que
   * se ejecuten los siguientes scripts incluidos en index.html.
   * @param {string} path Ruta al archivo JSON o JavaScript.
   * @returns {object|null}
   */
  cargarJSONSync(path) {
    try {
      const request = new XMLHttpRequest();
      request.open('GET', path, false); // "false" -> llamada sincrónica
      request.send(null);
      if (request.status === 200) {
        // Determinar si es un archivo JavaScript o JSON basado en la extensión
        const isJavaScript = path.endsWith('.js');

        if (isJavaScript) {
          // Para archivos JavaScript, ejecutar el script y usar window.menuConfig
          const scriptContent = request.responseText;

          // Crear un script temporal para ejecutar el contenido
          const script = document.createElement('script');
          script.textContent = scriptContent;
          document.head.appendChild(script);

          // Verificar si se creó la configuración global
          if (window.menuConfig) {
            document.head.removeChild(script);
            return window.menuConfig;
          } else {
            document.head.removeChild(script);
            console.error(`No se pudo cargar la configuración desde ${path}`);
            return null;
          }
        } else {
          // Para archivos JSON, usar el método tradicional
          return JSON.parse(request.responseText);
        }
      }
      console.error(
        `Error ${request.status} al intentar cargar el archivo ${path}`
      );
    } catch (error) {
      console.error('Excepción al cargar archivo:', error);
    }
    return null;
  }

  /**
   * Inicializa la configuración de la aplicación
   */
  inicializar() {
    if (this.isInitialized) {
      console.log('Configuración ya inicializada');
      return;
    }

    // Si ya existe una configuración previa, no la sobre-escribimos
    if (localStorage.getItem('config')) {
      this.isInitialized = true;
      return;
    }

    try {
      // Cargar configuración base y menú desde archivos JSON
      const configBase =
        this.cargarJSONSync(AppConfig.PATHS.DEFAULT_CONFIG) || {};
      const menuJSON = this.cargarJSONSync(AppConfig.PATHS.MENU_JSON) || {};

      // Normalizar estructura del menú
      configBase.menu = menuJSON.menuItems || menuJSON.menu || {};

      // Guardar en localStorage
      localStorage.setItem('config', JSON.stringify(configBase));

      console.log(AppConfig.MESSAGES.SUCCESS.CONFIG_LOADED, configBase);
      this.isInitialized = true;
    } catch (error) {
      console.error(AppConfig.getErrorMessage('CONFIG_LOAD_FAILED'), error);
    }
  }

  /**
   * Verifica si la configuración está inicializada
   * @returns {boolean}
   */
  estaInicializada() {
    return this.isInitialized;
  }

  /**
   * Limpia la configuración (útil para testing)
   */
  limpiar() {
    localStorage.removeItem('config');
    this.isInitialized = false;
    console.log('Configuración limpiada');
  }

  /**
   * Recarga la configuración desde los archivos JSON
   */
  recargar() {
    this.limpiar();
    this.inicializar();
  }
}

// Crear instancia global
window.initConfig = new InitConfig();

// Ejecutar la inicialización al cargar el DOM
document.addEventListener(AppConfig.EVENTS.DOMCONTENTLOADED, () => {
  window.initConfig.inicializar();
});
