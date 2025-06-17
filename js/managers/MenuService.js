class MenuService {
  constructor() {
    /** @type {Promise<{top: Array, bottom: Array}>|null} */
    this._menuPromise = null;
  }

  /**
   * Devuelve los items del menú (top & bottom).
   * El archivo solo se carga la primera vez; las siguientes
   * llamadas reutilizan el resultado (‘caching’ en memoria).
   * @returns {Promise<{top: Array, bottom: Array}>}
   */
  async getMenuItems() {
    if (this._menuPromise) return this._menuPromise;

    this._menuPromise = fetch('data/menu.json')
      .then(resp => {
        if (!resp.ok) {
          throw new Error('Error al cargar data/menu.json');
        }
        return resp.json();
      })
      .then(json => json.menuItems || { top: [], bottom: [] })
      .catch(err => {
        console.error(err);
        // Valor por defecto minimalista para no romper la UI
        return { top: [], bottom: [] };
      });

    return this._menuPromise;
  }
}
