# Alianza por el Progreso — Sitio web de campaña

Sitio web estático profesional para difusión de trayectoria, logros de gestión, propuestas y actividades de campaña electoral.

## Características

- Diseño responsive (móvil, tablet y escritorio)
- HTML5, CSS3 y JavaScript puro (sin frameworks)
- Modo claro / oscuro
- Contadores animados, galería filtrable, línea de tiempo interactiva
- Integración con YouTube, formulario de participación y buscador de contenido
- SEO básico y metadatos para redes sociales
- Accesibilidad (ARIA, skip link, movimiento reducido)

## Estructura del proyecto

```
partido_politico/
├── index.html      # Página principal
├── styles.css      # Estilos
├── script.js       # Interactividad
├── requerimientos.md
└── README.md
```

## Uso local

Abre `index.html` directamente en el navegador, o sirve la carpeta con un servidor estático:

```bash
# Con npx (Node.js)
npx serve .

# Con Python
python -m http.server 8080
```

Luego visita `http://localhost:8080` (o el puerto indicado).

## Despliegue

El sitio es estático y puede alojarse en:

- [GitHub Pages](https://pages.github.com/)
- [Netlify](https://www.netlify.com/)
- [Vercel](https://vercel.com/)
- Cualquier hosting con soporte para archivos HTML/CSS/JS

### GitHub Pages

1. Sube el repositorio a GitHub.
2. Ve a **Settings → Pages**.
3. En **Source**, elige la rama `main` y la carpeta `/ (root)`.
4. Guarda; el sitio quedará en `https://<usuario>.github.io/<repositorio>/`.

## Personalización

| Elemento | Archivo |
|----------|---------|
| Contenido y textos | `index.html` |
| Colores y tipografía | `styles.css` (`:root`) |
| Comportamiento | `script.js` |

Reemplaza imágenes, videos de YouTube, enlaces de redes sociales y el número de WhatsApp con los datos oficiales del partido.

## Licencia

Contenido de ejemplo con fines demostrativos. Ajusta la licencia según las políticas de tu organización.
