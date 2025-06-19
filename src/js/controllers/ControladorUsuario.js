class ControladorUsuario {
  /**
   * @param {ConfigService} configService Servicio de configuración compartido.
   */
  constructor(configService = new ConfigService()) {
    this.configService = configService;
  }

  obtenerUsuarioActual() {
    return this.configService.getUser();
  }

  /**
   * Actualiza todos los datos del usuario.
   * @param {object} datos Estructura compatible con la clase Usuario
   * @returns {boolean} - True si se actualizó correctamente
   */
  actualizarUsuario(datos) {
    const success = this.configService.updateUser(datos);
    if (!success) {
      console.error('ControladorUsuario: Error al actualizar usuario');
    }
    return success;
  }

  /**
   * Actualiza el avatar del usuario
   * @param {string} ruta - Ruta del nuevo avatar
   * @returns {boolean} - True si se actualizó correctamente
   */
  actualizarAvatar(ruta) {
    const success = this.configService.updateAvatar(ruta);
    if (!success) {
      console.error('ControladorUsuario: Error al actualizar avatar');
    }
    return success;
  }

  /**
   * Actualiza el idioma del usuario
   * @param {string} idioma - Nuevo idioma
   * @returns {boolean} - True si se actualizó correctamente
   */
  actualizarIdioma(idioma) {
    const success = this.configService.updateLanguage(idioma);
    if (!success) {
      console.error('ControladorUsuario: Error al actualizar idioma');
    }
    return success;
  }

  obtenerPreferencias() {
    return this.configService.getPreferences();
  }

  /**
   * Verifica si la configuración del usuario es válida
   * @returns {boolean}
   */
  esConfiguracionValida() {
    return this.configService.isValid();
  }
}
