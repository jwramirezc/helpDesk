class MenuItem {
  constructor(datos = {}) {
    this.id = datos.id || '';
    this.icono = datos.icono || '';
    this.titulo = datos.titulo || '';
    this.visible = datos.visible !== undefined ? datos.visible : true;
    this.orden = datos.orden || 0;
  }

  toHTML() {
    return `
            <div class="menu-item" 
                 id="${this.id}" 
                 data-tooltip="${this.titulo}"
                 style="display: ${this.visible ? 'flex' : 'none'}">
                <i class="fas ${this.icono}"></i>
            </div>
        `;
  }

  toJSON() {
    return {
      id: this.id,
      icono: this.icono,
      titulo: this.titulo,
      visible: this.visible,
      orden: this.orden,
    };
  }

  static fromJSON(json) {
    return new MenuItem(json);
  }
}
