class TemaHelper {
  constructor() {
    // Intentar cargar la configuración del localStorage
    this.config = LocalStorageAdapter.get('config');

    // Si no existe configuración, crear una por defecto
    if (!this.config || !this.config.tema) {
      this.config = {
        tema: {
          modo: 'dark', // Tema por defecto
          colores: {
            primario: '#007bff',
            secundario: '#6c757d',
            fondo: '#ffffff',
            texto: '#212529',
          },
        },
      };
      // Guardar configuración por defecto
      LocalStorageAdapter.set('config', this.config);
    }

    // Aplicar el tema al iniciar
    this.aplicarTema();
  }

  aplicarTema() {
    // Obtener el modo actual del tema
    const modo = this.config.tema.modo;

    // Aplicar el atributo data-theme al elemento body
    document.body.setAttribute('data-theme', modo);

    // Guardar en localStorage
    LocalStorageAdapter.set('config', this.config);

    // Aplicar colores personalizados
    const root = document.documentElement;
    root.style.setProperty(
      '--primary-color',
      this.config.tema.colores.primario
    );
    root.style.setProperty(
      '--secondary-color',
      this.config.tema.colores.secundario
    );
    root.style.setProperty(
      '--background-color',
      this.config.tema.colores.fondo
    );
    root.style.setProperty('--text-color', this.config.tema.colores.texto);
  }

  cambiarModo(modo) {
    // Actualizar el modo en la configuración
    this.config.tema.modo = modo;

    // Aplicar el nuevo tema
    this.aplicarTema();
  }

  actualizarColores(colores) {
    this.config.tema.colores = { ...this.config.tema.colores, ...colores };
    LocalStorageAdapter.set('config', this.config);
    this.aplicarTema();
  }

  obtenerTemaActual() {
    return this.config.tema;
  }
}
