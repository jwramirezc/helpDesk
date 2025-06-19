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
   * Actualiza todos los datos del usuario.
   * @param {object} datos Estructura compatible con la clase Usuario
   * @returns {boolean} - True si se actualizó correctamente
   */
  updateUser(datos) {
    try {
      if (!datos || typeof datos !== 'object') {
        throw new Error('ConfigService: datos debe ser un objeto válido');
      }

      const nuevoUsuario = new Usuario(datos);

      if (!nuevoUsuario.esValido()) {
        throw new Error('ConfigService: datos de usuario inválidos');
      }

      this.config.usuario = nuevoUsuario;
      return this.save();
    } catch (error) {
      console.error('ConfigService: Error al actualizar usuario:', error);
      return false;
    }
  }

  /**
   * Actualiza el avatar del usuario
   * @param {string} ruta - Ruta del nuevo avatar
   * @returns {boolean} - True si se actualizó correctamente
   */
  updateAvatar(ruta) {
    try {
      if (!ruta || typeof ruta !== 'string') {
        throw new Error('ConfigService: ruta debe ser una cadena válida');
      }

      this.config.usuario.avatar = ruta;
      return this.save();
    } catch (error) {
      console.error('ConfigService: Error al actualizar avatar:', error);
      return false;
    }
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

  /*  PREFERENCIAS & TEMAS */
  getTheme() {
    return this.config.tema;
  }

  /**
   * Obtiene el modo del tema actual
   * @returns {string} - 'claro' o 'oscuro'
   */
  getTema() {
    return this.config.tema.modo;
  }

  /**
   * Actualiza el tema
   * @param {Object} tema - Nuevo tema
   * @returns {boolean} - True si se actualizó correctamente
   *
   * @status READY - Listo para implementar
   * @priority HIGH - Prioridad alta para UX
   * @useCase "Selector de temas en la interfaz, cambio dinámico de apariencia"
   */
  updateTheme(tema) {
    try {
      if (!tema || typeof tema !== 'object') {
        throw new Error('ConfigService: tema debe ser un objeto válido');
      }

      this.config.tema = { ...this.config.tema, ...tema };
      return this.save();
    } catch (error) {
      console.error('ConfigService: Error al actualizar tema:', error);
      return false;
    }
  }

  getNotifications() {
    return this.config.notificaciones;
  }

  /**
   * Actualiza las notificaciones
   * @param {Object} notificaciones - Nuevas configuraciones de notificaciones
   * @returns {boolean} - True si se actualizó correctamente
   *
   * @status READY - Listo para implementar
   * @priority MEDIUM - Prioridad media
   * @useCase "Panel de configuración de notificaciones, personalización de alertas"
   */
  updateNotifications(notificaciones) {
    try {
      if (!notificaciones || typeof notificaciones !== 'object') {
        throw new Error(
          'ConfigService: notificaciones debe ser un objeto válido'
        );
      }

      this.config.notificaciones = {
        ...this.config.notificaciones,
        ...notificaciones,
      };
      return this.save();
    } catch (error) {
      console.error(
        'ConfigService: Error al actualizar notificaciones:',
        error
      );
      return false;
    }
  }

  getPreferences() {
    return {
      idioma: this.config.usuario.idioma,
      tema: this.config.tema,
      notificaciones: this.config.notificaciones,
    };
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

  /**
   * Resetea la configuración a valores por defecto
   * @returns {boolean} - True si se reseteó correctamente
   *
   * @status READY - Listo para implementar
   * @priority LOW - Prioridad baja
   * @useCase "Botón 'Restaurar configuración', reset de preferencias"
   */
  reset() {
    try {
      this.config = Configuracion.resetear();
      return true;
    } catch (error) {
      console.error('ConfigService: Error al resetear configuración:', error);
      return false;
    }
  }

  /**
   * Verifica si la configuración es válida
   * @returns {boolean}
   *
   * @status READY - Listo para implementar
   * @priority MEDIUM - Prioridad media
   * @useCase "Verificación de integridad, diagnóstico de problemas"
   */
  isValid() {
    return this.config.esValida();
  }
}
