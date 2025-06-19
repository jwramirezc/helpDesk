class Configuracion {
  constructor(datos = {}) {
    // Validar que datos sea un objeto
    if (datos && typeof datos !== 'object') {
      throw new Error('Configuracion: datos debe ser un objeto');
    }

    this.usuario = new Usuario(datos.usuario);
    this.tema = datos.tema || {
      modo: 'claro',
      colores: {
        primario: '#007bff',
        secundario: '#6c757d',
        fondo: '#ffffff',
        texto: '#212529',
      },
    };
    this.notificaciones = datos.notificaciones || {
      activas: true,
      sonido: true,
      intervalo: 300000,
    };
  }

  /**
   * Guarda la configuración en localStorage
   * @returns {boolean} - True si se guardó correctamente
   */
  guardar() {
    try {
      if (typeof LocalStorageAdapter === 'undefined') {
        console.error('Configuracion: LocalStorageAdapter no está disponible');
        return false;
      }
      LocalStorageAdapter.set('config', this.toJSON());
      return true;
    } catch (error) {
      console.error('Configuracion: Error al guardar configuración:', error);
      return false;
    }
  }

  /**
   * Valida si la configuración es válida
   * @returns {boolean}
   */
  esValida() {
    return this.usuario && this.usuario.esValido();
  }

  /**
   * Actualiza la configuración
   * @param {Object} nuevosDatos - Nuevos datos de configuración
   */
  actualizar(nuevosDatos) {
    if (nuevosDatos && typeof nuevosDatos === 'object') {
      if (nuevosDatos.usuario) {
        this.usuario.actualizar(nuevosDatos.usuario);
      }
      if (nuevosDatos.tema) {
        this.tema = { ...this.tema, ...nuevosDatos.tema };
      }
      if (nuevosDatos.notificaciones) {
        this.notificaciones = {
          ...this.notificaciones,
          ...nuevosDatos.notificaciones,
        };
      }
    }
  }

  toJSON() {
    return {
      usuario: this.usuario.toJSON(),
      tema: this.tema,
      notificaciones: this.notificaciones,
    };
  }

  static cargar() {
    try {
      if (typeof LocalStorageAdapter === 'undefined') {
        console.warn(
          'Configuracion: LocalStorageAdapter no está disponible, usando configuración por defecto'
        );
        return new Configuracion();
      }
      const datos = LocalStorageAdapter.get('config');
      return datos ? new Configuracion(datos) : new Configuracion();
    } catch (error) {
      console.error('Configuracion: Error al cargar configuración:', error);
      return new Configuracion();
    }
  }

  /**
   * Resetea la configuración a valores por defecto
   * @returns {Configuracion}
   */
  static resetear() {
    try {
      if (typeof LocalStorageAdapter !== 'undefined') {
        LocalStorageAdapter.remove('config');
      }
      return new Configuracion();
    } catch (error) {
      console.error('Configuracion: Error al resetear configuración:', error);
      return new Configuracion();
    }
  }
}
