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
}
