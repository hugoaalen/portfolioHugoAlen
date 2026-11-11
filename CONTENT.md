# Editar contenido del portfolio

El contenido principal del portfolio vive en `src/data`. La idea es que puedas actualizar textos, proyectos, experiencia y formación sin tocar componentes Astro ni clases CSS.

## Archivos

- `src/data/profile.json`: datos personales, hero, email y redes.
- `src/data/about.json`: párrafos de la sección "Sobre mí".
- `src/data/projects.json`: proyectos, imágenes, enlaces y tecnologías.
- `src/data/experience.json`: experiencia profesional.
- `src/data/education.json`: formación.

## Campos comunes

En listas como proyectos, experiencia, formación y about:

- `id`: identificador único. No lo repitas.
- `order`: orden de aparición. Usa saltos de 10 para poder insertar elementos entre medias.
- `visible`: `true` para mostrar, `false` para ocultar sin borrar.

Los textos traducibles usan siempre:

```json
{
  "es": "Texto en español",
  "en": "English text"
}
```

## Proyectos

Ejemplo mínimo:

```json
{
  "id": "mi-proyecto",
  "order": 60,
  "visible": true,
  "featured": false,
  "status": "published",
  "category": "app",
  "title": {
    "es": "Mi proyecto",
    "en": "My project"
  },
  "description": {
    "es": "Descripción breve.",
    "en": "Short description."
  },
  "github": "https://github.com/hugoaalen/mi-proyecto",
  "link": "https://mi-proyecto.vercel.app",
  "image": "/projects/mi-proyecto.png",
  "tags": ["REACT", "TYPESCRIPT", "VITE"]
}
```

Campos extra:

- `featured`: si es `true`, la tarjeta se muestra destacada en desktop.
- `status`: puede ser `published`, `draft` o `archived`. Solo `published` se renderiza.
- `category`: puede ser `app`, `website`, `game`, `tool` o `design`.
- `image`: ruta pública. La imagen debe estar en `public`, por ejemplo `public/projects/mi-proyecto.png` se referencia como `/projects/mi-proyecto.png`.

Tags disponibles:

```txt
NEXT, TAILWIND, HTML, CSS, VANILLAJS, BOOTSTRAP, REACT, SUPABASE, ASTRO, VITE, TYPESCRIPT, FIREBASE, PHP, ANGULAR, MYSQL
```

## Validación

El archivo `src/data/content.ts` valida el contenido al construir la web. Si algo está mal, `astro check` o `astro build` fallará con un mensaje que empieza por `[content]`.

Valida, entre otras cosas:

- IDs repetidos.
- Campos obligatorios vacíos.
- Traducciones `es` y `en`.
- Tags de proyecto inexistentes.
- URLs mal formadas.
- Imágenes que no empiezan por `/`.

## Flujo recomendado

1. Edita el JSON correspondiente.
2. Si añades imágenes, colócalas en `public/projects`.
3. Ejecuta:

```bash
pnpm run build
```

4. Si el build pasa, el portfolio está listo para desplegar.

## Administración sencilla

`/admin` solo controla mantenimiento, con acceso mediante Google y escrituras protegidas por las reglas de Firestore. No permite editar textos ni importar JSON.

Todos los contenidos se construyen desde estos archivos. Los proyectos profesionales se mantienen en `src/data/marsan-projects.json`; los personales en `src/data/projects.json`. Tras cambiar un JSON, hay que desplegar para actualizar producción.

Firebase conserva únicamente el ajuste de disponibilidad utilizado por la aplicación: `maintenanceEnabled` en `content/profile`, por compatibilidad con las reglas ya publicadas. Los documentos antiguos del CMS no se borran, pero ya no reemplazan contenido.

El control se aplica en el Routing Middleware de Vercel y en desarrollo local. Cambiarlo desde local también afecta al estado compartido de producción. No oculta ni elimina recursos públicos antiguos.
