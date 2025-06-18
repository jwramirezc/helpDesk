class TemaHelper {
  constructor() {
    // Intentar cargar la configuración del localStorage
    this.config = LocalStorageAdapter.get('config');
    this.temas = null;
    this.temaActual = null;

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

    // Cargar temas desde JSON y aplicar el tema actual
    this.cargarTemas();
  }

  async cargarTemas() {
    try {
      const response = await fetch('data/config/temas.json');
      if (response.ok) {
        const data = await response.json();
        this.temas = data.temas;
        this.temaPorDefecto = data.temaPorDefecto;

        // Aplicar el tema actual
        this.aplicarTema();
      } else {
        console.error(
          'Error al cargar temas.json, usando configuración por defecto'
        );
        this.aplicarTema();
      }
    } catch (error) {
      console.error('Error al cargar temas:', error);
      this.aplicarTema();
    }
  }

  obtenerTemaPorId(id) {
    if (!this.temas) return null;
    return this.temas.find(tema => tema.id === id);
  }

  aplicarTema() {
    // Obtener el modo actual del tema
    const modo = this.config.tema.modo;

    // Buscar el tema en la lista de temas disponibles
    let tema = this.obtenerTemaPorId(modo);

    // Si no se encuentra el tema, usar el tema por defecto
    if (!tema) {
      tema = this.obtenerTemaPorId(this.temaPorDefecto) || this.temas?.[0];
      if (tema) {
        this.config.tema.modo = tema.id;
      }
    }

    // Si no hay temas cargados, usar configuración por defecto
    if (!tema) {
      document.body.setAttribute('data-theme', modo);
      this.aplicarColoresPorDefecto();
      return;
    }

    // Aplicar el atributo data-theme al elemento body
    document.body.setAttribute('data-theme', tema.modo);

    // Guardar en localStorage
    LocalStorageAdapter.set('config', this.config);

    // Aplicar colores del tema
    this.aplicarColoresTema(tema.colores);
  }

  aplicarColoresTema(colores) {
    const root = document.documentElement;

    // Mapeo específico de variables CSS
    const mapeoVariables = {
      primario: '--primary-color',
      secundario: '--secondary-color',
      fondo: '--background-color',
      texto: '--text-color',
      'sidebar-bg': '--sidebar-bg-color',
      'icon-color': '--icon-color',
      'icon-color-active': '--icon-color-active',
      'background-icon': '--background-icon-color',
      'hover-color': '--hover-color',
    };

    // Aplicar variables con mapeo específico
    Object.entries(colores).forEach(([key, value]) => {
      const cssVariable =
        mapeoVariables[key] ||
        `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      root.style.setProperty(cssVariable, value);
    });
  }

  aplicarColoresPorDefecto() {
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
    // Verificar si el tema existe
    const tema = this.obtenerTemaPorId(modo);
    if (!tema) {
      console.error(`Tema '${modo}' no encontrado`);
      return;
    }

    // Actualizar el modo en la configuración
    this.config.tema.modo = modo;

    // Aplicar el nuevo tema
    this.aplicarTema();
  }

  obtenerTemasDisponibles() {
    return this.temas || [];
  }

  obtenerTemaActual() {
    return this.config.tema;
  }

  obtenerTemaActualCompleto() {
    const modo = this.config.tema.modo;
    return this.obtenerTemaPorId(modo);
  }
}
