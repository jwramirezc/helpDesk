class Usuario {
  constructor(datos = {}) {
    // Validar que datos sea un objeto
    if (datos && typeof datos !== 'object') {
      throw new Error('Usuario: datos debe ser un objeto');
    }

    this.id = datos.id || '';
    this.nombre = datos.nombre || '';
    this.apellidos = datos.apellidos || '';
    this.empresa = datos.empresa || '';
    this.avatar = datos.avatar || 'public/images/avatar1.png';
    this.telefono = datos.telefono || '';
    this.idioma = datos.idioma || 'es';
  }

  get nombreCompleto() {
    return `${this.nombre} ${this.apellidos}`.trim();
  }

  /**
   * Valida si el usuario tiene datos mínimos requeridos
   * @returns {boolean}
   */
  esValido() {
    return this.nombre.trim() !== '' && this.id.trim() !== '';
  }

  /**
   * Obtiene las iniciales del usuario
   * @returns {string}
   */
  get iniciales() {
    const nombre = this.nombre.charAt(0).toUpperCase();
    const apellido = this.apellidos.charAt(0).toUpperCase();
    return `${nombre}${apellido}`;
  }

  /**
   * Actualiza los datos del usuario
   * @param {Object} nuevosDatos - Nuevos datos a actualizar
   */
  actualizar(nuevosDatos) {
    if (nuevosDatos && typeof nuevosDatos === 'object') {
      Object.assign(this, nuevosDatos);
    }
  }

  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      apellidos: this.apellidos,
      empresa: this.empresa,
      avatar: this.avatar,
      telefono: this.telefono,
      idioma: this.idioma,
    };
  }

  static fromJSON(json) {
    return new Usuario(json);
  }
}
