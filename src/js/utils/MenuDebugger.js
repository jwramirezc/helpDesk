/**
 * Utilidad para debugging del sistema de menús
 * Facilita el mantenimiento y troubleshooting
 */
class MenuDebugger {
  constructor(controladorMenu) {
    this.controlador = controladorMenu;
    this.isEnabled = false;
    this.logs = [];
  }

  /**
   * Habilita el modo debugging
   */
  enable() {
    this.isEnabled = true;
    console.log('🔍 MenuDebugger: Modo debugging habilitado');
    this.log('Debugging habilitado');
  }

  /**
   * Deshabilita el modo debugging
   */
  disable() {
    this.isEnabled = false;
    console.log('🔍 MenuDebugger: Modo debugging deshabilitado');
  }

  /**
   * Registra un mensaje de log
   * @param {string} message - Mensaje a registrar
   * @param {string} level - Nivel del log ('info', 'warn', 'error')
   */
  log(message, level = 'info') {
    if (!this.isEnabled) return;

    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      message,
      level,
      controllerState: this.controlador.getControllerState(),
    };

    this.logs.push(logEntry);

    const emoji = {
      info: 'ℹ️',
      warn: '⚠️',
      error: '❌',
    };

    console.log(`${emoji[level]} MenuDebugger: ${message}`, logEntry);
  }

  /**
   * Obtiene un reporte completo del estado del sistema
   * @returns {Promise<Object>}
   */
  async getFullReport() {
    try {
      const controllerState = this.controlador.getControllerState();
      const validation = await this.controlador.validateMenuStructure();
      const menuStats = await this.controlador.menuService.getMenuStats();
      const submenuItems = await this.controlador.menuService.getSubmenuItems();

      return {
        timestamp: new Date().toISOString(),
        controllerState,
        validation,
        menuStats,
        submenuItems: submenuItems.map(item => ({
          id: item.id,
          label: item.label,
          childrenCount: item.children.length,
          path: item.getPath(),
        })),
        logs: this.logs.slice(-10), // Últimos 10 logs
        domValidation: this.controlador.menuView.validateDOM(),
      };
    } catch (error) {
      this.log(`Error al generar reporte: ${error.message}`, 'error');
      return {
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Valida la estructura del menú y reporta problemas
   * @returns {Promise<Object>}
   */
  async validateMenu() {
    try {
      const validation = await this.controlador.validateMenuStructure();

      if (validation.isValid) {
        this.log('✅ Estructura del menú válida');
      } else {
        this.log(`❌ Errores encontrados: ${validation.errors.length}`, 'warn');
        validation.errors.forEach(error => {
          this.log(`  - ${error}`, 'error');
        });
      }

      return validation;
    } catch (error) {
      this.log(`Error en validación: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Analiza el rendimiento del sistema
   * @returns {Object}
   */
  analyzePerformance() {
    const startTime = performance.now();

    // Simular operaciones típicas
    const controllerState = this.controlador.getControllerState();
    const domValidation = this.controlador.menuView.validateDOM();

    const endTime = performance.now();
    const duration = endTime - startTime;

    const analysis = {
      duration: `${duration.toFixed(2)}ms`,
      isFast: duration < 10,
      controllerStateSize: JSON.stringify(controllerState).length,
      domValid: domValidation,
      logsCount: this.logs.length,
    };

    this.log(
      `Análisis de rendimiento: ${analysis.duration}`,
      analysis.isFast ? 'info' : 'warn'
    );

    return analysis;
  }

  /**
   * Obtiene información detallada de un ítem específico
   * @param {string} itemId - ID del ítem a analizar
   * @returns {Promise<Object>}
   */
  async analyzeItem(itemId) {
    try {
      const item = await this.controlador.menuService.findItemById(itemId);

      if (!item) {
        this.log(`Ítem no encontrado: ${itemId}`, 'error');
        return { error: 'Ítem no encontrado' };
      }

      const analysis = {
        id: item.id,
        label: item.label,
        type: item.type,
        isActive: item.isActive(),
        hasChildren: item.hasChildren(),
        childrenCount: item.children.length,
        path: item.getPath(),
        parent: item.getParent()?.id || null,
        properties: {
          icon: item.icon,
          target: item.target,
          openAction: item.openAction,
          message: item.message,
        },
      };

      this.log(`Análisis del ítem: ${itemId}`, 'info');
      return analysis;
    } catch (error) {
      this.log(`Error al analizar ítem ${itemId}: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Simula la activación de un ítem para testing
   * @param {string} itemId - ID del ítem a activar
   * @returns {Promise<Object>}
   */
  async simulateItemActivation(itemId) {
    try {
      this.log(`Simulando activación del ítem: ${itemId}`);

      const beforeState = this.controlador.getControllerState();
      await this.controlador.activarSoloItem(itemId);
      const afterState = this.controlador.getControllerState();

      const simulation = {
        itemId,
        beforeState,
        afterState,
        changes: {
          isInSubmenu: beforeState.isInSubmenu !== afterState.isInSubmenu,
          itemActivo: beforeState.itemActivo !== afterState.itemActivo,
          mobileMenuActive:
            beforeState.mobileMenuActive !== afterState.mobileMenuActive,
        },
      };

      this.log(`Simulación completada para: ${itemId}`);
      return simulation;
    } catch (error) {
      this.log(`Error en simulación: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Exporta los logs para análisis externo
   * @returns {string}
   */
  exportLogs() {
    const exportData = {
      timestamp: new Date().toISOString(),
      totalLogs: this.logs.length,
      logs: this.logs,
    };

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Limpia los logs almacenados
   */
  clearLogs() {
    this.logs = [];
    this.log('Logs limpiados');
  }

  /**
   * Obtiene estadísticas de uso
   * @returns {Object}
   */
  getUsageStats() {
    const stats = {
      totalLogs: this.logs.length,
      logLevels: {
        info: this.logs.filter(log => log.level === 'info').length,
        warn: this.logs.filter(log => log.level === 'warn').length,
        error: this.logs.filter(log => log.level === 'error').length,
      },
      timeRange: {
        first: this.logs[0]?.timestamp || null,
        last: this.logs[this.logs.length - 1]?.timestamp || null,
      },
      isEnabled: this.isEnabled,
    };

    return stats;
  }
}

// Exportar para uso global
if (typeof window !== 'undefined') {
  window.MenuDebugger = MenuDebugger;
}
