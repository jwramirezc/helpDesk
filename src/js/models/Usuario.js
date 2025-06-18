class Usuario {
  constructor(datos = {}) {
    this.id = datos.id || '';
    this.nombre = datos.nombre || '';
    this.apellidos = datos.apellidos || '';
    this.empresa = datos.empresa || '';
    this.avatar = datos.avatar || 'public/images/avatar1.png';
    this.telefono = datos.telefono || '';
    this.idioma = datos.idioma || 'es';
  }

  get nombreCompleto() {
    return `${this.nombre} ${this.apellidos}`;
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
