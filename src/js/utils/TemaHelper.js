class TemaHelper {
  constructor() {
    // Verificar disponibilidad de LocalStorageAdapter
    if (typeof LocalStorageAdapter === 'undefined') {
      console.error('TemaHelper: LocalStorageAdapter no está disponible');
      // Fallback a localStorage directo
      this.useDirectStorage = true;
    } else {
      this.useDirectStorage = false;
    }

    // Intentar cargar la configuración del localStorage
    this.config = this.useDirectStorage
      ? this._getConfigDirect()
      : LocalStorageAdapter.get('config');
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
      this._saveConfig();
    }

    // Cargar temas desde JSON y aplicar el tema actual
    this.cargarTemas();
  }

  /**
   * Método de fallback para obtener configuración directamente
   * @private
   */
  _getConfigDirect() {
    try {
      const config = localStorage.getItem('config');
      return config ? JSON.parse(config) : null;
    } catch (error) {
      console.error(
        'TemaHelper: Error al obtener configuración directa:',
        error
      );
      return null;
    }
  }

  /**
   * Método de fallback para guardar configuración directamente
   * @private
   */
  _saveConfig() {
    try {
      if (this.useDirectStorage) {
        localStorage.setItem('config', JSON.stringify(this.config));
      } else {
        LocalStorageAdapter.set('config', this.config);
      }
    } catch (error) {
      console.error('TemaHelper: Error al guardar configuración:', error);
    }
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
    this._saveConfig();

    // Aplicar colores del tema
    this.aplicarColoresTema(tema.colores);
  }

  aplicarColoresTema(colores) {
    const root = document.documentElement;

    // Mapeo específico de variables CSS
    const mapeoVariables = {
      primario: '--primary-color',
      secundario: '--secondary-color',
      'sidebar-bg': '--sidebar-bg-color',
      'icon-color': '--icon-color',
      'icon-color-active': '--icon-color-active',
      'icon-color-hover': '--icon-color-hover',
      'icon-color-header-hover': '--icon-color-header-hover',
      'icon-color-background': '--background-icon-color',
      'background-color-hover': '--background-color-hover',
      'text-color': '--text-color',
      'text-color-active': '--text-color-active',
      'icon-color-submenu': '--icon-color-submenu',
      'text-color-submenu': '--text-color-submenu',
      'background-color-item-submenu': '--background-color-item-submenu',
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

  obtenerLogoTemaActual() {
    const tema = this.obtenerTemaActualCompleto();
    return tema ? tema.logo : 'public/images/logo-saia-dark.png';
  }

  obtenerLogoMovilTemaActual() {
    const tema = this.obtenerTemaActualCompleto();
    return tema ? tema['logo-movil'] : 'public/images/logo-movil-dark.png';
  }

  /**
   * Cambia al siguiente tema disponible
   */
  cambiarTema() {
    const temasDisponibles = this.obtenerTemasDisponibles();
    if (!temasDisponibles || temasDisponibles.length === 0) {
      console.warn('No hay temas disponibles');
      return;
    }

    const temaActual = this.obtenerTemaActualCompleto();
    if (!temaActual) {
      // Si no hay tema actual, usar el primero
      this.cambiarModo(temasDisponibles[0].id);
      return;
    }

    // Encontrar el índice del tema actual
    const indiceActual = temasDisponibles.findIndex(
      t => t.id === temaActual.id
    );
    const siguienteIndice = (indiceActual + 1) % temasDisponibles.length;
    const siguienteTema = temasDisponibles[siguienteIndice];

    // Cambiar al siguiente tema
    this.cambiarModo(siguienteTema.id);
  }
}
