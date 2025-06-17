// Se reemplaza la constante CONFIG por la carga de archivos JSON.

/**
 * Carga un archivo JSON de forma SINCRÓNICA.
 * Esto garantiza que la configuración esté lista antes de que
 * se ejecuten los siguientes scripts incluidos en index.html.
 * @param {string} path Ruta al archivo JSON.
 * @returns {object|null}
 */
function cargarJSONSync(path) {
  try {
    const request = new XMLHttpRequest();
    request.open('GET', path, false); // "false" -> llamada sincrónica
    request.send(null);
    if (request.status === 200) {
      return JSON.parse(request.responseText);
    }
    console.error(
      `Error ${request.status} al intentar cargar el archivo ${path}`
    );
  } catch (error) {
    console.error('Excepción al cargar JSON:', error);
  }
  return null;
}

function inicializarLocalStorage() {
  // Si ya existe una configuración previa, no la sobre-escribimos
  if (localStorage.getItem('config')) {
    console.log('Configuración existente detectada; se mantiene.');
    return;
  }

  // Cargar configuración base y menú desde archivos JSON
  const configBase = cargarJSONSync('data/default-config.json') || {};
  const menuJSON = cargarJSONSync('data/menu.json') || {};

  // Normalizar estructura del menú
  configBase.menu = menuJSON.menuItems || menuJSON.menu || {};

  // Guardar en localStorage
  localStorage.setItem('config', JSON.stringify(configBase));

  console.log('Configuración inicial cargada desde archivos JSON:', configBase);
}

// Ejecutar la inicialización al cargar el DOM
document.addEventListener('DOMContentLoaded', inicializarLocalStorage);
