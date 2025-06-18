class Configuracion {
  constructor(datos = {}) {
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

  guardar() {
    LocalStorageAdapter.set('config', this.toJSON());
  }

  toJSON() {
    return {
      usuario: this.usuario.toJSON(),
      tema: this.tema,
      notificaciones: this.notificaciones,
    };
  }

  static cargar() {
    const datos = LocalStorageAdapter.get('config');
    return datos ? new Configuracion(datos) : new Configuracion();
  }
}
