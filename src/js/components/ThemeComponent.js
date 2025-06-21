/**
 * Componente Theme Reutilizable
 *
 * Este componente maneja el sistema de temas de forma reutilizable
 * y configurable en toda la aplicación.
 */
class ThemeComponent {
  constructor(options = {}) {
    // Obtener opciones por defecto desde la configuración
    const defaultOptions = ComponentConfig.getDefaultOptions('THEME');

    this.options = {
      ...defaultOptions,
      ...options,
    };

    this.temas = null;
    this.temaActual = null;
    this.temaPorDefecto = null;
    this.config = null;
    this.isInitialized = false;

    // Verificar disponibilidad de LocalStorageAdapter
    this.useDirectStorage = typeof LocalStorageAdapter === 'undefined';
  }

  /**
   * Inicializa el componente
   */
  async initialize() {
    if (this.isInitialized) return;

    try {
      // Cargar configuración
      this.loadConfig();

      // Cargar temas
      await this.loadThemes();

      // Aplicar tema actual
      this.applyCurrentTheme();

      this.isInitialized = true;

      // Log en desarrollo usando configuración centralizada
      ComponentConfig.log('ThemeComponent', 'Inicializado');
    } catch (error) {
      ComponentConfig.logError('ThemeComponent', 'Error al inicializar', error);
    }
  }

  /**
   * Carga la configuración desde localStorage
   */
  loadConfig() {
    try {
      if (this.useDirectStorage) {
        const config = localStorage.getItem(this.options.configKey);
        this.config = config ? JSON.parse(config) : null;
      } else {
        this.config = LocalStorageAdapter.get(this.options.configKey);
      }

      // Crear configuración por defecto si no existe
      if (!this.config || !this.config.tema) {
        this.config = {
          tema: {
            modo: this.options.defaultTheme,
            colores: ComponentConfig.THEME.DEFAULT_COLORS,
          },
        };
        this.saveConfig();
      }
    } catch (error) {
      ComponentConfig.logError(
        'ThemeComponent',
        'Error al cargar configuración',
        error
      );
      this.createDefaultConfig();
    }
  }

  /**
   * Crea configuración por defecto
   */
  createDefaultConfig() {
    this.config = {
      tema: {
        modo: this.options.defaultTheme,
        colores: ComponentConfig.THEME.DEFAULT_COLORS,
      },
    };
    this.saveConfig();
  }

  /**
   * Guarda la configuración en localStorage
   */
  saveConfig() {
    try {
      if (this.useDirectStorage) {
        localStorage.setItem(
          this.options.configKey,
          JSON.stringify(this.config)
        );
      } else {
        LocalStorageAdapter.set(this.options.configKey, this.config);
      }
    } catch (error) {
      ComponentConfig.logError(
        'ThemeComponent',
        'Error al guardar configuración',
        error
      );
    }
  }

  /**
   * Carga los temas desde el archivo JSON
   */
  async loadThemes() {
    try {
      const response = await fetch(this.options.themesPath);
      if (response.ok) {
        const data = await response.json();
        this.temas = data.temas;
        this.temaPorDefecto = data.temaPorDefecto;
      } else {
        ComponentConfig.logError(
          'ThemeComponent',
          'Error al cargar temas.json'
        );
        throw new Error('No se pudo cargar temas.json');
      }
    } catch (error) {
      ComponentConfig.logError(
        'ThemeComponent',
        'Error al cargar temas',
        error
      );
      throw error;
    }
  }

  /**
   * Aplica el tema actual
   */
  applyCurrentTheme() {
    const modo = this.config.tema.modo;
    let tema = this.getThemeById(modo);

    // Si no se encuentra el tema, usar el tema por defecto
    if (!tema) {
      tema = this.getThemeById(this.temaPorDefecto) || this.temas?.[0];
      if (tema) {
        this.config.tema.modo = tema.id;
      }
    }

    // Si no hay temas cargados, mostrar error
    if (!tema) {
      ComponentConfig.logError(
        'ThemeComponent',
        'No se encontraron temas disponibles'
      );
      return;
    }

    // Aplicar el tema
    this.applyTheme(tema);
  }

  /**
   * Aplica un tema específico
   * @param {Object} tema - Objeto del tema
   */
  applyTheme(tema) {
    // Aplicar el atributo data-theme al elemento body
    document.body.setAttribute('data-theme', tema.modo);

    // Aplicar colores del tema
    this.applyThemeColors(tema.colores);

    // Aplicar comportamientos dinámicos del tema
    this.applyThemeBehaviors(tema);

    // Guardar configuración
    this.config.tema.modo = tema.id;
    this.saveConfig();

    // Actualizar tema actual
    this.temaActual = tema;
  }

  /**
   * Aplica los colores del tema
   * @param {Object} colores - Objeto de colores
   */
  applyThemeColors(colores) {
    const root = document.documentElement;
    const cssVariables = ComponentConfig.THEME.CSS_VARIABLES;

    // Aplicar variables con mapeo específico
    Object.entries(colores).forEach(([key, value]) => {
      const cssVariable =
        cssVariables[key] ||
        `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      root.style.setProperty(cssVariable, value);
    });
  }

  /**
   * Aplica los comportamientos del tema
   * @param {Object} tema - Objeto del tema
   */
  applyThemeBehaviors(tema) {
    if (!tema.comportamientos) return;

    const comportamientos = tema.comportamientos;
    const root = document.documentElement;

    // Aplicar comportamientos como variables CSS
    Object.entries(comportamientos).forEach(([key, value]) => {
      const cssVariable = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      root.style.setProperty(cssVariable, value ? '1' : '0');
    });

    // Aplicar estilos dinámicos específicos
    this.applyDynamicStyles(tema);
  }

  /**
   * Aplica estilos dinámicos específicos
   * @param {Object} tema - Objeto del tema
   */
  applyDynamicStyles(tema) {
    if (!tema.comportamientos) return;

    const comportamientos = tema.comportamientos;

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

    styleElement.textContent = cssRules;
  }

  /**
   * Cambia el modo del tema
   * @param {string} modo - Modo del tema ('light' o 'dark')
   */
  changeThemeMode(modo) {
    if (!['light', 'dark'].includes(modo)) {
      ComponentConfig.logError(
        'ThemeComponent',
        `Modo de tema inválido: ${modo}`
      );
      return;
    }

    this.config.tema.modo = modo;
    this.saveConfig();
    this.applyCurrentTheme();
  }

  /**
   * Cambia el tema
   */
  changeTheme() {
    const modoActual = this.config.tema.modo;
    const nuevoModo = modoActual === 'light' ? 'dark' : 'light';
    this.changeThemeMode(nuevoModo);
  }

  /**
   * Obtiene un tema por ID
   * @param {string} id - ID del tema
   * @returns {Object|null} Objeto del tema
   */
  getThemeById(id) {
    if (!this.temas) return null;
    return this.temas.find(tema => tema.id === id);
  }

  /**
   * Obtiene el tema actual
   * @returns {Object} Objeto del tema actual
   */
  getCurrentTheme() {
    return {
      id: this.config.tema.modo,
      modo: this.config.tema.modo,
    };
  }

  /**
   * Obtiene el tema actual completo
   * @returns {Object} Objeto completo del tema actual
   */
  getCurrentThemeComplete() {
    return this.temaActual || this.getThemeById(this.config.tema.modo);
  }

  /**
   * Obtiene los temas disponibles
   * @returns {Array} Array de temas disponibles
   */
  getAvailableThemes() {
    return this.temas || [];
  }

  /**
   * Obtiene la ruta del logo del tema actual
   * @returns {string} Ruta del logo
   */
  getCurrentThemeLogo() {
    const tema = this.getCurrentThemeComplete();
    if (!tema) return ComponentConfig.getPath('THEME', 'DEFAULT_LOGO');

    const paths = ComponentConfig.THEME.PATHS;
    return tema.logo || `${paths.LOGO_PREFIX}${tema.modo}${paths.LOGO_SUFFIX}`;
  }

  /**
   * Obtiene la ruta del logo móvil del tema actual
   * @returns {string} Ruta del logo móvil
   */
  getCurrentThemeMobileLogo() {
    const tema = this.getCurrentThemeComplete();
    if (!tema) return ComponentConfig.getPath('THEME', 'DEFAULT_LOGO');

    const paths = ComponentConfig.THEME.PATHS;
    return (
      tema.logoMovil ||
      `${paths.MOBILE_LOGO_PREFIX}${tema.modo}${paths.MOBILE_LOGO_SUFFIX}`
    );
  }

  /**
   * Obtiene los comportamientos actuales
   * @returns {Object} Objeto de comportamientos
   */
  getCurrentBehaviors() {
    const tema = this.getCurrentThemeComplete();
    return tema?.comportamientos || {};
  }

  /**
   * Destruye el componente y limpia recursos
   */
  destroy() {
    // Remover estilos dinámicos
    const styleElement = document.getElementById('dynamic-theme-styles');
    if (styleElement) {
      styleElement.remove();
    }

    this.isInitialized = false;

    // Log en desarrollo usando configuración centralizada
    ComponentConfig.log('ThemeComponent', 'Destruido');
  }
}

// Exportar para uso global
window.ThemeComponent = ThemeComponent;
