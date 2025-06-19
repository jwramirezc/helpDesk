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

      console.log(
        `I18nService: Traducciones cargadas para idioma: ${this.currentLang}`
      );
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

  /**
   * Cambia el idioma actual
   * @param {string} newLang - Nuevo idioma
   * @returns {Promise<boolean>} - True si se cambió correctamente
   *
   * @status READY - Listo para implementar
   * @priority HIGH - Prioridad alta para UX
   * @useCase "Selector de idioma en la interfaz, cambio dinámico de idioma"
   */
  async changeLanguage(newLang) {
    if (this.currentLang === newLang) {
      return true;
    }

    this.currentLang = newLang;
    this.isLoaded = false;

    // Actualizar idioma en configuración
    try {
      this.configService.updateLanguage(newLang);
    } catch (error) {
      console.error(
        'I18nService: Error al actualizar idioma en configuración:',
        error
      );
    }

    return await this.load();
  }

  /**
   * Obtiene el idioma actual
   * @returns {string}
   *
   * @status READY - Listo para implementar
   * @priority MEDIUM - Prioridad media
   * @useCase "Mostrar idioma actual en la interfaz, validación de idioma"
   */
  getCurrentLanguage() {
    return this.currentLang;
  }

  /**
   * Verifica si las traducciones están cargadas
   * @returns {boolean}
   *
   * @status READY - Listo para implementar
   * @priority MEDIUM - Prioridad media
   * @useCase "Indicador de carga de traducciones, validación antes de mostrar contenido"
   */
  isTranslationsLoaded() {
    return this.isLoaded;
  }
}
