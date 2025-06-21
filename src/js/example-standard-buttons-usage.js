/**
 * Ejemplo de uso del StandardButtonsService
 *
 * Este archivo demuestra cómo usar el StandardButtonsService
 * para botones fuera del header (sidebar, toolbar, floating, etc.)
 *
 * NOTA: Para botones del header, usar HeaderConfigService
 */

// Ejemplo de inicialización y uso del StandardButtonsService
class StandardButtonsExample {
  constructor() {
    this.standardButtonsService = new StandardButtonsService();
    this.isInitialized = false;
  }

  /**
   * Inicializa el ejemplo
   */
  async initialize() {
    try {
      // Inicializar el servicio
      const success = await this.standardButtonsService.initialize();
      if (!success) {
        throw new Error('No se pudo inicializar StandardButtonsService');
      }

      // Establecer rol del usuario (ejemplo)
      this.standardButtonsService.setUserRole('user');

      this.isInitialized = true;
      console.log('✅ StandardButtonsExample inicializado correctamente');

      // Ejecutar ejemplos
      this.runExamples();
    } catch (error) {
      console.error('❌ Error al inicializar StandardButtonsExample:', error);
    }
  }

  /**
   * Ejecuta todos los ejemplos
   */
  runExamples() {
    if (!this.isInitialized) {
      console.error('❌ StandardButtonsExample no está inicializado');
      return;
    }

    console.log('🚀 Ejecutando ejemplos de StandardButtonsService...');

    // Ejemplo 1: Botones de Sidebar
    this.exampleSidebarButtons();

    // Ejemplo 2: Botones de Toolbar
    this.exampleToolbarButtons();

    // Ejemplo 3: Botones Flotantes
    this.exampleFloatingButtons();

    // Ejemplo 4: Botones de Dashboard
    this.exampleDashboardButtons();

    // Ejemplo 5: Botones de Formulario
    this.exampleFormButtons();

    // Ejemplo 6: Botones de Modal
    this.exampleModalButtons();

    // Ejemplo 7: Obtener información del servicio
    this.exampleServiceInfo();
  }

  /**
   * Ejemplo 1: Botones de Sidebar
   */
  exampleSidebarButtons() {
    console.log('\n📋 Ejemplo 1: Botones de Sidebar');

    // Obtener contenedor de sidebar (crear si no existe)
    let sidebarContainer = document.getElementById('sidebar-buttons');
    if (!sidebarContainer) {
      sidebarContainer = document.createElement('div');
      sidebarContainer.id = 'sidebar-buttons';
      sidebarContainer.className = 'sidebar-buttons-container';
      document.body.appendChild(sidebarContainer);
    }

    // Renderizar botones de sidebar
    this.standardButtonsService.renderButtonsInContainer(
      'sidebar',
      sidebarContainer,
      key => key, // Función de traducción simple
      {
        showTooltip: true,
        showBadge: true,
        customClasses: 'sidebar-button-custom',
      }
    );

    // Obtener botones específicos
    const helpButton =
      this.standardButtonsService.getButton('btn-sidebar-help');
    const settingsButton = this.standardButtonsService.getButton(
      'btn-sidebar-settings'
    );

    console.log('Botones de sidebar obtenidos:', {
      help: helpButton,
      settings: settingsButton,
    });
  }

  /**
   * Ejemplo 2: Botones de Toolbar
   */
  exampleToolbarButtons() {
    console.log('\n🔧 Ejemplo 2: Botones de Toolbar');

    // Obtener contenedor de toolbar (crear si no existe)
    let toolbarContainer = document.getElementById('toolbar-buttons');
    if (!toolbarContainer) {
      toolbarContainer = document.createElement('div');
      toolbarContainer.id = 'toolbar-buttons';
      toolbarContainer.className = 'toolbar-buttons-container';
      document.body.appendChild(toolbarContainer);
    }

    // Renderizar botones de toolbar
    this.standardButtonsService.renderButtonsInContainer(
      'toolbar',
      toolbarContainer,
      key => key,
      {
        showTooltip: true,
        showBadge: false,
      }
    );

    // Ejemplo de actualización de estado
    setTimeout(() => {
      this.standardButtonsService.updateButtonState('btn-toolbar-save', {
        icon: 'fas fa-save',
        tooltip: 'Guardar cambios (actualizado)',
      });
      console.log('✅ Estado del botón de guardar actualizado');
    }, 2000);
  }

  /**
   * Ejemplo 3: Botones Flotantes
   */
  exampleFloatingButtons() {
    console.log('\n💬 Ejemplo 3: Botones Flotantes');

    // Obtener contenedor de botones flotantes (crear si no existe)
    let floatingContainer = document.getElementById('floating-buttons');
    if (!floatingContainer) {
      floatingContainer = document.createElement('div');
      floatingContainer.id = 'floating-buttons';
      floatingContainer.className = 'floating-buttons-container';
      document.body.appendChild(floatingContainer);
    }

    // Renderizar botones flotantes
    this.standardButtonsService.renderButtonsInContainer(
      'floating',
      floatingContainer,
      key => key,
      {
        showTooltip: true,
        showBadge: true,
      }
    );

    // Ejemplo de actualización de badge
    setTimeout(() => {
      this.standardButtonsService.updateButtonState('btn-floating-chat', {
        badge: {
          enabled: true,
          class: 'chat-badge',
          count: 5,
        },
      });
      console.log('✅ Badge del chat actualizado');
    }, 3000);
  }

  /**
   * Ejemplo 4: Botones de Dashboard
   */
  exampleDashboardButtons() {
    console.log('\n📊 Ejemplo 4: Botones de Dashboard');

    // Obtener contenedor de dashboard (crear si no existe)
    let dashboardContainer = document.getElementById('dashboard-buttons');
    if (!dashboardContainer) {
      dashboardContainer = document.createElement('div');
      dashboardContainer.id = 'dashboard-buttons';
      dashboardContainer.className = 'dashboard-buttons-container';
      document.body.appendChild(dashboardContainer);
    }

    // Renderizar botones de dashboard
    this.standardButtonsService.renderButtonsInContainer(
      'dashboard',
      dashboardContainer,
      key => key,
      {
        showTooltip: true,
        showBadge: true,
      }
    );

    // Ejemplo de generación de HTML individual
    const refreshButtonHTML = this.standardButtonsService.generateButtonHTML(
      'btn-dashboard-refresh',
      key => key,
      {
        customClasses: 'dashboard-refresh-custom',
        customAttributes: {
          'data-dashboard-id': 'main-dashboard',
        },
      }
    );

    console.log('HTML del botón de refresh generado:', refreshButtonHTML);
  }

  /**
   * Ejemplo 5: Botones de Formulario
   */
  exampleFormButtons() {
    console.log('\n📝 Ejemplo 5: Botones de Formulario');

    // Obtener contenedor de formulario (crear si no existe)
    let formContainer = document.getElementById('form-buttons');
    if (!formContainer) {
      formContainer = document.createElement('div');
      formContainer.id = 'form-buttons';
      formContainer.className = 'form-buttons-container';
      document.body.appendChild(formContainer);
    }

    // Renderizar botones de formulario
    this.standardButtonsService.renderButtonsInContainer(
      'form',
      formContainer,
      key => key,
      {
        showTooltip: true,
        showBadge: false,
      }
    );

    // Ejemplo de verificación de acceso
    const canSubmit = this.standardButtonsService.hasAccess('btn-form-submit');
    const canReset = this.standardButtonsService.hasAccess('btn-form-reset');

    console.log('Permisos de formulario:', {
      canSubmit,
      canReset,
    });
  }

  /**
   * Ejemplo 6: Botones de Modal
   */
  exampleModalButtons() {
    console.log('\n🪟 Ejemplo 6: Botones de Modal');

    // Obtener contenedor de modal (crear si no existe)
    let modalContainer = document.getElementById('modal-buttons');
    if (!modalContainer) {
      modalContainer = document.createElement('div');
      modalContainer.id = 'modal-buttons';
      modalContainer.className = 'modal-buttons-container';
      document.body.appendChild(modalContainer);
    }

    // Renderizar botones de modal
    this.standardButtonsService.renderButtonsInContainer(
      'modal',
      modalContainer,
      key => key,
      {
        showTooltip: true,
        showBadge: false,
      }
    );

    // Ejemplo de obtención de botones por categoría
    const modalButtons =
      this.standardButtonsService.getButtonsByCategory('modal');
    console.log('Botones de modal disponibles:', modalButtons);
  }

  /**
   * Ejemplo 7: Información del servicio
   */
  exampleServiceInfo() {
    console.log('\nℹ️ Ejemplo 7: Información del Servicio');

    const serviceInfo = this.standardButtonsService.getServiceInfo();
    console.log('Información del StandardButtonsService:', serviceInfo);

    // Obtener todas las categorías
    const categories = this.standardButtonsService.getCategories();
    console.log('Categorías disponibles:', categories);

    // Obtener todos los botones disponibles
    const allButtons = this.standardButtonsService.getAllAvailableButtons();
    console.log('Todos los botones disponibles:', allButtons);
  }

  /**
   * Ejemplo de cambio de rol de usuario
   */
  changeUserRole(newRole) {
    console.log(`\n👤 Cambiando rol de usuario a: ${newRole}`);

    this.standardButtonsService.setUserRole(newRole);

    // Re-renderizar botones para aplicar nuevos permisos
    this.runExamples();
  }

  /**
   * Ejemplo de limpieza
   */
  cleanup() {
    console.log('\n🧹 Limpiando ejemplos...');

    // Remover contenedores creados
    const containers = [
      'sidebar-buttons',
      'toolbar-buttons',
      'floating-buttons',
      'dashboard-buttons',
      'form-buttons',
      'modal-buttons',
    ];

    containers.forEach(id => {
      const container = document.getElementById(id);
      if (container) {
        container.remove();
      }
    });

    console.log('✅ Limpieza completada');
  }
}

// Función para ejecutar el ejemplo
function runStandardButtonsExample() {
  console.log('🎯 Iniciando ejemplo de StandardButtonsService...');

  const example = new StandardButtonsExample();

  // Inicializar y ejecutar ejemplos
  example.initialize();

  // Exponer métodos para testing
  window.standardButtonsExample = {
    changeRole: role => example.changeUserRole(role),
    cleanup: () => example.cleanup(),
    getService: () => example.standardButtonsService,
  };

  console.log(
    '💡 Usa window.standardButtonsExample.changeRole("admin") para cambiar rol'
  );
  console.log('💡 Usa window.standardButtonsExample.cleanup() para limpiar');
}

// Auto-ejecutar si está en modo desarrollo
if (
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
) {
  // Esperar a que el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runStandardButtonsExample);
  } else {
    runStandardButtonsExample();
  }
}

// Exportar para uso manual
window.runStandardButtonsExample = runStandardButtonsExample;
