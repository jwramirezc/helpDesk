class TemaHelper {
  constructor() {
    this.config = LocalStorageHelper.obtener('config');
  }

  aplicarTema() {
    const tema = this.config.tema;
    document.documentElement.setAttribute('data-theme', tema.modo);

    // Aplicar colores personalizados
    const root = document.documentElement;
    root.style.setProperty('--primary-color', tema.colores.primario);
    root.style.setProperty('--secondary-color', tema.colores.secundario);
    root.style.setProperty('--background-color', tema.colores.fondo);
    root.style.setProperty('--text-color', tema.colores.texto);
  }

  cambiarModo(modo) {
    this.config.tema.modo = modo;
    LocalStorageHelper.guardar('config', this.config);
    this.aplicarTema();
  }

  actualizarColores(colores) {
    this.config.tema.colores = { ...this.config.tema.colores, ...colores };
    LocalStorageHelper.guardar('config', this.config);
    this.aplicarTema();
  }

  obtenerTemaActual() {
    return this.config.tema;
  }
}
