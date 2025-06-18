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

    // Aplicar comportamientos dinámicos del tema
    this.aplicarComportamientosTema(tema);
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

  aplicarComportamientosTema(tema) {
    if (!tema.comportamientos) return;

    const comportamientos = tema.comportamientos;
    const root = document.documentElement;

    // Aplicar comportamientos como variables CSS para que el CSS pueda usarlas
    Object.entries(comportamientos).forEach(([key, value]) => {
      const cssVariable = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      root.style.setProperty(cssVariable, value ? '1' : '0');
    });

    // Aplicar estilos dinámicos específicos
    this.aplicarEstilosDinamicos(tema);
  }

  aplicarEstilosDinamicos(tema) {
    if (!tema.comportamientos) return;

    const comportamientos = tema.comportamientos;
    const colores = tema.colores;

    // Crear o actualizar estilos dinámicos
    let styleElement = document.getElementById('dynamic-theme-styles');
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'dynamic-theme-styles';
      document.head.appendChild(styleElement);
    }

    // Generar CSS dinámico basado en comportamientos
    let cssRules = '';

    // Reglas para mobile menu items
    if (comportamientos['mobile-menu-hover-text-change']) {
      cssRules += `
        .mobile-menu-item:hover {
          color: var(--icon-color-active) !important;
        }
      `;
    } else {
      cssRules += `
        .mobile-menu-item:hover {
          color: var(--text-color) !important;
        }
      `;
    }

    if (comportamientos['mobile-menu-active-text-change']) {
      cssRules += `
        .mobile-menu-item:active {
          color: var(--icon-color-active) !important;
        }
      `;
    } else {
      cssRules += `
        .mobile-menu-item:active {
          color: var(--text-color) !important;
        }
      `;
    }

    if (comportamientos['mobile-menu-focus-text-change']) {
      cssRules += `
        .mobile-menu-item:focus {
          color: var(--icon-color-active) !important;
        }
      `;
    } else {
      cssRules += `
        .mobile-menu-item:focus {
          color: var(--text-color) !important;
        }
      `;
    }

    // Aplicar estilos de fondo según comportamientos
    if (!comportamientos['mobile-menu-hover-bg']) {
      cssRules += `
        .mobile-menu-item:hover {
          background-color: transparent !important;
        }
      `;
    }

    if (!comportamientos['mobile-menu-active-bg']) {
      cssRules += `
        .mobile-menu-item:active {
          background-color: transparent !important;
        }
      `;
    }

    if (!comportamientos['mobile-menu-focus-bg']) {
      cssRules += `
        .mobile-menu-item:focus {
          background-color: transparent !important;
        }
      `;
    }

    styleElement.textContent = cssRules;
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

  // Método para obtener comportamientos del tema actual
  obtenerComportamientosActuales() {
    const tema = this.obtenerTemaActualCompleto();
    return tema ? tema.comportamientos : {};
  }
}
