class ConfigService {
  constructor() {
    // Cargar configuración actual o valores por defecto
    this.config = Configuracion.cargar();
  }

  /* ------------------------- MÉTODOS DE USUARIO ------------------------- */
  getUser() {
    return this.config.usuario;
  }

  /**
   * Actualiza todos los datos del usuario.
   * @param {object} datos Estructura compatible con la clase Usuario
   */
  updateUser(datos) {
    this.config.usuario = new Usuario(datos);
    this.save();
  }

  updateAvatar(ruta) {
    this.config.usuario.avatar = ruta;
    this.save();
  }

  updateLanguage(idioma) {
    this.config.usuario.idioma = idioma;
    this.save();
  }

  /* ----------------------- PREFERENCIAS & TEMAS ------------------------ */
  getTheme() {
    return this.config.tema;
  }

  getNotifications() {
    return this.config.notificaciones;
  }

  getPreferences() {
    return {
      idioma: this.config.usuario.idioma,
      tema: this.config.tema,
      notificaciones: this.config.notificaciones,
    };
  }

  /* --------------------------- PERSISTENCIA ---------------------------- */
  save() {
    this.config.guardar();
  }
}
