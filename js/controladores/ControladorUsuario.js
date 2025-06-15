class ControladorUsuario {
  constructor() {
    this.config = Configuracion.cargar();
  }

  obtenerUsuarioActual() {
    return this.config.usuario;
  }

  actualizarUsuario(datos) {
    this.config.usuario = new Usuario(datos);
    this.config.guardar();
  }

  actualizarAvatar(ruta) {
    this.config.usuario.avatar = ruta;
    this.config.guardar();
  }

  actualizarIdioma(idioma) {
    this.config.usuario.idioma = idioma;
    this.config.guardar();
  }

  obtenerPreferencias() {
    return {
      idioma: this.config.usuario.idioma,
      tema: this.config.tema,
      notificaciones: this.config.notificaciones,
    };
  }
}
