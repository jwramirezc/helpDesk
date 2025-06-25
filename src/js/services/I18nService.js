class I18nService {
  constructor(configService) {
    // Validar que configService existe
    if (!configService) {
      throw new Error('I18nService: configService es requerido');
    }

    this.configService = configService;

    // Obtener idioma con validación
    try {
      const usuario = configService.getUser();
      this.currentLang = usuario?.idioma || 'es';
    } catch (error) {
      console.warn(
        'I18nService: Error al obtener idioma del usuario, usando español por defecto:',
        error
      );
      this.currentLang = 'es';
    }

    this.translations = {};
    this.isLoaded = false;
  }

  /**
   * Carga las traducciones del idioma actual
   * @returns {Promise<boolean>} - True si se cargaron correctamente
   */
  async load() {
    try {
      // Usar AppConfig para obtener la ruta de traducciones
      const path = AppConfig.getI18nPath(this.currentLang);
      const resp = await fetch(path);

      if (!resp.ok) {
        throw new Error(
          `No se pudo cargar ${path}: ${resp.status} ${resp.statusText}`
        );
      }

      this.translations = await resp.json();
      this.isLoaded = true;

      return true;
    } catch (err) {
      console.error('I18nService: Error al cargar traducciones:', err);
      this.translations = {};
      this.isLoaded = false;
      return false;
    }
  }

  /**
   * Traduce una clave a texto
   * @param {string} key - Clave de traducción
   * @param {Object} params - Parámetros para interpolación
   * @returns {string}
   */
  t(key, params = {}) {
    if (!this.isLoaded) {
      console.warn(
        `I18nService: Traducciones no cargadas, usando clave: ${key}`
      );
      return key;
    }

    let translation = this.translations[key] || key;

    // Interpolación de parámetros
    if (params && typeof params === 'object') {
      Object.keys(params).forEach(param => {
        translation = translation.replace(
          new RegExp(`\\{${param}\\}`, 'g'),
          params[param]
        );
      });
    }

    return translation;
  }
}
