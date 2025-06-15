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
