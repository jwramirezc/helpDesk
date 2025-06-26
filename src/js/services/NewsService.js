/**
 * Servicio para manejar las noticias del portal
 */
class NewsService {
  constructor() {
    this.newsData = null;
    this.config = null;
    this.container = null;
  }

  /**
   * Inicializa el servicio de noticias
   * @param {string} containerId - ID del contenedor donde se mostrarán las noticias
   * @returns {Promise} Promesa que se resuelve cuando se completa la inicialización
   */
  async init(containerId = 'news-container') {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      throw new Error(`Contenedor de noticias no encontrado: ${containerId}`);
    }

    await this.loadNews();
    return this;
  }

  /**
   * Carga las noticias desde el archivo JSON
   */
  async loadNews() {
    try {
      this.showLoading();

      const response = await fetch('data/news.json');

      if (response.ok) {
        const data = await response.json();

        this.newsData = data.news;
        this.config = data.config;

        this.renderNews();
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      this.showError();
    }
  }

  /**
   * Muestra el estado de carga
   */
  showLoading() {
    if (this.container) {
      this.container.innerHTML = `
                <div class="text-center">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Cargando noticias...</span>
                    </div>
                    <p class="mt-2">Cargando noticias...</p>
                </div>
            `;
    }
  }

  /**
   * Muestra el estado de error
   */
  showError() {
    if (this.container) {
      this.container.innerHTML = `
        <div class="text-center text-muted">
          <i class="fas fa-exclamation-triangle fa-2x mb-2"></i>
          <p>Error al cargar las noticias</p>
          <button class="btn btn-outline-primary btn-sm" onclick="location.reload()">
            <i class="fas fa-redo me-1"></i>Reintentar
          </button>
        </div>
      `;
    }
  }

  /**
   * Renderiza las noticias en el contenedor
   */
  renderNews() {
    if (!this.container || !this.newsData) {
      return;
    }

    if (this.newsData.length === 0) {
      this.container.innerHTML =
        '<p class="text-muted text-center">No hay noticias disponibles</p>';
      return;
    }

    // Filtrar noticias activas y ordenar por fecha
    const activeNews = this.newsData
      .filter(news => news.active)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, this.config.maxNewsToShow || 5);

    const newsHTML = activeNews.map(news => this.createNewsItem(news)).join('');

    this.container.innerHTML = newsHTML;
  }

  /**
   * Crea el HTML para un elemento de noticia
   * @param {Object} news - Objeto de noticia
   * @returns {string} HTML del elemento de noticia
   */
  createNewsItem(news) {
    const formattedDate = this.formatDate(news.date, this.config.dateFormat);
    const iconClass = this.config.showIcon ? news.icon : '';
    const colorClass = news.color || '';
    const priorityBadge = this.config.showPriority
      ? this.createPriorityBadge(news.priority)
      : '';

    return `
            <div class="news-item mb-3" data-news-id="${news.id}">
                <div class="d-flex align-items-start">
                    ${
                      this.config.showIcon
                        ? `<i class="${iconClass} ${colorClass} me-3 mt-1" style="font-size: 1.2rem;"></i>`
                        : ''
                    }
                    <div class="flex-grow-1">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h6 class="mb-1">${news.title}</h6>
                            ${priorityBadge}
                        </div>
                        <p class="text-muted mb-2">${news.content}</p>
                        ${
                          this.config.showDate
                            ? `<small class="text-muted"><i class="fas fa-calendar-alt me-1"></i>${formattedDate}</small>`
                            : ''
                        }
                    </div>
                </div>
            </div>
        `;
  }

  /**
   * Crea el badge de prioridad
   * @param {string} priority - Prioridad de la noticia
   * @returns {string} HTML del badge
   */
  createPriorityBadge(priority) {
    const priorityConfig = {
      high: { class: 'badge bg-danger', text: 'Alta' },
      medium: { class: 'badge bg-warning text-dark', text: 'Media' },
      low: { class: 'badge bg-success', text: 'Baja' },
    };

    const config = priorityConfig[priority] || priorityConfig.medium;
    return `<span class="${config.class}">${config.text}</span>`;
  }

  /**
   * Formatea la fecha según el formato especificado
   * @param {string} dateString - Fecha en formato string
   * @param {string} format - Formato deseado
   * @returns {string} Fecha formateada
   */
  formatDate(dateString, format) {
    const date = new Date(dateString);
    const options = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    };
    return date.toLocaleDateString('es-ES', options);
  }

  /**
   * Verifica si el archivo JSON está disponible
   * @returns {Promise<boolean>} True si está disponible, false en caso contrario
   */
  async checkJsonAvailability() {
    try {
      const response = await fetch('data/news.json', { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  /**
   * Recarga las noticias desde el archivo JSON
   */
  async reloadNews() {
    await this.loadNews();
  }

  /**
   * Obtiene las noticias filtradas por tipo
   * @param {string} type - Tipo de noticia
   * @returns {Array} Array de noticias filtradas
   */
  getNewsByType(type) {
    if (!this.newsData) return [];
    return this.newsData.filter(news => news.type === type && news.active);
  }

  /**
   * Obtiene las noticias por prioridad
   * @param {string} priority - Prioridad de la noticia
   * @returns {Array} Array de noticias filtradas
   */
  getNewsByPriority(priority) {
    if (!this.newsData) return [];
    return this.newsData.filter(
      news => news.priority === priority && news.active
    );
  }

  /**
   * Actualiza la configuración de visualización
   * @param {Object} newConfig - Nueva configuración
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    this.renderNews();
  }
}

// Exportar la clase para uso global
window.NewsService = NewsService;
