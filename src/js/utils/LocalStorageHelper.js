class LocalStorageHelper {
  static guardar(clave, valor) {
    try {
      localStorage.setItem(clave, JSON.stringify(valor));
      return true;
    } catch (error) {
      console.error('Error al guardar en localStorage:', error);
      return false;
    }
  }

  static obtener(clave) {
    try {
      const valor = localStorage.getItem(clave);
      return valor ? JSON.parse(valor) : null;
    } catch (error) {
      console.error('Error al obtener de localStorage:', error);
      return null;
    }
  }

  static eliminar(clave) {
    try {
      localStorage.removeItem(clave);
      return true;
    } catch (error) {
      console.error('Error al eliminar de localStorage:', error);
      return false;
    }
  }

  static limpiar() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error al limpiar localStorage:', error);
      return false;
    }
  }

  static existe(clave) {
    return localStorage.getItem(clave) !== null;
  }
}

// Adapter que envuelve LocalStorageHelper y expone una interfaz más genérica
class LocalStorageAdapter {
  // Métodos nuevos y más genéricos
  static set(key, value) {
    return LocalStorageHelper.guardar(key, value);
  }

  static get(key) {
    return LocalStorageHelper.obtener(key);
  }

  static remove(key) {
    return LocalStorageHelper.eliminar(key);
  }

  static clear() {
    return LocalStorageHelper.limpiar();
  }

  static has(key) {
    return LocalStorageHelper.existe(key);
  }

  // Métodos legacy (alias) para permitir transición gradual
  static guardar(...args) {
    return LocalStorageHelper.guardar(...args);
  }
  static obtener(...args) {
    return LocalStorageHelper.obtener(...args);
  }
  static eliminar(...args) {
    return LocalStorageHelper.eliminar(...args);
  }
  static limpiar(...args) {
    return LocalStorageHelper.limpiar(...args);
  }
  static existe(...args) {
    return LocalStorageHelper.existe(...args);
  }
}
