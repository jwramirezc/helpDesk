class I18nService {
  constructor(configService) {
    this.configService = configService;
    this.currentLang = configService.getUser().idioma || 'es';
    this.translations = {};
  }

  async load() {
    const path = `data/i18n/${this.currentLang}.json`;
    try {
      const resp = await fetch(path);
      if (!resp.ok) throw new Error(`No se pudo cargar ${path}`);
      this.translations = await resp.json();
    } catch (err) {
      console.error('Error al cargar traducciones', err);
      this.translations = {};
    }
  }

  t(key) {
    return this.translations[key] || key;
  }
}
