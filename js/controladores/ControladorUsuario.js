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

  actualizarUsuario(datos) {
    this.configService.updateUser(datos);
  }

  actualizarAvatar(ruta) {
    this.configService.updateAvatar(ruta);
  }

  actualizarIdioma(idioma) {
    this.configService.updateLanguage(idioma);
  }

  obtenerPreferencias() {
    return this.configService.getPreferences();
  }
}
