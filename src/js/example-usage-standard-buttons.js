/**
 * Ejemplo de uso del StandardButtonsService
 *
 * Este archivo muestra cómo implementar y usar el servicio
 * de botones estándar en la aplicación.
 */

// Ejemplo de inicialización en Main.js
class StandardButtonsExample {
  constructor() {
    this.standardButtonsService = null;
    this.popoverComponent = null;
  }

  /**
   * Inicializa los servicios de botones estándar
   */
  async initializeStandardButtons() {
    try {
      // 1. Inicializar el servicio de botones estándar
      this.standardButtonsService = new StandardButtonsService();
      await this.standardButtonsService.initialize();

      // 2. Establecer el rol del usuario (ejemplo)
      this.standardButtonsService.setUserRole('user');

      // 3. Hacer disponible globalmente
      window.standardButtonsService = this.standardButtonsService;

      // 4. Inicializar PopoverComponent existente
      this.popoverComponent = new PopoverComponent();

      // 5. Renderizar botones del header
      this.renderHeaderButtons();

      // 6. Configurar eventos
      this.setupButtonEvents();

      console.log('StandardButtonsService inicializado correctamente');
    } catch (error) {
      console.error('Error al inicializar StandardButtonsService:', error);
    }
  }

  /**
   * Renderiza los botones del header
   */
  renderHeaderButtons() {
    const headerContainer = document.querySelector('#header .user-info');
    if (!headerContainer) return;

    // Obtener botones de la categoría header
    const headerButtons =
      this.standardButtonsService.getButtonsByCategory('header');

    // Limpiar contenedor
    headerContainer.innerHTML = '';

    // Renderizar cada botón
    headerButtons.forEach(button => {
      const buttonHTML = this.standardButtonsService.generateButtonHTML(
        button.id,
        this.translateFunction.bind(this),
        {
          showTooltip: true,
          showBadge: true,
        }
      );

      headerContainer.insertAdjacentHTML('beforeend', buttonHTML);
    });
  }

  /**
   * Configura los eventos de los botones
   */
  setupButtonEvents() {
    const buttons = document.querySelectorAll('.standard-button');

    buttons.forEach(button => {
      const buttonId = button.id;
      const buttonConfig = this.standardButtonsService.getButton(buttonId);

      if (!buttonConfig) return;

      // Evento de click
      button.addEventListener('click', e => {
        e.preventDefault();
        this.handleButtonClick(buttonId, buttonConfig);
      });
    });
  }

  /**
   * Maneja el click en un botón
   */
  handleButtonClick(buttonId, buttonConfig) {
    console.log(`Click en botón: ${buttonId}`, buttonConfig);

    switch (buttonConfig.type) {
      case 'popover':
        this.handlePopoverButton(buttonId, buttonConfig);
        break;
      case 'button':
        this.handleButtonAction(buttonId, buttonConfig);
        break;
      default:
        console.warn(`Tipo de botón no manejado: ${buttonConfig.type}`);
    }
  }

  /**
   * Maneja botones de tipo popover usando el PopoverComponent existente
   */
  handlePopoverButton(buttonId, buttonConfig) {
    const buttonElement = document.getElementById(buttonId);
    if (!buttonElement) return;

    // El PopoverComponent ya maneja automáticamente los elementos con clase 'popover-trigger'
    // Solo necesitamos asegurar que el popover correspondiente existe en el DOM

    const popoverId = buttonConfig.popover.content;
    let popover = document.getElementById(popoverId);

    // Si el popover no existe, crearlo dinámicamente
    if (!popover) {
      popover = this.createPopoverContent(buttonId, buttonConfig);
      document.body.appendChild(popover);
    }

    // El PopoverComponent se encargará del resto automáticamente
    console.log(`Popover configurado para: ${buttonId}`);
  }

  /**
   * Crea el contenido del popover dinámicamente
   */
  createPopoverContent(buttonId, buttonConfig) {
    const popoverId = buttonConfig.popover.content;

    // Crear popover usando el método existente del PopoverComponent
    const popover = this.popoverComponent.createPopoverFromMenu(
      this.getPopoverItems(buttonId),
      popoverId,
      (item, element) => this.handlePopoverItemClick(item, element, buttonId)
    );

    // Configurar dimensiones si están especificadas
    if (buttonConfig.popover.width) {
      popover.style.width = buttonConfig.popover.width;
    }
    if (buttonConfig.popover.height) {
      popover.style.height = buttonConfig.popover.height;
    }

    return popover;
  }

  /**
   * Obtiene los items del popover según el tipo de botón
   */
  getPopoverItems(buttonId) {
    switch (buttonId) {
      case 'btn-notifications':
        return [
          {
            id: 'notif-1',
            label: 'Nueva notificación',
            icon: 'fas fa-bell',
            type: 'item',
          },
          {
            id: 'notif-2',
            label: 'Ver todas',
            icon: 'fas fa-list',
            type: 'item',
          },
        ];

      case 'btn-user-menu':
        return [
          {
            id: 'user-profile',
            label: 'Mi perfil',
            icon: 'fas fa-user',
            type: 'item',
          },
          {
            id: 'user-settings',
            label: 'Configuración',
            icon: 'fas fa-cog',
            type: 'item',
          },
          {
            id: 'user-logout',
            label: 'Cerrar sesión',
            icon: 'fas fa-sign-out-alt',
            type: 'item',
          },
        ];

      case 'btn-language-selector':
        return [
          {
            id: 'lang-es',
            label: 'Español',
            icon: 'fas fa-flag',
            type: 'item',
          },
          {
            id: 'lang-en',
            label: 'English',
            icon: 'fas fa-flag',
            type: 'item',
          },
        ];

      case 'btn-help':
        return [
          {
            id: 'help-docs',
            label: 'Documentación',
            icon: 'fas fa-book',
            type: 'item',
          },
          {
            id: 'help-support',
            label: 'Soporte',
            icon: 'fas fa-headset',
            type: 'item',
          },
        ];

      case 'btn-search':
        return [
          {
            id: 'search-input',
            label: 'Buscar...',
            icon: 'fas fa-search',
            type: 'item',
          },
        ];

      default:
        return [];
    }
  }

  /**
   * Maneja clicks en items del popover
   */
  handlePopoverItemClick(item, element, buttonId) {
    console.log(`Click en item del popover: ${item.id}`, { item, buttonId });

    // Aquí implementarías la lógica específica para cada tipo de popover
    switch (buttonId) {
      case 'btn-notifications':
        this.handleNotificationAction(item.id);
        break;
      case 'btn-user-menu':
        this.handleUserMenuAction(item.id);
        break;
      case 'btn-language-selector':
        this.handleLanguageAction(item.id);
        break;
      case 'btn-help':
        this.handleHelpAction(item.id);
        break;
      case 'btn-search':
        this.handleSearchAction(item.id);
        break;
    }
  }

  /**
   * Maneja acciones de botones simples
   */
  handleButtonAction(buttonId, buttonConfig) {
    switch (buttonId) {
      case 'btn-theme-toggle':
        this.toggleTheme();
        break;
      default:
        console.log(`Acción no implementada para: ${buttonId}`);
    }
  }

  /**
   * Cambia el tema de la aplicación
   */
  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);

    // Actualizar icono del botón
    const button = this.standardButtonsService.getButton('btn-theme-toggle');
    if (button) {
      const newIcon = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
      this.standardButtonsService.updateButtonState('btn-theme-toggle', {
        icon: newIcon,
      });
    }
  }

  /**
   * Métodos para manejar acciones específicas de popovers
   */
  handleNotificationAction(actionId) {
    console.log('Acción de notificación:', actionId);
  }

  handleUserMenuAction(actionId) {
    console.log('Acción de menú de usuario:', actionId);
  }

  handleLanguageAction(actionId) {
    console.log('Acción de idioma:', actionId);
  }

  handleHelpAction(actionId) {
    console.log('Acción de ayuda:', actionId);
  }

  handleSearchAction(actionId) {
    console.log('Acción de búsqueda:', actionId);
  }

  /**
   * Función de traducción
   */
  translateFunction(key) {
    // Aquí usarías tu servicio de i18n
    const translations = {
      notifications: 'Notificaciones',
      user_menu: 'Menú de usuario',
      toggle_theme: 'Cambiar tema',
      change_language: 'Cambiar idioma',
      help: 'Ayuda',
      search: 'Buscar',
    };

    return translations[key] || key;
  }

  /**
   * Actualiza el estado de notificaciones
   */
  updateNotificationsState(hasNotifications) {
    if (this.standardButtonsService) {
      this.standardButtonsService.updateButtonState('btn-notifications', {
        badge: {
          enabled: hasNotifications,
        },
      });
    }
  }
}

// Ejemplo de uso en Main.js
/*
// En tu archivo Main.js
class Main {
  async initialize() {
    // ... otras inicializaciones
    
    // Inicializar botones estándar
    this.standardButtonsExample = new StandardButtonsExample();
    await this.standardButtonsExample.initializeStandardButtons();
    
    // ... resto de la inicialización
  }
}
*/
