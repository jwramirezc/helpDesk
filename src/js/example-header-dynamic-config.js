/**
 * Ejemplo de uso del Header con configuración dinámica
 *
 * Este archivo muestra cómo usar el nuevo sistema de header
 * que elimina completamente los datos hardcodeados.
 */

// Ejemplo de cómo agregar un nuevo botón al header
class HeaderConfigExample {
  constructor() {
    this.headerConfigService = null;
  }

  /**
   * Inicializa el ejemplo
   */
  async initialize() {
    try {
      // 1. Inicializar el servicio de configuración del header
      this.headerConfigService = new HeaderConfigService();
      await this.headerConfigService.initialize();

      // 2. Mostrar información del servicio
      this.showServiceInfo();

      // 3. Validar configuración
      this.validateConfiguration();

      // 4. Demostrar funcionalidades
      this.demonstrateFeatures();

      console.log('HeaderConfigExample: Inicializado correctamente');
    } catch (error) {
      console.error('HeaderConfigExample: Error al inicializar', error);
    }
  }

  /**
   * Muestra información del servicio
   */
  showServiceInfo() {
    const info = this.headerConfigService.getServiceInfo();
    console.log('📊 Información del HeaderConfigService:', info);
  }

  /**
   * Valida la configuración del header
   */
  validateConfiguration() {
    const validation = this.headerConfigService.validateConfig();
    console.log('🔍 Validación de configuración:', validation);

    if (!validation.isValid) {
      console.error('❌ Errores en la configuración:', validation.errors);
    }

    if (validation.warnings.length > 0) {
      console.warn('⚠️ Advertencias en la configuración:', validation.warnings);
    }
  }

  /**
   * Demuestra las funcionalidades del sistema
   */
  demonstrateFeatures() {
    console.log('🎯 Demostración de funcionalidades:');

    // 1. Mostrar botones disponibles para diferentes roles
    const roles = ['admin', 'user', 'guest'];
    roles.forEach(role => {
      const buttons = this.headerConfigService.getEnabledButtons(role);
      console.log(
        `👤 Botones para rol "${role}":`,
        buttons.map(b => b.id)
      );
    });

    // 2. Mostrar campos de usuario disponibles
    const userFields = this.headerConfigService.getEnabledUserFields();
    console.log(
      '📝 Campos de usuario habilitados:',
      userFields.map(f => f.id)
    );

    // 3. Mostrar configuración de avatar
    const avatarConfig = this.headerConfigService.getUserAvatarConfig();
    console.log('🖼️ Configuración de avatar:', avatarConfig);
  }

  /**
   * Ejemplo de cómo agregar un nuevo botón dinámicamente
   */
  addCustomButton() {
    console.log('➕ Agregando botón personalizado...');

    // En un caso real, esto se haría modificando el archivo JSON
    // Aquí solo mostramos cómo sería la configuración
    const customButton = {
      id: 'btn-custom',
      type: 'popover',
      icon: 'fas fa-star',
      tooltip: 'custom_button',
      popover: {
        content: 'custom-panel',
        placement: 'bottom',
      },
      enabled: true,
      order: 6,
    };

    console.log('🔧 Configuración del nuevo botón:', customButton);
    console.log('💡 Para implementarlo, agregar al archivo header-config.json');
  }

  /**
   * Ejemplo de cómo cambiar permisos dinámicamente
   */
  demonstratePermissions() {
    console.log('🔐 Demostración de permisos:');

    const buttonId = 'btn-notifications';
    const roles = ['admin', 'user', 'guest'];

    roles.forEach(role => {
      const hasPermission = this.headerConfigService.hasPermission(
        buttonId,
        role
      );
      console.log(
        `👤 Rol "${role}" tiene permiso para "${buttonId}": ${hasPermission}`
      );
    });
  }

  /**
   * Ejemplo de cómo agregar un nuevo campo de usuario
   */
  addCustomUserField() {
    console.log('📝 Agregando campo de usuario personalizado...');

    const customField = {
      id: 'user-department',
      type: 'text',
      source: "user.departamento || 'Sin departamento'",
      class: 'user-department',
      enabled: true,
    };

    console.log('🔧 Configuración del nuevo campo:', customField);
    console.log('💡 Para implementarlo, agregar al archivo header-config.json');
  }

  /**
   * Ejemplo de cómo cambiar el orden de elementos
   */
  demonstrateOrdering() {
    console.log('📋 Demostración de ordenamiento:');

    const structure = this.headerConfigService.getStructure();
    console.log('🏗️ Orden actual de elementos:');
    console.log(`  - Botones: orden ${structure.buttons?.order || 0}`);
    console.log(
      `  - Información de usuario: orden ${structure.userInfo?.order || 1}`
    );
    console.log(`  - Avatar: orden ${structure.userAvatar?.order || 2}`);

    console.log(
      '💡 Para cambiar el orden, modificar los valores "order" en header-config.json'
    );
  }

  /**
   * Ejemplo de cómo recargar la configuración
   */
  async reloadConfiguration() {
    console.log('🔄 Recargando configuración...');

    const success = await this.headerConfigService.reload();
    if (success) {
      console.log('✅ Configuración recargada correctamente');
      this.showServiceInfo();
    } else {
      console.error('❌ Error al recargar configuración');
    }
  }
}

// Ejemplo de uso en la consola del navegador
/*
// Para probar el sistema, ejecutar en la consola:

// 1. Crear instancia
const headerExample = new HeaderConfigExample();

// 2. Inicializar
await headerExample.initialize();

// 3. Probar funcionalidades
headerExample.demonstrateFeatures();
headerExample.demonstratePermissions();
headerExample.addCustomButton();
headerExample.addCustomUserField();
headerExample.demonstrateOrdering();

// 4. Recargar configuración (si se modificó el JSON)
await headerExample.reloadConfiguration();
*/

// Ejemplo de integración con el sistema existente
class HeaderIntegrationExample {
  constructor() {
    this.headerView = null;
    this.headerConfigService = null;
  }

  /**
   * Integra el nuevo sistema con la aplicación existente
   */
  async integrateWithExistingSystem() {
    try {
      // 1. Inicializar servicios
      this.headerConfigService = new HeaderConfigService();
      await this.headerConfigService.initialize();

      // 2. Obtener contenedor del header
      const headerContainer = document.getElementById('header');
      if (!headerContainer) {
        console.error('Contenedor del header no encontrado');
        return;
      }

      // 3. Crear nueva vista del header
      this.headerView = new HeaderView(headerContainer);

      // 4. Simular datos de usuario
      const mockUser = {
        nombre: 'Juan',
        apellidos: 'Pérez',
        empresa: 'Empresa Demo',
        rol: 'admin',
        avatar: 'public/images/avatar1.png',
        departamento: 'IT',
      };

      // 5. Renderizar header
      await this.headerView.render(mockUser, true, key => {
        // Función de traducción simple
        const translations = {
          notifications: 'Notificaciones',
          user_menu: 'Menú de usuario',
          toggle_theme: 'Cambiar tema',
          change_language: 'Cambiar idioma',
          help: 'Ayuda',
        };
        return translations[key] || key;
      });

      console.log('✅ Header integrado correctamente');
    } catch (error) {
      console.error('❌ Error al integrar header:', error);
    }
  }

  /**
   * Demuestra cómo actualizar dinámicamente el header
   */
  async demonstrateDynamicUpdates() {
    if (!this.headerView) {
      console.error('HeaderView no inicializada');
      return;
    }

    // Simular cambio de notificaciones
    console.log('🔔 Actualizando estado de notificaciones...');
    this.headerView.updateNotificationsState(false);

    // Simular cambio de usuario
    console.log('👤 Actualizando información de usuario...');
    const newUser = {
      nombre: 'María',
      apellidos: 'García',
      empresa: 'Nueva Empresa',
      rol: 'user',
      avatar: 'public/images/avatar2.png',
    };

    await this.headerView.render(newUser, false, key => key);

    console.log('✅ Actualizaciones aplicadas');
  }
}

// Exportar para uso global
window.HeaderConfigExample = HeaderConfigExample;
window.HeaderIntegrationExample = HeaderIntegrationExample;
