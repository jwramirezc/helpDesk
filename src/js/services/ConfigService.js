class ConfigService {
  constructor() {
    try {
      // Cargar configuración actual o valores por defecto
      this.config = Configuracion.cargar();

      // Validar que la configuración sea válida
      if (!this.config.esValida()) {
        console.warn(
          'ConfigService: Configuración inválida, usando valores por defecto'
        );
        this.config = new Configuracion();
      }
    } catch (error) {
      console.error('ConfigService: Error al cargar configuración:', error);
      this.config = new Configuracion();
    }
  }

  /*  MÉTODOS DE USUARIO  */
  getUser() {
    return this.config.usuario;
  }

  /**
   * Actualiza el idioma del usuario
   * @param {string} idioma - Nuevo idioma
   * @returns {boolean} - True si se actualizó correctamente
   */
  updateLanguage(idioma) {
    try {
      if (!idioma || typeof idioma !== 'string') {
        throw new Error('ConfigService: idioma debe ser una cadena válida');
      }

      this.config.usuario.idioma = idioma;
      return this.save();
    } catch (error) {
      console.error('ConfigService: Error al actualizar idioma:', error);
      return false;
    }
  }

  /*  PERSISTENCIA  */
  /**
   * Guarda la configuración
   * @returns {boolean} - True si se guardó correctamente
   */
  save() {
    try {
      return this.config.guardar();
    } catch (error) {
      console.error('ConfigService: Error al guardar configuración:', error);
      return false;
    }
  }
}
